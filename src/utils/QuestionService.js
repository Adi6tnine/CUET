// AVION - Intelligent Question Service with Mistake-Based Learning
// Enhanced with failure-driven learning and CUET exam patterns

import { physicsGenerators, getPhysicsQuestion } from './generators/physics.js';
import { mathsGenerators } from './generators/maths.js';
import { chemistryGenerators } from './generators/chemistry.js';
import { englishGenerators } from './generators/english.js';
import { STATIC_QUESTIONS } from '../data/static_questions.js';
import { groqService } from './groqService.js';
import { intelligentQuestionService } from '../services/IntelligentQuestionService.js';
import { mistakeMemoryEngine } from '../services/MistakeMemoryEngine.js';
import { CUET_STANDARDS, getPracticeConfig } from '../config/CUETStandards.js';

class QuestionService {
  constructor() {
    this.predictionMode = false;
    this.userStats = this.loadUserStats();
    this.aiProvider = import.meta.env.VITE_PRIMARY_AI_PROVIDER || 'groq';
    this.useAI = import.meta.env.VITE_DEV_MODE === 'true'; // Enable AI in dev mode
  }

  // Load user statistics from localStorage
  loadUserStats() {
    try {
      const stats = localStorage.getItem('cuet-user-stats');
      return stats ? JSON.parse(stats) : {
        solvedTemplates: new Set(),
        solvedStatic: new Set(),
        subjectMastery: {},
        weakTopics: [],
        totalQuestions: 0,
        correctAnswers: 0,
        xp: 0
      };
    } catch (error) {
      console.error('Failed to load user stats:', error);
      return { solvedTemplates: new Set(), solvedStatic: new Set(), subjectMastery: {}, weakTopics: [], totalQuestions: 0, correctAnswers: 0, xp: 0 };
    }
  }

  // Save user statistics to localStorage
  saveUserStats() {
    try {
      const statsToSave = {
        ...this.userStats,
        solvedTemplates: Array.from(this.userStats.solvedTemplates),
        solvedStatic: Array.from(this.userStats.solvedStatic)
      };
      localStorage.setItem('cuet-user-stats', JSON.stringify(statsToSave));
    } catch (error) {
      console.error('Failed to save user stats:', error);
    }
  }

  // Toggle 2026 Prediction Mode
  togglePredictionMode() {
    this.predictionMode = !this.predictionMode;
    console.log(`🔮 2026 Prediction Mode: ${this.predictionMode ? 'ON' : 'OFF'}`);
    return this.predictionMode;
  }

  // Alias for backward compatibility
  async getQuestions(subject, chapter, count = 30) {
    return this.getChapterQuestions(subject, chapter, count);
  }

  // Main method to get questions for a chapter with intelligent mistake-based learning
  async getChapterQuestions(subject, chapter, count = 30) {
    console.log(`🧠 INTELLIGENT: Getting ${count} questions for ${subject} - ${chapter}`);
    
    // Use intelligent question service for mistake-based learning
    return await intelligentQuestionService.getIntelligentQuestions({
      subject,
      chapter,
      count,
      mode: 'chapter',
      difficulty: 'adaptive'
    });
  }

  // Get questions for Daily Command with CUET-correct counts
  async getDailyCommandQuestions(subject, chapter) {
    const config = getPracticeConfig('daily');
    console.log(`📅 DAILY COMMAND: Getting ${config.questionCount} questions`);
    
    return await intelligentQuestionService.getIntelligentQuestions({
      subject,
      chapter,
      count: config.questionCount,
      mode: 'daily',
      difficulty: 'adaptive'
    });
  }

  // Get PYQ questions with mistake-based priority
  async getPYQQuestions(subject, chapter, count = 25) {
    const config = getPracticeConfig('pyq');
    console.log(`⭐ PYQ MODE: Getting ${config.questionCount} PYQ questions`);
    
    return await intelligentQuestionService.getIntelligentQuestions({
      subject,
      chapter,
      count: count || config.questionCount,
      mode: 'pyq',
      difficulty: 'adaptive'
    });
  }

