import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, BookOpen, Target, AlertTriangle } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { adaptiveLearningService } from '../utils/AdaptiveLearningService';

const AdaptiveLearningInsights = ({ onPracticeWeakTopic, onReviewMistakes }) => {
  const performance = adaptiveLearningService.getPerformanceSummary();
  const weakTopics = adaptiveLearningService.getWeakTopics(3);
  const recommendations = performance.recommendations;

  if (performance.totalTopics === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Start Your Learning Journey
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Take your first quiz to get personalized insights and recommendations.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Learning Analytics
          </h3>
          <Badge variant={performance.overallAccuracy >= 80 ? 'success' : performance.overallAccuracy >= 60 ? 'warning' : 'danger'}>
            {performance.overallAccuracy}% Overall
          </Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {performance.totalTopics}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Topics Practiced</div>
          </div>

          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {performance.weakTopicsCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Need Practice</div>
          </div>

          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {performance.totalIncorrectQuestions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">To Review</div>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {performance.overallAccuracy}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
          </div>
        </div>
      </Card>

      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingDown className="w-5 h-5 text-orange-500 mr-2" />
              Topics Needing Practice
            </h3>
          </div>

          <div className="space-y-3">
            {weakTopics.map((topic, index) => (
              <motion.div
                key={topic.topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {topic.topic.replace('-', ' → ')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {topic.totalAttempts} attempts • Last practiced {new Date(topic.lastAttempt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={topic.accuracy < 50 ? 'danger' : 'warning'}>
                    {topic.accuracy}%
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => onPracticeWeakTopic && onPracticeWeakTopic(topic.topic)}
                    className="flex items-center space-x-1"
                  >
                    <Target className="w-4 h-4" />
                    <span>Practice</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              Personalized Recommendations
            </h3>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  {rec.type === 'weak_topics' && <AlertTriangle className="w-4 h-4 text-white" />}
                  {rec.type === 'review' && <BookOpen className="w-4 h-4 text-white" />}
                  {rec.type === 'continue' && <TrendingUp className="w-4 h-4 text-white" />}
                </div>
                
                <div className="flex-1">
                  <p className="text-blue-900 dark:text-blue-100 font-medium">
                    {rec.message}
                  </p>
                  
                  <div className="mt-2">
                    {rec.action === 'practice_weak_topics' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPracticeWeakTopic && onPracticeWeakTopic(weakTopics[0]?.topic)}
                      >
                        Start Practice
                      </Button>
                    )}
                    
                    {rec.action === 'review_mistakes' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReviewMistakes && onReviewMistakes()}
                      >
                        Review Mistakes
                      </Button>
                    )}
                    
                    {rec.action === 'explore_new_topics' && (
                      <Button size="sm" variant="outline">
                        Explore Topics
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdaptiveLearningInsights;