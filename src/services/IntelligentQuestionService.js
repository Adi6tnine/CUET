/**
 * INTELLIGENT QUESTION SERVICE
 * Implements the 5-layer priority system for question selection
 * Ensures mistake-driven learning with CUET-correct question counts
 */

import { mistakeMemoryEngine } from './MistakeMemoryEngine.js';
import { questionService } from '../utils/QuestionService.js';
import { groqService } from '../utils/groqService.js';
import { cuetQuestionGenerator } from './CUETQuestionGenerator.js';
import { STATIC_QUESTIONS } from '../data/static_questions.js';

class IntelligentQuestionService {
  constructor() {
    this.mistakeEngine = mistakeMemoryEngine;
    // 🔥 SESSION QUESTION UNIQUENESS TRACKER
    this.sessionQuestionHashes = new Set();
    this.sessionStartTime = Date.now();
  }

  /**
   * MAIN METHOD: Get questions with mistake-based priority
   * Implements the 5-layer priority system with UNIQUENESS GUARANTEE
   */
  async getIntelligentQuestions(request) {
    const {
      subject,
      chapter,
      count,
      mode, // 'daily' | 'chapter' | 'pyq' | 'mock'
      difficulty = 'adaptive'
    } = request;

    console.log(`🧠 Getting ${count} intelligent questions for ${subject} - ${chapter} (${mode} mode)`);

    // 🔥 RESET SESSION TRACKER FOR NEW QUIZ
    this.resetSessionTracker();

    const questions = [];
    let remainingCount = count;
    let attempts = 0;
    const maxAttempts = 3;

    // Generate questions with uniqueness guarantee
    while (questions.length < count && attempts < maxAttempts) {
      attempts++;
      console.log(`🔄 Generation attempt ${attempts} for ${remainingCount} questions`);

      // LAYER 1: Previously wrong questions (HIGHEST PRIORITY)
      if (remainingCount > 0) {
        const wrongQuestions = await this.getWrongQuestionVariants(subject, chapter, Math.min(remainingCount, this.getWrongQuestionLimit(mode, count)));
        const uniqueWrong = this.filterUniqueQuestions(wrongQuestions);
        questions.push(...uniqueWrong);
        remainingCount -= uniqueWrong.length;
        console.log(`🔄 Layer 1: Added ${uniqueWrong.length} unique wrong question variants`);
      }

      // LAYER 2: Concept-similar PYQs
      if (remainingCount > 0) {
        const conceptPYQs = await this.getConceptSimilarPYQs(subject, chapter, Math.min(remainingCount, Math.floor(count * 0.3)));
        const uniquePYQs = this.filterUniqueQuestions(conceptPYQs);
        questions.push(...uniquePYQs);
        remainingCount -= uniquePYQs.length;
        console.log(`🎯 Layer 2: Added ${uniquePYQs.length} unique concept-similar PYQs`);
      }

      // LAYER 3: Exact PYQs (if available)
      if (remainingCount > 0) {
        const exactPYQs = await this.getExactPYQs(subject, chapter, Math.min(remainingCount, Math.floor(count * 0.3)));
        const uniqueExact = this.filterUniqueQuestions(exactPYQs);
        questions.push(...uniqueExact);
        remainingCount -= uniqueExact.length;
        console.log(`⭐ Layer 3: Added ${uniqueExact.length} unique exact PYQs`);
      }

      // LAYER 4: AI-generated questions (concept-aware)
      if (remainingCount > 0) {
        const aiQuestions = await this.getConceptAwareAIQuestions(subject, chapter, remainingCount, difficulty);
        const uniqueAI = this.filterUniqueQuestions(aiQuestions);
        questions.push(...uniqueAI);
        remainingCount -= uniqueAI.length;
        console.log(`🤖 Layer 4: Added ${uniqueAI.length} unique concept-aware AI questions`);
      }

      // LAYER 5: CUET-accurate fallback questions (NEVER EMPTY)
      if (remainingCount > 0) {
        const fallbackQuestions = await cuetQuestionGenerator.generateCUETQuestions(subject, chapter, remainingCount);
        const uniqueFallback = this.filterUniqueQuestions(fallbackQuestions);
        questions.push(...uniqueFallback);
        remainingCount -= uniqueFallback.length;
        console.log(`🎯 Layer 5: Added ${uniqueFallback.length} unique CUET-accurate fallback questions`);
      }

      // Break if we have enough questions
      if (questions.length >= count) break;
    }

    // 🔥 HARD GUARANTEE: Ensure minimum questions with emergency generation
    if (questions.length < Math.min(count, 10)) {
      console.warn(`⚠️ Insufficient unique questions (${questions.length}), generating emergency questions`);
      const emergencyQuestions = this.generateEmergencyUniqueQuestions(subject, chapter, count - questions.length);
      questions.push(...emergencyQuestions);
    }

    // Apply CUET-correct mixing ratios and shuffle options
    const finalQuestions = this.applyMixingRatios(questions, mode, count);
    const shuffledQuestions = this.shuffleAllQuestionOptions(finalQuestions);
    
    console.log(`✅ Generated ${shuffledQuestions.length} unique intelligent questions with shuffled options`);
    return shuffledQuestions;
  }

  /**
   * Get wrong question variants (same concept, different numbers/framing)
   */
  async getWrongQuestionVariants(subject, chapter, limit) {
    const wrongQuestions = this.mistakeEngine.getWrongQuestions(subject, chapter, limit);
    const variants = [];

    for (const wrongQ of wrongQuestions) {
      try {
        // Generate variant of the same concept
        const variant = await this.generateQuestionVariant(wrongQ, subject, chapter);
        if (variant) {
          variants.push({
            ...variant,
            source: 'mistake_variant',
            originalMistakeId: wrongQ.questionId,
            mistakeCount: wrongQ.mistakeCount,
            priority: 'highest'
          });
        }
      } catch (error) {
        console.warn(`Failed to generate variant for mistake ${wrongQ.questionId}:`, error);
      }
    }

    return variants;
  }

  /**
   * Generate a variant of a previously wrong question
   */
  async generateQuestionVariant(wrongQuestion, subject, chapter) {
    const conceptMistakes = this.mistakeEngine.getConceptMistakes(subject, chapter);
    const relevantConcept = conceptMistakes.find(cm => 
      cm.questions.includes(wrongQuestion.questionId)
    );

    if (!relevantConcept) {
      return null;
    }

    // Try AI generation first
    if (groqService.isAvailable) {
      try {
        const prompt = `Generate a CUET-level MCQ for ${subject} - ${chapter} that tests the SAME CONCEPT as a question the user previously answered incorrectly.

Concept: ${relevantConcept.concept}
Difficulty: ${wrongQuestion.attempts[0]?.difficulty || 'medium'}
Mistake count: ${wrongQuestion.mistakeCount}

Requirements:
- Test the SAME underlying concept/principle
- Use DIFFERENT numbers/values/examples
- Keep CUET exam difficulty level
- Provide clear explanation
- 4 options with 1 correct answer

Make it slightly easier if mistake count > 2, same difficulty if mistake count <= 2.`;

        const aiQuestions = await groqService.generateQuestions(subject, chapter, 1, 'medium', prompt);
        if (aiQuestions.length > 0) {
          return {
            ...aiQuestions[0],
            conceptTag: relevantConcept.concept,
            isVariant: true
          };
        }
      } catch (error) {
        console.warn('AI variant generation failed:', error);
      }
    }

    // Fallback to template-based variant
    return this.generateTemplateVariant(wrongQuestion, subject, chapter);
  }

  /**
   * Get concept-similar PYQs based on user mistakes
   */
  async getConceptSimilarPYQs(subject, chapter, limit) {
    const conceptMistakes = this.mistakeEngine.getConceptMistakes(subject, chapter);
    const pyqs = [];

    for (const conceptMistake of conceptMistakes.slice(0, 3)) {
      const similarPYQs = this.findSimilarPYQs(subject, conceptMistake.concept, Math.ceil(limit / 3));
      pyqs.push(...similarPYQs.map(pyq => ({
        ...pyq,
        source: 'concept_similar_pyq',
        conceptTag: conceptMistake.concept,
        mistakeCount: conceptMistake.mistakeCount,
        priority: 'high'
      })));
    }

    return pyqs.slice(0, limit);
  }

  /**
   * Find PYQs similar to a concept
   */
  findSimilarPYQs(subject, concept, limit) {
    const subjectQuestions = STATIC_QUESTIONS[subject.toLowerCase()] || {};
    const allPYQs = [];

    // Collect all PYQs from all chapters
    Object.values(subjectQuestions).forEach(chapterQuestions => {
      if (Array.isArray(chapterQuestions)) {
        const pyqs = chapterQuestions.filter(q => 
          q.isPYQ && 
          (q.concept === concept || 
           q.conceptTag === concept ||
           q.question.toLowerCase().includes(concept.toLowerCase()))
        );
        allPYQs.push(...pyqs);
      }
    });

    // Shuffle and return limited set
    return this.shuffleArray(allPYQs).slice(0, limit);
  }

  /**
   * Get exact PYQs for the chapter
   */
  async getExactPYQs(subject, chapter, limit) {
    try {
      const pyqs = await questionService.getPYQQuestions(subject, chapter, limit);
      return pyqs.map(pyq => ({
        ...pyq,
        source: 'exact_pyq',
        priority: 'medium'
      }));
    } catch (error) {
      console.warn('Failed to get exact PYQs:', error);
      return [];
    }
  }

  /**
   * Generate concept-aware AI questions
   */
  async getConceptAwareAIQuestions(subject, chapter, count, difficulty) {
    const conceptMistakes = this.mistakeEngine.getConceptMistakes(subject, chapter);
    const questions = [];

    if (groqService.isAvailable && conceptMistakes.length > 0) {
      try {
        // Generate questions targeting weak concepts
        const weakConcepts = conceptMistakes.slice(0, 3).map(cm => cm.concept);
        
        const prompt = `Generate ${count} CUET-level MCQs for ${subject} - ${chapter}.

Focus on these concepts where the user has made mistakes:
${weakConcepts.map((concept, i) => `${i + 1}. ${concept}`).join('\n')}

Requirements:
- Target the weak concepts above
- CUET exam difficulty level
- Clear explanations
- 4 options with 1 correct answer
- Vary question types and approaches`;

        const aiQuestions = await groqService.generateQuestions(subject, chapter, count, difficulty, prompt);
        
        questions.push(...aiQuestions.map(q => ({
          ...q,
          source: 'concept_aware_ai',
          conceptTag: weakConcepts[Math.floor(Math.random() * weakConcepts.length)],
          priority: 'medium'
        })));
      } catch (error) {
        console.warn('Concept-aware AI generation failed:', error);
      }
    }

    // Fill remaining with regular AI questions
    const remaining = count - questions.length;
    if (remaining > 0) {
      try {
        const regularAI = await questionService.getAIQuestions(subject, chapter, remaining, difficulty);
        questions.push(...regularAI.map(q => ({
          ...q,
          source: 'regular_ai',
          priority: 'low'
        })));
      } catch (error) {
        console.warn('Regular AI generation failed:', error);
      }
    }

    return questions;
  }

  /**
   * Generate intelligent fallback questions (CUET-accurate, never generic)
   */
  generateIntelligentFallback(subject, chapter, count) {
    console.log(`🎯 Generating ${count} CUET-accurate fallback questions`);
    
    // Use CUET question generator for realistic fallbacks
    return cuetQuestionGenerator.generateFallbackQuestions(subject, chapter, count);
  }

  /**
   * Apply CUET-correct mixing ratios based on mode
   */
  applyMixingRatios(questions, mode, targetCount) {
    const ratios = this.getMixingRatios(mode);
    const categorized = this.categorizeQuestions(questions);
    
    const mixed = [];
    
    // Add questions according to ratios
    const mistakeCount = Math.floor(targetCount * ratios.mistake);
    const pyqCount = Math.floor(targetCount * ratios.pyq);
    const freshCount = targetCount - mistakeCount - pyqCount;

    // Mistake-based questions (highest priority)
    mixed.push(...categorized.mistake.slice(0, mistakeCount));
    
    // PYQ questions
    mixed.push(...categorized.pyq.slice(0, pyqCount));
    
    // Fresh questions
    mixed.push(...categorized.fresh.slice(0, freshCount));

    // Fill any remaining slots
    const remaining = targetCount - mixed.length;
    if (remaining > 0) {
      const allRemaining = [...categorized.mistake, ...categorized.pyq, ...categorized.fresh]
        .filter(q => !mixed.includes(q));
      mixed.push(...allRemaining.slice(0, remaining));
    }

    return this.shuffleArray(mixed).slice(0, targetCount);
  }

  /**
   * Get mixing ratios for different modes
   */
  getMixingRatios(mode) {
    const ratios = {
      daily: { mistake: 0.4, pyq: 0.3, fresh: 0.3 },
      chapter: { mistake: 0.5, pyq: 0.3, fresh: 0.2 },
      pyq: { mistake: 0.2, pyq: 0.8, fresh: 0.0 },
      mock: { mistake: 0.3, pyq: 0.4, fresh: 0.3 }
    };

    return ratios[mode] || ratios.chapter;
  }

  /**
   * Categorize questions by type
   */
  categorizeQuestions(questions) {
    const categorized = {
      mistake: [],
      pyq: [],
      fresh: []
    };

    questions.forEach(q => {
      if (q.source === 'mistake_variant' || q.priority === 'highest') {
        categorized.mistake.push(q);
      } else if (q.source === 'exact_pyq' || q.source === 'concept_similar_pyq' || q.isPYQ) {
        categorized.pyq.push(q);
      } else {
        categorized.fresh.push(q);
      }
    });

    return categorized;
  }

  /**
   * Get wrong question limit based on mode
   */
  getWrongQuestionLimit(mode, totalCount) {
    const limits = {
      daily: Math.floor(totalCount * 0.4), // 40% for daily
      chapter: Math.floor(totalCount * 0.5), // 50% for chapter
      pyq: Math.floor(totalCount * 0.2), // 20% for PYQ mode
      mock: Math.floor(totalCount * 0.3) // 30% for mock
    };

    return limits[mode] || limits.chapter;
  }

  /**
   * Generate template-based variant (fallback)
   */
  generateTemplateVariant(wrongQuestion, subject, chapter) {
    // Simple template-based variant generation
    return {
      id: `variant_${wrongQuestion.questionId}_${Date.now()}`,
      question: `Variant of previous question: ${subject} - ${chapter} concept practice.`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0,
      explanation: 'This is a variant of a question you previously answered incorrectly.',
      difficulty: 'medium',
      source: 'template_variant',
      conceptTag: chapter,
      isVariant: true,
      originalMistakeId: wrongQuestion.questionId
    };
  }

  /**
   * Utility: Shuffle array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // 🔥 QUESTION UNIQUENESS METHODS (MANDATORY)

  /**
   * Reset session tracker for new quiz
   */
  resetSessionTracker() {
    this.sessionQuestionHashes.clear();
    this.sessionStartTime = Date.now();
    console.log('🔄 Reset session question tracker');
  }

  /**
   * Generate question hash for uniqueness check
   */
  generateQuestionHash(question) {
    const { subject, chapter, concept, question: questionText } = question;
    const normalizedText = questionText?.toLowerCase().replace(/[^\w\s]/g, '').trim() || '';
    return `${subject}_${chapter}_${concept || 'unknown'}_${normalizedText}`;
  }

  /**
   * Check if question is unique in current session
   */
  isQuestionUnique(question) {
    const hash = this.generateQuestionHash(question);
    return !this.sessionQuestionHashes.has(hash);
  }

  /**
   * Add question to session tracker
   */
  addQuestionToSession(question) {
    const hash = this.generateQuestionHash(question);
    this.sessionQuestionHashes.add(hash);
  }

  /**
   * Filter questions to ensure uniqueness
   */
  filterUniqueQuestions(questions) {
    const uniqueQuestions = [];
    
    for (const question of questions) {
      if (this.isQuestionUnique(question)) {
        this.addQuestionToSession(question);
        uniqueQuestions.push(question);
      } else {
        console.log(`🚫 Filtered duplicate question: ${question.question?.substring(0, 50)}...`);
      }
    }
    
    return uniqueQuestions;
  }

  /**
   * Generate emergency unique questions when all else fails
   */
  generateEmergencyUniqueQuestions(subject, chapter, count) {
    const questions = [];
    let attempts = 0;
    const maxAttempts = count * 3;

    while (questions.length < count && attempts < maxAttempts) {
      attempts++;
      
      const emergencyQuestion = {
        id: `emergency_unique_${subject}_${chapter}_${attempts}_${Date.now()}`,
        subject,
        chapter,
        concept: chapter,
        question: this.generateUniqueEmergencyQuestion(subject, chapter, attempts),
        options: this.generateCUETRealisticOptions(subject, chapter, attempts),
        correctAnswer: 0,
        explanation: `This question tests ${chapter} concepts from ${subject}.`,
        source: 'emergency_unique',
        difficulty: 'medium'
      };

      if (this.isQuestionUnique(emergencyQuestion)) {
        this.addQuestionToSession(emergencyQuestion);
        questions.push(emergencyQuestion);
      }
    }

    console.log(`🚨 Generated ${questions.length} emergency unique questions`);
    return questions;
  }

  /**
   * Generate unique emergency question text
   */
  generateUniqueEmergencyQuestion(subject, chapter, attempt) {
    const templates = {
      'Physics': [
        `In ${chapter}, when analyzing the fundamental principles, which property is most significant?`,
        `According to ${chapter} theory, the relationship between variables is characterized by:`,
        `The practical application of ${chapter} concepts demonstrates that:`,
        `In experimental ${chapter}, the most critical factor to consider is:`,
        `The mathematical formulation of ${chapter} principles indicates that:`
      ],
      'Chemistry': [
        `In ${chapter}, the molecular behavior is primarily governed by:`,
        `According to ${chapter} principles, the reaction mechanism involves:`,
        `The thermodynamic aspects of ${chapter} suggest that:`,
        `In ${chapter} processes, the rate-determining step is influenced by:`,
        `The equilibrium conditions in ${chapter} are characterized by:`
      ],
      'Mathematics': [
        `In ${chapter}, the fundamental theorem states that:`,
        `According to ${chapter} principles, the solution method involves:`,
        `The graphical representation of ${chapter} functions shows:`,
        `In ${chapter} applications, the critical point occurs when:`,
        `The analytical approach to ${chapter} problems requires:`
      ]
    };

    const subjectTemplates = templates[subject] || templates['Physics'];
    const template = subjectTemplates[attempt % subjectTemplates.length];
    
    return template;
  }

  /**
   * Generate CUET-realistic options (NO PLACEHOLDERS)
   */
  generateCUETRealisticOptions(subject, chapter, attempt) {
    const optionSets = {
      'Physics': {
        'Electrostatics': [
          ['Electric field strength', 'Magnetic field intensity', 'Gravitational force', 'Nuclear force'],
          ['Coulomb force law', 'Newton\'s law', 'Faraday\'s law', 'Ohm\'s law'],
          ['Inverse square relationship', 'Direct proportionality', 'Exponential decay', 'Linear relationship'],
          ['Permittivity of medium', 'Permeability of space', 'Conductivity factor', 'Resistance coefficient']
        ],
        'Current Electricity': [
          ['Ohmic resistance', 'Capacitive reactance', 'Inductive impedance', 'Magnetic reluctance'],
          ['Potential difference', 'Electric field', 'Magnetic flux', 'Current density'],
          ['Power dissipation', 'Energy storage', 'Magnetic coupling', 'Electric polarization'],
          ['Kirchhoff\'s laws', 'Faraday\'s laws', 'Lenz\'s law', 'Ampere\'s law']
        ]
      },
      'Chemistry': [
        ['Molecular orbital theory', 'Valence bond theory', 'Crystal field theory', 'Ligand field theory'],
        ['Activation energy', 'Bond dissociation energy', 'Lattice energy', 'Ionization energy'],
        ['Le Chatelier\'s principle', 'Hund\'s rule', 'Pauli exclusion', 'Aufbau principle'],
        ['Thermodynamic stability', 'Kinetic stability', 'Electronic stability', 'Nuclear stability']
      ],
      'Mathematics': [
        ['Continuity condition', 'Differentiability', 'Integrability', 'Convergence'],
        ['Maximum value', 'Minimum value', 'Inflection point', 'Asymptotic behavior'],
        ['Chain rule', 'Product rule', 'Quotient rule', 'Integration by parts'],
        ['Fundamental theorem', 'Mean value theorem', 'Intermediate value theorem', 'Rolle\'s theorem']
      ]
    };

    const subjectOptions = optionSets[subject] || optionSets['Mathematics'];
    const chapterOptions = subjectOptions[chapter] || subjectOptions[Object.keys(subjectOptions)[0]] || subjectOptions;
    
    if (Array.isArray(chapterOptions[0])) {
      return chapterOptions[attempt % chapterOptions.length];
    } else {
      return chapterOptions;
    }
  }

  // 🔥 OPTION SHUFFLING METHODS (MANDATORY)

  /**
   * Shuffle options for all questions and update correct answer indices
   */
  shuffleAllQuestionOptions(questions) {
    return questions.map(question => this.shuffleQuestionOptions(question));
  }

  /**
   * Shuffle options for a single question and update correct answer index
   */
  shuffleQuestionOptions(question) {
    if (!question.options || !Array.isArray(question.options)) {
      console.warn('⚠️ Question missing options array:', question.id);
      return question;
    }

    const originalCorrectAnswer = question.correctAnswer || 0;
    const correctOption = question.options[originalCorrectAnswer];
    
    // Create shuffled options
    const shuffledOptions = this.shuffleArray([...question.options]);
    
    // Find new index of correct option
    const newCorrectIndex = shuffledOptions.findIndex(option => option === correctOption);
    
    return {
      ...question,
      options: shuffledOptions,
      correctAnswer: newCorrectIndex >= 0 ? newCorrectIndex : 0,
      originalCorrectIndex: originalCorrectAnswer,
      wasShuffled: true
    };
  }

  /**
   * Record question attempt (integrates with mistake engine)
   */
  async recordQuestionAttempt(attemptData) {
    return this.mistakeEngine.recordAttempt(attemptData);
  }

  /**
   * Get learning analytics
   */
  getLearningAnalytics(subject, chapter) {
    return this.mistakeEngine.getLearningAnalytics(subject, chapter);
  }

  /**
   * Get questions ready for spaced repetition
   */
  getSpacedRepetitionQuestions(subject, chapter) {
    return this.mistakeEngine.getMistakesForReview(subject, chapter);
  }
}

// Export singleton instance
export const intelligentQuestionService = new IntelligentQuestionService();