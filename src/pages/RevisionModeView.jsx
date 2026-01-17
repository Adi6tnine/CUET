import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { 
  ArrowLeft, RotateCcw, Target, Clock, BookOpen, 
  TrendingDown, AlertTriangle, CheckCircle, Play, Brain
} from 'lucide-react';

const RevisionModeView = () => {
  const navigate = useNavigate();
  const { stats, quizHistory } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('wrong-answers');

  // Calculate revision data
  const revisionData = useMemo(() => {
    const recentQuizzes = (quizHistory || []).slice(0, 20);
    
    // Wrong answers from recent quizzes
    const wrongAnswers = [];
    const weakChapters = {};
    const subjectWeakness = {};
    
    recentQuizzes.forEach(quiz => {
      const wrongCount = quiz.totalQuestions - quiz.correctAnswers;
      if (wrongCount > 0) {
        wrongAnswers.push({
          subject: quiz.subject,
          chapter: quiz.chapter,
          wrongCount,
          totalQuestions: quiz.totalQuestions,
          accuracy: quiz.accuracy,
          date: quiz.date
        });
        
        // Track weak chapters
        const chapterKey = `${quiz.subject}-${quiz.chapter}`;
        if (!weakChapters[chapterKey]) {
          weakChapters[chapterKey] = {
            subject: quiz.subject,
            chapter: quiz.chapter,
            attempts: 0,
            totalWrong: 0,
            averageAccuracy: 0
          };
        }
        
        weakChapters[chapterKey].attempts++;
        weakChapters[chapterKey].totalWrong += wrongCount;
        weakChapters[chapterKey].averageAccuracy = 
          ((weakChapters[chapterKey].averageAccuracy * (weakChapters[chapterKey].attempts - 1)) + quiz.accuracy) / 
          weakChapters[chapterKey].attempts;
        
        // Track subject weakness
        if (!subjectWeakness[quiz.subject]) {
          subjectWeakness[quiz.subject] = {
            subject: quiz.subject,
            totalWrong: 0,
            totalQuestions: 0,
            quizCount: 0
          };
        }
        
        subjectWeakness[quiz.subject].totalWrong += wrongCount;
        subjectWeakness[quiz.subject].totalQuestions += quiz.totalQuestions;
        subjectWeakness[quiz.subject].quizCount++;
      }
    });
    
    // Convert to arrays and sort
    const sortedWeakChapters = Object.values(weakChapters)
      .filter(chapter => chapter.averageAccuracy < 70)
      .sort((a, b) => a.averageAccuracy - b.averageAccuracy)
      .slice(0, 10);
    
    const sortedSubjectWeakness = Object.values(subjectWeakness)
      .map(subject => ({
        ...subject,
        accuracy: Math.round((subject.totalQuestions - subject.totalWrong) / subject.totalQuestions * 100)
      }))
      .filter(subject => subject.accuracy < 75)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);
    
    return {
      wrongAnswers: wrongAnswers.slice(0, 15),
      weakChapters: sortedWeakChapters,
      weakSubjects: sortedSubjectWeakness,
      totalWrongQuestions: wrongAnswers.reduce((sum, item) => sum + item.wrongCount, 0)
    };
  }, [quizHistory]);

  const revisionCategories = [
    {
      id: 'wrong-answers',
      title: 'Wrong Answers',
      description: 'Questions you got wrong recently',
      count: revisionData.wrongAnswers.length,
      estimatedTime: Math.ceil(revisionData.totalWrongQuestions * 1.5),
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 'weak-chapters',
      title: 'Weak Chapters',
      description: 'Chapters with low accuracy',
      count: revisionData.weakChapters.length,
      estimatedTime: revisionData.weakChapters.length * 8,
      icon: TrendingDown,
      color: 'orange'
    },
    {
      id: 'weak-subjects',
      title: 'Weak Subjects',
      description: 'Subjects needing more practice',
      count: revisionData.weakSubjects.length,
      estimatedTime: revisionData.weakSubjects.length * 12,
      icon: BookOpen,
      color: 'yellow'
    }
  ];

  const getSelectedCategoryData = useMemo(() => {
    switch (selectedCategory) {
      case 'wrong-answers':
        return revisionData.wrongAnswers;
      case 'weak-chapters':
        return revisionData.weakChapters;
      case 'weak-subjects':
        return revisionData.weakSubjects;
      default:
        return [];
    }
  }, [selectedCategory, revisionData]);

  const getRecommendedRevision = useMemo(() => {
    if (revisionData.wrongAnswers.length > 0) {
      return {
        type: 'wrong-answers',
        title: 'Recent Wrong Answers',
        count: Math.min(revisionData.totalWrongQuestions, 15),
        estimatedTime: Math.ceil(Math.min(revisionData.totalWrongQuestions, 15) * 1.5),
        description: 'Focus on questions you got wrong in recent quizzes'
      };
    }
    
    if (revisionData.weakChapters.length > 0) {
      const weakestChapter = revisionData.weakChapters[0];
      return {
        type: 'weak-chapters',
        title: `${weakestChapter.subject} - ${weakestChapter.chapter}`,
        count: 10,
        estimatedTime: 12,
        description: `${Math.round(weakestChapter.averageAccuracy)}% accuracy - needs improvement`
      };
    }
    
    return null;
  }, [revisionData]);

  const handleStartRevision = useCallback((type, item = null) => {
    if (type === 'recommended') {
      const recommended = getRecommendedRevision;
      navigate(`/revision-quiz/${recommended.type}`, { 
        state: { revisionData: recommended } 
      });
    } else if (type === 'category') {
      navigate(`/revision-quiz/${selectedCategory}`, { 
        state: { revisionData: getSelectedCategoryData } 
      });
    } else if (type === 'specific' && item) {
      navigate(`/revision-quiz/specific`, { 
        state: { revisionData: item } 
      });
    }
  }, [getRecommendedRevision, selectedCategory, getSelectedCategoryData, navigate]);

  // If no revision data available
  if (revisionData.totalWrongQuestions === 0 && revisionData.weakChapters.length === 0) {
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
                Revision Mode
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Smart revision system
              </p>
            </div>
          </div>

          {/* No revision needed */}
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Great Job!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You don't have any weak areas to revise right now. Keep practicing to maintain your performance.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue Learning
            </Button>
          </Card>

        </div>
      </div>
    );
  }

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
              Revision Mode
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Focus on your weak areas
            </p>
          </div>
        </div>

        {/* Recommended Revision - Primary CTA */}
        {getRecommendedRevision && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Recommended Revision
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {getRecommendedRevision.title}
            </h3>
            
            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{getRecommendedRevision.count} questions</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{getRecommendedRevision.estimatedTime} min</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {getRecommendedRevision.description}
            </p>
            
            <Button 
              onClick={() => handleStartRevision('recommended')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Start Revision
            </Button>
          </Card>
        )}

        {/* Revision Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 px-1">
            Revision Categories
          </h3>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {revisionCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-lg text-center transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <category.icon className={`w-5 h-5 mx-auto mb-1 ${
                  selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <div className={`text-xs font-medium ${
                  selectedCategory === category.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {category.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {category.count} items
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Content */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {revisionCategories.find(c => c.id === selectedCategory)?.title}
            </h3>
            {getSelectedCategoryData.length > 0 && (
              <Button 
                onClick={() => handleStartRevision('category')}
                variant="outline"
                size="sm"
              >
                <Play className="w-4 h-4 mr-1" />
                Start All
              </Button>
            )}
          </div>
          
          {getSelectedCategoryData.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No items in this category. Great job!
              </p>
            </Card>
          ) : (
            getSelectedCategoryData.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {selectedCategory === 'wrong-answers' && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.subject} - {item.chapter}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                          <span>{item.wrongCount} wrong answers</span>
                          <Badge 
                            variant={item.accuracy >= 60 ? 'warning' : 'destructive'}
                            size="sm"
                          >
                            {item.accuracy}%
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {selectedCategory === 'weak-chapters' && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.subject} - {item.chapter}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                          <span>{item.attempts} attempts</span>
                          <Badge 
                            variant={item.averageAccuracy >= 60 ? 'warning' : 'destructive'}
                            size="sm"
                          >
                            {Math.round(item.averageAccuracy)}% avg
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {selectedCategory === 'weak-subjects' && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.subject}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                          <span>{item.quizCount} quizzes</span>
                          <Badge 
                            variant={item.accuracy >= 60 ? 'warning' : 'destructive'}
                            size="sm"
                          >
                            {item.accuracy}%
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => handleStartRevision('specific', item)}
                    variant="outline"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Revise
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Revision Tips */}
        <Card className="p-4 mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-1">
                Revision Tips
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Focus on understanding, not memorizing</li>
                <li>• Take short breaks between topics</li>
                <li>• Review explanations carefully</li>
                <li>• Practice similar questions after revision</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default RevisionModeView;