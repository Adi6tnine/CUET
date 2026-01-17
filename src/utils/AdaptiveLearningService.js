// Adaptive Learning Service for AVION
// Tracks incorrect answers and prioritizes weak topics

class AdaptiveLearningService {
  constructor() {
    this.incorrectAnswers = this.loadIncorrectAnswers();
    this.weakTopics = this.loadWeakTopics();
    this.questionHistory = this.loadQuestionHistory();
  }

  // Load incorrect answers from localStorage
  loadIncorrectAnswers() {
    try {
      const data = localStorage.getItem('cuet-incorrect-answers');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load incorrect answers:', error);
      return {};
    }
  }

  // Load weak topics from localStorage
  loadWeakTopics() {
    try {
      const data = localStorage.getItem('cuet-weak-topics');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load weak topics:', error);
      return {};
    }
  }

  // Load question history from localStorage
  loadQuestionHistory() {
    try {
      const data = localStorage.getItem('cuet-question-history');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load question history:', error);
      return {};
    }
  }

  // Save data to localStorage
  saveData() {
    try {
      localStorage.setItem('cuet-incorrect-answers', JSON.stringify(this.incorrectAnswers));
      localStorage.setItem('cuet-weak-topics', JSON.stringify(this.weakTopics));
      localStorage.setItem('cuet-question-history', JSON.stringify(this.questionHistory));
    } catch (error) {
      console.error('Failed to save adaptive learning data:', error);
    }
  }

  // Record a quiz result for adaptive learning
  recordQuizResult(subject, chapter, questions, answers) {
    const subjectKey = `${subject}-${chapter}`;
    
    if (!this.incorrectAnswers[subjectKey]) {
      this.incorrectAnswers[subjectKey] = [];
    }
    
    if (!this.weakTopics[subjectKey]) {
      this.weakTopics[subjectKey] = {
        totalAttempts: 0,
        correctAnswers: 0,
        accuracy: 0,
        lastAttempt: Date.now()
      };
    }

    if (!this.questionHistory[subjectKey]) {
      this.questionHistory[subjectKey] = [];
    }

    let correctCount = 0;
    let totalCount = 0;

    // Process each question
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correct;
      
      totalCount++;
      if (isCorrect) {
        correctCount++;
      } else {
        // Store incorrect question for future prioritization
        const incorrectQuestion = {
          ...question,
          userAnswer: userAnswer,
          correctAnswer: question.correct,
          timestamp: Date.now(),
          attempts: 1
        };

        // Check if this question was already answered incorrectly
        const existingIndex = this.incorrectAnswers[subjectKey].findIndex(
          q => q.question === question.question
        );

        if (existingIndex >= 0) {
          // Increment attempts for repeated mistakes
          this.incorrectAnswers[subjectKey][existingIndex].attempts++;
          this.incorrectAnswers[subjectKey][existingIndex].timestamp = Date.now();
        } else {
          // Add new incorrect question
          this.incorrectAnswers[subjectKey].push(incorrectQuestion);
        }
      }

      // Record question in history
      this.questionHistory[subjectKey].push({
        question: question.question,
        isCorrect,
        timestamp: Date.now(),
        difficulty: question.difficulty || 'Medium'
      });
    });

    // Update weak topics statistics
    this.weakTopics[subjectKey].totalAttempts += totalCount;
    this.weakTopics[subjectKey].correctAnswers += correctCount;
    this.weakTopics[subjectKey].accuracy = Math.round(
      (this.weakTopics[subjectKey].correctAnswers / this.weakTopics[subjectKey].totalAttempts) * 100
    );
    this.weakTopics[subjectKey].lastAttempt = Date.now();

    // Keep only recent history (last 100 questions per topic)
    if (this.questionHistory[subjectKey].length > 100) {
      this.questionHistory[subjectKey] = this.questionHistory[subjectKey].slice(-100);
    }

    // Keep only recent incorrect answers (last 50 per topic)
    if (this.incorrectAnswers[subjectKey].length > 50) {
      this.incorrectAnswers[subjectKey] = this.incorrectAnswers[subjectKey]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 50);
    }

    this.saveData();
    
    console.log(`📊 Adaptive Learning Updated:`, {
      subject: subjectKey,
      accuracy: this.weakTopics[subjectKey].accuracy,
      incorrectCount: this.incorrectAnswers[subjectKey].length
    });
  }

  // Get incorrect questions for review
  getIncorrectQuestions(subject, chapter, count = 10) {
    const subjectKey = `${subject}-${chapter}`;
    const incorrect = this.incorrectAnswers[subjectKey] || [];
    
    // Sort by attempts (most failed first) and recency
    return incorrect
      .sort((a, b) => {
        if (a.attempts !== b.attempts) {
          return b.attempts - a.attempts; // More attempts first
        }
        return b.timestamp - a.timestamp; // More recent first
      })
      .slice(0, count);
  }

  // Get weak topics for prioritization
  getWeakTopics(limit = 5) {
    return Object.entries(this.weakTopics)
      .filter(([_, data]) => data.accuracy < 70) // Less than 70% accuracy
      .sort((a, b) => a[1].accuracy - b[1].accuracy) // Lowest accuracy first
      .slice(0, limit)
      .map(([topic, data]) => ({
        topic,
        accuracy: data.accuracy,
        totalAttempts: data.totalAttempts,
        lastAttempt: data.lastAttempt
      }));
  }

  // Check if a topic needs more practice
  needsPractice(subject, chapter) {
    const subjectKey = `${subject}-${chapter}`;
    const topicData = this.weakTopics[subjectKey];
    
    if (!topicData) return false;
    
    return topicData.accuracy < 80 || topicData.totalAttempts < 10;
  }

  // Get personalized difficulty for next questions
  getRecommendedDifficulty(subject, chapter) {
    const subjectKey = `${subject}-${chapter}`;
    const topicData = this.weakTopics[subjectKey];
    
    if (!topicData || topicData.totalAttempts < 5) {
      return 'Easy'; // Start with easy questions
    }
    
    if (topicData.accuracy >= 85) {
      return 'Hard'; // Challenge with hard questions
    } else if (topicData.accuracy >= 70) {
      return 'Medium'; // Balanced difficulty
    } else {
      return 'Easy'; // Focus on fundamentals
    }
  }

  // Generate hints based on previous mistakes
  generateHintForQuestion(question, subject, chapter) {
    const subjectKey = `${subject}-${chapter}`;
    const incorrect = this.incorrectAnswers[subjectKey] || [];
    
    // Check if this question was answered incorrectly before
    const previousMistake = incorrect.find(q => 
      q.question.toLowerCase().includes(question.question.toLowerCase().substring(0, 50))
    );

    if (previousMistake) {
      return `💡 You've struggled with this before. Focus on: ${this.getTopicHint(question.type || 'general')}`;
    }

    // Generate general hints based on question type
    return this.getTopicHint(question.type || 'general');
  }

  // Get topic-specific hints
  getTopicHint(questionType) {
    const hints = {
      'assertion-reasoning': 'Analyze each statement independently, then check their relationship.',
      'match-column': 'Look for logical connections and eliminate obvious mismatches first.',
      'physics': 'Remember the fundamental formulas and units. Draw diagrams if needed.',
      'chemistry': 'Consider electron configuration, bonding, and reaction mechanisms.',
      'mathematics': 'Break down complex problems into smaller steps. Check your calculations.',
      'english': 'Read carefully for context clues and grammatical patterns.',
      'general': 'Eliminate obviously wrong options first, then analyze remaining choices.'
    };

    return hints[questionType] || hints['general'];
  }

  // Get performance summary
  getPerformanceSummary() {
    const totalTopics = Object.keys(this.weakTopics).length;
    const weakTopics = this.getWeakTopics(10);
    const totalIncorrect = Object.values(this.incorrectAnswers)
      .reduce((sum, arr) => sum + arr.length, 0);

    const overallAccuracy = totalTopics > 0 
      ? Math.round(
          Object.values(this.weakTopics)
            .reduce((sum, data) => sum + data.accuracy, 0) / totalTopics
        )
      : 0;

    return {
      totalTopics,
      weakTopicsCount: weakTopics.length,
      totalIncorrectQuestions: totalIncorrect,
      overallAccuracy,
      needsReview: totalIncorrect > 0,
      recommendations: this.getRecommendations()
    };
  }

  // Get personalized recommendations
  getRecommendations() {
    const weakTopics = this.getWeakTopics(3);
    const recommendations = [];

    if (weakTopics.length > 0) {
      recommendations.push({
        type: 'weak_topics',
        message: `Focus on ${weakTopics[0].topic} (${weakTopics[0].accuracy}% accuracy)`,
        action: 'practice_weak_topics'
      });
    }

    const totalIncorrect = Object.values(this.incorrectAnswers)
      .reduce((sum, arr) => sum + arr.length, 0);

    if (totalIncorrect > 10) {
      recommendations.push({
        type: 'review',
        message: `Review ${totalIncorrect} incorrect questions`,
        action: 'review_mistakes'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'continue',
        message: 'Great progress! Continue practicing new topics.',
        action: 'explore_new_topics'
      });
    }

    return recommendations;
  }

  // Clear old data (for privacy/performance)
  clearOldData(daysOld = 30) {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    
    // Clear old incorrect answers
    Object.keys(this.incorrectAnswers).forEach(key => {
      this.incorrectAnswers[key] = this.incorrectAnswers[key]
        .filter(q => q.timestamp > cutoffTime);
    });

    // Clear old question history
    Object.keys(this.questionHistory).forEach(key => {
      this.questionHistory[key] = this.questionHistory[key]
        .filter(q => q.timestamp > cutoffTime);
    });

    this.saveData();
    console.log(`🧹 Cleared data older than ${daysOld} days`);
  }
}

// Export singleton instance
export const adaptiveLearningService = new AdaptiveLearningService();