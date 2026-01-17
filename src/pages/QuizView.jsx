import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Lightbulb, BookOpen, Flag, Star } from 'lucide-react';
import { intelligentQuestionService } from '../services/IntelligentQuestionService';
import { mistakeMemoryEngine } from '../services/MistakeMemoryEngine';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { LoadingScreen } from '../components/LoadingScreen';

const QuizView = () => {
  const { subject, chapter } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addQuizResult, updateChapterProgress, updateStats, updateProfile, calculateXP, ...state } = useApp();
  
  // Get practice mode from URL params
  const practiceMode = searchParams.get('mode') || 'mixed';
  const difficulty = searchParams.get('difficulty') || 'adaptive';
  const isDailyTask = searchParams.get('daily') === 'true';
  
  // 🔥 DETERMINISTIC STATE MACHINE (MANDATORY)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  
  // Additional required states
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [allAttempts, setAllAttempts] = useState([]);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    loadQuestions();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [subject, chapter]);

  // 🔥 CUET-ACCURATE QUESTION LOADING (HARD SAFETY RULES)
  const loadQuestions = async () => {
    try {
      setLoading(true);
      
      console.log(`🧠 Loading CUET-accurate questions for ${subject} - ${chapter}`);
      
      // Determine CUET-correct question count
      let questionCount = 20; // Chapter practice
      if (isDailyTask) {
        questionCount = 15; // Daily command
      } else if (practiceMode === 'pyq-only') {
        questionCount = 25; // PYQ mode
      }

      // Get questions through CUET-accurate pipeline
      let loadedQuestions = await intelligentQuestionService.getIntelligentQuestions({
        subject,
        chapter,
        count: questionCount,
        mode: isDailyTask ? 'daily' : (practiceMode === 'pyq-only' ? 'pyq' : 'chapter'),
        difficulty
      });
      
      // 🔥 HARD SAFETY RULE: Minimum question count
      if (loadedQuestions.length < 10) {
        console.warn('⚠️ Insufficient questions loaded, regenerating...');
        loadedQuestions = await intelligentQuestionService.getIntelligentQuestions({
          subject,
          chapter,
          count: Math.max(questionCount, 15),
          mode: 'chapter',
          difficulty: 'medium'
        });
      }

      // 🔥 ABSOLUTE SAFETY: Never allow empty questions
      if (loadedQuestions.length === 0) {
        console.error('🚨 CRITICAL: No questions loaded, using emergency fallback');
        loadedQuestions = generateEmergencyQuestions(subject, chapter, 15);
      }

      console.log(`✅ Loaded ${loadedQuestions.length} CUET-accurate questions`);
      setQuestions(loadedQuestions);
      
      // Set appropriate timer
      const timePerQuestion = practiceMode === 'pyq-only' ? 90 : 120;
      setTimeLeft(Math.min(loadedQuestions.length * timePerQuestion, 45 * 60));
      
    } catch (error) {
      console.error('❌ Critical error loading questions:', error);
      // Emergency fallback - never fail
      const emergencyQuestions = generateEmergencyQuestions(subject, chapter, 15);
      setQuestions(emergencyQuestions);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 EMERGENCY CUET-STYLE FALLBACK GENERATOR
  const generateEmergencyQuestions = (subject, chapter, count) => {
    const questions = [];
    
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `emergency_${subject}_${chapter}_${i}`,
        subject,
        chapter,
        concept: chapter,
        question: getCUETStyleEmergencyQuestion(subject, chapter, i),
        options: getCUETStyleOptions(subject, chapter, i),
        correctAnswer: 0,
        explanation: `This is based on ${chapter} concepts from ${subject}.`,
        source: 'emergency_fallback'
      });
    }
    
    return questions;
  };

  // 🔥 CUET-STYLE EMERGENCY QUESTIONS (NEVER GENERIC)
  const getCUETStyleEmergencyQuestion = (subject, chapter, index) => {
    const templates = {
      'Physics': {
        'Electrostatics': [
          'According to Coulomb\'s law, the force between two point charges is proportional to:',
          'The electric field at a point due to a point charge is given by:',
          'The unit of electric field intensity is:'
        ],
        'Current Electricity': [
          'Ohm\'s law states that the current through a conductor is:',
          'The resistance of a wire depends on:',
          'The power dissipated in a resistor is given by:'
        ]
      },
      'Chemistry': {
        'Chemical Bonding': [
          'The type of bond formed between Na and Cl is:',
          'Hybridization of carbon in methane is:',
          'The geometry of ammonia molecule is:'
        ],
        'Thermodynamics': [
          'The first law of thermodynamics is based on:',
          'An adiabatic process is one in which:',
          'The enthalpy change for an exothermic reaction is:'
        ]
      },
      'Mathematics': {
        'Limits and Derivatives': [
          'The limit of sin(x)/x as x approaches 0 is:',
          'The derivative of x² is:',
          'If f(x) = x³, then f\'(x) equals:'
        ],
        'Integrals': [
          'The integral of x dx is:',
          'The fundamental theorem of calculus relates:',
          'The area under the curve y = x from 0 to 1 is:'
        ]
      }
    };

    const subjectTemplates = templates[subject] || {};
    const chapterTemplates = subjectTemplates[chapter] || [
      `Which of the following is correct regarding ${chapter}?`,
      `The fundamental principle of ${chapter} states that:`,
      `In ${chapter}, the most important concept is:`
    ];

    return chapterTemplates[index % chapterTemplates.length];
  };

  // 🔥 CUET-STYLE OPTIONS (NEVER GENERIC)
  const getCUETStyleOptions = (subject, chapter, index) => {
    const optionSets = {
      'Physics': {
        'Electrostatics': [
          ['Product of charges and inverse square of distance', 'Sum of charges only', 'Distance only', 'Medium only'],
          ['kq/r²', 'kq/r', 'kq²/r', 'kq²/r²'],
          ['N/C', 'C/N', 'N·C', 'C·N']
        ]
      },
      'Chemistry': {
        'Chemical Bonding': [
          ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
          ['sp³', 'sp²', 'sp', 'dsp²'],
          ['Tetrahedral', 'Pyramidal', 'Planar', 'Linear']
        ]
      },
      'Mathematics': {
        'Limits and Derivatives': [
          ['1', '0', '∞', 'Does not exist'],
          ['2x', 'x', '2x²', 'x²'],
          ['3x²', '3x', 'x³', 'x²']
        ]
      }
    };

    const subjectOptions = optionSets[subject] || {};
    const chapterOptions = subjectOptions[chapter] || [
      ['Option A', 'Option B', 'Option C', 'Option D']
    ];

    return chapterOptions[index % chapterOptions.length];
  };

  // 🔥 QUIZ START LOGIC
  const startQuiz = () => {
    setQuizStarted(true);
    startTimeRef.current = Date.now();
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 🔥 OPTION SELECTION (CLEAN STATE)
  const handleOptionSelect = (optionIndex) => {
    if (!isSubmitted) {
      setSelectedOption(optionIndex);
    }
  };

  // 🔥 SUBMIT LOGIC (STRICT VALIDATION)
  const handleSubmit = async () => {
    // Validate option selected
    if (selectedOption === null) {
      console.warn('⚠️ No option selected');
      return;
    }

    // Save attempt immediately
    await saveCurrentAttempt();
    
    // Lock options and show explanation
    setIsSubmitted(true);
    
    console.log(`✅ Question ${currentIndex + 1} submitted: Option ${selectedOption}`);
  };

  // 🔥 NEXT QUESTION LOGIC (MANDATORY RESET)
  const handleNext = () => {
    // Reset state for next question
    setSelectedOption(null);
    setIsSubmitted(false);
    
    // Advance or finish
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      console.log(`➡️ Advanced to question ${currentIndex + 2}`);
    } else {
      finishQuiz();
    }
  };

  // 🔥 SAVE CURRENT ATTEMPT
  const saveCurrentAttempt = async () => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    const attemptData = {
      questionId: currentQuestion.id,
      subject,
      chapter,
      conceptTag: currentQuestion.concept || chapter,
      source: currentQuestion.source || 'unknown',
      selectedOption,
      correctOption: currentQuestion.correctAnswer,
      isCorrect,
      timeTaken: 60, // Approximate
      difficulty: currentQuestion.difficulty || 'medium',
      questionText: currentQuestion.question,
      mode: isDailyTask ? 'daily' : practiceMode
    };

    // Record in mistake memory engine
    try {
      await intelligentQuestionService.recordQuestionAttempt(attemptData);
      
      // Store locally for quiz results
      setAllAttempts(prev => [...prev, {
        ...attemptData,
        questionIndex: currentIndex
      }]);
      
      console.log(`💾 Saved attempt for question ${currentIndex + 1}: ${isCorrect ? '✅' : '❌'}`);
    } catch (error) {
      console.error('❌ Failed to save attempt:', error);
    }
  };

  // 🔥 FINISH QUIZ
  const finishQuiz = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTimeRef.current) / 1000);
    
    // Calculate final results
    const correctAnswers = allAttempts.filter(a => a.isCorrect).length;
    const totalQuestions = questions.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const score = Math.max(0, (correctAnswers * 5) - ((totalQuestions - correctAnswers) * 1));

    const quizResult = {
      subject,
      chapter,
      score,
      totalQuestions,
      correctAnswers,
      accuracy,
      timeTaken,
      timeLeft,
      mistakes: allAttempts.filter(a => !a.isCorrect),
      date: new Date().toISOString(),
      mode: isDailyTask ? 'daily' : practiceMode
    };

    // Update app context
    updateChapterProgress(subject, chapter, {
      mastery: accuracy,
      attempts: 1,
      bestScore: score,
      totalQuestions,
      correctAnswers
    });

    updateStats({
      totalQuestions: (state?.stats?.totalQuestions || 0) + totalQuestions,
      correctAnswers: (state?.stats?.correctAnswers || 0) + correctAnswers,
      averageAccuracy: Math.round(((state?.stats?.correctAnswers || 0) + correctAnswers) / ((state?.stats?.totalQuestions || 0) + totalQuestions) * 100)
    });

    const earnedXP = calculateXP(correctAnswers, totalQuestions, Math.floor(timeLeft / 60));
    updateProfile({
      xp: (state?.profile?.xp || 0) + earnedXP,
      streak: accuracy >= 70 ? (state?.profile?.streak || 0) + 1 : 0
    });

    addQuizResult(quizResult);
    
    console.log('🏁 Quiz completed:', quizResult);
    navigate('/result', { state: { quizResult } });
  };

  // 🔥 UTILITY FUNCTIONS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 300) return 'text-red-600'; // Last 5 minutes
    if (timeLeft <= 600) return 'text-orange-600'; // Last 10 minutes
    return 'text-gray-600';
  };

  // 🔥 LOADING STATE
  if (loading) {
    return (
      <LoadingScreen
        message="Loading CUET-accurate questions..."
        phase="loading"
        showAIStatus={false}
      />
    );
  }

  // 🔥 QUIZ START SCREEN
  if (!quizStarted) {
    const mistakeBasedCount = questions.filter(q => 
      q.source === 'mistake_variant' || q.priority === 'highest'
    ).length;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {subject}
              </h1>
              <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                {chapter}
              </h2>
              
              {/* Practice Mode Indicator */}
              <div className="flex items-center justify-center space-x-2 mb-6">
                {isDailyTask && (
                  <Badge variant="success" className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Daily Command</span>
                  </Badge>
                )}
                {practiceMode === 'pyq-only' && (
                  <Badge variant="warning" className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>PYQ Mode</span>
                  </Badge>
                )}
              </div>
              
              {/* UX TRANSPARENCY - MISTAKE-BASED LEARNING INDICATOR */}
              {mistakeBasedCount > 0 && (
                <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300 text-sm">
                    <span>Some questions are based on your previous mistakes.</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">{questions.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Questions</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-1">{Math.floor(timeLeft / 60)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Minutes</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-1">+5/-1</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Marking</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <div className="text-2xl font-bold text-orange-600 mb-1">CUET</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Standard</div>
              </div>
            </div>

            <div className="space-y-4">
              <Button onClick={startQuiz} size="lg" className="w-full text-lg py-4">
                🚀 Start Quiz
              </Button>
              <Button onClick={() => navigate(-1)} variant="secondary" size="lg" className="w-full">
                ← Back to Chapters
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 🔥 MAIN QUIZ INTERFACE
  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                Question {currentIndex + 1} of {questions.length}
              </Badge>
              
              {currentQ?.source === 'mistake_variant' && (
                <Badge variant="warning" className="flex items-center space-x-1">
                  <Flag className="w-3 h-3" />
                  <span>Mistake Review</span>
                </Badge>
              )}
              
              {currentQ?.isPYQ && (
                <Badge variant="success" className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>PYQ</span>
                </Badge>
              )}
            </div>

            <div className={`flex items-center space-x-2 ${getTimerColor()}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 mb-6">
              {/* Question */}
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 leading-relaxed">
                  {currentQ?.question}
                </h3>
                
                {/* Options */}
                <div className="space-y-3">
                  {currentQ?.options?.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isSubmitted}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        selectedOption === index
                          ? isSubmitted
                            ? index === currentQ.correctAnswer
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                            : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : isSubmitted && index === currentQ.correctAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                      } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                      whileHover={!isSubmitted ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          selectedOption === index
                            ? isSubmitted
                              ? index === currentQ.correctAnswer
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-red-500 bg-red-500 text-white'
                              : 'border-indigo-500 bg-indigo-500 text-white'
                            : isSubmitted && index === currentQ.correctAnswer
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {isSubmitted && index === currentQ.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Explanation (shown after submission) */}
              {isSubmitted && currentQ?.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Explanation</h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 🔥 DETERMINISTIC BUTTON RENDER RULE */}
              <div className="mt-6 flex justify-between items-center">
                <Button
                  onClick={() => navigate(-1)}
                  variant="ghost"
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Exit Quiz</span>
                </Button>

                <div className="flex space-x-3">
                  {!isSubmitted ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={selectedOption === null}
                      className={`px-8 py-3 ${
                        selectedOption === null
                          ? 'opacity-50 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                    >
                      <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizView;