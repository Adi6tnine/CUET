import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Zap, BarChart3, User, Play } from 'lucide-react';

const EnhancedBottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Home', 
      color: 'from-indigo-500 to-purple-600',
      activeColor: 'text-indigo-600'
    },
    { 
      path: '/quick-quiz', 
      icon: Zap, 
      label: 'Quick Quiz', 
      color: 'from-yellow-500 to-orange-600',
      activeColor: 'text-yellow-600'
    },
    { 
      path: '/practice', 
      icon: Play, 
      label: 'Practice', 
      color: 'from-green-500 to-emerald-600',
      activeColor: 'text-green-600',
      isPrimary: true
    },
    { 
      path: '/analytics', 
      icon: BarChart3, 
      label: 'Analytics', 
      color: 'from-blue-500 to-indigo-600',
      activeColor: 'text-blue-600'
    },
    { 
      path: '/profile', 
      icon: User, 
      label: 'Profile', 
      color: 'from-purple-500 to-pink-600',
      activeColor: 'text-purple-600'
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/quick-quiz') {
      return location.pathname.startsWith('/quiz') && !location.pathname.includes('/result');
    }
    if (path === '/practice') {
      return location.pathname.startsWith('/subject');
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path, isPrimary) => {
    if (isPrimary) {
      // For practice, show subject selection (navigate to subjects page)
      navigate('/subjects');
    } else if (path === '/quick-quiz') {
      // Quick quiz - start with AI recommended subject/chapter
      const recommendation = getAIRecommendation();
      navigate(`/quiz/${encodeURIComponent(recommendation.subject)}/${encodeURIComponent(recommendation.chapter)}`);
    } else {
      navigate(path);
    }
  };

  // Get AI recommendation for quick quiz
  const getAIRecommendation = () => {
    // Simple logic to recommend a subject/chapter
    const subjects = ['Physics', 'Chemistry', 'Mathematics', 'English', 'General Test'];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    // Get first chapter of the subject
    const SYLLABUS = {
      'Physics': { sections: { 'Class 12 (CUET Core)': ['Electric Charges and Fields'] } },
      'Chemistry': { sections: { 'Class 12 (CUET Core)': ['Some Basic Concepts of Chemistry'] } },
      'Mathematics': { sections: { 'Class 12 (CUET Core)': ['Relations and Functions'] } },
      'English': { sections: { 'Class 12 (CUET Core)': ['Reading Comprehension'] } },
      'General Test': { sections: { 'Class 12 (CUET Core)': ['Current Affairs'] } }
    };
    
    const firstChapter = Object.values(SYLLABUS[randomSubject]?.sections || {})[0]?.[0] || 'General';
    
    return {
      subject: randomSubject,
      chapter: firstChapter
    };
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        {/* Glassmorphism Background */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              
              if (item.isPrimary) {
                // Primary floating action button
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigation(item.path, true)}
                    className="relative -mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-2xl shadow-2xl flex items-center justify-center`}>
                      <Play className="w-7 h-7 text-white" />
                    </div>
                    
                    {/* Pulse animation */}
                    <div className={`absolute inset-0 w-14 h-14 bg-gradient-to-r ${item.color} rounded-2xl animate-ping opacity-20`} />
                    
                    {/* Label */}
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 dark:text-gray-300">
                      {item.label}
                    </span>
                  </motion.button>
                );
              }
              
              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`p-2 rounded-xl transition-all duration-200 ${
                    active 
                      ? `bg-gradient-to-r ${item.color} shadow-lg` 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}>
                    <Icon 
                      className={`w-5 h-5 ${
                        active 
                          ? 'text-white' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`} 
                    />
                  </div>
                  <span className={`text-xs font-medium mt-1 transition-colors ${
                    active 
                      ? item.activeColor 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl" />
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-20 z-40">
        <div className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col items-center py-8">
          {/* Logo */}
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8">
            {/* Aircraft Icon */}
            <svg className="w-6 h-6" viewBox="0 0 80 80" fill="none">
              <path
                d="M10 40L60 10L50 40L80 50L60 55L50 80L40 55L10 40Z"
                fill="white"
              />
            </svg>
          </div>
          
          {/* Navigation Items */}
          <div className="flex flex-col space-y-4 flex-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              
              if (item.isPrimary) {
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigation(item.path, true)}
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-2xl shadow-lg flex items-center justify-center`}>
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.label}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                    </div>
                  </motion.button>
                );
              }
              
              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    active 
                      ? `bg-gradient-to-r ${item.color} shadow-lg` 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}>
                    <Icon 
                      className={`w-6 h-6 ${
                        active 
                          ? 'text-white' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`} 
                    />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          {/* Bottom Actions */}
          <div className="mt-auto">
            <motion.button
              className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Profile
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedBottomNavigation;