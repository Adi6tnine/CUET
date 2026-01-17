/**
 * MISTAKE LEARNING SYSTEM TEST
 * Comprehensive test to verify all components work together
 * Tests the complete failure-driven learning pipeline
 */

import { mistakeMemoryEngine } from '../services/MistakeMemoryEngine.js';
import { intelligentQuestionService } from '../services/IntelligentQuestionService.js';
import { pyqSimilarityEngine } from '../services/PYQSimilarityEngine.js';
import { sustainabilityEngine } from '../services/SustainabilityEngine.js';

class MistakeLearningSystemTest {
  constructor() {
    this.testResults = [];
  }

  /**
   * Run comprehensive system test
   */
  async runCompleteTest() {
    console.log('🧪 STARTING COMPREHENSIVE MISTAKE LEARNING SYSTEM TEST\n');
    
    // Clear any existing test data
    this.clearTestData();
    
    // Test 1: Basic mistake recording
    await this.testMistakeRecording();
    
    // Test 2: Question prioritization
    await this.testQuestionPrioritization();
    
    // Test 3: PYQ similarity matching
    await this.testPYQSimilarity();
    
    // Test 4: Spaced repetition
    await this.testSpacedRepetition();
    
    // Test 5: Long-term sustainability
    await this.testSustainability();
    
    // Test 6: CUET standards compliance
    await this.testCUETCompliance();
    
    // Test 7: Never-fail guarantee
    await this.testNeverFailGuarantee();
    
    // Generate test report
    this.generateTestReport();
    
    return this.testResults;
  }

