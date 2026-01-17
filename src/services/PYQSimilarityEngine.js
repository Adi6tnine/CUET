/**
 * PYQ SIMILARITY ENGINE
 * Finds and serves similar PYQ questions based on user mistakes
 * Implements concept-based matching and PYQ reuse logic
 */

import { STATIC_QUESTIONS } from '../data/static_questions.js';
import { groqService } from '../utils/groqService.js';

class PYQSimilarityEngine {
  constructor() {
    this.conceptMap = this.buildConceptMap();
    this.pyqIndex = this.buildPYQIndex();
  }

  /**
   * Build concept mapping for similarity matching
   */
  buildConceptMap() {
    const conceptMap = {
      // Physics concepts
      'Electrostatics': ['electric field', 'coulomb law', 'electric potential', 'capacitance', 'gauss law'],
      'Current Electricity': ['ohm law', 'resistance', 'current', 'voltage', 'power', 'kirchhoff'],
      'Magnetism': ['magnetic field', 'magnetic force', 'electromagnetic induction', 'faraday law'],
      'Optics': ['reflection', 'refraction', 'lens', 'mirror', 'interference', 'diffraction'],
      'Modern Physics': ['photoelectric effect', 'atomic structure', 'nuclear physics', 'quantum'],
      
      // Chemistry concepts
      'Chemical Bonding': ['ionic bond', 'covalent bond', 'metallic bond', 'hybridization', 'molecular geometry'],
      'Thermodynamics': ['enthalpy', 'entropy', 'gibbs energy', 'heat capacity', 'phase transition'],
      'Equilibrium': ['chemical equilibrium', 'le chatelier', 'equilibrium constant', 'acid base'],
      'Electrochemistry': ['oxidation', 'reduction', 'electrode potential', 'electrolysis', 'galvanic cell'],
      'Organic Chemistry': ['functional groups', 'isomerism', 'reaction mechanisms', 'nomenclature'],
      
      // Mathematics concepts
      'Calculus': ['limits', 'derivatives', 'integrals', 'differential equations', 'continuity'],
      'Algebra': ['quadratic equations', 'polynomials', 'matrices', 'determinants', 'complex numbers'],
      'Coordinate Geometry': ['straight line', 'circle', 'parabola', 'ellipse', 'hyperbola'],
      'Trigonometry': ['trigonometric functions', 'identities', 'inverse trigonometric'],
      'Probability': ['permutation', 'combination', 'probability distribution', 'statistics'],
      
      // English concepts
      'Reading Comprehension': ['main idea', 'inference', 'vocabulary', 'tone', 'author purpose'],
      'Grammar': ['parts of speech', 'tenses', 'voice', 'narration', 'sentence structure'],
      'Vocabulary': ['synonyms', 'antonyms', 'idioms', 'phrases', 'word formation'],
      
      // General Test concepts
      'General Knowledge': ['history', 'geography', 'polity', 'economics', 'current affairs'],
      'Logical Reasoning': ['syllogism', 'coding decoding', 'blood relations', 'direction sense'],
      'Quantitative Aptitude': ['arithmetic', 'algebra', 'geometry', 'data interpretation']
    };

    return conceptMap;
  }

  /**
   * Build PYQ index for fast lookup
   */
  buildPYQIndex() {
    const index = {
      bySubject: {},
      byConcept: {},
      byYear: {},
      byDifficulty: {}
    };

    Object.entries(STATIC_QUESTIONS).forEach(([subject, chapters]) => {
      index.bySubject[subject] = [];
      
      Object.entries(chapters).forEach(([chapter, questions]) => {
        if (Array.isArray(questions)) {
          questions.forEach(question => {
            if (question.isPYQ) {
              const pyqData = {
                ...question,
                subject,
                chapter,
                id: `${subject}_${chapter}_${questions.indexOf(question)}`
              };

              // Index by subject
              index.bySubject[subject].push(pyqData);

              // Index by concept
              const concept = question.concept || question.conceptTag || chapter;
              if (!index.byConcept[concept]) {
                index.byConcept[concept] = [];
              }
              index.byConcept[concept].push(pyqData);

              // Index by year
              const year = question.year || '2023';
              if (!index.byYear[year]) {
                index.byYear[year] = [];
              }
              index.byYear[year].push(pyqData);

              // Index by difficulty
              const difficulty = question.difficulty || 'medium';
              if (!index.byDifficulty[difficulty]) {
                index.byDifficulty[difficulty] = [];
              }
              index.byDifficulty[difficulty].push(pyqData);
            }
          });
        }
      });
    });

    console.log('📚 Built PYQ index:', {
      subjects: Object.keys(index.bySubject).length,
      concepts: Object.keys(index.byConcept).length,
      years: Object.keys(index.byYear).length,
      totalPYQs: Object.values(index.bySubject).reduce((sum, pyqs) => sum + pyqs.length, 0)
    });

    return index;
  }

