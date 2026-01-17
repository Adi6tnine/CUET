import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { 
  Clock, Play, BookOpen, Target, TrendingUp, CheckCircle, 
  ArrowLeft, AlertCircle, BarChart3, Award
} from 'lucide-react';

const MockTestView = () => {
  const navigate = useNavigate();
  const { stats, profile } = useApp();
  const [selectedMock, setSelectedMock] = useState(null);
  const [mockResults, setMockResults] = useState([]);

  // Mock test configurations
  const mockTests = useMemo(() => [
    {
      id: 'physics-mock-1',
      title: 'Physics Mock Test 1',
      subject: 'Physics',
      duration: 45,
      questions: 40,
      sections: ['Mechanics', 'Electricity', 'Optics'],
      difficulty: 'Medium',
      description: 'Focus on Class 11 & 12 core concepts'
    },
    {
      id: 'chemistry-mock-1',
      title: 'Chemistry Mock Test 1',
      subject: 'Chemistry',
      duration: 45,
      questions: 40,
      sections: ['Physical', 'Organic', 'Inorganic'],
      difficulty: 'Medium',
      description: 'Balanced coverage of all three branches'
    },
    {
      id: 'maths-mock-1',
      title: 'Mathematics Mock Test 1',
      subject: 'Mathematics',
      duration: 45,
      questions: 40,
      sections: ['Algebra', 'Calculus', 'Coordinate Geometry'],
      difficulty: 'Medium',
      description: 'Core mathematical concepts for CUET'
    },
    {
      id: 'full-cuet-mock-1',
      title: 'Full CUET Mock Test 1',
      subject: 'All Subjects',
      duration: 180,
      questions: 200,
      sections: ['Physics', 'Chemistry', 'Mathematics', 'English', 'General Test'],
      difficulty: 'Hard',
      description: 'Complete CUET simulation with all sections'
    }
  ], []);

  // Get user's mock test history
  const getUserMockHistory = useMemo(() => {
    // This would come from actual data in real implementation
    return [
      {
        id: 'physics-mock-1',
        score: 85,
        accuracy: 85,
        timeSpent: 42,
        rank: 'Above Average',
        date: '2024-01-08',
        weakAreas: ['Current Electricity', 'Magnetism']
      }
    ];
  }, []);

  const handleStartMock = useCallback((mock) => {
    // Navigate to mock test interface
    navigate(`/mock-test/${mock.id}`, { 
      state: { 
        mockConfig: mock,
        isFullTest: true 
      } 
    });
  }, [navigate]);

  const handleViewResults = useCallback((mockId) => {
    navigate(`/mock-results/${mockId}`);
  }, [navigate]);

  const getMockStatus = useCallback((mockId) => {
    const completed = getUserMockHistory.find(result => result.id === mockId);
    return completed ? 'completed' : 'available';
  }, [getUserMockHistory]);

  const getRecommendedMock = useMemo(() => {
    const totalQuestions = stats?.totalQuestions || 0;
    
    if (totalQuestions < 50) {
      return mockTests.find(mock => mock.subject === 'Physics');
    }
    
    // Find weakest subject
    const subjectMastery = stats?.subjectMastery || {};
    const subjects = Object.keys(subjectMastery);
    
    if (subjects.length === 0) {
      return mockTests.find(mock => mock.subject === 'Physics');
    }
    
    const weakestSubject = subjects.reduce((weakest, subject) => 
      (subjectMastery[subject] || 0) < (subjectMastery[weakest] || 0) ? subject : weakest
    );
    
    return mockTests.find(mock => mock.subject === weakestSubject) || mockTests[0];
  }, [stats, mockTests]);

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
              Mock Tests
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              CUET exam simulation
            </p>
          </div>
        </div>

        {/* Recommended Mock - Primary CTA */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Recommended for You
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {getRecommendedMock.title}
          </h3>
          
          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{getRecommendedMock.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{getRecommendedMock.questions} questions</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {getRecommendedMock.description}
          </p>
          
          <Button 
            onClick={() => handleStartMock(getRecommendedMock)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Mock Test
          </Button>
        </Card>

        {/* Mock Test History */}
        {getUserMockHistory.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 px-1">
              Recent Results
            </h3>
            
            <div className="space-y-3">
              {getUserMockHistory.map((result) => {
                const mock = mockTests.find(m => m.id === result.id);
                return (
                  <Card key={result.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {mock?.title}
                      </h4>
                      <Badge 
                        variant={result.accuracy >= 80 ? 'success' : result.accuracy >= 60 ? 'warning' : 'secondary'}
                        size="sm"
                      >
                        {result.accuracy}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{result.date}</span>
                      <span>{result.rank}</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => handleViewResults(result.id)}
                    >
                      View Detailed Results
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Mock Tests */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">
            All Mock Tests
          </h3>
          
          {mockTests.map((mock) => {
            const status = getMockStatus(mock.id);
            const isCompleted = status === 'completed';
            const result = getUserMockHistory.find(r => r.id === mock.id);
            
            return (
              <Card 
                key={mock.id} 
                className={`p-4 ${isCompleted ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {mock.title}
                      </h4>
                      {isCompleted && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                      <span>{mock.duration} min</span>
                      <span>{mock.questions} questions</span>
                      <Badge variant="secondary" size="sm">{mock.difficulty}</Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {mock.description}
                    </p>
                  </div>
                </div>
                
                {isCompleted ? (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium text-green-700 dark:text-green-300">
                        {result.accuracy}% • {result.rank}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewResults(mock.id)}
                      >
                        Results
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStartMock(mock)}
                      >
                        Retake
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleStartMock(mock)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Test
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Mock Test Tips */}
        <Card className="p-4 mt-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm mb-1">
                Mock Test Tips
              </h4>
              <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Take tests in a quiet environment</li>
                <li>• Follow the time limit strictly</li>
                <li>• Review wrong answers immediately</li>
                <li>• Take one mock test per week</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default MockTestView;