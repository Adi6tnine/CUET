import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SYLLABUS } from '../data/syllabus';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { 
  Play, Clock, Target, TrendingUp, RotateCcw, BookOpen, 
  CheckCircle, ArrowRight, Flame, Zap, Calendar, Award, Brain, BarChart3
} from 'lucide-react';

const UpgradedDashboard = ({ predictionMode = false }) => {
  const navigate = useNavigate();
  const { profile, stats, quizHistory } = useApp();

  // SOLO MODE - No user state restrictions
  const SOLO_MODE = true;
  const currentStreak = profile?.streak || 0;

  // Helper functions defined first
  const getWeakestSubject = useCallback(() => {
    if (!stats?.subjectMastery) return 'Physics';
    const subjects = Object.keys(stats.subjectMastery);
    if (subjects.length === 0) return 'Physics';
    return subjects.reduce((weakest, subject) => 
      (stats.subjectMastery[subject] || 0) < (stats.subjectMastery[weakest] || 0) ? subject : weakest
    );
  }, [stats?.subjectMastery]);

  const getWeakestChapter = useCallback((subject) => {
    // Simple chapter rotation based on common weak areas
    const weakChapters = {
      'Physics': ['Electrostatics', 'Current Electricity', 'Magnetism', 'Electromagnetic Induction'],
      'Chemistry': ['Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Electrochemistry'],
      'Mathematics': ['Limits and Derivatives', 'Integrals', 'Differential Equations', 'Probability'],
      'English': ['Reading Comprehension (Factual Passages)', 'Verbal Ability', 'Vocabulary', 'Synonyms and Antonyms'],
      'General Test': ['General Knowledge', 'Current Affairs (National)', 'Logical and Analytical Reasoning', 'Numerical Ability']
    };
    
    const chapters = weakChapters[subject] || ['Basic Concepts'];
    const dayIndex = new Date().getDate() % chapters.length;
    return chapters[dayIndex];
  }, []);

  // 1️⃣ DAILY COMMAND SYSTEM - PRIMARY GUIDANCE (NOT EXCLUSIVE)
  const getDailyTask = useMemo(() => {
    const today = new Date().toDateString();
    const todayQuizzes = (quizHistory || []).filter(
      quiz => quiz.date && new Date(quiz.date).toDateString() === today
    );

    // If user already completed today's task
    if (todayQuizzes.length > 0) {
      return {
        completed: true,
        subject: todayQuizzes[0].subject,
        chapter: todayQuizzes[0].chapter,
        score: todayQuizzes[0].accuracy
      };
    }

    // Smart task selection based on AI analysis and weak areas
    let selectedSubject = 'Physics';
    let selectedChapter = 'Motion in a Straight Line';
    let estimatedTime = 20;
    let questionCount = 15;

    // AI-powered selection for power users
    const weakestSubject = getWeakestSubject();
    const weakestChapter = getWeakestChapter(weakestSubject);
    
    selectedSubject = weakestSubject;
    selectedChapter = weakestChapter;
    questionCount = 20;
    estimatedTime = 25;

    return {
      completed: false,
      subject: selectedSubject,
      chapter: selectedChapter,
      questionCount,
      estimatedTime,
      type: 'AI-Recommended Focus'
    };
  }, [quizHistory, stats, getWeakestSubject, getWeakestChapter]);

  // 4️⃣ REVISION ENGINE - ALWAYS AVAILABLE
  const getRevisionData = useMemo(() => {
    // Get wrong questions from recent quizzes
    const recentQuizzes = (quizHistory || []).slice(0, 10);
    const wrongQuestions = recentQuizzes.reduce((total, quiz) => {
      return total + (quiz.totalQuestions - quiz.correctAnswers);
    }, 0);

    if (wrongQuestions === 0) return null;

    const revisionCount = Math.min(wrongQuestions, 10);
    const estimatedTime = Math.ceil(revisionCount * 1.5);

    return {
      count: revisionCount,
      estimatedTime,
      subjects: [...new Set(recentQuizzes.map(q => q.subject))].slice(0, 3)
    };
  }, [quizHistory]);

  // 5️⃣ RANK CONTEXT - ALWAYS AVAILABLE (SOFT LANGUAGE)
  const getRankContext = useMemo(() => {
    const totalQuestions = stats?.totalQuestions || 0;
    const accuracy = stats?.totalQuestions > 0 ? 
      Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;

    if (totalQuestions === 0) return { level: 'Ready to Start', color: 'blue', message: 'Begin your CUET preparation journey' };
    if (totalQuestions < 50) return { level: 'Building Foundation', color: 'blue', message: 'Keep practicing consistently' };
    if (accuracy >= 80) return { level: 'Exam Ready', color: 'green', message: 'You\'re performing excellently' };
    if (accuracy >= 65) return { level: 'Above Average', color: 'emerald', message: 'Good progress, keep it up' };
    if (accuracy >= 50) return { level: 'On Track', color: 'yellow', message: 'Steady improvement needed' };
    return { level: 'Needs Focus', color: 'orange', message: 'Focus on understanding concepts' };
  }, [stats]);

  const handleStartDailyTask = useCallback(() => {
    const task = getDailyTask;
    if (!task.completed) {
      const params = new URLSearchParams({
        daily: 'true',
        mode: 'mixed',
        difficulty: 'adaptive'
      });
      navigate(`/quiz/${encodeURIComponent(task.subject)}/${encodeURIComponent(task.chapter)}?${params}`);
    }
  }, [getDailyTask, navigate]);

  const handleStartRevision = useCallback(() => {
    navigate('/revision-mode');
  }, [navigate]);

  const handleMockTest = useCallback(() => {
    navigate('/mock-test');
  }, [navigate]);

  const handlePYQMode = useCallback(() => {
    navigate('/pyq-mode');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Header - Power User Mode */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            CUET Command Center
          </h1>
          {currentStreak > 0 && (
            <div className="flex items-center justify-center mt-2 text-orange-600">
              <Flame className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{currentStreak} day streak</span>
            </div>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Follow Daily Command for guided study, or choose a chapter manually
          </p>
        </div>

        {/* 1️⃣ DAILY COMMAND SYSTEM - PRIMARY CTA */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          {getDailyTask.completed ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Today's Task Complete!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {getDailyTask.subject} • {getDailyTask.score}% accuracy
              </p>
              <Badge variant="success" size="sm">Streak maintained</Badge>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {getDailyTask.type}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{getDailyTask.estimatedTime} min</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {getDailyTask.subject} → {getDailyTask.chapter}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {getDailyTask.questionCount} questions • {getDailyTask.estimatedTime} minutes
              </p>
              
              <Button 
                onClick={handleStartDailyTask}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Now
              </Button>
            </div>
          )}
        </Card>

        {/* CHAPTER-WISE PRACTICE ENTRY POINT - ALWAYS VISIBLE */}
        <div className="mb-6">
          <Card className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate('/practice-by-chapter')}
              className="w-full flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all p-2 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    📚 Practice by Chapter
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Topic-wise focused practice
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
          </Card>
        </div>

        {/* 4️⃣ REVISION ENGINE - SECONDARY CTA */}
        {getRevisionData && (
          <Card className="p-4 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Revise Today</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {getRevisionData.count} weak questions • {getRevisionData.estimatedTime} min
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleStartRevision}
                variant="outline" 
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Start
              </Button>
            </div>
          </Card>
        )}

        {/* 5️⃣ RANK CONTEXT - ALWAYS VISIBLE */}
        <Card className="p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full bg-${getRankContext.color}-500`}></div>
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {getRankContext.level}
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {getRankContext.message}
              </p>
            </div>
          </div>
        </Card>

        {/* PRACTICE MODES - ALL VISIBLE */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">
            Practice Modes
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* 2️⃣ MOCK TEST MODE */}
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate('/mock-test')}
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">🧪 Mock Tests</h4>
                <p className="text-xs text-gray-500 mt-1">Full CUET simulation</p>
              </div>
            </Card>

            {/* 3️⃣ PYQ MODE */}
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate('/pyq-mode')}
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">📚 PYQs</h4>
                <p className="text-xs text-gray-500 mt-1">Previous year questions</p>
              </div>
            </Card>

            {/* ANALYTICS */}
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate('/analytics')}
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">📊 Analytics</h4>
                <p className="text-xs text-gray-500 mt-1">Progress insights</p>
              </div>
            </Card>

            {/* QUICK PRACTICE */}
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate('/quick-quiz')}
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">⚡ Quick Quiz</h4>
                <p className="text-xs text-gray-500 mt-1">Instant practice</p>
              </div>
            </Card>
          </div>
        </div>

        {/* SUBJECTS - ALWAYS VISIBLE */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">
            Quick Access
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(SYLLABUS).map(([subject, data]) => {
              const progress = stats?.subjectMastery?.[subject] || 0;
              return (
                <Card 
                  key={subject}
                  className="p-3 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => navigate(`/subject/${encodeURIComponent(subject)}`)}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{data.icon}</div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-xs">
                      {subject}
                    </h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                      <div 
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
            
            {/* If odd number of subjects, add a placeholder for better layout */}
            {Object.keys(SYLLABUS).length % 2 === 1 && (
              <div className="opacity-0 pointer-events-none">
                <Card className="p-3">
                  <div className="text-center">
                    <div className="text-lg mb-1">📚</div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-xs">
                      Placeholder
                    </h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* STATS - ALWAYS VISIBLE */}
        {stats?.totalQuestions > 0 && (
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.totalQuestions}
                </div>
                <div className="text-xs text-gray-500">Questions</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {Math.round((stats.correctAnswers / stats.totalQuestions) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {profile?.xp || 0}
                </div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default UpgradedDashboard;