  // Get AI questions with concept awareness
  async getAIQuestions(subject, chapter, count = 15, difficulty = 'medium') {
    console.log(`🤖 AI: Getting ${count} concept-aware AI questions`);
    
    // Get concept mistakes for context
    const conceptMistakes = mistakeMemoryEngine.getConceptMistakes(subject, chapter);
    
    if (groqService.isAvailable && conceptMistakes.length > 0) {
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

      try {
        const aiQuestions = await groqService.generateQuestions(subject, chapter, count, difficulty, prompt);
        return aiQuestions.map(q => ({
          ...q,
          source: 'concept_aware_ai',
          conceptTag: weakConcepts[Math.floor(Math.random() * weakConcepts.length)]
        }));
      } catch (error) {
        console.warn('Concept-aware AI generation failed:', error);
      }
    }
    
    // Fallback to regular AI generation
    return await this.generateAIQuestions(subject, chapter, count, difficulty);
  }

  // Generate AI questions using GroqCloud
  async generateAIQuestions(subject, chapter, count = 5, difficulty = 'Medium') {
    try {
      console.log(`🤖 Generating ${count} AI questions for ${subject} - ${chapter} (${difficulty})`);
      
      // Use GroqCloud service to generate questions
      const aiQuestions = await groqService.generateQuestions(subject, chapter, count, difficulty.toLowerCase());
      
      // Filter out any invalid questions and add hints
      const validQuestions = aiQuestions.filter(q => 
        q && q.question && Array.isArray(q.options) && q.options.length === 4
      ).map(q => ({
        ...q,
        difficulty,
        hint: this.generateQuestionHint(q, subject)
      }));
      
      console.log(`✅ GroqCloud generated ${validQuestions.length}/${aiQuestions.length} valid questions`);
      return validQuestions;
      
    } catch (error) {
      console.warn(`⚠️ AI generation failed: ${error.message}`);
      
      // Return empty array to let other strategies handle question generation
      return [];
    }
  }

  // Generate hint for a question
  generateQuestionHint(question, subject) {
    const subjectHints = {
      physics: [
        "Remember to check units and apply the correct formula",
        "Draw a diagram to visualize the problem",
        "Consider conservation laws (energy, momentum, charge)",
        "Check if the problem involves vectors or scalars"
      ],
      chemistry: [
        "Consider electron configuration and periodic trends",
        "Think about molecular geometry and bonding",
        "Check oxidation states and reaction mechanisms",
        "Remember equilibrium principles and Le Chatelier's principle"
      ],
      mathematics: [
        "Break the problem into smaller steps",
        "Check if you need to use a specific theorem or formula",
        "Consider the domain and range of functions",
        "Verify your answer by substitution or alternative method"
      ],
      english: [
        "Look for context clues in the passage",
        "Pay attention to grammar rules and sentence structure",
        "Consider the tone and style of the text",
        "Eliminate obviously incorrect options first"
      ],
      'general test': [
        "Use logical reasoning and elimination",
        "Consider current affairs and general knowledge",
        "Think about cause and effect relationships",
        "Look for patterns or connections"
      ]
    };

    const hints = subjectHints[subject.toLowerCase()] || subjectHints['general test'];
    return hints[Math.floor(Math.random() * hints.length)];
  }

  // Check if subject uses template generation
  isTemplateSubject(subject) {
    return ['physics', 'mathematics', 'chemistry'].includes(subject);
  }

  // Generate questions using algorithmic templates
  generateTemplateQuestions(subject, chapter, count) {
    const questions = [];

    // Special handling for physics using new complete generator
    if (subject === 'physics') {
      for (let i = 0; i < count; i++) {
        try {
          const question = getPhysicsQuestion(chapter);
          questions.push({
            ...question,
            source: 'template',
            hint: this.generateQuestionHint(question, subject)
          });
        } catch (error) {
          console.error(`Failed to generate physics question for ${chapter}:`, error);
        }
      }
      return questions;
    }

    // Original logic for mathematics and chemistry
    let generators = [];
    switch (subject) {
      case 'mathematics':
        generators = mathsGenerators[chapter] || [];
        break;
      case 'chemistry':
        generators = chemistryGenerators[chapter] || [];
        break;
    }

    if (generators.length === 0) {
      console.warn(`No generators found for ${subject} - ${chapter}`);
      return this.generateFallbackQuestions(subject, chapter, count);
    }

    // Filter generators based on prediction mode
    const availableGenerators = this.predictionMode 
      ? generators.filter(gen => gen.highWeightage || gen.trend2026)
      : generators;

    if (availableGenerators.length === 0) {
      console.warn(`No prediction mode generators for ${subject} - ${chapter}`);
      return generators.slice(0, Math.min(5, generators.length)).map(gen => gen.generate());
    }

    // Generate questions by cycling through available generators
    for (let i = 0; i < count; i++) {
      const generator = availableGenerators[i % availableGenerators.length];
      try {
        const question = generator.generate();
        questions.push({
          ...question,
          source: 'template',
          generator: generator.name,
          difficulty: generator.difficulty || 'medium',
          concept: generator.concept || chapter
        });
      } catch (error) {
        console.error(`Failed to generate question from ${generator.name}:`, error);
      }
    }

    return questions;
  }

  // Get questions from static database
  getStaticQuestions(subject, chapter, count) {
    // Normalize subject name for lookup
    const normalizedSubject = subject.toLowerCase() === 'general test' ? 'general test' : subject.toLowerCase();
    console.log(`📖 Looking for static questions: ${normalizedSubject} - ${chapter}`);
    
    const subjectQuestions = STATIC_QUESTIONS[normalizedSubject] || {};
    const chapterQuestions = subjectQuestions[chapter] || [];
    
    console.log(`📊 Found ${chapterQuestions.length} static questions for ${normalizedSubject} - ${chapter}`);
    
    if (chapterQuestions.length === 0) {
      console.warn(`⚠️ No static questions found for ${subject} - ${chapter}, using fallback`);
      return this.generateFallbackQuestions(subject, chapter, count);
    }

    // Filter based on prediction mode
    const availableQuestions = this.predictionMode
      ? chapterQuestions.filter(q => q.trend === '2026_Probable' || q.difficulty === 'Hard')
      : chapterQuestions;

    if (availableQuestions.length === 0) {
      console.log(`📝 No prediction mode questions, using all ${chapterQuestions.length} questions`);
      const shuffled = this.shuffleArray([...chapterQuestions]);
      return shuffled.slice(0, count).map(q => ({
        ...q,
        source: 'static',
        hint: this.generateQuestionHint(q, subject)
      }));
    }

    // Return shuffled questions
    const shuffled = this.shuffleArray([...availableQuestions]);
    const selectedQuestions = shuffled.slice(0, count).map(q => ({
      ...q,
      source: 'static',
      hint: this.generateQuestionHint(q, subject)
    }));
    
    console.log(`✅ Returning ${selectedQuestions.length} static questions`);
    return selectedQuestions;
  }

  // Generate fallback questions when no specific generators/questions available
  generateFallbackQuestions(subject, chapter, count) {
    console.log(`🔄 Generating ${count} fallback questions for ${subject} - ${chapter}`);
    const questions = [];
    
    // Subject-specific fallback templates
    const fallbackTemplates = {
      'Physics': {
        template: 'A particle moves with velocity {v} m/s. What is its kinetic energy if mass is {m} kg?',
        options: ['½mv²', 'mv²', '2mv²', 'mv'],
        correct: 0,
        explanation: 'Kinetic energy is given by KE = ½mv²'
      },
      'Chemistry': {
        template: 'What is the molecular formula of {compound}?',
        options: ['H₂O', 'CO₂', 'NaCl', 'CH₄'],
        correct: 0,
        explanation: 'This is a basic molecular formula question.'
      },
      'Mathematics': {
        template: 'Find the derivative of x² + {c}x + {d}',
        options: ['2x + c', 'x² + c', '2x', 'x + c'],
        correct: 0,
        explanation: 'The derivative of x² is 2x, derivative of cx is c, and derivative of constant is 0.'
      },
      'English': {
        template: 'Choose the correct synonym for "{word}"',
        options: ['Happy', 'Sad', 'Angry', 'Confused'],
        correct: 0,
        explanation: 'This tests vocabulary and word relationships.'
      },
      'General Test': {
        template: 'Which of the following is the capital of {country}?',
        options: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
        correct: 0,
        explanation: 'This tests general knowledge about geography.'
      }
    };
    
    const template = fallbackTemplates[subject] || fallbackTemplates['General Test'];
    
    for (let i = 0; i < count; i++) {
      questions.push({
        question: `${subject} - ${chapter}: Sample question ${i + 1}. ${template.template.replace('{v}', Math.floor(Math.random() * 10) + 1).replace('{m}', Math.floor(Math.random() * 5) + 1).replace('{c}', Math.floor(Math.random() * 10) + 1).replace('{d}', Math.floor(Math.random() * 10) + 1).replace('{compound}', 'Water').replace('{word}', 'Joyful').replace('{country}', 'India')}`,
        options: template.options.map((opt, idx) => `${opt} (Option ${String.fromCharCode(65 + idx)})`),
        correct: template.correct,
        explanation: `${template.explanation} This is a fallback question for ${subject} ${chapter}.`,
        difficulty: 'medium',
        source: 'fallback',
        concept: chapter,
        hint: this.generateQuestionHint({ question: template.template }, subject)
      });
    }

    console.log(`✅ Generated ${questions.length} fallback questions`);
    return questions;
  }

  // Utility: Shuffle array
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Update user statistics after quiz completion
  updateUserStats(results) {
    const { subject, chapter, questions, userAnswers, score, timeSpent } = results;

    // Update basic stats
    this.userStats.totalQuestions += questions.length;
    this.userStats.correctAnswers += userAnswers.filter((answer, index) => 
      answer === questions[index].correct
    ).length;

    // Update XP
    const xpGained = score > 0 ? Math.floor(score / 5) * 10 : 0;
    this.userStats.xp += xpGained;

    // Update subject mastery
    const accuracy = (this.userStats.correctAnswers / this.userStats.totalQuestions) * 100;
    this.userStats.subjectMastery[subject] = Math.min(100, (this.userStats.subjectMastery[subject] || 0) + 5);

    // Track solved questions
    questions.forEach((q, index) => {
      const questionId = `${subject}-${chapter}-${q.generator || q.id}`;
      if (q.source === 'template') {
        this.userStats.solvedTemplates.add(questionId);
      } else {
        this.userStats.solvedStatic.add(questionId);
      }
    });

    // Identify weak topics
    const incorrectQuestions = questions.filter((q, index) => 
      userAnswers[index] !== q.correct
    );
    
    incorrectQuestions.forEach(q => {
      if (!this.userStats.weakTopics.includes(q.concept)) {
        this.userStats.weakTopics.push(q.concept);
      }
    });

    // Keep only last 10 weak topics
    this.userStats.weakTopics = this.userStats.weakTopics.slice(-10);

    this.saveUserStats();
    
    return {
      xpGained,
      newMastery: this.userStats.subjectMastery[subject],
      totalXP: this.userStats.xp,
      accuracy: Math.round(accuracy)
    };
  }

  // Get user progress statistics
  getUserProgress() {
    return {
      totalQuestions: this.userStats.totalQuestions,
      correctAnswers: this.userStats.correctAnswers,
      accuracy: this.userStats.totalQuestions > 0 
        ? Math.round((this.userStats.correctAnswers / this.userStats.totalQuestions) * 100) 
        : 0,
      xp: this.userStats.xp,
      level: Math.floor(this.userStats.xp / 1000) + 1,
      subjectMastery: this.userStats.subjectMastery,
      weakTopics: this.userStats.weakTopics,
      solvedCount: {
        templates: this.userStats.solvedTemplates.size,
        static: this.userStats.solvedStatic.size
      }
    };
  }

  // Get recommendations for next study topics
  getRecommendations() {
    const progress = this.getUserProgress();
    const recommendations = [];

    // Recommend weak topics
    if (progress.weakTopics.length > 0) {
      recommendations.push({
        type: 'weak_topic',
        title: 'Focus on Weak Areas',
        description: `Practice more questions on: ${progress.weakTopics.slice(0, 3).join(', ')}`,
        priority: 'high'
      });
    }

    // Recommend subjects with low mastery
    Object.entries(progress.subjectMastery).forEach(([subject, mastery]) => {
      if (mastery < 50) {
        recommendations.push({
          type: 'low_mastery',
          title: `Improve ${subject}`,
          description: `Current mastery: ${mastery}%. Practice more chapters to improve.`,
          priority: 'medium'
        });
      }
    });

    // Recommend prediction mode if accuracy is high
    if (progress.accuracy > 75 && !this.predictionMode) {
      recommendations.push({
        type: 'prediction_mode',
        title: 'Try 2026 Prediction Mode',
        description: 'Your accuracy is high! Challenge yourself with high-weightage questions.',
        priority: 'low'
      });
    }

    return recommendations.slice(0, 5);
  }

  // Clear all user data (for reset functionality)
  clearUserData() {
    this.userStats = {
      solvedTemplates: new Set(),
      solvedStatic: new Set(),
      subjectMastery: {},
      weakTopics: [],
      totalQuestions: 0,
      correctAnswers: 0,
      xp: 0
    };
    
    localStorage.removeItem('cuet-user-stats');
    console.log('🗑️ User data cleared successfully');
  }

  // NEW FORMAT: Generate Assertion-Reasoning Questions
  generateARQuestion(subject, topic) {
    console.log(`🔬 Generating Assertion-Reasoning question for ${subject} - ${topic}`);
    
    const arDatabase = {
      physics: [
        {
          assertion: "Electric field lines never intersect each other",
          reason: "At any point, electric field has a unique direction",
          relationship: "correct_explanation"
        },
        {
          assertion: "Magnetic field lines form closed loops",
          reason: "Magnetic monopoles do not exist in nature",
          relationship: "correct_explanation"
        },
        {
          assertion: "Current flows from positive to negative terminal in external circuit",
          reason: "Electrons move from negative to positive terminal inside the conductor",
          relationship: "correct_explanation"
        },
        {
          assertion: "Resistance of a conductor increases with temperature",
          reason: "Higher temperature increases atomic vibrations",
          relationship: "correct_explanation"
        },
        {
          assertion: "Capacitors block DC current in steady state",
          reason: "No current flows through the dielectric material",
          relationship: "correct_explanation"
        }
      ],
      mathematics: [
        {
          assertion: "The derivative of a constant function is zero",
          reason: "Constants do not change with respect to the variable",
          relationship: "correct_explanation"
        },
        {
          assertion: "Integration and differentiation are inverse operations",
          reason: "The fundamental theorem of calculus establishes this relationship",
          relationship: "correct_explanation"
        },
        {
          assertion: "The limit of sin(x)/x as x approaches 0 is 1",
          reason: "This is a standard limit used in calculus",
          relationship: "correct_explanation"
        }
      ],
      chemistry: [
        {
          assertion: "Noble gases are chemically inert under normal conditions",
          reason: "They have complete outer electron shells (octet configuration)",
          relationship: "correct_explanation"
        },
        {
          assertion: "Ionic compounds conduct electricity in molten state",
          reason: "Ions become mobile when the solid lattice breaks down",
          relationship: "correct_explanation"
        }
      ]
    };

    const subjectData = arDatabase[subject.toLowerCase()] || arDatabase.physics;
    const selected = subjectData[Math.floor(Math.random() * subjectData.length)];
    
    // Randomly introduce traps (25% chance each)
    const trapType = Math.floor(Math.random() * 4);
    let correctAnswer, modifiedAssertion = selected.assertion, modifiedReason = selected.reason;
    
    switch(trapType) {
      case 0: // Both true and correct explanation
        correctAnswer = 0;
        break;
      case 1: // Both true but wrong explanation
        correctAnswer = 1;
        modifiedReason = "This is a fundamental principle of science"; // Generic wrong reason
        break;
      case 2: // Assertion true, reason false
        correctAnswer = 2;
        modifiedReason = modifiedReason.replace("do not exist", "exist in abundance")
                                      .replace("increases", "decreases")
                                      .replace("complete", "incomplete"); // Make reason false
        break;
      case 3: // Assertion false
        correctAnswer = 3;
        modifiedAssertion = modifiedAssertion.replace("never intersect", "always intersect")
                                           .replace("increases", "decreases")
                                           .replace("form closed loops", "are always straight"); // Make assertion false
        break;
    }
    
    const options = [
      "Both Assertion and Reason are true, and Reason is correct explanation of Assertion",
      "Both Assertion and Reason are true, but Reason is not correct explanation of Assertion",
      "Assertion is true but Reason is false",
      "Assertion is false but Reason is true"
    ];
    
    return {
      question: `**Assertion (A):** ${modifiedAssertion}\n**Reason (R):** ${modifiedReason}`,
      options,
      correct: correctAnswer,
      explanation: `Analysis: ${options[correctAnswer]}\n\nThis tests your understanding of the logical relationship between scientific statements.`,
      type: "assertion-reasoning",
      source: "ar_generator",
      difficulty: "hard",
      concept: topic,
      assertionData: {
        assertion: modifiedAssertion,
        reason: modifiedReason,
        correctRelationship: options[correctAnswer]
      }
    };
  }

  // NEW FORMAT: Generate Match the Column Questions
  generateMatchColumn(subject) {
    console.log(`🔗 Generating Match the Column question for ${subject}`);
    
    const matchDatabase = {
      physics: {
        title: "Match the Scientist with their Discovery",
        pairs: [
          { key: "A. Coulomb", value: "1. Electrostatic force law" },
          { key: "B. Faraday", value: "2. Electromagnetic induction" },
          { key: "C. Ohm", value: "3. Current-voltage relationship" },
          { key: "D. Gauss", value: "4. Electric flux theorem" }
        ]
      },
      chemistry: {
        title: "Match the Element with its Symbol",
        pairs: [
          { key: "A. Sodium", value: "1. Na" },
          { key: "B. Potassium", value: "2. K" },
          { key: "C. Iron", value: "3. Fe" },
          { key: "D. Gold", value: "4. Au" }
        ]
      },
      mathematics: {
        title: "Match the Function with its Derivative",
        pairs: [
          { key: "A. sin x", value: "1. cos x" },
          { key: "B. cos x", value: "2. -sin x" },
          { key: "C. tan x", value: "3. sec²x" },
          { key: "D. ln x", value: "4. 1/x" }
        ]
      },
      english: {
        title: "Match the Author with their Famous Work",
        pairs: [
          { key: "A. Shakespeare", value: "1. Hamlet" },
          { key: "B. Charles Dickens", value: "2. Oliver Twist" },
          { key: "C. Jane Austen", value: "3. Pride and Prejudice" },
          { key: "D. George Orwell", value: "4. 1984" }
        ]
      }
    };

    const subjectData = matchDatabase[subject.toLowerCase()] || matchDatabase.physics;
    
    // Generate option combinations (correct and traps)
    const correctMapping = "A-1, B-2, C-3, D-4";
    const trapOptions = [
      "A-2, B-1, C-4, D-3",  // Swap first two pairs
      "A-1, B-3, C-2, D-4",  // Swap middle pairs
      "A-4, B-3, C-2, D-1"   // Reverse order
    ];
    
    const options = [correctMapping, ...trapOptions];
    
    return {
      question: `Match the items in Column I with Column II and select the correct combination:`,
      options,
      correct: 0,
      explanation: `Correct matching: ${correctMapping}\n\nThis tests your knowledge of ${subjectData.title.toLowerCase()}.`,
      type: "match-column",
      source: "match_generator",
      difficulty: "medium",
      concept: "Knowledge Matching",
      matchData: {
        title: subjectData.title,
        pairs: subjectData.pairs,
        correctMapping
      }
    };
  }

  // Enhanced question generation with new formats
  async getChapterQuestionsWithFormats(subject, chapter, count = 30, includeSpecialFormats = true) {
    const questions = await this.getChapterQuestions(subject, chapter, Math.floor(count * 0.7));
    
    if (includeSpecialFormats && count > 20) {
      // Add 20% Assertion-Reasoning questions
      const arCount = Math.floor(count * 0.2);
      for (let i = 0; i < arCount; i++) {
        questions.push(this.generateARQuestion(subject, chapter));
      }
      
      // Add 10% Match the Column questions
      const matchCount = Math.floor(count * 0.1);
      for (let i = 0; i < matchCount; i++) {
        questions.push(this.generateMatchColumn(subject));
      }
    }
    
    return this.shuffleArray(questions).slice(0, count);
  }
  // 🌟 PYQ-SPECIFIC METHODS FOR CHAPTER-WISE PRACTICE
  
  /**
   * Get Previous Year Questions for a specific subject and chapter
   */
  async getPYQQuestions(subject, chapter, count = 15) {
    console.log(`⭐ Loading PYQ questions for ${subject} - ${chapter}`);
    
    try {
      // First try to get real PYQ data from static questions
      const pyqQuestions = this.getPYQFromStatic(subject, chapter, count);
      
      if (pyqQuestions.length >= count) {
        return pyqQuestions.slice(0, count);
      }
      
      // If not enough PYQ data, generate PYQ-style questions using AI
      const remainingCount = count - pyqQuestions.length;
      const aiPYQQuestions = await this.generatePYQStyleQuestions(subject, chapter, remainingCount);
      
      return [...pyqQuestions, ...aiPYQQuestions];
    } catch (error) {
      console.error('Error loading PYQ questions:', error);
      // Fallback to template-based questions marked as PYQ-style
      return this.getTemplateQuestions(subject, chapter, count).map(q => ({
        ...q,
        isPYQ: true,
        source: 'Template (PYQ-style)',
        year: '2023' // Default year for template questions
      }));
    }
  }

  /**
   * Get AI-generated questions for chapter practice
   */
  async getAIQuestions(subject, chapter, count = 15, difficulty = 'medium') {
    console.log(`🤖 Loading AI questions for ${subject} - ${chapter}`);
    
    try {
      if (this.useAI && this.aiProvider === 'groq') {
        const aiQuestions = await groqService.generateChapterQuestions(subject, chapter, count, difficulty);
        return aiQuestions.map(q => ({
          ...q,
          isAI: true,
          source: 'AI Generated',
          difficulty: difficulty
        }));
      }
      
      // Fallback to template questions
      return this.getTemplateQuestions(subject, chapter, count);
    } catch (error) {
      console.error('Error loading AI questions:', error);
      return this.getTemplateQuestions(subject, chapter, count);
    }
  }

  /**
   * Extract PYQ questions from static question database
   */
  getPYQFromStatic(subject, chapter, count) {
    const subjectQuestions = STATIC_QUESTIONS[subject] || [];
    const chapterQuestions = subjectQuestions.filter(q => 
      q.chapter && q.chapter.toLowerCase().includes(chapter.toLowerCase()) && q.isPYQ
    );
    
    return chapterQuestions.slice(0, count).map(q => ({
      ...q,
      isPYQ: true,
      source: `CUET ${q.year || '2023'}`,
      year: q.year || '2023'
    }));
  }

  /**
   * Generate PYQ-style questions using AI
   */
  async generatePYQStyleQuestions(subject, chapter, count) {
    if (!this.useAI || this.aiProvider !== 'groq') {
      return [];
    }
    
    try {
      const prompt = `Generate ${count} CUET Previous Year Question style MCQs for ${subject} - ${chapter}. 
      Make them exactly like real CUET exam questions with:
      - Authentic CUET difficulty level
      - Real exam-style language
      - Practical application focus
      - Standard CUET format`;
      
      const questions = await groqService.generateQuestions(subject, chapter, count, 'medium', prompt);
      return questions.map(q => ({
        ...q,
        isPYQ: true,
        source: 'AI (PYQ-style)',
        year: '2024',
        isAI: true
      }));
    } catch (error) {
      console.error('Error generating PYQ-style questions:', error);
      return [];
    }
  }

  /**
   * Check if chapter has PYQ data available
   */
  hasPYQData(subject, chapter) {
    const subjectQuestions = STATIC_QUESTIONS[subject] || [];
    const pyqCount = subjectQuestions.filter(q => 
      q.chapter && q.chapter.toLowerCase().includes(chapter.toLowerCase()) && q.isPYQ
    ).length;
    
    return pyqCount > 0;
  }

  /**
   * Get PYQ statistics for a subject
   */
  getPYQStats(subject) {
    const subjectQuestions = STATIC_QUESTIONS[subject] || [];
    const pyqQuestions = subjectQuestions.filter(q => q.isPYQ);
    
    const yearStats = {};
    pyqQuestions.forEach(q => {
      const year = q.year || '2023';
      yearStats[year] = (yearStats[year] || 0) + 1;
    });
    
    return {
      totalPYQ: pyqQuestions.length,
      yearStats,
      availableYears: Object.keys(yearStats).sort((a, b) => b - a)
    };
  }

}

// Export singleton instance
export const questionService = new QuestionService();