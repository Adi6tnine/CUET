import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SYLLABUS } from '../data/syllabus';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { 
  ArrowLeft, BookOpen, Calendar, Target, TrendingUp, 
  Play, Clock, CheckCircle, Star, Award
} from 'lucide-react';

const PYQModeView = () => {
  const navigate = useNavigate();
  const { stats } = useApp();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // PYQ data structure
  const pyqData = useMemo(() => ({
    '2024': {
      'Physics': { total: 45, completed: 12, accuracy: 78 },
      'Chemistry': { total: 42, completed: 8, accuracy: 65 },
      'Mathematics': { total: 48, completed: 15, accuracy: 82 },
      'English': { total: 35, completed: 20, accuracy: 88 },
      'General Test': { total: 30, completed: 5, accuracy: 60 }
    },
    '2023': {
      'Physics': { total: 43, completed: 25, accuracy: 85 },
      'Chemistry': { total: 40, completed: 18, accuracy: 72 },
      'Mathematics': { total: 46, completed: 30, accuracy: 79 },
      'English': { total: 33, completed: 33, accuracy: 91 },
      'General Test': { total: 28, completed: 15, accuracy: 68 }
    },
    '2022': {
      'Physics': { total: 41, completed: 35, accuracy: 88 },
      'Chemistry': { total: 38, completed: 32, accuracy: 76 },
      'Mathematics': { total: 44, completed: 40, accuracy: 83 },
      'English': { total: 31, completed: 31, accuracy: 94 },
      'General Test': { total: 26, completed: 20, accuracy: 71 }
    }
  }), []);

  const availableYears = Object.keys(pyqData).sort((a, b) => b - a);
  const subjects = ['All', ...Object.keys(SYLLABUS)];

  // Calculate overall PYQ stats
  const overallPYQStats = useMemo(() => {
    let totalQuestions = 0;
    let completedQuestions = 0;
    let totalAccuracy = 0;
    let subjectCount = 0;

    Object.values(pyqData).forEach(yearData => {
      Object.values(yearData).forEach(subjectData => {
        totalQuestions += subjectData.total;
        completedQuestions += subjectData.completed;
        if (subjectData.completed > 0) {
          totalAccuracy += subjectData.accuracy;
          subjectCount++;
        }
      });
    });

    return {
      totalQuestions,
      completedQuestions,
      completionRate: Math.round((completedQuestions / totalQuestions) * 100),
      averageAccuracy: subjectCount > 0 ? Math.round(totalAccuracy / subjectCount) : 0
    };
  }, [pyqData]);

  // Get filtered data based on selection
  const getFilteredData = useMemo(() => {
    const yearData = pyqData[selectedYear];
    if (!yearData) {
      return [];
    }
    
    if (selectedSubject === 'All') {
      return Object.entries(yearData).map(([subject, data]) => ({
        subject,
        ...data,
        icon: SYLLABUS[subject]?.icon || '📚'
      }));
    }
    
    const subjectData = yearData[selectedSubject];
    if (!subjectData) {
      return [];
    }
    
    return [{
      subject: selectedSubject,
      ...subjectData,
      icon: SYLLABUS[selectedSubject]?.icon || '📚'
    }];
  }, [selectedYear, selectedSubject, pyqData]);

  // Get recommended PYQ set
  const getRecommendedPYQ = useMemo(() => {
    // Find subject with lowest PYQ completion rate
    const currentYearData = pyqData[selectedYear];
    if (!currentYearData) {
      return {
        subject: 'Physics',
        year: selectedYear,
        remaining: 0,
        accuracy: 0
      };
    }
    
    const subjects = Object.entries(currentYearData);
    
    if (subjects.length === 0) {
      return {
        subject: 'Physics',
        year: selectedYear,
        remaining: 0,
        accuracy: 0
      };
    }
    
    const lowestCompletion = subjects.reduce((lowest, [subject, data]) => {
      if (!lowest) {
        return { subject, data };
      }
      
      const completionRate = (data.completed / data.total) * 100;
      const lowestRate = (lowest.data.completed / lowest.data.total) * 100;
      return completionRate < lowestRate ? { subject, data } : lowest;
    }, null);

    if (!lowestCompletion) {
      return {
        subject: 'Physics',
        year: selectedYear,
        remaining: 0,
        accuracy: 0
      };
    }

    return {
      subject: lowestCompletion.subject,
      year: selectedYear,
      remaining: lowestCompletion.data.total - lowestCompletion.data.completed,
      accuracy: lowestCompletion.data.accuracy
    };
  }, [selectedYear, pyqData]);

  const handleStartPYQ = useCallback((subject, year) => {
    navigate(`/pyq-quiz/${year}/${encodeURIComponent(subject)}`);
  }, [navigate]);

  const handleStartRecommended = useCallback(() => {
    const recommended = getRecommendedPYQ;
    handleStartPYQ(recommended.subject, recommended.year);
  }, [getRecommendedPYQ, handleStartPYQ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Previous Year Questions
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              CUET 2022-2024 PYQs
            </p>
          </div>
        </div>

        {/* Overall PYQ Progress */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Your PYQ Progress
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {overallPYQStats.completedQuestions}
              </div>
              <div className="text-xs text-gray-500">Solved</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {overallPYQStats.completionRate}%
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {overallPYQStats.averageAccuracy}%
              </div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
          </div>
        </Card>

        {/* Recommended PYQ - Primary CTA */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Recommended Practice
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {getRecommendedPYQ.subject} • CUET {getRecommendedPYQ.year}
          </h3>
          
          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{getRecommendedPYQ.remaining} questions left</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{getRecommendedPYQ.accuracy}% accuracy</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Focus on your weakest area for maximum improvement
          </p>
          
          <Button 
            onClick={handleStartRecommended}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start PYQ Practice
          </Button>
        </Card>

        {/* Year and Subject Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Year
              </label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>CUET {year}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Subject
              </label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* PYQ Subject Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">
            CUET {selectedYear} {selectedSubject === 'All' ? 'All Subjects' : selectedSubject}
          </h3>
          
          {getFilteredData.map((subjectData) => {
            const completionRate = Math.round((subjectData.completed / subjectData.total) * 100);
            const isCompleted = completionRate === 100;
            
            return (
              <Card 
                key={subjectData.subject} 
                className={`p-4 ${isCompleted ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{subjectData.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {subjectData.subject}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{subjectData.completed}/{subjectData.total} questions</span>
                        <Badge 
                          variant={subjectData.accuracy >= 80 ? 'success' : subjectData.accuracy >= 60 ? 'warning' : 'secondary'}
                          size="sm"
                        >
                          {subjectData.accuracy}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {completionRate}% complete
                  </span>
                  
                  <Button 
                    onClick={() => handleStartPYQ(subjectData.subject, selectedYear)}
                    variant={isCompleted ? "outline" : "default"}
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isCompleted ? 'Practice Again' : 'Continue'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* PYQ Benefits */}
        <Card className="p-4 mt-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-start space-x-3">
            <Award className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm mb-1">
                Why Practice PYQs?
              </h4>
              <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                <li>• Understand actual CUET exam patterns</li>
                <li>• Build confidence with real questions</li>
                <li>• Identify frequently asked topics</li>
                <li>• Practice time management</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default PYQModeView;