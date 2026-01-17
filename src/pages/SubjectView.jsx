import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Play, Zap, Target, Clock, Trophy, Star, 
  Flame, Brain, ChevronRight, Lock, Sparkles, Award,
  TrendingUp, BarChart3, CheckCircle, X, CalendarDays
} from 'lucide-react';
import { SYLLABUS } from '../data/syllabus';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

// Study Tracker Data Integration
const STUDY_PLAN_DATA = {
  "Physics": {
    "Week 1": ["Motion in a Straight Line", "Units and Measurements"],
    "Week 2": ["Laws of Motion", "Work, Energy and Power"],
    "Week 3": ["Gravitation"],
    "Week 4": ["Waves", "Current Electricity"],
    "Week 5": ["Electric Charges and Fields", "Electrostatic Potential and Capacitance"],
    "Week 6": ["Moving Charges and Magnetism", "Magnetism and Matter"],
    "Week 7": ["Electromagnetic Induction", "Alternating Current"],
    "Week 8": ["Ray Optics and Optical Instruments", "Wave Optics"],
    "Week 9": ["Dual Nature of Radiation and Matter", "Atoms", "Nuclei"]
  },
  "Chemistry": {
    "Week 1": ["Some Basic Concepts of Chemistry", "Structure of Atom"],
    "Week 2": ["Chemical Bonding and Molecular Structure"],
    "Week 3": ["Thermodynamics"],
    "Week 4": ["Equilibrium"],
    "Week 5": ["Hydrocarbons"],
    "Week 6": ["Organic Chemistry - Some Basic Principles"],
    "Week 7": ["Alcohols, Phenols and Ethers"],
    "Week 8": ["Aldehydes, Ketones and Carboxylic Acids"],
    "Week 9": ["The p-Block Elements", "Coordination Compounds"]
  },
  "Mathematics": {
    "Week 1": ["Sets", "Relations and Functions"],
    "Week 2": ["Trigonometric Functions"],
    "Week 3": ["Complex Numbers and Quadratic Equations"],
    "Week 4": ["Matrices"],
    "Week 5": ["Determinants"],
    "Week 6": ["Limits and Derivatives"],
    "Week 7": ["Continuity and Differentiability"],
    "Week 8": ["Application of Derivatives", "Integrals"],
    "Week 9": ["Application of Integrals", "Differential Equations"]
  }
};

const SubjectView = ({ predictionMode = false }) => {
  const { subject: encodedSubject } = useParams();
  const navigate = useNavigate();
  const { getChapterProgress, profile, stats } = useApp();
  const [selectedSection, setSelectedSection] = useState(null);
  const [showXPToast, setShowXPToast] = useState(false);
  const [showAINudge, setShowAINudge] = useState(true);
  const [lastRecommendedChapter, setLastRecommendedChapter] = useState(null);

  // Decode the subject parameter
  const subject = decodeURIComponent(encodedSubject || '');
  const subjectData = SYLLABUS[subject];
  
  if (!subjectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subject not found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The subject "{subject}" doesn't exist. Available subjects: {Object.keys(SYLLABUS).join(', ')}
          </p>
          <Button 
            onClick={() => navigate('/')} 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const sections = Object.keys(subjectData.sections);
  const hasMultipleSections = sections.length > 1;

  // Initialize with Class 12 (CUET Core) if available, otherwise first section
  useEffect(() => {
    if (!selectedSection && sections.length > 0) {
      const coreSection = sections.find(s => s.includes('Class 12')) || sections[0];
      setSelectedSection(coreSection);
    }
  }, [sections, selectedSection]);

  const currentChapters = selectedSection ? subjectData.sections[selectedSection] : [];

  // Get chapter difficulty based on position and complexity
  const getChapterDifficulty = (chapter, index) => {
    const difficultyMap = {
      'Easy': ['Motion in a Straight Line', 'Physical World', 'Units and Measurements', 'Some Basic Concepts of Chemistry'],
      'Hard': ['Electromagnetic Induction', 'Alternating Current', 'Wave Optics', 'Nuclei', 'Semiconductor Electronics', 'Chemical Kinetics', 'Coordination Compounds']
    };
    
    if (difficultyMap.Easy.some(easy => chapter.includes(easy.split(' ')[0]))) return 'Easy';
    if (difficultyMap.Hard.some(hard => chapter.includes(hard.split(' ')[0]))) return 'Hard';
    return 'Medium';
  };

  const getChapterMastery = (chapter) => {
    const progress = getChapterProgress(subject, chapter);
    return progress.mastery || 0;
  };

  // Get study plan week for a chapter
  const getChapterWeek = (chapter) => {
    const subjectPlan = STUDY_PLAN_DATA[subject];
    if (!subjectPlan) return null;
    
    for (const [week, chapters] of Object.entries(subjectPlan)) {
      if (chapters.some(planChapter => 
        chapter.toLowerCase().includes(planChapter.toLowerCase()) ||
        planChapter.toLowerCase().includes(chapter.toLowerCase())
      )) {
        return week;
      }
    }
    return null;
  };

  // Get chapter priority based on study plan
  const getChapterPriority = (chapter) => {
    const week = getChapterWeek(chapter);
    if (!week) return 'normal';
    
    const weekNumber = parseInt(week.split(' ')[1]);
    const currentWeek = Math.ceil((new Date() - new Date('2024-01-01')) / (7 * 24 * 60 * 60 * 1000));
    
    if (weekNumber <= currentWeek) return 'high';
    if (weekNumber <= currentWeek + 2) return 'medium';
    return 'low';
  };

  // Get chapter status
  const getChapterStatus = (chapter) => {
    const mastery = getChapterMastery(chapter);
    const priority = getChapterPriority(chapter);
    
    if (mastery >= 80) return 'completed';
    if (mastery >= 50) return 'in-progress';
    if (priority === 'high') return 'urgent';
    return 'pending';
  };

  // Get AI recommendation
  const getAIRecommendation = () => {
    const uncompletedChapters = currentChapters.filter(chapter => getChapterMastery(chapter) < 80);
    if (uncompletedChapters.length === 0) return null;
    
    // Prioritize easy chapters for beginners, medium for intermediate
    const avgMastery = currentChapters.reduce((sum, ch) => sum + getChapterMastery(ch), 0) / currentChapters.length;
    
    if (avgMastery < 30) {
      // Beginner - recommend easy chapters
      const easyChapters = uncompletedChapters.filter(ch => getChapterDifficulty(ch) === 'Easy');
      return easyChapters[0] || uncompletedChapters[0];
    } else if (avgMastery < 60) {
      // Intermediate - recommend medium chapters
      const mediumChapters = uncompletedChapters.filter(ch => getChapterDifficulty(ch) === 'Medium');
      return mediumChapters[0] || uncompletedChapters[0];
    } else {
      // Advanced - recommend hard chapters
      const hardChapters = uncompletedChapters.filter(ch => getChapterDifficulty(ch) === 'Hard');
      return hardChapters[0] || uncompletedChapters[0];
    }
  };

  // Get today's target progress
  const getTodaysTarget = () => {
    const today = new Date().toDateString();
    const todayQuizzes = (stats?.quizHistory || []).filter(
      quiz => new Date(quiz.date).toDateString() === today && quiz.subject === subject
    ).length;
    return { completed: todayQuizzes, target: 3 };
  };

  // Handle chapter start
  const handleStartChapter = (chapter) => {
    // Trigger XP animation
    setShowXPToast(true);
    setTimeout(() => setShowXPToast(false), 2000);
    
    navigate(`/quiz/${encodeURIComponent(subject)}/${encodeURIComponent(chapter)}`);
  };

  // Handle quick quiz
  const handleQuickQuiz = (chapter) => {
    navigate(`/quiz/${encodeURIComponent(subject)}/${encodeURIComponent(chapter)}?mode=quick`);
  };

  // Continue practice (FAB action)
  const handleContinuePractice = () => {
    const recommendation = getAIRecommendation();
    if (recommendation) {
      handleStartChapter(recommendation);
    } else {
      // All chapters completed, start from first
      handleStartChapter(currentChapters[0]);
    }
  };

  const todaysTarget = getTodaysTarget();
  const aiRecommendation = getAIRecommendation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 pb-24">
      {/* Mobile-First Container */}
      <div className="max-w-md mx-auto lg:max-w-4xl lg:px-8">
        
        {/* 1️⃣ ACTION HERO SECTION */}
        <motion.div
          className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="px-4 py-4">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="mr-3 p-2 hover:bg-white/50 dark:hover:bg-gray-800/50"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    {subjectData.icon} {subject}
                  </h1>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    Master one chapter today ⚡
                  </p>
                </div>
              </div>
            </div>

            {/* Mini Stats Bar - Swipeable on Mobile */}
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-3 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {(profile?.streak) || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {(profile?.xp) || 0} XP
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {todaysTarget.completed}/{todaysTarget.target}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {selectedSection?.includes('12') ? 'CUET Core' : 'Foundation'}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* 2️⃣ CLASS TOGGLE - SEGMENTED CONTROL */}
        {hasMultipleSections && (
          <motion.div 
            className="sticky top-24 z-30 px-4 py-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 relative flex">
              {/* Sliding background indicator */}
              <div className="absolute inset-1 flex">
                <motion.div
                  className="w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg"
                  animate={{
                    x: selectedSection === sections[0] ? 0 : '100%'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </div>
              
              {sections.map((section, index) => (
                <motion.button
                  key={section}
                  className={`relative flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors duration-200 z-10 ${
                    selectedSection === section
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setSelectedSection(section)}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">
                    {section.includes('12') ? 'Class 12 (CUET Core)' : 'Class 11 (Foundation)'}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          className="px-4 pt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 6️⃣ AI NUDGE CARD */}
          {showAINudge && aiRecommendation && (
            <motion.div
              variants={itemVariants}
              className="mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800 relative">
                <button
                  onClick={() => setShowAINudge(false)}
                  className="absolute top-3 right-3 p-1 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">🤖 AI Suggests</h3>
                      <Badge variant="secondary" className="text-xs">Smart Pick</Badge>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Start {aiRecommendation}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                      {getChapterDifficulty(aiRecommendation) === 'Easy' ? 'Perfect for beginners + high CUET weightage' :
                       getChapterDifficulty(aiRecommendation) === 'Medium' ? 'Balanced difficulty + exam focused' :
                       'Advanced level + maximum CUET impact'}
                    </p>
                    <Button
                      onClick={() => handleStartChapter(aiRecommendation)}
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Start Now
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* 3️⃣ CHAPTER CARDS - POWER CARDS */}
          <div className="space-y-4">
            {currentChapters.map((chapter, index) => {
              const mastery = getChapterMastery(chapter);
              const progress = getChapterProgress(subject, chapter);
              const difficulty = getChapterDifficulty(chapter, index);
              const isUntouched = mastery === 0 && progress.attempts === 0;
              const isRecommended = chapter === aiRecommendation;
              
              return (
                <motion.div 
                  key={chapter} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`relative overflow-hidden ${
                    isRecommended ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : ''
                  } ${isUntouched ? 'bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20' : ''}`}>
                    
                    {/* Recommended Badge */}
                    {isRecommended && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-blue-500 text-white text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Pick
                        </Badge>
                      </div>
                    )}

                    {/* TOP ROW */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 pr-4">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 leading-tight">
                          {chapter}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={difficulty === 'Easy' ? 'success' : difficulty === 'Medium' ? 'warning' : 'destructive'}
                            size="sm"
                          >
                            {difficulty}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Chapter {index + 1}
                          </span>
                        </div>
                      </div>
                      
                      {/* PROGRESS RING */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <motion.circle
                            cx="18"
                            cy="18"
                            r="16"
                            stroke={mastery >= 80 ? '#10B981' : mastery >= 60 ? '#F59E0B' : '#6366F1'}
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 16}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
                            animate={{ 
                              strokeDashoffset: 2 * Math.PI * 16 * (1 - mastery / 100)
                            }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isUntouched ? (
                            <Lock className="w-6 h-6 text-gray-400" />
                          ) : (
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {mastery}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* MIDDLE SECTION - Enhanced with Tracker Data */}
                    {!isUntouched ? (
                      <div className="space-y-3 mb-4">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {progress.attempts || 0}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">Attempts</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {progress.bestScore || 0}/30
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">Best Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {progress.avgTime || '--'}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">Avg Time</div>
                          </div>
                        </div>
                        
                        {/* Study Plan Info */}
                        {getChapterWeek(chapter) && (
                          <div className="flex items-center justify-between p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CalendarDays className="w-4 h-4 text-indigo-600" />
                              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                                {getChapterWeek(chapter)} - Study Plan
                              </span>
                            </div>
                            <Badge 
                              variant={getChapterPriority(chapter) === 'high' ? 'destructive' : 
                                     getChapterPriority(chapter) === 'medium' ? 'warning' : 'secondary'}
                              size="sm"
                            >
                              {getChapterPriority(chapter)} priority
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* 4️⃣ ENHANCED EMPTY STATE with Tracker Info */
                      <div className="mb-4 space-y-3">
                        <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-200 dark:border-indigo-800 text-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            This chapter is untouched
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Start now to unlock insights 🔓
                          </p>
                        </div>
                        
                        {/* Study Plan Info for Untouched Chapters */}
                        {getChapterWeek(chapter) && (
                          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <CalendarDays className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                                  Scheduled for {getChapterWeek(chapter)}
                                </span>
                              </div>
                              <Badge 
                                variant={getChapterPriority(chapter) === 'high' ? 'destructive' : 
                                       getChapterPriority(chapter) === 'medium' ? 'warning' : 'secondary'}
                                size="sm"
                              >
                                {getChapterPriority(chapter)} priority
                              </Badge>
                            </div>
                            {getChapterPriority(chapter) === 'high' && (
                              <p className="text-xs text-orange-600 dark:text-orange-400">
                                ⚡ This chapter is due in your study plan!
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* BOTTOM SECTION - PRIMARY ACTIONS */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => handleStartChapter(chapter)}
                        className={`w-full py-3 text-base font-bold ${
                          isUntouched 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                        }`}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        {isUntouched ? 'Start Practice' : 'Continue Practice'}
                      </Button>
                      
                      <Button
                        onClick={() => handleQuickQuiz(chapter)}
                        variant="outline"
                        className="w-full py-2 border-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        ⚡ Quick 5 MCQs
                      </Button>
                    </div>

                    {/* Mastery Achievement Badge */}
                    {mastery >= 90 && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="success" className="bg-green-500 text-white">
                          <Trophy className="w-3 h-3 mr-1" />
                          Mastered
                        </Badge>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Section Summary */}
          <motion.div variants={itemVariants} className="mt-8 mb-6">
            <Card className="p-6 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-200 dark:border-indigo-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                {selectedSection} Progress
              </h3>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600 mb-1">
                    {currentChapters.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Chapters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {currentChapters.filter(chapter => getChapterMastery(chapter) >= 80).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Mastered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {Math.round(
                      currentChapters.reduce((sum, chapter) => sum + getChapterMastery(chapter), 0) / 
                      currentChapters.length
                    ) || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Overall Score</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* 7️⃣ FLOATING ACTION BUTTON - Mobile Only */}
      <motion.div
        className="fixed bottom-20 right-4 z-50 lg:hidden"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
      >
        <Button
          onClick={handleContinuePractice}
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl shadow-purple-500/25"
        >
          <Target className="w-6 h-6" />
        </Button>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">
            {todaysTarget.target - todaysTarget.completed}
          </span>
        </div>
      </motion.div>

      {/* XP Toast Animation */}
      <AnimatePresence>
        {showXPToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span className="font-bold">+10 XP</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectView;