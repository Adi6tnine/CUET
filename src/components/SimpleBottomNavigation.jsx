import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Target, BarChart3, User, BookOpen } from 'lucide-react';

const SimpleBottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/'
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: Target,
      path: '/quick-quiz'
    },
    {
      id: 'mock',
      label: 'Mock',
      icon: BookOpen,
      path: '/mock-test'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      path: '/analytics'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile'
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                  active 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {/* Active Background */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Icon */}
                <div className="relative z-10 mb-1">
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Label */}
                <span className="relative z-10 text-xs font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimpleBottomNavigation;