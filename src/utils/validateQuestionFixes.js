/**
 * QUESTION FIXES VALIDATION UTILITY
 * Simple validation functions to test the implemented fixes
 */

/**
 * Validate that questions have unique content
 */
export function validateQuestionUniqueness(questions) {
  const questionTexts = questions.map(q => q.question?.toLowerCase().trim());
  const uniqueTexts = new Set(questionTexts);
  
  return {
    total: questions.length,
    unique: uniqueTexts.size,
    hasDuplicates: questionTexts.length !== uniqueTexts.size,
    duplicateCount: questionTexts.length - uniqueTexts.size
  };
}

/**
 * Validate that options are shuffled (correct answers in different positions)
 */
export function validateOptionShuffling(questions) {
  const correctPositions = questions.map(q => q.correctAnswer).filter(pos => pos !== undefined);
  const uniquePositions = new Set(correctPositions);
  
  const positionCounts = {};
  correctPositions.forEach(pos => {
    positionCounts[pos] = (positionCounts[pos] || 0) + 1;
  });
  
  return {
    totalQuestions: correctPositions.length,
    uniquePositions: uniquePositions.size,
    positionDistribution: positionCounts,
    isShuffled: uniquePositions.size > 1,
    maxPositionUsed: Math.max(...correctPositions)
  };
}

/**
 * Validate that no placeholder options exist
 */
export function validateNoPlaceholders(questions) {
  const placeholderPatterns = [
    /correct answer/i,
    /incorrect [abc]/i,
    /option [abc]/i,
    /wrong answer/i,
    /placeholder/i,
    /^[abc]\.?\s*$/i
  ];
  
  const foundPlaceholders = [];
  let totalOptions = 0;
  
  questions.forEach((question, qIndex) => {
    if (question.options && Array.isArray(question.options)) {
      question.options.forEach((option, oIndex) => {
        totalOptions++;
        placeholderPatterns.forEach(pattern => {
          if (pattern.test(option)) {
            foundPlaceholders.push({
              questionIndex: qIndex,
              optionIndex: oIndex,
              option: option,
              questionText: question.question?.substring(0, 50) + '...'
            });
          }
        });
      });
    }
  });
  
  return {
    totalOptions,
    placeholderCount: foundPlaceholders.length,
    hasPlaceholders: foundPlaceholders.length > 0,
    placeholders: foundPlaceholders
  };
}

/**
 * Validate CUET realism in questions
 */
export function validateCUETRealism(questions) {
  const cuetIndicators = [
    /according to/i,
    /the value of/i,
    /which of the following/i,
    /if.*then/i,
    /the.*is:?$/i,
    /calculate/i,
    /find/i,
    /determine/i
  ];
  
  const realisticQuestions = [];
  const unrealisticQuestions = [];
  
  questions.forEach((question, index) => {
    const questionText = question.question || '';
    const hasIndicator = cuetIndicators.some(pattern => pattern.test(questionText));
    const hasExplanation = !!question.explanation;
    const hasProperOptions = question.options && question.options.length === 4;
    
    const analysis = {
      index,
      questionText: questionText.substring(0, 60) + '...',
      hasIndicator,
      hasExplanation,
      hasProperOptions,
      isRealistic: hasIndicator && hasExplanation && hasProperOptions
    };
    
    if (analysis.isRealistic) {
      realisticQuestions.push(analysis);
    } else {
      unrealisticQuestions.push(analysis);
    }
  });
  
  return {
    totalQuestions: questions.length,
    realisticCount: realisticQuestions.length,
    unrealisticCount: unrealisticQuestions.length,
    realisticPercentage: Math.round((realisticQuestions.length / questions.length) * 100),
    passesRealism: realisticQuestions.length >= Math.floor(questions.length * 0.7),
    realisticQuestions,
    unrealisticQuestions
  };
}

/**
 * Validate session guarantee (minimum question count)
 */
export function validateSessionGuarantee(questions, requestedCount) {
  const minRequired = Math.min(requestedCount, 10);
  const uniqueQuestions = validateQuestionUniqueness(questions);
  
  return {
    requested: requestedCount,
    received: questions.length,
    unique: uniqueQuestions.unique,
    minRequired,
    meetsGuarantee: questions.length >= minRequired && uniqueQuestions.unique >= minRequired,
    guaranteeDetails: {
      hasMinimumCount: questions.length >= minRequired,
      hasMinimumUnique: uniqueQuestions.unique >= minRequired,
      noDuplicates: !uniqueQuestions.hasDuplicates
    }
  };
}

/**
 * Run comprehensive validation on a set of questions
 */
export function runComprehensiveValidation(questions, requestedCount = questions.length) {
  console.log('🔍 Running comprehensive question validation...');
  
  const results = {
    uniqueness: validateQuestionUniqueness(questions),
    shuffling: validateOptionShuffling(questions),
    placeholders: validateNoPlaceholders(questions),
    realism: validateCUETRealism(questions),
    guarantee: validateSessionGuarantee(questions, requestedCount)
  };
  
  // Calculate overall score
  const tests = [
    { name: 'Uniqueness', passed: !results.uniqueness.hasDuplicates },
    { name: 'Option Shuffling', passed: results.shuffling.isShuffled },
    { name: 'No Placeholders', passed: !results.placeholders.hasPlaceholders },
    { name: 'CUET Realism', passed: results.realism.passesRealism },
    { name: 'Session Guarantee', passed: results.guarantee.meetsGuarantee }
  ];
  
  const passedTests = tests.filter(t => t.passed).length;
  const totalTests = tests.length;
  
  results.overall = {
    score: `${passedTests}/${totalTests}`,
    percentage: Math.round((passedTests / totalTests) * 100),
    passed: passedTests === totalTests,
    tests
  };
  
  return results;
}

/**
 * Display validation results in console
 */
export function displayValidationResults(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 QUESTION VALIDATION RESULTS');
  console.log('='.repeat(60));
  
  // Uniqueness
  console.log(`\n🔍 UNIQUENESS: ${results.uniqueness.hasDuplicates ? '❌ FAIL' : '✅ PASS'}`);
  console.log(`   Total: ${results.uniqueness.total}, Unique: ${results.uniqueness.unique}`);
  if (results.uniqueness.hasDuplicates) {
    console.log(`   Duplicates found: ${results.uniqueness.duplicateCount}`);
  }
  
  // Option Shuffling
  console.log(`\n🔀 OPTION SHUFFLING: ${results.shuffling.isShuffled ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Positions used: ${Object.keys(results.shuffling.positionDistribution).join(', ')}`);
  console.log(`   Distribution: ${JSON.stringify(results.shuffling.positionDistribution)}`);
  
  // Placeholders
  console.log(`\n🚫 NO PLACEHOLDERS: ${results.placeholders.hasPlaceholders ? '❌ FAIL' : '✅ PASS'}`);
  console.log(`   Total options: ${results.placeholders.totalOptions}, Placeholders: ${results.placeholders.placeholderCount}`);
  
  // CUET Realism
  console.log(`\n🎯 CUET REALISM: ${results.realism.passesRealism ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Realistic: ${results.realism.realisticCount}/${results.realism.totalQuestions} (${results.realism.realisticPercentage}%)`);
  
  // Session Guarantee
  console.log(`\n🔒 SESSION GUARANTEE: ${results.guarantee.meetsGuarantee ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Requested: ${results.guarantee.requested}, Received: ${results.guarantee.received}, Unique: ${results.guarantee.unique}`);
  
  // Overall
  console.log(`\n🏁 OVERALL RESULT: ${results.overall.score} (${results.overall.percentage}%)`);
  results.overall.tests.forEach(test => {
    const status = test.passed ? '✅' : '❌';
    console.log(`   ${status} ${test.name}`);
  });
  
  if (results.overall.passed) {
    console.log('\n🎉 ALL FIXES WORKING CORRECTLY!');
  } else {
    console.log('\n⚠️ SOME ISSUES DETECTED - Review failed tests');
  }
  
  console.log('='.repeat(60));
}

/**
 * Quick test function for browser console
 */
export async function quickValidationTest() {
  try {
    // This would be called from browser console with actual question service
    console.log('To test the fixes, run this in browser console:');
    console.log(`
// Import the validation functions
import { runComprehensiveValidation, displayValidationResults } from './src/utils/validateQuestionFixes.js';
import { intelligentQuestionService } from './src/services/IntelligentQuestionService.js';

// Generate test questions
const questions = await intelligentQuestionService.getIntelligentQuestions({
  subject: 'Physics',
  chapter: 'Electrostatics', 
  count: 15,
  mode: 'chapter'
});

// Run validation
const results = runComprehensiveValidation(questions, 15);
displayValidationResults(results);
    `);
  } catch (error) {
    console.error('Validation test setup failed:', error);
  }
}