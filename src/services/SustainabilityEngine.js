/**
 * SUSTAINABILITY ENGINE
 * Ensures AVION remains useful and engaging for 6-9 months of daily practice
 * Implements variation, spaced repetition, and fatigue prevention
 */

import { mistakeMemoryEngine } from './MistakeMemoryEngine.js';
import { CUET_STANDARDS } from '../config/CUETStandards.js';

class SustainabilityEngine {
  constructor() {
    this.sessionCount = this.getSessionCount();
    this.variationPatterns = this.initializeVariationPatterns();
  }

  /**
   * Get current session count for the user
   */
  getSessionCount() {
    try {
      const count = localStorage.getItem('cuet-session-count');
      return count ? parseInt(count) : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Increment session count
   */
  incrementSessionCount() {
    this.sessionCount++;
    try {
      localStorage.setItem('cuet-session-count', this.sessionCount.toString());
    } catch (error) {
      console.warn('Failed to save session count:', error);
    }
    return this.sessionCount;
  }

  /**
   * Initialize variation patterns for different subjects
   */
  initializeVariationPatterns() {
    return {
      Physics: {
        numberVariations: [
          { type: 'multiply', factor: [2, 3, 5, 10] },
          { type: 'decimal', places: [1, 2] },
          { type: 'scientific', range: [1e-3, 1e6] }
        ],
        unitVariations: [
          { from: 'm', to: ['cm', 'mm', 'km'] },
          { from: 's', to: ['ms', 'min', 'h'] },
          { from: 'kg', to: ['g', 'mg', 'ton'] }
        ],
        contextVariations: [
          'A particle', 'An object', 'A body', 'A mass',
          'A charge', 'An electron', 'A proton', 'An ion'
        ]
      },
      Chemistry: {
        compoundVariations: [
          'NaCl', 'KCl', 'CaCl₂', 'MgCl₂', 'AlCl₃',
          'H₂SO₄', 'HCl', 'HNO₃', 'CH₃COOH'
        ],
        concentrationVariations: [
          0.1, 0.2, 0.5, 1.0, 2.0, 5.0
        ],
        temperatureVariations: [
          273, 298, 300, 373, 400, 500
        ]
      },
      Mathematics: {
        coefficientVariations: [1, 2, 3, 4, 5, -1, -2, -3],
        functionVariations: [
          'f(x)', 'g(x)', 'h(x)', 'y', 'u', 'v'
        ],
        intervalVariations: [
          '[0,1]', '[1,2]', '[-1,1]', '[0,π]', '[0,2π]'
        ]
      },
      English: {
        passageTopics: [
          'technology', 'environment', 'education', 'health',
          'society', 'culture', 'science', 'history'
        ],
        questionStarters: [
          'According to the passage',
          'The author suggests that',
          'It can be inferred that',
          'The main idea is'
        ]
      },
      'General Test': {
        yearVariations: [2020, 2021, 2022, 2023, 2024],
        locationVariations: [
          'India', 'Asia', 'World', 'Europe', 'America'
        ],
        categoryVariations: [
          'Political', 'Economic', 'Social', 'Cultural', 'Scientific'
        ]
      }
    };
  }

  /**
   * Generate question variation to prevent repetition fatigue
   */
  generateQuestionVariation(originalQuestion, subject, sessionsSinceFirst = 0) {
    const variations = this.variationPatterns[subject];
    if (!variations) {
      return this.generateGenericVariation(originalQuestion, sessionsSinceFirst);
    }

    const varied = { ...originalQuestion };
    
    // Apply subject-specific variations
    switch (subject) {
      case 'Physics':
        varied = this.applyPhysicsVariations(varied, variations, sessionsSinceFirst);
        break;
      case 'Chemistry':
        varied = this.applyChemistryVariations(varied, variations, sessionsSinceFirst);
        break;
      case 'Mathematics':
        varied = this.applyMathematicsVariations(varied, variations, sessionsSinceFirst);
        break;
      case 'English':
        varied = this.applyEnglishVariations(varied, variations, sessionsSinceFirst);
        break;
      case 'General Test':
        varied = this.applyGeneralTestVariations(varied, variations, sessionsSinceFirst);
        break;
    }

    // Add variation metadata
    varied.isVariation = true;
    varied.originalQuestionId = originalQuestion.id;
    varied.variationLevel = this.getVariationLevel(sessionsSinceFirst);
    varied.sessionsSinceFirst = sessionsSinceFirst;

    return varied;
  }

  /**
   * Apply Physics-specific variations
   */
  applyPhysicsVariations(question, variations, sessionsSinceFirst) {
    const varied = { ...question };
    
    // Vary numbers in the question
    varied.question = this.varyNumbers(varied.question, variations.numberVariations);
    
    // Vary units
    varied.question = this.varyUnits(varied.question, variations.unitVariations);
    
    // Vary context words
    varied.question = this.varyContext(varied.question, variations.contextVariations);
    
    // Recalculate options if needed
    varied.options = this.recalculateOptions(varied.options, sessionsSinceFirst);
    
    return varied;
  }

  /**
   * Apply Chemistry-specific variations
   */
  applyChemistryVariations(question, variations, sessionsSinceFirst) {
    const varied = { ...question };
    
    // Vary chemical compounds
    const compounds = variations.compoundVariations;
    const randomCompound = compounds[Math.floor(Math.random() * compounds.length)];
    varied.question = varied.question.replace(/NaCl|KCl|CaCl₂/g, randomCompound);
    
    // Vary concentrations
    const concentrations = variations.concentrationVariations;
    const randomConc = concentrations[Math.floor(Math.random() * concentrations.length)];
    varied.question = varied.question.replace(/\d+\.?\d*\s*M/g, `${randomConc} M`);
    
    // Vary temperatures
    const temperatures = variations.temperatureVariations;
    const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
    varied.question = varied.question.replace(/\d+\s*K/g, `${randomTemp} K`);
    
    return varied;
  }

  /**
   * Apply Mathematics-specific variations
   */
  applyMathematicsVariations(question, variations, sessionsSinceFirst) {
    const varied = { ...question };
    
    // Vary coefficients
    const coefficients = variations.coefficientVariations;
    const randomCoeff = coefficients[Math.floor(Math.random() * coefficients.length)];
    varied.question = varied.question.replace(/\b\d+x/g, `${randomCoeff}x`);
    
    // Vary function names
    const functions = variations.functionVariations;
    const randomFunc = functions[Math.floor(Math.random() * functions.length)];
    varied.question = varied.question.replace(/f\(x\)/g, randomFunc);
    
    return varied;
  }

  /**
   * Apply English-specific variations
   */
  applyEnglishVariations(question, variations, sessionsSinceFirst) {
    const varied = { ...question };
    
    // Vary question starters
    const starters = variations.questionStarters;
    const randomStarter = starters[Math.floor(Math.random() * starters.length)];
    
    if (varied.question.includes('According to')) {
      varied.question = varied.question.replace(/^According to[^,]*,/, `${randomStarter},`);
    }
    
    return varied;
  }

  /**
   * Apply General Test-specific variations
   */
  applyGeneralTestVariations(question, variations, sessionsSinceFirst) {
    const varied = { ...question };
    
    // Vary years in current affairs questions
    const years = variations.yearVariations;
    const randomYear = years[Math.floor(Math.random() * years.length)];
    varied.question = varied.question.replace(/\b20\d{2}\b/g, randomYear.toString());
    
    return varied;
  }

  /**
   * Vary numbers in question text
   */
  varyNumbers(text, numberVariations) {
    const variation = numberVariations[Math.floor(Math.random() * numberVariations.length)];
    
    return text.replace(/\b\d+\.?\d*\b/g, (match) => {
      const num = parseFloat(match);
      if (isNaN(num)) return match;
      
      switch (variation.type) {
        case 'multiply':
          const factor = variation.factor[Math.floor(Math.random() * variation.factor.length)];
          return (num * factor).toString();
        case 'decimal':
          const places = variation.places[Math.floor(Math.random() * variation.places.length)];
          return (num + Math.random()).toFixed(places);
        default:
          return match;
      }
    });
  }

  /**
   * Vary units in question text
   */
  varyUnits(text, unitVariations) {
    unitVariations.forEach(unitVar => {
      const alternatives = unitVar.to;
      const randomUnit = alternatives[Math.floor(Math.random() * alternatives.length)];
      const regex = new RegExp(`\\b${unitVar.from}\\b`, 'g');
      text = text.replace(regex, randomUnit);
    });
    
    return text;
  }

  /**
   * Vary context words
   */
  varyContext(text, contextVariations) {
    const randomContext = contextVariations[Math.floor(Math.random() * contextVariations.length)];
    return text.replace(/A particle|An object|A body/g, randomContext);
  }

  /**
   * Recalculate options based on variation level
   */
  recalculateOptions(options, sessionsSinceFirst) {
    // For higher variation levels, shuffle options more
    if (sessionsSinceFirst > 5) {
      return this.shuffleArray([...options]);
    }
    return options;
  }

  /**
   * Get variation level based on sessions since first encounter
   */
  getVariationLevel(sessionsSinceFirst) {
    if (sessionsSinceFirst <= 1) return 'minimal';
    if (sessionsSinceFirst <= 3) return 'moderate';
    if (sessionsSinceFirst <= 7) return 'significant';
    return 'maximum';
  }

  /**
   * Generate generic variation for subjects without specific patterns
   */
  generateGenericVariation(question, sessionsSinceFirst) {
    const varied = { ...question };
    
    // Shuffle options for variety
    if (sessionsSinceFirst > 2) {
      const correctAnswer = varied.options[varied.correct];
      varied.options = this.shuffleArray([...varied.options]);
      varied.correct = varied.options.indexOf(correctAnswer);
    }
    
    return varied;
  }

  /**
   * Implement spaced repetition schedule
   */
  getSpacedRepetitionSchedule(mistakeCount, lastAttemptTime) {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptTime;
    
    // Determine next review time based on mistake count
    let nextReviewInterval;
    
    if (mistakeCount >= 3) {
      nextReviewInterval = CUET_STANDARDS.SPACED_REPETITION.long; // 7 days
    } else if (mistakeCount === 2) {
      nextReviewInterval = CUET_STANDARDS.SPACED_REPETITION.medium; // 1 day
    } else {
      nextReviewInterval = CUET_STANDARDS.SPACED_REPETITION.short; // 3 minutes
    }
    
    return {
      isReady: timeSinceLastAttempt >= nextReviewInterval,
      nextReviewAt: lastAttemptTime + nextReviewInterval,
      interval: nextReviewInterval,
      priority: mistakeCount >= 3 ? 'high' : mistakeCount === 2 ? 'medium' : 'low'
    };
  }

  /**
   * Prevent repetition fatigue by tracking question exposure
   */
  preventRepetitionFatigue(questions, subject, chapter) {
    const exposureKey = `question-exposure-${subject}-${chapter}`;
    let exposureData = {};
    
    try {
      const stored = localStorage.getItem(exposureKey);
      exposureData = stored ? JSON.parse(stored) : {};
    } catch (error) {
      exposureData = {};
    }
    
    // Filter out over-exposed questions
    const filteredQuestions = questions.filter(q => {
      const exposure = exposureData[q.id] || 0;
      return exposure < 5; // Max 5 exposures before temporary retirement
    });
    
    // Update exposure counts
    filteredQuestions.forEach(q => {
      exposureData[q.id] = (exposureData[q.id] || 0) + 1;
    });
    
    // Save updated exposure data
    try {
      localStorage.setItem(exposureKey, JSON.stringify(exposureData));
    } catch (error) {
      console.warn('Failed to save exposure data:', error);
    }
    
    return filteredQuestions;
  }

  /**
   * Generate fresh content to maintain engagement
   */
  generateFreshContent(subject, chapter, count) {
    const freshQuestions = [];
    
    for (let i = 0; i < count; i++) {
      const freshQuestion = {
        id: `fresh_${Date.now()}_${i}`,
        question: `Fresh ${subject} question ${i + 1} for ${chapter}. This question introduces new aspects of the concept.`,
        options: [
          `Fresh correct answer ${i + 1}`,
          `Fresh option A ${i + 1}`,
          `Fresh option B ${i + 1}`,
          `Fresh option C ${i + 1}`
        ],
        correct: 0,
        explanation: `This fresh question explores different aspects of ${chapter} to maintain engagement.`,
        difficulty: 'medium',
        source: 'fresh_content',
        isFresh: true,
        subject,
        chapter
      };
      
      freshQuestions.push(freshQuestion);
    }
    
    return freshQuestions;
  }

  /**
   * Calculate engagement score based on user behavior
   */
  calculateEngagementScore() {
    const mistakeData = mistakeMemoryEngine.loadMistakeData();
    const recentAttempts = mistakeData.attemptHistory.slice(0, 50); // Last 50 attempts
    
    if (recentAttempts.length === 0) return 100; // New user, full engagement
    
    // Calculate various engagement metrics
    const accuracyTrend = this.calculateAccuracyTrend(recentAttempts);
    const sessionFrequency = this.calculateSessionFrequency(recentAttempts);
    const varietyScore = this.calculateVarietyScore(recentAttempts);
    
    // Weighted engagement score
    const engagementScore = (
      accuracyTrend * 0.4 +
      sessionFrequency * 0.3 +
      varietyScore * 0.3
    );
    
    return Math.max(0, Math.min(100, engagementScore));
  }

  /**
   * Calculate accuracy trend
   */
  calculateAccuracyTrend(attempts) {
    if (attempts.length < 10) return 75; // Default for new users
    
    const recent = attempts.slice(0, 10);
    const previous = attempts.slice(10, 20);
    
    const recentAccuracy = recent.filter(a => a.isCorrect).length / recent.length;
    const previousAccuracy = previous.filter(a => a.isCorrect).length / previous.length;
    
    const trend = (recentAccuracy - previousAccuracy) * 100;
    return Math.max(0, 50 + trend); // Base 50, adjust by trend
  }

  /**
   * Calculate session frequency score
   */
  calculateSessionFrequency(attempts) {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    const recentAttempts = attempts.filter(a => a.timestamp > oneDayAgo).length;
    const mediumAttempts = attempts.filter(a => a.timestamp > threeDaysAgo).length;
    const weeklyAttempts = attempts.filter(a => a.timestamp > oneWeekAgo).length;
    
    if (recentAttempts > 0) return 100; // Active today
    if (mediumAttempts > 0) return 75;  // Active in last 3 days
    if (weeklyAttempts > 0) return 50;  // Active in last week
    return 25; // Less active
  }

  /**
   * Calculate variety score
   */
  calculateVarietyScore(attempts) {
    const subjects = new Set(attempts.map(a => a.subject));
    const chapters = new Set(attempts.map(a => a.chapter));
    const modes = new Set(attempts.map(a => a.mode));
    
    // More variety = higher engagement
    const varietyScore = (subjects.size * 20) + (chapters.size * 5) + (modes.size * 10);
    return Math.min(100, varietyScore);
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

  /**
   * Get sustainability recommendations
   */
  getSustainabilityRecommendations() {
    const engagementScore = this.calculateEngagementScore();
    const recommendations = [];
    
    if (engagementScore < 50) {
      recommendations.push({
        type: 'variety',
        message: 'Try practicing different subjects to maintain engagement',
        priority: 'high'
      });
    }
    
    if (this.sessionCount > 100) {
      recommendations.push({
        type: 'milestone',
        message: `Congratulations! You've completed ${this.sessionCount} practice sessions`,
        priority: 'celebration'
      });
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const sustainabilityEngine = new SustainabilityEngine();