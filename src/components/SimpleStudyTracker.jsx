import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Calendar, X, Target, Clock } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

const SimpleStudyTracker = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const weeklyPlan = [
    { week: "Week 1", focus: "Motion + Units, Mole + Atomic, Sets + Functions", status: "active" },
    { week: "Week 2", focus: "NLM + WEP, Bonding, Trigo basics", status: "pending" },
    { week: "Week 3", focus: "Gravitation, Thermodynamics, Quadratic", status: "pending" },
    { week: "Week 4", focus: "Waves + Current, Equilibrium, Matrices", status: "pending" },
    { week: "Week 5", focus: "Electrostatics, Hydrocarbons, Determinants", status: "pending" },
  ];

  const subjects = [
    { name: "Physics", progress: 25, color: "blue" },
    { name: "Chemistry", progress: 30, color: "purple" },
    { name: "Mathematics", progress: 20, color: "green" },
    { name: "English", progress: 40, color: "indigo" },
    { name: "General Test", progress: 35, color: "orange" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl shadow-sm">
                <BookOpen className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  CUET 2026 Study Tracker
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Simplified View
                </p>
              </div>
            </div>
            
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        <main className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Progress Overview */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-indigo-600" />
                Overall Progress
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">12</div>
                  <div className="text-sm text-green-700 dark:text-green-400">Topics Completed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">In Progress</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600 mb-1">25</div>
                  <div className="text-sm text-orange-700 dark:text-orange-400">Remaining</div>
                </div>
              </div>

              {/* Subject Progress */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Subject Progress</h3>
                {subjects.map((subject) => (
                  <div key={subject.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${subject.color}-500`}></div>
                      <span className="font-medium text-gray-900 dark:text-white">{subject.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 bg-${subject.color}-500 rounded-full transition-all duration-300`}
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-12">
                        {subject.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly Plan */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-purple-600" />
                5-Month Study Plan
              </h2>
              
              <div className="space-y-4">
                {weeklyPlan.map((week, index) => (
                  <div 
                    key={week.week}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      week.status === 'active' 
                        ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{week.week}</h3>
                      <Badge 
                        variant={week.status === 'active' ? 'default' : 'secondary'}
                        size="sm"
                      >
                        {week.status === 'active' ? 'Current' : 'Upcoming'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{week.focus}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Study Method */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-green-600" />
                Daily Study Protocol
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">6–7 Hours Core Study</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Focus heavily on PCM (Physics, Chemistry, Maths). Use 2 hour blocks.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">40 PYQs Daily</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Solve Previous Year Questions in timed manner. Mark and review mistakes immediately.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Revision & Notes</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Before sleeping, revise mistakes and make short notes for formulas.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => window.open('https://www.nta.ac.in/cuet', '_blank')}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Official CUET Info
                </Button>
                <Button 
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Start Studying
                </Button>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SimpleStudyTracker;