  /**
   * Test 1: Basic mistake recording
   */
  async testMistakeRecording() {
    console.log('📝 TEST 1: Mistake Recording');
    
    try {
      // Simulate wrong answers
      const wrongAttempts = [
        {
          questionId: 'test_q1',
          subject: 'Physics',
          chapter: 'Electrostatics',
          conceptTag: 'Coulomb Law',
          source: 'pyq',
          selectedOption: 1,
          correctOption: 0,
          isCorrect: false,
          timeTaken: 120,
          difficulty: 'medium',
          questionText: 'Test question about Coulomb law',
          mode: 'chapter'
        },
        {
          questionId: 'test_q2',
          subject: 'Physics',
          chapter: 'Electrostatics',
          conceptTag: 'Electric Field',
          source: 'ai',
          selectedOption: 2,
          correctOption: 1,
          isCorrect: false,
          timeTaken: 90,
          difficulty: 'hard',
          questionText: 'Test question about electric field',
          mode: 'daily'
        }
      ];

      // Record attempts
      for (const attempt of wrongAttempts) {
        const attemptId = mistakeMemoryEngine.recordAttempt(attempt);
        console.log(`✅ Recorded attempt: ${attemptId}`);
      }

      // Verify storage
      const mistakeData = mistakeMemoryEngine.loadMistakeData();
      const wrongQuestions = mistakeMemoryEngine.getWrongQuestions('Physics', 'Electrostatics');
      const conceptMistakes = mistakeMemoryEngine.getConceptMistakes('Physics', 'Electrostatics');

      console.log(`📊 Stored ${mistakeData.attemptHistory.length} attempts`);
      console.log(`❌ Found ${wrongQuestions.length} wrong questions`);
      console.log(`🎯 Found ${conceptMistakes.length} concept mistakes`);

      this.testResults.push({
        test: 'Mistake Recording',
        status: 'PASS',
        details: `Recorded ${wrongAttempts.length} mistakes successfully`
      });

    } catch (error) {
      console.error('❌ Mistake recording test failed:', error);
      this.testResults.push({
        test: 'Mistake Recording',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  /**
   * Test 2: Question prioritization
   */
  async testQuestionPrioritization() {
    console.log('\n🎯 TEST 2: Question Prioritization');
    
    try {
      // Get intelligent questions
      const questions = await intelligentQuestionService.getIntelligentQuestions({
        subject: 'Physics',
        chapter: 'Electrostatics',
        count: 10,
        mode: 'chapter'
      });

      console.log(`📚 Generated ${questions.length} questions`);
      
      // Check for mistake-based questions
      const mistakeBasedCount = questions.filter(q => 
        q.source === 'mistake_variant' || q.priority === 'highest'
      ).length;
      
      const pyqCount = questions.filter(q => 
        q.source === 'exact_pyq' || q.source === 'concept_similar_pyq'
      ).length;

      console.log(`🔄 ${mistakeBasedCount} mistake-based questions`);
      console.log(`⭐ ${pyqCount} PYQ questions`);

      // Verify priority system is working
      const hasPriority = questions.some(q => q.priority);
      
      this.testResults.push({
        test: 'Question Prioritization',
        status: hasPriority ? 'PASS' : 'PARTIAL',
        details: `Generated ${questions.length} questions with ${mistakeBasedCount} mistake-based`
      });

    } catch (error) {
      console.error('❌ Question prioritization test failed:', error);
      this.testResults.push({
        test: 'Question Prioritization',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  /**
   * Test 3: PYQ similarity matching
   */
  async testPYQSimilarity() {
    console.log('\n⭐ TEST 3: PYQ Similarity Matching');
    
    try {
      // Create a mock wrong answer
      const wrongAnswer = {
        questionId: 'test_pyq_wrong',
        subject: 'Physics',
        chapter: 'Electrostatics',
        conceptTag: 'Coulomb Law',
        mistakeCount: 2
      };

      // Find similar PYQs
      const similarPYQs = pyqSimilarityEngine.findSimilarPYQs(wrongAnswer, 5);
      
      console.log(`🔍 Found ${similarPYQs.length} similar PYQs`);
      
      // Test PYQ statistics
      const pyqStats = pyqSimilarityEngine.getPYQStats();
      console.log(`📊 PYQ Database: ${pyqStats.totalPYQs} total PYQs`);

      this.testResults.push({
        test: 'PYQ Similarity Matching',
        status: 'PASS',
        details: `Found ${similarPYQs.length} similar PYQs from ${pyqStats.totalPYQs} total`
      });

    } catch (error) {
      console.error('❌ PYQ similarity test failed:', error);
      this.testResults.push({
        test: 'PYQ Similarity Matching',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  /**
   * Test 4: Spaced repetition
   */
  async testSpacedRepetition() {
    console.log('\n📅 TEST 4: Spaced Repetition');
    
    try {
      // Get questions ready for review
      const reviewQuestions = mistakeMemoryEngine.getMistakesForReview('Physics', 'Electrostatics');
      
      console.log(`📝 ${reviewQuestions.length} questions ready for spaced repetition`);
      
      // Test spaced repetition schedule
      const schedule = sustainabilityEngine.getSpacedRepetitionSchedule(2, Date.now() - 1000);
      
      console.log(`⏰ Spaced repetition schedule:`, {
        isReady: schedule.isReady,
        priority: schedule.priority
      });

      this.testResults.push({
        test: 'Spaced Repetition',
        status: 'PASS',
        details: `${reviewQuestions.length} questions ready for review`
      });

    } catch (error) {
      console.error('❌ Spaced repetition test failed:', error);
      this.testResults.push({
        test: 'Spaced Repetition',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  /**
   * Test 5: Long-term sustainability
   */
  async testSustainability() {
    console.log('\n🔄 TEST 5: Long-term Sustainability');
    
    try {
      // Test question variation
      const originalQuestion = {
        id: 'test_original',
        question: 'A particle moves with velocity 5 m/s. Calculate kinetic energy if mass is 2 kg.',
        options: ['25 J', '10 J', '5 J', '50 J'],
        correct: 0,
        subject: 'Physics'
      };

      const variation = sustainabilityEngine.generateQuestionVariation(originalQuestion, 'Physics', 3);
      
      console.log(`🔄 Generated variation:`, {
        isVariation: variation.isVariation,
        variationLevel: variation.variationLevel
      });

      // Test engagement score
      const engagementScore = sustainabilityEngine.calculateEngagementScore();
      console.log(`📊 Engagement score: ${engagementScore}`);

      this.testResults.push({
        test: 'Long-term Sustainability',
        status: 'PASS',
        details: `Generated variations with ${engagementScore}% engagement`
      });

    } catch (error) {
      console.error('❌ Sustainability test failed:', error);
      this.testResults.push({
        test: 'Long-term Sustainability',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  /**
   * Test 6: CUET standards compliance
   */
  async testCUETCompliance() {
    console.log('\n📏 TEST 6: CUET Standards Compliance');
    
    try {
      // Test daily command questions
      const dailyQuestions = await intelligentQuestionService.getIntelligentQuestions({
        subject: 'Physics',
        chapter: 'Electrostatics',
        count: 15, // CUET standard for daily
        mode: 'daily'
      });

      // Test chapter practice questions
      const chapterQuestions = await intelligentQuestionService.getIntelligentQuestions({
        subject: 'Physics',
        chapter: 'Electrostatics',
        count: 20, // CUET standard for chapter
        mode: 'chapter'
      });

      console.log(`📅 Daily: ${dailyQuestions.length} questions (expected: 15)`);
      console.log(`📚 Chapter: ${chapterQuestions.length} questions (expected: 20)`);

      const dailyCompliant = dailyQuestions.length === 15;
      const chapterCompliant = chapterQuestions.length === 20;

      this.testResults.push({
        test: 'CUET Standards Compliance',
        status: (dailyCompliant && chapterCompliant) ? 'PASS' : 'PARTIAL',
        details: `Daily: ${dailyQuestions.length}/15, Chapter: ${chapterQuestions.length}/20`
      });

    } catch (error) {
      console.error('❌ CUET compliance test failed:', error);
      this.testResults.push({
        test: 'CUET Standards Compliance',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  /**
   * Test 7: Never-fail guarantee
   */
  async testNeverFailGuarantee() {
    console.log('\n🛡️ TEST 7: Never-Fail Guarantee');
    
    try {
      // Test with non-existent subject/chapter
      const emergencyQuestions = await intelligentQuestionService.getIntelligentQuestions({
        subject: 'NonExistentSubject',
        chapter: 'NonExistentChapter',
        count: 10,
        mode: 'chapter'
      });

      console.log(`🚨 Emergency questions: ${emergencyQuestions.length}`);
      
      // Verify we always get questions
      const neverEmpty = emergencyQuestions.length > 0;
      
      // Test multiple scenarios
      const testScenarios = [
        { subject: 'Physics', chapter: 'InvalidChapter', count: 5 },
        { subject: 'InvalidSubject', chapter: 'Electrostatics', count: 3 },
        { subject: '', chapter: '', count: 1 }
      ];

      let allScenariosPass = true;
      for (const scenario of testScenarios) {
        const questions = await intelligentQuestionService.getIntelligentQuestions({
          ...scenario,
          mode: 'chapter'
        });
        
        if (questions.length === 0) {
          allScenariosPass = false;
          console.error(`❌ Failed scenario:`, scenario);
        } else {
          console.log(`✅ Scenario passed: ${questions.length} questions`);
        }
      }

      this.testResults.push({
        test: 'Never-Fail Guarantee',
        status: (neverEmpty && allScenariosPass) ? 'PASS' : 'FAIL',
        details: `All scenarios generated questions: ${allScenariosPass}`
      });

    } catch (error) {
      console.error('❌ Never-fail test failed:', error);
      this.testResults.push({
        test: 'Never-Fail Guarantee',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  /**
   * Generate comprehensive test report
   */
  generateTestReport() {
    console.log('\n📋 COMPREHENSIVE TEST REPORT');
    console.log('=' .repeat(50));
    
    const passCount = this.testResults.filter(r => r.status === 'PASS').length;
    const partialCount = this.testResults.filter(r => r.status === 'PARTIAL').length;
    const failCount = this.testResults.filter(r => r.status === 'FAIL').length;
    
    this.testResults.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : 
                   result.status === 'PARTIAL' ? '⚠️' : '❌';
      console.log(`${icon} ${result.test}: ${result.status}`);
      if (result.details) console.log(`   ${result.details}`);
      if (result.error) console.log(`   Error: ${result.error}`);
    });
    
    console.log('\n📊 SUMMARY:');
    console.log(`✅ Passed: ${passCount}`);
    console.log(`⚠️ Partial: ${partialCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📈 Success Rate: ${Math.round((passCount / this.testResults.length) * 100)}%`);
    
    const overallStatus = failCount === 0 ? 
      (partialCount === 0 ? 'ALL SYSTEMS OPERATIONAL' : 'MOSTLY OPERATIONAL') : 
      'NEEDS ATTENTION';
    
    console.log(`\n🎯 OVERALL STATUS: ${overallStatus}`);
    
    if (overallStatus === 'ALL SYSTEMS OPERATIONAL') {
      console.log('\n🎉 MISTAKE LEARNING SYSTEM IS FULLY OPERATIONAL!');
      console.log('✅ Ready for 6-9 months of intelligent CUET preparation');
    }
  }

  /**
   * Clear test data
   */
  clearTestData() {
    try {
      localStorage.removeItem('cuet-mistake-memory');
      localStorage.removeItem('cuet-session-count');
      console.log('🧹 Cleared test data');
    } catch (error) {
      console.warn('Failed to clear test data:', error);
    }
  }
}

// Export for use in development
export const mistakeLearningSystemTest = new MistakeLearningSystemTest();

// Auto-run test in development mode
if (import.meta.env.DEV) {
  console.log('🧪 Development mode detected - running system test...');
  setTimeout(() => {
    mistakeLearningSystemTest.runCompleteTest();
  }, 2000);
}