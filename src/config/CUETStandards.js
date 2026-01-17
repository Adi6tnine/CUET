/**
 * CUET STANDARDS CONFIGURATION
 * Defines official CUET exam patterns and question counts
 * Used to ensure practice sessions match real exam expectations
 */

export const CUET_STANDARDS = {
  // DAILY COMMAND CONFIGURATION
  DAILY_COMMAND: {
    questionCount: 15,
    timeLimit: 20, // minutes
    mixingRatio: {
      mistakeBased: 0.4, // 40% - 6 questions
      pyq: 0.3,          // 30% - 4-5 questions  
      fresh: 0.3         // 30% - 4-5 questions
    },
    description: "Smart daily practice targeting weak areas"
  },

  // CHAPTER-WISE PRACTICE CONFIGURATION
  CHAPTER_PRACTICE: {
    questionCount: 20,
    timeLimit: 25, // minutes
    mixingRatio: {
      mistakeBased: 0.5, // 50% - 10 questions
      pyq: 0.3,          // 30% - 6 questions
      fresh: 0.2         // 20% - 4 questions
    },
    description: "Focused chapter practice with mistake reinforcement"
  },

  // PYQ MODE CONFIGURATION
  PYQ_MODE: {
    questionCount: 25,
    timeLimit: 30, // minutes
    mixingRatio: {
      mistakeBased: 0.2, // 20% - 5 questions (mistake-based PYQs)
      pyq: 0.8,          // 80% - 20 questions (pure PYQs)
      fresh: 0.0         // 0% - no fresh questions
    },
    description: "Previous year questions with mistake-based selection"
  },

  // MOCK TEST CONFIGURATION (CUET STANDARD)
  MOCK_TEST: {
    FULL: {
      questionCount: 200,
      timeLimit: 180, // minutes (3 hours)
      mixingRatio: {
        mistakeBased: 0.3, // 30% - 60 questions
        pyq: 0.4,          // 40% - 80 questions
        fresh: 0.3         // 30% - 60 questions
      },
      description: "Full CUET simulation"
    },
    SECTIONAL: {
      questionCount: 50,
      timeLimit: 45, // minutes
      mixingRatio: {
        mistakeBased: 0.3, // 30% - 15 questions
        pyq: 0.4,          // 40% - 20 questions
        fresh: 0.3         // 30% - 15 questions
      },
      description: "Subject-wise sectional test"
    }
  },

  // SPACED REPETITION INTERVALS
  SPACED_REPETITION: {
    immediate: 0,                    // Same session
    short: 3 * 60 * 1000,          // 3 minutes
    medium: 24 * 60 * 60 * 1000,   // 1 day
    long: 7 * 24 * 60 * 60 * 1000  // 7 days
  },

  // MISTAKE REAPPEARANCE SCHEDULE
  MISTAKE_SCHEDULE: {
    session1: 0,        // Immediate (same session)
    session3: 2,        // After 3 sessions
    week1: 7,           // After 7 days
    resolved: 30        // Mark as resolved after 30 days of correct answers
  },

  // DIFFICULTY PROGRESSION
  DIFFICULTY_PROGRESSION: {
    beginner: {
      easy: 0.5,    // 50% easy questions
      medium: 0.4,  // 40% medium questions
      hard: 0.1     // 10% hard questions
    },
    intermediate: {
      easy: 0.3,    // 30% easy questions
      medium: 0.5,  // 50% medium questions
      hard: 0.2     // 20% hard questions
    },
    advanced: {
      easy: 0.2,    // 20% easy questions
      medium: 0.4,  // 40% medium questions
      hard: 0.4     // 40% hard questions
    }
  },

  // SUBJECT-WISE TIME ALLOCATION (per question)
  TIME_PER_QUESTION: {
    'Physics': 90,        // 1.5 minutes per question
    'Chemistry': 90,      // 1.5 minutes per question
    'Mathematics': 120,   // 2 minutes per question
    'English': 60,        // 1 minute per question
    'General Test': 60    // 1 minute per question
  },

  // ACCURACY THRESHOLDS
  ACCURACY_THRESHOLDS: {
    excellent: 85,    // 85%+ accuracy
    good: 70,         // 70-84% accuracy
    average: 50,      // 50-69% accuracy
    needsWork: 0      // Below 50% accuracy
  },

  // MASTERY LEVELS
  MASTERY_LEVELS: {
    beginner: 0,      // 0-30% mastery
    developing: 30,   // 30-60% mastery
    proficient: 60,   // 60-80% mastery
    expert: 80        // 80%+ mastery
  },

  // STREAK REQUIREMENTS
  STREAK_REQUIREMENTS: {
    maintain: 70,     // 70%+ accuracy to maintain streak
    bonus: 85,        // 85%+ accuracy for bonus XP
    perfect: 100      // 100% accuracy for perfect bonus
  }
};

/**
 * Get question count and time limit for a practice mode
 */
export function getPracticeConfig(mode) {
  const configs = {
    'daily': CUET_STANDARDS.DAILY_COMMAND,
    'chapter': CUET_STANDARDS.CHAPTER_PRACTICE,
    'pyq': CUET_STANDARDS.PYQ_MODE,
    'mock_full': CUET_STANDARDS.MOCK_TEST.FULL,
    'mock_sectional': CUET_STANDARDS.MOCK_TEST.SECTIONAL
  };

  return configs[mode] || CUET_STANDARDS.CHAPTER_PRACTICE;
}

/**
 * Calculate time per question based on subject
 */
export function getTimePerQuestion(subject) {
  return CUET_STANDARDS.TIME_PER_QUESTION[subject] || 90; // Default 90 seconds
}

/**
 * Get mixing ratios for question types
 */
export function getMixingRatios(mode) {
  const config = getPracticeConfig(mode);
  return config.mixingRatio;
}

/**
 * Determine user's mastery level
 */
export function getMasteryLevel(accuracy) {
  if (accuracy >= CUET_STANDARDS.MASTERY_LEVELS.expert) return 'expert';
  if (accuracy >= CUET_STANDARDS.MASTERY_LEVELS.proficient) return 'proficient';
  if (accuracy >= CUET_STANDARDS.MASTERY_LEVELS.developing) return 'developing';
  return 'beginner';
}

/**
 * Get difficulty distribution based on user level
 */
export function getDifficultyDistribution(masteryLevel) {
  return CUET_STANDARDS.DIFFICULTY_PROGRESSION[masteryLevel] || 
         CUET_STANDARDS.DIFFICULTY_PROGRESSION.intermediate;
}

/**
 * Check if accuracy meets streak requirements
 */
export function meetsStreakRequirement(accuracy) {
  return accuracy >= CUET_STANDARDS.STREAK_REQUIREMENTS.maintain;
}

/**
 * Calculate XP bonus based on accuracy
 */
export function calculateAccuracyBonus(accuracy) {
  if (accuracy >= CUET_STANDARDS.STREAK_REQUIREMENTS.perfect) return 2.0; // 100% bonus
  if (accuracy >= CUET_STANDARDS.STREAK_REQUIREMENTS.bonus) return 1.5;   // 50% bonus
  if (accuracy >= CUET_STANDARDS.STREAK_REQUIREMENTS.maintain) return 1.2; // 20% bonus
  return 1.0; // No bonus
}