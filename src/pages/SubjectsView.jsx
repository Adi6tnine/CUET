import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SYLLABUS } from '../data/syllabus';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ArrowLeft, Play, BookOpen, Target } from 'lucide-react';

const SubjectsView = ({ predictionMode = false }) => {
  const navigate = useNavigate();
  const { stats } = useApp();

  // Get subject progress
  const getSubjectProgress = (subject) => {
    if (!stats || !stats.subjectMastery) return 0;
    return stats.subjectMastery[subject] || 0;
  };

  // Subject colors
  const getSubjectColor = (subject) => {
    const colors = {
      'Physics': 'from-blue-500 to-indigo-600',
      'Chemistry': 'from-purple-500 to-pink-600',
      'Mathematics': 'from-green-500 to-emerald-600',
      'English': 'from-indigo-500 to-blue-600',
      'General Test': 'from-orange-500 to-red-600'
    };
    return colors[subject] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 pb-24">
      <div className="max-w-4xl mx-auto p-4 pt-8">
        
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
                All Subjects
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Choose a subject to start practicing
              </p>
            </div>
          </div>
        </motion.div>

        {/* Subjects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Object.entries(SYLLABUS).map(([subject, data]) => {
            if (!data || !data.sections) return null;
            
            const subjectProgress = getSubjectProgress(subject);
            const totalChapters = Object.values(data.sections).flat().length;
            
            return (
              <motion.div
                key={subject}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => navigate(`/subject/${encodeURIComponent(subject)}`)}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{data.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {subject}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {totalChapters} chapters available
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {subjectProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 bg-gradient-to-r ${getSubjectColor(subject)} rounded-full transition-all duration-300`}
                        style={{ width: `${subjectProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Mastery Level */}
                  <div className="mb-4">
                    <Badge 
                      variant={
                        subjectProgress >= 80 ? "success" : 
                        subjectProgress >= 60 ? "warning" : 
                        subjectProgress >= 40 ? "secondary" : "default"
                      }
                      className="w-full justify-center"
                    >
                      {subjectProgress >= 80 ? "🏆 Mastered" : 
                       subjectProgress >= 60 ? "🎯 Advanced" : 
                       subjectProgress >= 40 ? "📚 Intermediate" : 
                       subjectProgress > 0 ? "🌱 Beginner" : "🚀 Start Now"}
                    </Badge>
                  </div>

                  {/* Action Button */}
                  <div className={`w-full bg-gradient-to-r ${getSubjectColor(subject)} hover:opacity-90 px-4 py-3 rounded-xl text-white font-medium flex items-center justify-center space-x-2 transition-all`}>
                    <Play className="w-4 h-4" />
                    <span>{subjectProgress > 0 ? 'Continue' : 'Start'}</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Overall Progress</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {Object.keys(SYLLABUS).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {Object.values(SYLLABUS).reduce((total, subject) => 
                    total + Object.values(subject.sections || {}).flat().length, 0
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Chapters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {stats?.totalQuestions || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {stats?.averageAccuracy || 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SubjectsView;