  /**
   * Find similar PYQs based on a wrong answer
   */
  findSimilarPYQs(wrongAnswer, limit = 5) {
    const { subject, chapter, conceptTag } = wrongAnswer;
    const similarPYQs = [];

    console.log(`🔍 Finding similar PYQs for mistake: ${subject} - ${conceptTag || chapter}`);

    // Strategy 1: Exact concept match
    const exactConceptPYQs = this.findByExactConcept(subject, conceptTag || chapter);
    similarPYQs.push(...exactConceptPYQs.slice(0, Math.ceil(limit * 0.6)));

    // Strategy 2: Related concept match
    if (similarPYQs.length < limit) {
      const relatedPYQs = this.findByRelatedConcepts(subject, conceptTag || chapter);
      const remaining = limit - similarPYQs.length;
      similarPYQs.push(...relatedPYQs.slice(0, remaining));
    }

    // Strategy 3: Same chapter PYQs
    if (similarPYQs.length < limit) {
      const chapterPYQs = this.findByChapter(subject, chapter);
      const remaining = limit - similarPYQs.length;
      similarPYQs.push(...chapterPYQs.slice(0, remaining));
    }

    // Remove duplicates and add metadata
    const uniquePYQs = this.removeDuplicates(similarPYQs).map(pyq => ({
      ...pyq,
      source: 'similar_pyq',
      similarityReason: this.getSimilarityReason(pyq, wrongAnswer),
      mistakeBasedSelection: true
    }));

    console.log(`✅ Found ${uniquePYQs.length} similar PYQs`);
    return uniquePYQs.slice(0, limit);
  }

  /**
   * Find PYQs by exact concept match
   */
  findByExactConcept(subject, concept) {
    const conceptPYQs = this.pyqIndex.byConcept[concept] || [];
    const subjectPYQs = conceptPYQs.filter(pyq => pyq.subject === subject);
    
    return this.shuffleArray(subjectPYQs);
  }

  /**
   * Find PYQs by related concepts
   */
  findByRelatedConcepts(subject, concept) {
    const relatedConcepts = this.getRelatedConcepts(concept);
    const relatedPYQs = [];

    relatedConcepts.forEach(relatedConcept => {
      const conceptPYQs = this.pyqIndex.byConcept[relatedConcept] || [];
      const subjectPYQs = conceptPYQs.filter(pyq => pyq.subject === subject);
      relatedPYQs.push(...subjectPYQs);
    });

    return this.shuffleArray(relatedPYQs);
  }

  /**
   * Find PYQs by chapter
   */
  findByChapter(subject, chapter) {
    const subjectPYQs = this.pyqIndex.bySubject[subject] || [];
    const chapterPYQs = subjectPYQs.filter(pyq => pyq.chapter === chapter);
    
    return this.shuffleArray(chapterPYQs);
  }

  /**
   * Get related concepts for similarity matching
   */
  getRelatedConcepts(concept) {
    const related = [];
    
    // Find concepts that share keywords
    Object.entries(this.conceptMap).forEach(([mainConcept, keywords]) => {
      if (mainConcept === concept) {
        // Add all keywords as related concepts
        related.push(...keywords);
      } else if (keywords.some(keyword => 
        concept.toLowerCase().includes(keyword) || 
        keyword.includes(concept.toLowerCase())
      )) {
        related.push(mainConcept);
      }
    });

    return [...new Set(related)]; // Remove duplicates
  }

