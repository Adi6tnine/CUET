import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SYLLABUS } from '../data/syllabus';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import StudyTracker from '../components/StudyTracker';
import SimpleStudyTracker from '../components/SimpleStudyTracker';
import StudyTrackerErrorBoundary from '../components/StudyTrackerErrorBoundary';
import AdaptiveLearningInsights from '../components/AdaptiveLearningInsights';
import { 
  Play, Brain, Zap, Target, Trophy, Star, ChevronRight, 
  BookOpen, Clock, TrendingUp, Award, Flame, Lock, 
  Sparkles, CheckCircle, ArrowRight, BarChart3, User, Calendar
} from 'lucide-react';

const GamefiedDashboard = ({ predictionMode = false }) => {
  const navigate = useNavigate();
  const { profile, stats } = useApp();
  const [showStudyTracker, setShowStudyTracker] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [currentStreak, setCurrentStreak] = useState((profile && profile.streak) || 0);
  const [completedChecklist, setCompletedChecklist] = useState([]);

  // Memoize expensive calculations
  const isNewUser = useMemo(() => {
    return !stats || !stats.totalQuestions || stats.totalQuestions === 0;
  }, [stats?.totalQuestions]);
  
  const getUserName = useMemo(() => {
    if (profile && profile.name && profile.name !== 'Anonymous User') {
      return profile.name.split(' ')[0];
    }
    return 'Aspirant';
  }, [profile?.name]);

  const calculateOverallProgress = useMemo(() => {
    if (isNewUser || !stats || !stats.subjectMastery) return 0;
    const subjects = Object.keys(stats.subjectMastery || {});
    if (subjects.length === 0) return 0;
    const totalMastery = subjects.reduce((sum, subject) => sum + (stats.subjectMastery[subject] || 0), 0);
    return Math.round(totalMastery / subjects.length);
  }, [isNewUser, stats?.subjectMastery]);

  const getAIRecommendation = useMemo(() => {
    if (isNewUser || !stats || !stats.subjectMastery) {
      return {
        subject: 'Physics',
        chapter: 'Motion in a Straight Line',
        reason: 'Perfect starting point for CUET 2026',
        confidence: 95
      };
    }
    
    const subjects = Object.entries(stats.subjectMastery || {});
    if (subjects.length === 0) {
      return {
        subject: 'Physics',
        chapter: 'Electric Charges and Fields',
        reason: 'High weightage in CUET 2026',
        confidence: 88
      };
    }
    
    const lowestSubject = subjects.reduce((min, current) => 
      current[1] < min[1] ? current : min
    );
    
    return {
      subject: lowestSubject[0],
      chapter: 'Next Chapter',
      reason: 'Based on your progress & CUET trends',
      confidence: 92
    };
  }, [isNewUser, stats?.subjectMastery]);

  const getTodaysGoal = useMemo(() => {
    const today = new Date().toDateString();
    const todayQuizzes = (stats?.quizHistory || []).filter(
      quiz => quiz.date && new Date(quiz.date).toDateString() === today
    ).length;
    
    return {
      completed: todayQuizzes,
      target: 5,
      remaining: Math.max(0, 5 - todayQuizzes)
    };
  }, [stats?.quizHistory]);

  // Get question of the day
  const getQuestionOfTheDay = useMemo(() => {
    const questions = [
      {
        question: "What is the SI unit of electric current?",
        options: ["Volt", "Ampere", "Ohm", "Watt"],
        correct: 1,
        subject: "Physics",
        explanation: "The ampere (A) is the SI base unit of electric current."
      },
      {
        question: "Which element has the atomic number 6?",
        options: ["Oxygen", "Nitrogen", "Carbon", "Boron"],
        correct: 2,
        subject: "Chemistry",
        explanation: "Carbon has 6 protons, giving it atomic number 6."
      },
      {
        question: "What is the derivative of x²?",
        options: ["x", "2x", "x²", "2"],
        correct: 1,
        subject: "Mathematics",
        explanation: "Using the power rule: d/dx(x²) = 2x¹ = 2x"
      }
    ];
    
    const today = new Date().getDate();
    return questions[today % questions.length];
  }, []);

  // Optimized callbacks
  const handleStartStudy = useCallback(() => {
    navigate(`/subject/${encodeURIComponent(getAIRecommendation.subject)}`);
  }, [getAIRecommendation.subject, navigate]);

  const handleSubjectClick = useCallback((subject) => {
    navigate(`/subject/${encodeURIComponent(subject)}`);
  }, [navigate]);

  const getSubjectProgress = useCallback((subject) => {
    if (isNewUser || !stats || !stats.subjectMastery) return 0;
    return stats.subjectMastery[subject] || 0;
  }, [isNewUser, stats?.subjectMastery]);

  const getSubjectColor = useCallback((subject) => {
    const colors = {
      'Physics': 'from-blue-500 to-indigo-600',
      'Chemistry': 'from-purple-500 to-pink-600',
      'Mathematics': 'from-green-500 to-emerald-600',
      'English': 'from-indigo-500 to-blue-600',
      'General Test': 'from-orange-500 to-red-600'
    };
    return colors[subject] || 'from-gray-500 to-gray-600';
  }, []);

  // Handle checklist item completion
  const handleChecklistAction = useCallback((item) => {
    if (!completedChecklist.includes(item.id)) {
      setCompletedChecklist([...completedChecklist, item.id]);
    }
    item.action();
  }, [completedChecklist]);

  // XP Animation
  const triggerXPAnimation = useCallback((xp) => {
    setShowXPAnimation(true);
    setTimeout(() => setShowXPAnimation(false), 2000);
  }, []);

  // Getting started checklist for new users
  const getGettingStartedItems = useMemo(() => {
    if (!isNewUser) return [];
    
    return [
      {
        id: 'first-quiz',
        title: 'Take your first quiz',
        description: 'Start with Physics - Motion',
        icon: Play,
        completed: completedChecklist.includes('first-quiz'),
        action: () => navigate('/subject/Physics')
      },
      {
        id: 'set-goal',
        title: 'Set daily goal',
        description: 'Aim for 5 quizzes per day',
        icon: Target,
        completed: completedChecklist.includes('set-goal'),
        action: () => setCompletedChecklist([...completedChecklist, 'set-goal'])
      },
      {
        id: 'explore-tracker',
        title: 'Open Study Tracker',
        description: 'Plan your CUET 2026 journey',
        icon: Calendar,
        completed: completedChecklist.includes('explore-tracker'),
        action: () => {
          setShowStudyTracker(true);
          setCompletedChecklist([...completedChecklist, 'explore-tracker']);
        }
      }
    ];
  }, [isNewUser, completedChecklist, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 pb-24">
      {/* Mobile-First Layout */}
      <div className="max-w-md mx-auto lg:max-w-7xl lg:px-8">
        
        {/* Personalized Greeting */}
        <div className="px-4 pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Hi {getUserName}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
              {isNewUser ? "Ready to start your CUET 2026 journey?" : "Let's continue crushing those goals!"}
            </p>
          </motion.div>

          {/* START QUIZ button with glow effect */}
          <motion.div 
            className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              onClick={handleStartStudy}
              className="w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-xl flex flex-col items-center justify-center text-white font-bold relative overflow-hidden group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-75 group-hover:opacity-100 animate-pulse"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <Play className="w-8 h-8 lg:w-10 lg:h-10 mb-2 mx-auto" />
                <span className="text-lg lg:text-xl font-bold">START</span>
                <span className="text-lg lg:text-xl font-bold block">QUIZ</span>
                <span className="text-xs opacity-90">{calculateOverallProgress}% Complete</span>
              </div>
            </motion.button>
          </motion.div>

          {/* XP Bar & Streak */}
          <div className="flex items-center justify-between mb-6 px-4 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-900 dark:text-white">
                  {(profile && profile.xp) || 0} XP
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-gray-900 dark:text-white">
                  {currentStreak} day{currentStreak !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Level {Math.floor(((profile && profile.xp) || 0) / 100) + 1}
            </Badge>
          </div>
        </div>

        {/* Getting Started Checklist for New Users */}
        {isNewUser && getGettingStartedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-4 mb-6"
          >
            <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Getting Started</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Complete these steps to begin your journey</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {getGettingStartedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                      item.completed 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                        : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleChecklistAction(item)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <item.icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${item.completed ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        {item.description}
                      </div>
                    </div>
                    {!item.completed && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* AI RECOMMENDATION & TODAY'S GOAL CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-4 mb-6"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">🤖 AI Suggests</h3>
                  <Badge variant="secondary" className="text-xs">
                    {getAIRecommendation.confidence}% match
                  </Badge>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Start {getAIRecommendation.subject} – {getAIRecommendation.chapter}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {getAIRecommendation.reason}
                </p>
              </div>
            </div>
            
            {/* Today's Progress */}
            <div className="flex items-center justify-between mb-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Today's Progress</span>
              <Badge variant={getTodaysGoal.remaining === 0 ? "success" : "secondary"}>
                {getTodaysGoal.completed}/{getTodaysGoal.target} quizzes
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleStartStudy}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Now
              </Button>
              <Button
                onClick={() => setShowStudyTracker(true)}
                variant="outline"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Study Plan
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Question of the Day */}
        {!isNewUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-4 mb-6"
          >
            <Card className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Question of the Day</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{getQuestionOfTheDay.subject}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="font-medium text-gray-900 dark:text-white mb-3">
                  {getQuestionOfTheDay.question}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {getQuestionOfTheDay.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg text-sm cursor-pointer transition-all ${
                        index === getQuestionOfTheDay.correct
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <strong>Answer:</strong> {getQuestionOfTheDay.explanation}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Subject Cards - Enhanced */}
        <div className="px-4 mb-6" data-section="subjects">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Subject
          </h2>
          
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {SYLLABUS && Object.entries(SYLLABUS).slice(0, 6).map(([subject, data]) => {
              if (!data || !data.sections) return null;
              
              const subjectProgress = getSubjectProgress(subject);
              
              return (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <Card className="p-4 h-full hover:shadow-lg transition-all group">
                    <div className="text-center">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{data.icon}</div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
                        {subject}
                      </h3>
                      <div className="text-2xl font-bold text-indigo-600 mb-1">
                        {isNewUser ? '0' : subjectProgress}%
                      </div>
                      <div className={`w-full text-xs bg-gradient-to-r ${getSubjectColor(subject)} hover:opacity-90 px-3 py-2 rounded-lg text-white font-medium flex items-center justify-center space-x-1 group-hover:shadow-md transition-all`}>
                        <Play className="w-3 h-3" />
                        <span>Start</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Adaptive Learning Insights - Desktop Only */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 mb-8">
        <AdaptiveLearningInsights 
          onPracticeWeakTopic={(topic) => {
            const [subject, chapter] = topic.split('-');
            navigate(`/quiz/${encodeURIComponent(subject)}/${encodeURIComponent(chapter)}`);
          }}
          onReviewMistakes={() => navigate('/analytics')}
        />
      </div>

      {/* Fixed Primary CTA - Mobile */}
      <div className="fixed bottom-20 left-0 right-0 px-4 lg:hidden">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleStartStudy}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl text-lg font-bold py-4"
          >
            <Play className="w-6 h-6 mr-3" />
            ▶ Start Today's Study
          </Button>
        </motion.div>
      </div>

      {/* XP Animation Toast */}
      {showXPAnimation && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">+50 XP Earned!</span>
          </div>
        </motion.div>
      )}

      {/* Study Tracker Panel */}
      {showStudyTracker && (
        <StudyTrackerErrorBoundary onClose={() => setShowStudyTracker(false)}>
          <StudyTracker onClose={() => setShowStudyTracker(false)} />
        </StudyTrackerErrorBoundary>
      )}
    </div>
  );
};

export default GamefiedDashboard;