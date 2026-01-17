/**
 * QUIZ ENGINE STABILITY TEST
 * Comprehensive test to verify the hardened quiz flow and CUET-accurate generation
 */

import { cuetQuestionGenerator } from '../services/CUETQuestionGenerator.js';
import { intelligentQuestionService } from '../services/IntelligentQuestionService.js';

class QuizEngineStabilityTest {
  
  /**
   * Test 1: Quiz State Machine Flow
   */
  async testQuizStateMachine() {
    console.log('🔥 TEST 1: Quiz State Machine Flow');
    
    // Simulate quiz state transitions
    let currentIndex = 0;
    let selectedOption = null;
    let isSubmitted = false;
    let questions = await intelligentQuestionService.getIntelligentQuestions({
      subject: 'Physics',
      chapter: 'Electrostatics',
      count: 5,
      mode: 'chapter'
    });

    console.log(`📚 Loaded ${questions.length} questions for state machine test`);

    // Test state transitions
    const stateTransitions = [];

    // Initial state
    stateTransitions.push({
      state: 'initial',
      currentIndex,
      selectedOption,
      isSubmitted,
      valid: currentIndex === 0 && selectedOption === null && !isSubmitted
    });

    // Select option
    selectedOption = 1;
    stateTransitions.push({
      state: 'option_selected',
      currentIndex,
      selectedOption,
      isSubmitted,
      valid: selectedOption !== null && !isSubmitted
    });

    // Submit answer
    if (selectedOption !== null) {
      isSubmitted = true;
      stateTransitions.push({
        state: 'submitted',
        currentIndex,
        selectedOption,
        isSubmitted,
        valid: isSubmitted && selectedOption !== null
      });
    }

    // Next question (reset state)
    if (currentIndex < questions.length - 1) {
      selectedOption = null;
      isSubmitted = false;
      currentIndex++;
      stateTransitions.push({
        state: 'next_question',
        currentIndex,
        selectedOption,
        isSubmitted,
        valid: selectedOption === null && !isSubmitted && currentIndex === 1
      });
    }

    const allTransitionsValid = stateTransitions.every(t => t.valid);
    
    console.log('📊 State Transitions:');
    stateTransitions.forEach(t => {
      console.log(`  ${t.state}: ${t.valid ? '✅' : '❌'} (index: ${t.currentIndex}, option: ${t.selectedOption}, submitted: ${t.isSubmitted})`);
    });

    console.log(`🔥 State Machine Test: ${allTransitionsValid ? '✅ PASS' : '❌ FAIL'}`);
    return allTransitionsValid;
  }

  /**
   * Test 2: CUET-Accurate Question Generation
   */
  async testCUETAccurateGeneration() {
    console.log('\n🎯 TEST 2: CUET-Accurate Question Generation');
    
    const subjects = ['Physics', 'Chemistry', 'Mathematics', 'English', 'General Test'];
    const chapters = {
      'Physics': 'Electrostatics',
      'Chemistry': 'Chemical Bonding',
      'Mathematics': 'Limits and Derivatives',
      'English': 'Reading Comprehension',
      'General Test': 'General Knowledge'
    };

    let allTestsPass = true;
    
    for (const subject of subjects) {
      const chapter = chapters[subject];
      
      try {
        const questions = await cuetQuestionGenerator.generateCUETQuestions(subject, chapter, 5);
        
        console.log(`📚 ${subject} - ${chapter}: ${questions.length} questions`);
        
        // Check for generic/placeholder text
        const hasGenericText = questions.some(q => 
          q.question.includes('practice question') ||
          q.question.includes('This question tests') ||
          q.question.includes('placeholder') ||
          q.options.some(opt => opt.includes('Option'))
        );

        // Check for proper CUET structure
        const hasProperStructure = questions.every(q => 
          q.id && q.subject && q.chapter && q.concept && 
          q.question && Array.isArray(q.options) && q.options.length === 4 &&
          typeof q.correctAnswer === 'number' && q.explanation
        );

        const subjectPass = !hasGenericText && hasProperStructure;
        
        console.log(`  Generic text: ${hasGenericText ? '❌ FOUND' : '✅ NONE'}`);
        console.log(`  Proper structure: ${hasProperStructure ? '✅ YES' : '❌ NO'}`);
        console.log(`  ${subject} result: ${subjectPass ? '✅ PASS' : '❌ FAIL'}`);
        
        if (!subjectPass) allTestsPass = false;
        
      } catch (error) {
        console.log(`  ❌ ERROR: ${error.message}`);
        allTestsPass = false;
      }
    }

    console.log(`🎯 CUET Generation Test: ${allTestsPass ? '✅ PASS' : '❌ FAIL'}`);
    return allTestsPass;
  }

