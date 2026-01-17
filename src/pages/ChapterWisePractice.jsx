import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SYLLABUS } from '../data/syllabus';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { 
  ArrowLeft, BookOpen, Play, Target, TrendingDown, 
  CheckCircle, Clock, Zap, Star, AlertTriangle, Brain
} from 'lucide-react';

const ChapterWisePractice = () => {
  const navigate = useNavigate();
  const { stats, quizHistory, profile } = useApp();
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [showPYQOnly, setShowPYQOnly] = useState(false);

  // AI-powered chapter analysis using existing data
  const getChapterIntelligence = useMemo(() => {
    const recentQuizzes = (quizHistory || []).slice(0, 20);
    const chapterStats = {};

    // Analyze past performance per chapter
    recentQuizzes.forEach(quiz => {
      const key = `${quiz.subject}-${quiz.chapter}`;
      if (!chapterStats[key]) {
        chapterStats[key] = {
          subject: quiz.subject,
          chapter: quiz.chapter,
          attempts: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          lastAttempt: quiz.date
        };
      }
      
      chapterStats[key].attempts++;
      chapterStats[key].totalQuestions += quiz.totalQuestions;
      chapterStats[key].correctAnswers += quiz.correctAnswers;
      chapterStats[key].lastAttempt = quiz.date;
    });

    // Calculate intelligence labels
    const intelligence = {};
    Object.values(chapterStats).forEach(chapter => {
      const accuracy = (chapter.correctAnswers / chapter.totalQuestions) * 100;
      const key = `${chapter.subject}-${chapter.chapter}`;
      
      if (accuracy < 60) {
        intelligence[key] = { label: 'Needs Revision', color: 'red', priority: 3 };
      } else if (accuracy < 75) {
        intelligence[key] = { label: 'Recommended', color: 'orange', priority: 2 };
      } else if (accuracy >= 85) {
        intelligence[key] = { label: 'Strong Topic', color: 'green', priority: 0 };
      } else {
        intelligence[key] = { label: 'Good Progress', color: 'blue', priority: 1 };
      }
    });

    return intelligence;
  }, [quizHistory]);

  // Get chapters for selected subject
  const getSubjectChapters = useMemo(() => {
    const subjectData = SYLLABUS[selectedSubject];
    if (!subjectData || !subjectData.sections) return [];

    const chapters = [];
    Object.entries(subjectData.sections).forEach(([sectionName, sectionData]) => {
      if (sectionData.chapters) {
        sectionData.chapters.forEach(chapter => {
          const chapterKey = `${selectedSubject}-${chapter}`;
          const intelligence = getChapterIntelligence[chapterKey];
          const progress = stats?.chapterProgress?.[chapterKey] || { mastery: 0, attempts: 0 };
          
          chapters.push({
            name: chapter,
            section: sectionName,
            key: chapterKey,
            intelligence: intelligence || { label: 'New Topic', color: 'gray', priority: 1 },
            progress: progress.mastery || 0,
            attempts: progress.attempts || 0,
            difficulty: getDifficultyTag(chapter),
            hasPYQ: hasPYQData(selectedSubject, chapter)
          });
        });
      }
    });

    // Sort by intelligence priority, then by progress
    return chapters.sort((a, b) => {
      if (a.intelligence.priority !== b.intelligence.priority) {
        return b.intelligence.priority - a.intelligence.priority; // Higher priority first
      }
      return a.progress - b.progress; // Lower progress first
    });
  }, [selectedSubject, getChapterIntelligence, stats]);

  const getDifficultyTag = useCallback((chapter) => {
    // Simple difficulty mapping based on common CUET patterns
    const hardChapters = [
      'Electromagnetic Induction', 'Alternating Current', 'Dual Nature of Radiation',
      'Chemical Kinetics', 'Electrochemistry', 'Coordination Compounds',
      'Limits and Derivatives', 'Integrals', 'Differential Equations'
    ];
    
    const mediumChapters = [
      'Current Electricity', 'Magnetism', 'Optics',
      'Chemical Bonding', 'Thermodynamics', 'Equilibrium',
      'Matrices', 'Determinants', 'Probability'
    ];

    if (hardChapters.some(hard => chapter.includes(hard))) return 'Hard';
    if (mediumChapters.some(medium => chapter.includes(medium))) return 'Medium';
    return 'Easy';
  }, []);

  const hasPYQData = useCallback((subject, chapter) => {
    // In real implementation, this would check actual PYQ database
    // For now, assume most chapters have PYQ data
    return Math.random() > 0.3; // 70% chapters have PYQ data
  }, []);

  const handleChapterPractice = useCallback((chapter, mode = 'mixed') => {
    const params = new URLSearchParams({
      mode: showPYQOnly ? 'pyq-only' : mode,
      difficulty: 'adaptive'
    });
    
    navigate(`/quiz/${encodeURIComponent(selectedSubject)}/${encodeURIComponent(chapter.name)}?${params}`);
  }, [selectedSubject, showPYQOnly, navigate]);

  const getIntelligenceIcon = useCallback((intelligence) => {
    switch (intelligence.color) {
      case 'red': return AlertTriangle;
      case 'orange': return Target;
      case 'green': return CheckCircle;
      case 'blue': return TrendingDown;
      default: return BookOpen;
    }
  }, []);

  const subjects = Object.keys(SYLLABUS);

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
              Practice by Chapter
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Topic-wise focused practice
            </p>
          </div>
        </div>

        {/* Subject Selection */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSubject === subject
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {SYLLABUS[subject]?.icon} {subject}
              </button>
            ))}
          </div>
        </div>

        {/* PYQ Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Star className="w-4 h-4 text-yellow-600" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  PYQ-First Mode
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Show previous year questions first
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPYQOnly(!showPYQOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showPYQOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showPYQOnly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* AI Insights */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              AI Insights for {selectedSubject}
            </span>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            Chapters are ordered by your performance and learning needs. 
            {showPYQOnly ? ' Showing PYQ-first practice mode.' : ' Mixed practice includes AI + PYQ questions.'}
          </p>
        </Card>

        {/* Chapter List */}
        <div className="space-y-3">
          {getSubjectChapters.map((chapter, index) => {
            const IntelligenceIcon = getIntelligenceIcon(chapter.intelligence);
            
            return (
              <Card key={chapter.key} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {chapter.name}
                      </h4>
                      {chapter.hasPYQ && (
                        <Badge variant="secondary" size="sm" className="text-xs">
                          PYQ
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                      <span>{chapter.section}</span>
                      <Badge 
                        variant={chapter.difficulty === 'Hard' ? 'destructive' : 
                               chapter.difficulty === 'Medium' ? 'warning' : 'secondary'}
                        size="sm"
                      >
                        {chapter.difficulty}
                      </Badge>
                      {chapter.attempts > 0 && (
                        <span>{chapter.attempts} attempts</span>
                      )}
                    </div>

                    {/* AI Intelligence Label */}
                    <div className="flex items-center space-x-2">
                      <IntelligenceIcon className={`w-3 h-3 text-${chapter.intelligence.color}-600`} />
                      <span className={`text-xs font-medium text-${chapter.intelligence.color}-600 dark:text-${chapter.intelligence.color}-400`}>
                        {chapter.intelligence.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress Ring */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${chapter.progress}, 100`}
                          className="text-blue-600"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {chapter.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleChapterPractice(chapter)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {chapter.progress === 0 ? 'Start Chapter' : 'Continue'}
                  </Button>
                  
                  {chapter.hasPYQ && (
                    <Button 
                      onClick={() => handleChapterPractice(chapter, 'pyq-only')}
                      variant="outline"
                      size="sm"
                      className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      PYQ
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Practice Tips */}
        <Card className="p-4 mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-1">
                Chapter Practice Tips
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Start with recommended chapters (AI-suggested)</li>
                <li>• Use PYQ mode for exam-like practice</li>
                <li>• Focus on weak chapters for improvement</li>
                <li>• Complete daily tasks to build consistency</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default ChapterWisePractice;