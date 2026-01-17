import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, BookOpen, RotateCcw, Home, TrendingUp, Award, Share2, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const ResultView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateProfile, checkAchievements } = useApp();
  
  const quizResult = location.state?.quizResult;

  if (!quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <Card className="text-center p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No quiz results found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            It looks like you haven't completed a quiz yet.
          </p>
          <Button onClick={() => navigate('/')} size="lg">
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const {
    subject,
    chapter,
    score,
    totalQuestions,
    correctAnswers,
    accuracy,
    timeTaken,
    timeLeft,
    mistakes,
    earnedXP
  } = quizResult;

  // Update XP and check achievements
  useEffect(() => {
    updateProfile({ xp: (prev) => (prev || 0) + earnedXP });
    checkAchievements(quizResult);
  }, []);

  const getPerformanceEmoji = () => {
    if (accuracy >= 90) return '🏆';
    if (accuracy >= 80) return '🎉';
    if (accuracy >= 70) return '👍';
    if (accuracy >= 60) return '😐';
    return '😞';
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return 'Outstanding Performance!';
    if (accuracy >= 80) return 'Excellent Work!';
    if (accuracy >= 70) return 'Good Job!';
    if (accuracy >= 60) return 'Keep Practicing!';
    return 'Need More Practice';
  };

  const getGradeColor = () => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-blue-600';
    if (accuracy >= 70) return 'text-yellow-600';
    if (accuracy >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceLevel = () => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'bg-green-500', description: 'You\'re ready for the exam!' };
    if (accuracy >= 80) return { level: 'Very Good', color: 'bg-blue-500', description: 'Great understanding of concepts' };
    if (accuracy >= 70) return { level: 'Good', color: 'bg-yellow-500', description: 'Solid foundation, keep improving' };
    if (accuracy >= 60) return { level: 'Average', color: 'bg-orange-500', description: 'Focus on weak areas' };
    return { level: 'Needs Work', color: 'bg-red-500', description: 'More practice required' };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const shareResults = () => {
    const shareText = `🎯 Just completed a CUET quiz!\n📚 ${subject} - ${chapter}\n🏆 Score: ${accuracy}% (${correctAnswers}/${totalQuestions})\n⚡ Earned ${earnedXP} XP\n\n#CUET2026 #StudyHard`;
    
    if (navigator.share) {
      navigator.share({
        title: 'AVION Quiz Results',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };

  const downloadResults = () => {
    const resultsData = {
      subject,
      chapter,
      score,
      accuracy,
      correctAnswers,
      totalQuestions,
      timeTaken: formatTime(timeTaken),
      earnedXP,
      mistakes: mistakes.length,
      date: new Date().toLocaleDateString()
    };
    
    const dataStr = JSON.stringify(resultsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `avion-quiz-results-${subject}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const performanceLevel = getPerformanceLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 pb-20">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Result Header - Enhanced */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="text-8xl lg:text-9xl mb-6">
            {getPerformanceEmoji()}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Complete!
          </h1>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              {subject} - {chapter}
            </h2>
            <div className={`text-2xl lg:text-3xl font-bold ${getGradeColor()} mb-2`}>
              {getPerformanceMessage()}
            </div>
            <Badge 
              variant={accuracy >= 80 ? 'success' : accuracy >= 60 ? 'warning' : 'error'} 
              size="lg"
              className="text-lg px-6 py-2"
            >
              {performanceLevel.level}
            </Badge>
          </div>
        </motion.div>

        {/* Main Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Score Overview */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 lg:p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">
                      {score}
                    </div>
                    <div className="text-sm lg:text-base text-indigo-500">Total Score</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                      {accuracy}%
                    </div>
                    <div className="text-sm lg:text-base text-green-500">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">
                      {correctAnswers}
                    </div>
                    <div className="text-sm lg:text-base text-purple-500">Correct</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                      +{earnedXP}
                    </div>
                    <div className="text-sm lg:text-base text-orange-500">XP Earned</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm lg:text-base">
                    <span className="text-gray-600 dark:text-gray-300">Performance Level</span>
                    <span className="text-gray-600 dark:text-gray-300">{accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <motion.div
                      className={`h-4 rounded-full ${performanceLevel.color}`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${accuracy}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 text-center">
                    {performanceLevel.description}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Performance Breakdown */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3" />
                  Performance Breakdown
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  <div className="p-4 lg:p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3 mb-3">
                      <Trophy className="w-6 h-6 text-green-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">Correct Answers</span>
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">{correctAnswers}</div>
                    <div className="text-sm text-green-500">out of {totalQuestions}</div>
                  </div>
                  
                  <div className="p-4 lg:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="w-6 h-6 text-blue-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">Time Taken</span>
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">{formatTime(timeTaken)}</div>
                    <div className="text-sm text-blue-500">of 45 minutes</div>
                  </div>
                  
                  <div className="p-4 lg:p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center space-x-3 mb-3">
                      <Target className="w-6 h-6 text-purple-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">Questions Attempted</span>
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">
                      {totalQuestions - mistakes.filter(m => m.userAnswer === 'Not answered').length}
                    </div>
                    <div className="text-sm text-purple-500">out of {totalQuestions}</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Mistakes Analysis - Enhanced */}
            {mistakes.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-between">
                    <span className="flex items-center">
                      <BookOpen className="w-6 h-6 mr-3" />
                      Review Mistakes ({mistakes.length})
                    </span>
                    <Badge variant="error" size="sm">
                      {Math.round((mistakes.length / totalQuestions) * 100)}% incorrect
                    </Badge>
                  </h3>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {mistakes.slice(0, 8).map((mistake, index) => (
                      <motion.div 
                        key={index} 
                        className="p-4 lg:p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border-l-4 border-red-500"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <p className="font-medium text-gray-900 dark:text-white mb-3 text-sm lg:text-base leading-relaxed">
                          <span className="text-red-600 font-bold">Q{index + 1}:</span> {mistake.question}
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm lg:text-base">
                          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <p className="text-red-700 dark:text-red-300">
                              <span className="font-semibold">Your answer:</span><br />
                              {mistake.userAnswer}
                            </p>
                          </div>
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <p className="text-green-700 dark:text-green-300">
                              <span className="font-semibold">Correct answer:</span><br />
                              {mistake.correctAnswer}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300 text-sm lg:text-base">
                            <span className="font-semibold">Explanation:</span><br />
                            {mistake.explanation}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {mistakes.length > 8 && (
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-300">
                          +{mistakes.length - 8} more mistakes to review
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column - Actions & Achievements */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Quick Actions
                </h3>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate(`/quiz/${encodeURIComponent(subject)}/${encodeURIComponent(chapter)}`)}
                    size="lg"
                    className="w-full flex items-center justify-center"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Retry Quiz
                  </Button>
                  
                  <Button
                    onClick={() => navigate(`/subject/${encodeURIComponent(subject)}`)}
                    variant="secondary"
                    size="lg"
                    className="w-full flex items-center justify-center"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    More Chapters
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={shareResults}
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-center"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    <Button
                      onClick={downloadResults}
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => navigate('/')}
                    variant="ghost"
                    size="lg"
                    className="w-full flex items-center justify-center"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Dashboard
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="text-center">
                  <div className="text-4xl mb-3">
                    {accuracy >= 90 ? '🏆' : accuracy >= 80 ? '🥇' : accuracy >= 70 ? '🥈' : accuracy >= 60 ? '🥉' : '📚'}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {accuracy >= 90 ? 'Champion!' : 
                     accuracy >= 80 ? 'Excellent!' : 
                     accuracy >= 70 ? 'Well Done!' : 
                     accuracy >= 60 ? 'Good Effort!' : 'Keep Learning!'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    You've earned <strong>{earnedXP} XP</strong> for completing this quiz
                  </p>
                  <Badge variant="warning" size="lg">
                    +{earnedXP} XP
                  </Badge>
                </div>
              </Card>
            </motion.div>

            {/* Study Tip */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  💡 Study Tip
                </h3>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 italic leading-relaxed">
                  {accuracy >= 80 
                    ? "Excellent work! Try tackling more challenging topics or help others with their studies." 
                    : mistakes.length > 0
                    ? "Focus on reviewing the concepts from your incorrect answers. Understanding your mistakes is key to improvement."
                    : "Great job completing the quiz! Regular practice will help you improve your accuracy and speed."
                  }
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultView;