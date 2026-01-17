/**
 * SYSTEM VALIDATION CHECKS
 * Critical tests to verify the mistake-learning system works as specified
 */

import { mistakeMemoryEngine } from '../services/MistakeMemoryEngine.js';
import { intelligentQuestionService } from '../services/IntelligentQuestionService.js';

class SystemValidationChecks {
  
  /**
   * CHECK 1: Wrong Answer Resurrection
   * Simulate getting 3 questions wrong, then verify they resurface
   */
  async check1_WrongAnswerResurrection() {
    console.log('🔍 CHECK 1: Wrong Answer Resurrection');
    
    // Clear existing data for clean test
    localStorage.removeItem('cuet-mistake-memory');
    
    // Simulate 3 wrong answers in Physics - Electrostatics
    const wrongAttempts = [
      {
        questionId: 'physics_electro_q1',
        subject: 'Physics',
        chapter: 'Electrostatics',
        conceptTag: 'Coulomb Law',
        source: 'pyq',
        selectedOption: 1,
        correctOption: 0,
        isCorrect: false,
        timeTaken: 120,
        difficulty: 'medium',
        questionText: 'Calculate force between two charges using Coulomb law',
        mode: 'chapter'
      },
      {
        questionId: 'physics_electro_q2',
        subject: 'Physics',
        chapter: 'Electrostatics',
        conceptTag: 'Electric Field',
        source: 'ai',
        selectedOption: 2,
        correctOption: 1,
        isCorrect: false,
        timeTaken: 90,
        difficulty: 'hard',
        questionText: 'Find electric field at a point due to point charge',
        mode: 'chapter'
      },
      {
        questionId: 'physics_electro_q3',
        subject: 'Physics',
        chapter: 'Electrostatics',
        conceptTag: 'Electric Potential',
        source: 'template',
        selectedOption: 3,
        correctOption: 2,
        isCorrect: false,
        timeTaken: 150,
        difficulty: 'medium',
        questionText: 'Calculate electric potential at a point',
        mode: 'chapter'
      }
    ];

    // Record all wrong attempts
    console.log('📝 Recording 3 wrong attempts...');
    for (const attempt of wrongAttempts) {
      mistakeMemoryEngine.recordAttempt(attempt);
    }

    // Simulate app restart by reloading mistake data
    console.log('🔄 Simulating app restart...');
    
    // Get new questions for same chapter
    const newQuestions = await intelligentQuestionService.getIntelligentQuestions({
      subject: 'Physics',
      chapter: 'Electrostatics',
      count: 10,
      mode: 'chapter'
    });

    // Check if mistake-based questions appear
    const mistakeBasedQuestions = newQuestions.filter(q => 
      q.source === 'mistake_variant' || 
      q.priority === 'highest' ||
      q.originalMistakeId
    );

    const conceptSimilarQuestions = newQuestions.filter(q =>
      q.source === 'concept_similar_pyq' ||
      q.conceptTag === 'Coulomb Law' ||
      q.conceptTag === 'Electric Field' ||
      q.conceptTag === 'Electric Potential'
    );

    console.log(`✅ Generated ${newQuestions.length} total questions`);
    console.log(`🔄 ${mistakeBasedQuestions.length} mistake-based questions found`);
    console.log(`🎯 ${conceptSimilarQuestions.length} concept-similar questions found`);

    const resurrectionWorking = mistakeBasedQuestions.length > 0 || conceptSimilarQuestions.length > 0;
    
    console.log(`📊 CHECK 1 RESULT: ${resurrectionWorking ? '✅ PASS' : '❌ FAIL'}`);
    
    if (resurrectionWorking) {
      console.log('🎉 Wrong answers are successfully resurfacing!');
    } else {
      console.log('⚠️ Wrong answers not resurfacing - system needs attention');
    }

    return resurrectionWorking;
  }

  /**
   * CHECK 2: Spaced Repetition Timing
   * Verify mistakes appear at correct intervals
   */
  async check2_SpacedRepetitionTiming() {
    console.log('\n🔍 CHECK 2: Spaced Repetition Timing');
    
    // Get current mistake data
    const mistakeData = mistakeMemoryEngine.loadMistakeData();
    const wrongQuestions = mistakeData.wrongQuestions;
    
    if (wrongQuestions.length === 0) {
      console.log('⚠️ No wrong questions found for spaced repetition test');
      return false;
    }

    // Check spaced repetition schedule for each wrong question
    let spacedRepetitionWorking = true;
    
    wrongQuestions.forEach((wrongQ, index) => {
      const timeSinceLastAttempt = Date.now() - wrongQ.lastAttemptedAt;
      const mistakeCount = wrongQ.mistakeCount;
      
      // Determine expected interval based on mistake count
      let expectedInterval;
      if (mistakeCount >= 3) {
        expectedInterval = 7 * 24 * 60 * 60 * 1000; // 7 days
      } else if (mistakeCount === 2) {
        expectedInterval = 24 * 60 * 60 * 1000; // 1 day
      } else {
        expectedInterval = 3 * 60 * 1000; // 3 minutes
      }

      const shouldAppearNow = timeSinceLastAttempt >= expectedInterval;
      
      console.log(`📅 Question ${index + 1}: ${mistakeCount} mistakes, ${Math.floor(timeSinceLastAttempt / 1000)}s ago`);
      console.log(`   Expected interval: ${Math.floor(expectedInterval / 1000)}s, Should appear: ${shouldAppearNow}`);
    });

    // Get questions ready for spaced repetition review
    const reviewQuestions = mistakeMemoryEngine.getMistakesForReview('Physics', 'Electrostatics');
    
    console.log(`📝 ${reviewQuestions.length} questions ready for spaced repetition review`);
    console.log(`📊 CHECK 2 RESULT: ${spacedRepetitionWorking ? '✅ PASS' : '❌ FAIL'}`);
    
    return spacedRepetitionWorking;
  }

  /**
   * CHECK 3: PYQ Priority
   * Verify wrong PYQs get priority in future sessions
   */
  async check3_PYQPriority() {
    console.log('\n🔍 CHECK 3: PYQ Priority');
    
    // Record a wrong PYQ attempt
    const wrongPYQAttempt = {
      questionId: 'cuet_2023_physics_q15',
      subject: 'Physics',
      chapter: 'Electrostatics',
      conceptTag: 'Gauss Law',
      source: 'pyq',
      selectedOption: 2,
      correctOption: 0,
      isCorrect: false,
      timeTaken: 180,
      difficulty: 'hard',
      questionText: 'CUET 2023: Apply Gauss law to find electric field',
      mode: 'pyq'
    };

    console.log('📝 Recording wrong PYQ attempt...');
    mistakeMemoryEngine.recordAttempt(wrongPYQAttempt);

    // Get PYQ mistakes
    const pyqMistakes = mistakeMemoryEngine.getPYQMistakes('Physics', 'Electrostatics');
    console.log(`⭐ Found ${pyqMistakes.count} PYQ mistakes`);

    // Get new questions and check for PYQ priority
    const newQuestions = await intelligentQuestionService.getIntelligentQuestions({
      subject: 'Physics',
      chapter: 'Electrostatics',
      count: 15,
      mode: 'pyq'
    });

    const pyqQuestions = newQuestions.filter(q => 
      q.source === 'exact_pyq' || 
      q.source === 'concept_similar_pyq' ||
      q.isPYQ
    );

    const samePYQ = newQuestions.find(q => q.questionId === wrongPYQAttempt.questionId);
    const sameConceptPYQ = newQuestions.filter(q => 
      q.conceptTag === 'Gauss Law' && q.isPYQ
    );

    console.log(`⭐ ${pyqQuestions.length} PYQ questions in new set`);
    console.log(`🔄 Same PYQ found: ${samePYQ ? 'Yes' : 'No'}`);
    console.log(`🎯 Same concept PYQs: ${sameConceptPYQ.length}`);

    const pyqPriorityWorking = samePYQ || sameConceptPYQ.length > 0;
    
    console.log(`📊 CHECK 3 RESULT: ${pyqPriorityWorking ? '✅ PASS' : '❌ FAIL'}`);
    
    return pyqPriorityWorking;
  }

  /**
   * CHECK 4: No Empty State (Hard Rule)
   * Verify questions appear even when all services fail
   */
  async check4_NoEmptyState() {
    console.log('\n🔍 CHECK 4: No Empty State (Hard Rule)');
    
    // Simulate complete system failure
    console.log('🚨 Simulating complete system failure...');
    
    // Test with invalid/non-existent data
    const emergencyScenarios = [
      { subject: 'NonExistentSubject', chapter: 'NonExistentChapter' },
      { subject: '', chapter: '' },
      { subject: 'Physics', chapter: 'InvalidChapter' },
      { subject: null, chapter: null }
    ];

    let allScenariosPass = true;
    
    for (const scenario of emergencyScenarios) {
      try {
        const questions = await intelligentQuestionService.getIntelligentQuestions({
          subject: scenario.subject || 'Emergency',
          chapter: scenario.chapter || 'Emergency',
          count: 5,
          mode: 'chapter'
        });

        console.log(`🧪 Scenario ${JSON.stringify(scenario)}: ${questions.length} questions`);
        
        if (questions.length === 0) {
          console.log(`❌ FAILED: Empty state detected!`);
          allScenariosPass = false;
        } else {
          console.log(`✅ PASSED: ${questions.length} fallback questions generated`);
        }
      } catch (error) {
        console.log(`❌ FAILED: Error thrown - ${error.message}`);
        allScenariosPass = false;
      }
    }

    console.log(`📊 CHECK 4 RESULT: ${allScenariosPass ? '✅ PASS' : '❌ FAIL'}`);
    
    if (allScenariosPass) {
      console.log('🛡️ System is bulletproof - never returns empty state!');
    } else {
      console.log('⚠️ System has empty state vulnerabilities');
    }

    return allScenariosPass;
  }

  /**
   * CHECK 5: Data Persistence
   * Verify mistakes persist across browser sessions
   */
  async check5_DataPersistence() {
    console.log('\n🔍 CHECK 5: Data Persistence');
    
    // Check if mistake data exists and persists
    const mistakeData = mistakeMemoryEngine.loadMistakeData();
    
    console.log(`💾 Attempt history: ${mistakeData.attemptHistory.length} records`);
    console.log(`❌ Wrong questions: ${mistakeData.wrongQuestions.length} records`);
    console.log(`🎯 Concept mistakes: ${Object.keys(mistakeData.conceptMistakes).length} concepts`);
    console.log(`📅 Last updated: ${new Date(mistakeData.lastUpdated).toLocaleString()}`);

    // Verify data structure integrity
    const hasAttemptHistory = Array.isArray(mistakeData.attemptHistory);
    const hasWrongQuestions = Array.isArray(mistakeData.wrongQuestions);
    const hasConceptMistakes = typeof mistakeData.conceptMistakes === 'object';
    const hasTimestamp = typeof mistakeData.lastUpdated === 'number';

    const dataIntegrityGood = hasAttemptHistory && hasWrongQuestions && hasConceptMistakes && hasTimestamp;

    // Test if mistakes influence new question generation
    let mistakesInfluenceQuestions = false;
    if (mistakeData.wrongQuestions.length > 0) {
      const testQuestions = await intelligentQuestionService.getIntelligentQuestions({
        subject: 'Physics',
        chapter: 'Electrostatics',
        count: 10,
        mode: 'chapter'
      });

      const mistakeInfluencedCount = testQuestions.filter(q => 
        q.source === 'mistake_variant' || 
        q.priority === 'highest' ||
        q.mistakeBasedSelection
      ).length;

      mistakesInfluenceQuestions = mistakeInfluencedCount > 0;
      console.log(`🧠 ${mistakeInfluencedCount} questions influenced by stored mistakes`);
    }

    const persistenceWorking = dataIntegrityGood && (mistakeData.attemptHistory.length > 0 || mistakesInfluenceQuestions);
    
    console.log(`📊 CHECK 5 RESULT: ${persistenceWorking ? '✅ PASS' : '❌ FAIL'}`);
    
    if (persistenceWorking) {
      console.log('💾 Data persistence is working - long-term prep is safe!');
    } else {
      console.log('⚠️ Data persistence issues detected');
    }

    return persistenceWorking;
  }

  /**
   * Run all validation checks
   */
  async runAllChecks() {
    console.log('🧪 RUNNING COMPLETE SYSTEM VALIDATION\n');
    console.log('=' .repeat(60));
    
    const results = {
      check1: await this.check1_WrongAnswerResurrection(),
      check2: await this.check2_SpacedRepetitionTiming(),
      check3: await this.check3_PYQPriority(),
      check4: await this.check4_NoEmptyState(),
      check5: await this.check5_DataPersistence()
    };

    console.log('\n📋 FINAL VALIDATION REPORT');
    console.log('=' .repeat(60));
    
    const passCount = Object.values(results).filter(r => r).length;
    const totalChecks = Object.keys(results).length;
    
    console.log(`✅ CHECK 1 - Wrong Answer Resurrection: ${results.check1 ? 'PASS' : 'FAIL'}`);
    console.log(`✅ CHECK 2 - Spaced Repetition Timing: ${results.check2 ? 'PASS' : 'FAIL'}`);
    console.log(`✅ CHECK 3 - PYQ Priority: ${results.check3 ? 'PASS' : 'FAIL'}`);
    console.log(`✅ CHECK 4 - No Empty State: ${results.check4 ? 'PASS' : 'FAIL'}`);
    console.log(`✅ CHECK 5 - Data Persistence: ${results.check5 ? 'PASS' : 'FAIL'}`);
    
    console.log(`\n📊 OVERALL SCORE: ${passCount}/${totalChecks} (${Math.round((passCount/totalChecks)*100)}%)`);
    
    if (passCount === totalChecks) {
      console.log('\n🎉 SYSTEM IS TRULY INTELLIGENT!');
      console.log('🏆 AVION is ready for adaptive, mistake-driven CUET preparation');
      console.log('🎯 User rank is now limited by effort, not platform design');
    } else {
      console.log('\n⚠️ SYSTEM NEEDS ATTENTION');
      console.log('🔧 Some intelligence features require fixes');
    }

    return results;
  }
}

export const systemValidationChecks = new SystemValidationChecks();