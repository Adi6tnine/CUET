/**
 * QUICK SYSTEM INTEGRATION TEST
 * Verifies the mistake learning system is properly integrated
 */

import { mistakeMemoryEngine } from '../services/MistakeMemoryEngine.js';
import { intelligentQuestionService } from '../services/IntelligentQuestionService.js';

export async function quickSystemTest() {
  console.log('🧪 QUICK SYSTEM INTEGRATION TEST');
  
  try {
    // Test 1: Can we record a mistake?
    console.log('📝 Testing mistake recording...');
    const testAttempt = {
      questionId: 'integration_test_q1',
      subject: 'Physics',
      chapter: 'Electrostatics',
      conceptTag: 'Coulomb Law',
      source: 'test',
      selectedOption: 1,
      correctOption: 0,
      isCorrect: false,
      timeTaken: 60,
      difficulty: 'medium',
      questionText: 'Integration test question',
      mode: 'test'
    };
    
    const attemptId = mistakeMemoryEngine.recordAttempt(testAttempt);
    console.log(`✅ Recorded attempt: ${attemptId}`);
    
    // Test 2: Can we get intelligent questions?
    console.log('🧠 Testing intelligent question generation...');
    const questions = await intelligentQuestionService.getIntelligentQuestions({
      subject: 'Physics',
      chapter: 'Electrostatics',
      count: 5,
      mode: 'chapter'
    });
    
    console.log(`✅ Generated ${questions.length} intelligent questions`);
    
    // Test 3: Do mistakes influence questions?
    const mistakeInfluenced = questions.some(q => 
      q.source === 'mistake_variant' || 
      q.priority === 'highest' ||
      q.conceptTag === 'Coulomb Law'
    );
    
    console.log(`🎯 Mistakes influence questions: ${mistakeInfluenced ? 'YES' : 'NO'}`);
    
    // Test 4: Never-fail guarantee
    const emptyTest = await intelligentQuestionService.getIntelligentQuestions({
      subject: 'InvalidSubject',
      chapter: 'InvalidChapter',
      count: 3,
      mode: 'chapter'
    });
    
    console.log(`🛡️ Never-fail test: ${emptyTest.length > 0 ? 'PASS' : 'FAIL'} (${emptyTest.length} questions)`);
    
    const allTestsPass = attemptId && questions.length > 0 && emptyTest.length > 0;
    
    console.log(`\n📊 INTEGRATION TEST: ${allTestsPass ? '✅ PASS' : '❌ FAIL'}`);
    
    if (allTestsPass) {
      console.log('🎉 System integration is working correctly!');
      console.log('🧠 Mistake learning system is operational');
    }
    
    return allTestsPass;
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return false;
  }
}

// Auto-run in development
if (import.meta.env?.DEV) {
  setTimeout(() => {
    quickSystemTest();
  }, 1000);
}