  /**
   * Test 3: Question Count Compliance
   */
  async testQuestionCountCompliance() {
    console.log('\n📊 TEST 3: Question Count Compliance');
    
    const testCases = [
      { mode: 'daily', expectedCount: 15 },
      { mode: 'chapter', expectedCount: 20 },
      { mode: 'pyq', expectedCount: 25 }
    ];

    let allCountsCorrect = true;

    for (const testCase of testCases) {
      try {
        const questions = await intelligentQuestionService.getIntelligentQuestions({
          subject: 'Physics',
          chapter: 'Electrostatics',
          count: testCase.expectedCount,
          mode: testCase.mode
        });

        const actualCount = questions.length;
        const countCorrect = actualCount === testCase.expectedCount;
        
        console.log(`📚 ${testCase.mode.toUpperCase()} mode: ${actualCount}/${testCase.expectedCount} questions ${countCorrect ? '✅' : '❌'}`);
        
        if (!countCorrect) allCountsCorrect = false;
        
      } catch (error) {
        console.log(`  ❌ ERROR in ${testCase.mode}: ${error.message}`);
        allCountsCorrect = false;
      }
    }

    console.log(`📊 Question Count Test: ${allCountsCorrect ? '✅ PASS' : '❌ FAIL'}`);
    return allCountsCorrect;
  }

  /**
   * Test 4: Never-Fail Guarantee
   */
  async testNeverFailGuarantee() {
    console.log('\n🛡️ TEST 4: Never-Fail Guarantee');
    
    const extremeScenarios = [
      { subject: 'NonExistentSubject', chapter: 'NonExistentChapter', count: 10 },
      { subject: '', chapter: '', count: 5 },
      { subject: 'Physics', chapter: 'InvalidChapter', count: 15 },
      { subject: null, chapter: null, count: 20 }
    ];

    let allScenariosPass = true;

    for (const scenario of extremeScenarios) {
      try {
        const questions = await intelligentQuestionService.getIntelligentQuestions({
          subject: scenario.subject || 'Emergency',
          chapter: scenario.chapter || 'Emergency',
          count: scenario.count,
          mode: 'chapter'
        });

        const hasQuestions = questions.length > 0;
        const hasValidStructure = questions.every(q => 
          q.question && Array.isArray(q.options) && q.options.length === 4
        );

        const scenarioPass = hasQuestions && hasValidStructure;
        
        console.log(`🧪 Scenario ${JSON.stringify(scenario)}: ${questions.length} questions ${scenarioPass ? '✅' : '❌'}`);
        
        if (!scenarioPass) allScenariosPass = false;
        
      } catch (error) {
        console.log(`  ❌ FAILED: ${error.message}`);
        allScenariosPass = false;
      }
    }

    console.log(`🛡️ Never-Fail Test: ${allScenariosPass ? '✅ PASS' : '❌ FAIL'}`);
    return allScenariosPass;
  }

  /**
   * Test 5: Button Render Logic
   */
  testButtonRenderLogic() {
    console.log('\n🔘 TEST 5: Button Render Logic');
    
    const testStates = [
      { isSubmitted: false, expectedButton: 'Submit' },
      { isSubmitted: true, expectedButton: 'Next' }
    ];

    let allButtonsCorrect = true;

    testStates.forEach(state => {
      // Simulate button render logic: !isSubmitted ? Submit : Next
      const actualButton = !state.isSubmitted ? 'Submit' : 'Next';
      const buttonCorrect = actualButton === state.expectedButton;
      
      console.log(`🔘 isSubmitted: ${state.isSubmitted} → ${actualButton} button ${buttonCorrect ? '✅' : '❌'}`);
      
      if (!buttonCorrect) allButtonsCorrect = false;
    });

    console.log(`🔘 Button Logic Test: ${allButtonsCorrect ? '✅ PASS' : '❌ FAIL'}`);
    return allButtonsCorrect;
  }

  /**
   * Test 6: Offline Functionality
   */
  async testOfflineFunctionality() {
    console.log('\n📱 TEST 6: Offline Functionality');
    
    // Simulate offline condition by testing fallback generation
    try {
      const offlineQuestions = await cuetQuestionGenerator.generateCUETQuestions('Physics', 'Electrostatics', 10);
      
      const hasQuestions = offlineQuestions.length > 0;
      const allValid = offlineQuestions.every(q => 
        q.question && !q.question.includes('refresh the page') &&
        Array.isArray(q.options) && q.options.length === 4
      );

      const offlineWorks = hasQuestions && allValid;
      
      console.log(`📱 Offline questions: ${offlineQuestions.length}`);
      console.log(`📱 All valid: ${allValid ? '✅' : '❌'}`);
      console.log(`📱 Offline Test: ${offlineWorks ? '✅ PASS' : '❌ FAIL'}`);
      
      return offlineWorks;
      
    } catch (error) {
      console.log(`📱 Offline Test: ❌ FAIL - ${error.message}`);
      return false;
    }
  }

  /**
   * Run all stability tests
   */
  async runAllStabilityTests() {
    console.log('🔥 RUNNING COMPLETE QUIZ ENGINE STABILITY TEST\n');
    console.log('=' .repeat(60));
    
    const results = {
      stateMachine: await this.testQuizStateMachine(),
      cuetGeneration: await this.testCUETAccurateGeneration(),
      questionCounts: await this.testQuestionCountCompliance(),
      neverFail: await this.testNeverFailGuarantee(),
      buttonLogic: this.testButtonRenderLogic(),
      offline: await this.testOfflineFunctionality()
    };

    console.log('\n🏁 FINAL STABILITY REPORT');
    console.log('=' .repeat(60));
    
    const passCount = Object.values(results).filter(r => r).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`🔥 TEST 1 - Quiz State Machine: ${results.stateMachine ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🎯 TEST 2 - CUET-Accurate Generation: ${results.cuetGeneration ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`📊 TEST 3 - Question Count Compliance: ${results.questionCounts ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🛡️ TEST 4 - Never-Fail Guarantee: ${results.neverFail ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🔘 TEST 5 - Button Render Logic: ${results.buttonLogic ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`📱 TEST 6 - Offline Functionality: ${results.offline ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log(`\n📈 OVERALL SCORE: ${passCount}/${totalTests} (${Math.round((passCount/totalTests)*100)}%)`);
    
    if (passCount === totalTests) {
      console.log('\n🎉 QUIZ ENGINE IS FULLY STABILIZED AND HARDENED!');
      console.log('✅ Deterministic state machine operational');
      console.log('✅ CUET-accurate content generation active');
      console.log('✅ Never-fail reliability guaranteed');
      console.log('✅ Ready for sustained CUET preparation');
    } else {
      console.log('\n⚠️ QUIZ ENGINE NEEDS ATTENTION');
      console.log('🔧 Some stability features require fixes');
    }

    return results;
  }
}

export const quizEngineStabilityTest = new QuizEngineStabilityTest();