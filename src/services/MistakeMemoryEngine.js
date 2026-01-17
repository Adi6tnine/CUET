/**
 * MISTAKE MEMORY ENGINE
 * Core intelligence system that learns from every user mistake
 * Implements failure-driven learning for CUET preparation
 */

class MistakeMemoryEngine {
  constructor() {
    this.storageKey = 'cuet-mistake-memory';
    this.initializeStorage();
  }

  initializeStorage() {
    const existing = this.loadMistakeData();
    if (!existing.attemptHistory) {
      this.saveMistakeData({
        attemptHistory: [],
        wrongQuestions: [],
        conceptMistakes: {},
        chapterMistakes: {},
        pyqMistakes: {},
        lastUpdated: Date.now()
      });
    }
  }

  loadMistakeData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {
        attemptHistory: [],
        wrongQuestions: [],
        conceptMistakes: {},
        chapterMistakes: {},
        pyqMistakes: {},
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('Failed to load mistake data:', error);
      return {
        attemptHistory: [],
        wrongQuestions: [],
        conceptMistakes: {},
        chapterMistakes: {},
        pyqMistakes: {},
        lastUpdated: Date.now()
      };
    }
  }

  saveMistakeData(data) {
    try {
      data.lastUpdated = Date.now();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      console.log('💾 Mistake data saved successfully');
    } catch (error) {
      console.error('Failed to save mistake data:', error);
    }
  }

  /**
   * CORE METHOD: Record every question attempt
   * This is called after EVERY question answered
   */
  recordAttempt(attemptData) {
    const {
      questionId,
      subject,
      chapter,
      conceptTag,
      source, // 'pyq' | 'ai' | 'template' | 'fallback'
      selectedOption,
      correctOption,
      isCorrect,
      timeTaken,
      difficulty,
      questionText,
      mode // 'daily' | 'chapter' | 'pyq' | 'mock'
    } = attemptData;

    const mistakeData = this.loadMistakeData();
    const timestamp = Date.now();

    // Create attempt record
    const attempt = {
      id: `attempt_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      questionId,
      subject,
      chapter,
      conceptTag: conceptTag || chapter,
      source,
      selectedOption,
      correctOption,
      isCorrect,
      timeTaken: timeTaken || 0,
      difficulty: difficulty || 'medium',
      questionText: questionText ? questionText.substring(0, 200) : '',
      mode,
      timestamp,
      mistakeCount: 0
    };

    // Add to attempt history
    mistakeData.attemptHistory.unshift(attempt);

    // If incorrect, process as mistake
    if (!isCorrect) {
      this.processMistake(attempt, mistakeData);
    }

    // Keep only last 1000 attempts for performance
    if (mistakeData.attemptHistory.length > 1000) {
      mistakeData.attemptHistory = mistakeData.attemptHistory.slice(0, 1000);
    }

    this.saveMistakeData(mistakeData);
    
    console.log(`📝 Recorded attempt: ${subject} - ${chapter} - ${isCorrect ? '✅' : '❌'}`);
    
    return attempt.id;
  }

  /**
   * Process a mistake and update all tracking structures
   */
  processMistake(attempt, mistakeData) {
    const { subject, chapter, conceptTag, source, questionId } = attempt;

    // 1. Add to wrong questions
    const existingWrong = mistakeData.wrongQuestions.find(q => q.questionId === questionId);
    if (existingWrong) {
      existingWrong.mistakeCount++;
      existingWrong.lastAttemptedAt = attempt.timestamp;
      existingWrong.attempts.push(attempt);
    } else {
      mistakeData.wrongQuestions.push({
        questionId,
        subject,
        chapter,
        conceptTag,
        source,
        mistakeCount: 1,
        firstMistakeAt: attempt.timestamp,
        lastAttemptedAt: attempt.timestamp,
        attempts: [attempt],
        isResolved: false
      });
    }

    // 2. Update concept mistakes
    const conceptKey = `${subject}::${conceptTag}`;
    if (!mistakeData.conceptMistakes[conceptKey]) {
      mistakeData.conceptMistakes[conceptKey] = {
        subject,
        concept: conceptTag,
        mistakeCount: 0,
        questions: [],
        lastMistakeAt: 0,
        difficulty: attempt.difficulty,
        needsReview: true
      };
    }
    mistakeData.conceptMistakes[conceptKey].mistakeCount++;
    mistakeData.conceptMistakes[conceptKey].lastMistakeAt = attempt.timestamp;
    mistakeData.conceptMistakes[conceptKey].questions.push(questionId);
    mistakeData.conceptMistakes[conceptKey].needsReview = true;

    // 3. Update chapter mistakes
    const chapterKey = `${subject}::${chapter}`;
    if (!mistakeData.chapterMistakes[chapterKey]) {
      mistakeData.chapterMistakes[chapterKey] = {
        subject,
        chapter,
        mistakeCount: 0,
        concepts: new Set(),
        lastMistakeAt: 0,
        needsReview: true
      };
    }
    mistakeData.chapterMistakes[chapterKey].mistakeCount++;
    mistakeData.chapterMistakes[chapterKey].lastMistakeAt = attempt.timestamp;
    mistakeData.chapterMistakes[chapterKey].concepts.add(conceptTag);
    mistakeData.chapterMistakes[chapterKey].needsReview = true;

    // 4. Track PYQ mistakes separately
    if (source === 'pyq') {
      const pyqKey = `${subject}::${chapter}`;
      if (!mistakeData.pyqMistakes[pyqKey]) {
        mistakeData.pyqMistakes[pyqKey] = {
          subject,
          chapter,
          pyqMistakeCount: 0,
          questions: [],
          lastMistakeAt: 0
        };
      }
      mistakeData.pyqMistakes[pyqKey].pyqMistakeCount++;
      mistakeData.pyqMistakes[pyqKey].lastMistakeAt = attempt.timestamp;
      mistakeData.pyqMistakes[pyqKey].questions.push(questionId);
    }

    console.log(`❌ Processed mistake: ${conceptKey} (${mistakeData.conceptMistakes[conceptKey].mistakeCount} total)`);
  }

  /**
   * Get previously wrong questions for a chapter (PRIORITY #1)
   */
  getWrongQuestions(subject, chapter, limit = 10) {
    const mistakeData = this.loadMistakeData();
    
    const wrongQuestions = mistakeData.wrongQuestions.filter(q => 
      q.subject === subject && 
      q.chapter === chapter && 
      !q.isResolved
    );

    // Sort by mistake count (most mistakes first) and recency
    wrongQuestions.sort((a, b) => {
      if (a.mistakeCount !== b.mistakeCount) {
        return b.mistakeCount - a.mistakeCount;
      }
      return b.lastAttemptedAt - a.lastAttemptedAt;
    });

    console.log(`🔄 Found ${wrongQuestions.length} wrong questions for ${subject} - ${chapter}`);
    return wrongQuestions.slice(0, limit);
  }

  /**
   * Get concept-based mistakes for intelligent question selection
   */
  getConceptMistakes(subject, chapter) {
    const mistakeData = this.loadMistakeData();
    
    const conceptMistakes = Object.values(mistakeData.conceptMistakes).filter(cm => 
      cm.subject === subject && 
      (cm.concept === chapter || cm.concept.includes(chapter)) &&
      cm.needsReview
    );

    // Sort by mistake count and recency
    conceptMistakes.sort((a, b) => {
      if (a.mistakeCount !== b.mistakeCount) {
        return b.mistakeCount - a.mistakeCount;
      }
      return b.lastMistakeAt - a.lastMistakeAt;
    });

    console.log(`🎯 Found ${conceptMistakes.length} concept mistakes for ${subject} - ${chapter}`);
    return conceptMistakes;
  }

  /**
   * Get PYQ mistakes for reuse logic
   */
  getPYQMistakes(subject, chapter) {
    const mistakeData = this.loadMistakeData();
    const pyqKey = `${subject}::${chapter}`;
    
    const pyqMistakes = mistakeData.pyqMistakes[pyqKey];
    if (!pyqMistakes) {
      return { questions: [], count: 0 };
    }

    console.log(`⭐ Found ${pyqMistakes.pyqMistakeCount} PYQ mistakes for ${subject} - ${chapter}`);
    return {
      questions: pyqMistakes.questions,
      count: pyqMistakes.pyqMistakeCount,
      lastMistakeAt: pyqMistakes.lastMistakeAt
    };
  }

  /**
   * Mark a question as resolved (user got it right after mistakes)
   */
  markQuestionResolved(questionId) {
    const mistakeData = this.loadMistakeData();
    
    const wrongQuestion = mistakeData.wrongQuestions.find(q => q.questionId === questionId);
    if (wrongQuestion) {
      wrongQuestion.isResolved = true;
      wrongQuestion.resolvedAt = Date.now();
      this.saveMistakeData(mistakeData);
      console.log(`✅ Marked question as resolved: ${questionId}`);
    }
  }

  /**
   * Get spaced repetition schedule for mistakes
   */
  getMistakesForReview(subject, chapter) {
    const mistakeData = this.loadMistakeData();
    const now = Date.now();
    
    // Spaced repetition intervals (in milliseconds)
    const intervals = {
      immediate: 0,           // Same session
      short: 3 * 60 * 1000,   // 3 minutes
      medium: 24 * 60 * 60 * 1000, // 1 day
      long: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    const reviewQuestions = mistakeData.wrongQuestions.filter(q => {
      if (q.subject !== subject || q.chapter !== chapter || q.isResolved) {
        return false;
      }

      const timeSinceLastAttempt = now - q.lastAttemptedAt;
      
      // Determine review interval based on mistake count
      let requiredInterval;
      if (q.mistakeCount >= 3) {
        requiredInterval = intervals.long;
      } else if (q.mistakeCount === 2) {
        requiredInterval = intervals.medium;
      } else {
        requiredInterval = intervals.short;
      }

      return timeSinceLastAttempt >= requiredInterval;
    });

    console.log(`📅 Found ${reviewQuestions.length} questions ready for spaced repetition review`);
    return reviewQuestions;
  }

  /**
   * Get learning analytics for user progress
   */
  getLearningAnalytics(subject, chapter) {
    const mistakeData = this.loadMistakeData();
    
    const chapterAttempts = mistakeData.attemptHistory.filter(a => 
      a.subject === subject && a.chapter === chapter
    );

    const totalAttempts = chapterAttempts.length;
    const correctAttempts = chapterAttempts.filter(a => a.isCorrect).length;
    const wrongAttempts = totalAttempts - correctAttempts;
    
    const conceptMistakes = this.getConceptMistakes(subject, chapter);
    const wrongQuestions = this.getWrongQuestions(subject, chapter, 100);
    
    const analytics = {
      totalAttempts,
      correctAttempts,
      wrongAttempts,
      accuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
      conceptsNeedingReview: conceptMistakes.length,
      questionsNeedingReview: wrongQuestions.length,
      improvementTrend: this.calculateImprovementTrend(chapterAttempts),
      lastPracticeAt: chapterAttempts.length > 0 ? chapterAttempts[0].timestamp : 0
    };

    return analytics;
  }

  /**
   * Calculate improvement trend over time
   */
  calculateImprovementTrend(attempts) {
    if (attempts.length < 10) return 'insufficient_data';
    
    // Compare recent 10 attempts with previous 10
    const recent = attempts.slice(0, 10);
    const previous = attempts.slice(10, 20);
    
    const recentAccuracy = recent.filter(a => a.isCorrect).length / recent.length;
    const previousAccuracy = previous.filter(a => a.isCorrect).length / previous.length;
    
    const improvement = recentAccuracy - previousAccuracy;
    
    if (improvement > 0.1) return 'improving';
    if (improvement < -0.1) return 'declining';
    return 'stable';
  }

  /**
   * Clean up old data to maintain performance
   */
  cleanupOldData() {
    const mistakeData = this.loadMistakeData();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    // Keep only last 30 days of attempt history
    mistakeData.attemptHistory = mistakeData.attemptHistory.filter(a => 
      a.timestamp > thirtyDaysAgo
    );

    // Remove resolved questions older than 30 days
    mistakeData.wrongQuestions = mistakeData.wrongQuestions.filter(q => 
      !q.isResolved || q.lastAttemptedAt > thirtyDaysAgo
    );

    this.saveMistakeData(mistakeData);
    console.log('🧹 Cleaned up old mistake data');
  }

  /**
   * Export mistake data for backup
   */
  exportMistakeData() {
    const mistakeData = this.loadMistakeData();
    const dataStr = JSON.stringify(mistakeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cuet-mistakes-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Get mistake summary for dashboard
   */
  getMistakeSummary() {
    const mistakeData = this.loadMistakeData();
    
    const totalMistakes = mistakeData.wrongQuestions.length;
    const unresolvedMistakes = mistakeData.wrongQuestions.filter(q => !q.isResolved).length;
    const conceptsNeedingReview = Object.values(mistakeData.conceptMistakes).filter(cm => cm.needsReview).length;
    
    return {
      totalMistakes,
      unresolvedMistakes,
      conceptsNeedingReview,
      totalAttempts: mistakeData.attemptHistory.length,
      lastUpdated: mistakeData.lastUpdated
    };
  }
}

// Export singleton instance
export const mistakeMemoryEngine = new MistakeMemoryEngine();