  /**
   * Generate PYQ-style question if no similar PYQ found
   */
  async generatePYQStyleQuestion(wrongAnswer) {
    if (!groqService.isAvailable) {
      return null;
    }

    const { subject, chapter, conceptTag, mistakeCount } = wrongAnswer;

    try {
      const prompt = `Generate a CUET Previous Year Question style MCQ that tests the SAME CONCEPT as a question the user previously answered incorrectly.

Subject: ${subject}
Chapter: ${chapter}
Concept: ${conceptTag || chapter}
User's mistake count on this concept: ${mistakeCount}

Requirements:
- EXACT CUET PYQ format and difficulty
- Test the SAME underlying concept/principle
- Use authentic CUET language and style
- Provide 4 options with 1 correct answer
- Include detailed explanation
- Make it ${mistakeCount > 2 ? 'slightly easier' : 'same difficulty'} as original

Generate a question that feels like it came from an actual CUET paper.`;

      const aiQuestions = await groqService.generateQuestions(subject, chapter, 1, 'medium', prompt);
      
      if (aiQuestions.length > 0) {
        return {
          ...aiQuestions[0],
          source: 'pyq_style_ai',
          isPYQ: true,
          year: '2024',
          conceptTag: conceptTag || chapter,
          mistakeBasedGeneration: true,
          originalMistakeId: wrongAnswer.questionId
        };
      }
    } catch (error) {
      console.warn('Failed to generate PYQ-style question:', error);
    }

    return null;
  }

  /**
   * Get PYQ reuse recommendations
   */
  getPYQReuseRecommendations(mistakeHistory, subject, chapter) {
    const recommendations = [];

    // Find PYQs that were answered incorrectly
    const pyqMistakes = mistakeHistory.filter(mistake => 
      mistake.source === 'pyq' && 
      mistake.subject === subject && 
      mistake.chapter === chapter
    );

    pyqMistakes.forEach(mistake => {
      // Recommend the same PYQ for retry
      recommendations.push({
        type: 'retry_same_pyq',
        questionId: mistake.questionId,
        reason: `You got this PYQ wrong ${mistake.mistakeCount} times`,
        priority: mistake.mistakeCount > 2 ? 'high' : 'medium'
      });

      // Recommend similar PYQs
      const similarPYQs = this.findSimilarPYQs(mistake, 3);
      similarPYQs.forEach(similarPYQ => {
        recommendations.push({
          type: 'similar_pyq',
          questionId: similarPYQ.id,
          reason: `Similar to PYQ you got wrong (${mistake.conceptTag})`,
          priority: 'medium',
          originalMistakeId: mistake.questionId
        });
      });
    });

    return recommendations;
  }

  /**
   * Get similarity reason for UI display
   */
  getSimilarityReason(pyq, wrongAnswer) {
    if (pyq.concept === wrongAnswer.conceptTag) {
      return 'Same concept';
    }
    if (pyq.chapter === wrongAnswer.chapter) {
      return 'Same chapter';
    }
    return 'Related concept';
  }

  /**
   * Remove duplicate PYQs
   */
  removeDuplicates(pyqs) {
    const seen = new Set();
    return pyqs.filter(pyq => {
      const key = `${pyq.subject}_${pyq.chapter}_${pyq.question.substring(0, 50)}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Shuffle array utility
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get PYQ statistics
   */
  getPYQStats() {
    const stats = {
      totalPYQs: 0,
      bySubject: {},
      byYear: {},
      byConcept: Object.keys(this.pyqIndex.byConcept).length
    };

    Object.entries(this.pyqIndex.bySubject).forEach(([subject, pyqs]) => {
      stats.bySubject[subject] = pyqs.length;
      stats.totalPYQs += pyqs.length;
    });

    Object.entries(this.pyqIndex.byYear).forEach(([year, pyqs]) => {
      stats.byYear[year] = pyqs.length;
    });

    return stats;
  }

  /**
   * Search PYQs by text content
   */
  searchPYQs(searchTerm, subject = null, limit = 10) {
    const allPYQs = subject 
      ? this.pyqIndex.bySubject[subject] || []
      : Object.values(this.pyqIndex.bySubject).flat();

    const matchingPYQs = allPYQs.filter(pyq => 
      pyq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pyq.concept?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pyq.chapter.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchingPYQs.slice(0, limit);
  }
}

// Export singleton instance
export const pyqSimilarityEngine = new PYQSimilarityEngine();