import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SYLLABUS } from '../data/syllabus';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ArrowLeft, Play, Zap, Brain, Target, Clock, Shuffle } from 'lucide-react';

const QuickQuizView = ({ predictionMode = false }) => {
  const navigate = useNavigate();
  const { stats } = useApp();
  const [selectedMode, setSelectedMode] = useState('adaptive');
  const [isStarting, setIsStarting] = useState(false);

  const quizModes = [
    {
      id: 'adaptive',
      title: '🧠 Smart Quiz',
      description: 'AI picks questions based on your weak areas',
      color: 'from-purple-500 to-pink-600',
      recommended: true
    },
    {
      id: 'random',
      title: '🎲 Random Mix',
      description: 'Mixed questions from all subjects',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'timed',
      title: '⏱️ Speed Challenge',
      description: '30 seconds per question - test your speed',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'weak-topics',
      title: '🎯 Weak Topics',
      description: 'Focus on your challenging areas',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const getRecommendedQuiz = () => {
    if (!stats || !stats.subjectMastery) {
      return {
        subject: 'Physics',
        chapter: 'Electric Charges and Fields',
        reason: 'Great starting point for CUET prep'
      };
    }

    // Find subject with lowest mastery
    const subjects = Object.entries(stats.subjectMastery);
    if (subjects.length === 0) {
      return {
        subject: 'Mathematics',
        chapter: 'Relations and Functions',
        reason: 'Build strong foundation'
      };
    }

    const lowestSubject = subjects.reduce((min, current) => 
      current[1] < min[1] ? current : min
    );

    const subjectData = SYLLABUS[lowestSubject[0]];
    const firstChapter = subjectData ? Object.values(subjectData.sections)[0]?.[0] : 'General';

    return {
      subject: lowestSubject[0],
      chapter: firstChapter,
      reason: `Your weakest subject (${Math.round(lowestSubject[1])}% mastery)`
    };
  };

  const startQuiz = async (mode) => {
    setIsStarting(true);
    
    const recommendation = getRecommendedQuiz();
    
    // Add slight delay for better UX
    setTimeout(() => {
      if (mode === 'random') {
        // Random subject and chapter
        const subjects = Object.keys(SYLLABUS);
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        const chapters = Object.values(SYLLABUS[randomSubject].sections).flat();
        const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
        navigate(`/quiz/${encodeURIComponent(randomSubject)}/${encodeURIComponent(randomChapter)}`);
      } else {
        // Use AI recommendation
        navigate(`/quiz/${encodeURIComponent(recommendation.subject)}/${encodeURIComponent(recommendation.chapter)}`);
      }
    }, 500);
  };

  const recommendation = getRecommendedQuiz();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 pb-24">
      <div className="max-w-2xl mx-auto p-4 pt-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Quick Quiz
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Jump straight into practice
              </p>
            </div>
          </div>
        </motion.div>

        {/* AI Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">🤖 AI Recommends</h3>
                  <Badge variant="secondary" className="text-xs">Smart Pick</Badge>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {recommendation.subject} - {recommendation.chapter}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {recommendation.reason}
                </p>
                <Button
                  onClick={() => startQuiz('adaptive')}
                  disabled={isStarting}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isStarting ? 'Starting...' : 'Start Smart Quiz'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quiz Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Quiz Mode
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizModes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => setSelectedMode(mode.id)}
              >
                <Card className={`p-4 transition-all duration-200 ${
                  selectedMode === mode.id 
                    ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'hover:shadow-lg'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${mode.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {mode.id === 'adaptive' && <Brain className="w-5 h-5 text-white" />}
                      {mode.id === 'random' && <Shuffle className="w-5 h-5 text-white" />}
                      {mode.id === 'timed' && <Clock className="w-5 h-5 text-white" />}
                      {mode.id === 'weak-topics' && <Target className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {mode.title}
                        </h3>
                        {mode.recommended && (
                          <Badge variant="success" className="text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {mode.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={() => startQuiz(selectedMode)}
            disabled={isStarting}
            size="lg"
            className={`w-full bg-gradient-to-r ${
              quizModes.find(m => m.id === selectedMode)?.color || 'from-purple-500 to-pink-600'
            } hover:opacity-90 text-lg font-bold py-4`}
          >
            <Zap className="w-6 h-6 mr-3" />
            {isStarting ? 'Starting Quiz...' : `Start ${quizModes.find(m => m.id === selectedMode)?.title || 'Quiz'}`}
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {stats?.totalQuestions || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Questions Done</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {stats?.averageAccuracy || 0}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Accuracy</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {stats?.streak || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Day Streak</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default QuickQuizView;