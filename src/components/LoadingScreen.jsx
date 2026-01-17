import { motion } from 'framer-motion';
import { Zap, Database, Brain, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const LoadingScreen = ({ 
  message = 'Loading...', 
  phase = 'loading',
  aiReason = null,
  progress = 0,
  showAIStatus = false 
}) => {
  const getPhaseIcon = () => {
    switch (phase) {
      case 'phase1': return <Database className="w-8 h-8" />;
      case 'phase2_start': 
      case 'phase2_ai_success': return <Brain className="w-8 h-8" />;
      case 'phase2_cache': return <Zap className="w-8 h-8" />;
      case 'phase2_fallback': return <AlertTriangle className="w-8 h-8" />;
      case 'complete': return <CheckCircle className="w-8 h-8" />;
      case 'error': 
      case 'emergency': return <AlertTriangle className="w-8 h-8" />;
      default: return <Clock className="w-8 h-8" />;
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'phase1': return 'text-blue-500';
      case 'phase2_start': 
      case 'phase2_ai_success': return 'text-green-500';
      case 'phase2_cache': return 'text-purple-500';
      case 'phase2_fallback': return 'text-orange-500';
      case 'complete': return 'text-green-500';
      case 'error': 
      case 'emergency': return 'text-red-500';
      default: return 'text-indigo-500';
    }
  };

  const getAIStatusMessage = () => {
    if (!aiReason) return null;
    
    switch (aiReason) {
      case 'api_limit_exceeded':
        return {
          icon: '⚠️',
          title: 'AI Daily Limit Reached',
          message: 'Free tier allows ~75 question sets per day. Using high-quality practice questions instead. Resets at midnight UTC.',
          color: 'text-orange-600'
        };
      case 'api_key_invalid':
        return {
          icon: '🔑',
          title: 'API Key Issue',
          message: 'Invalid API key detected. App works perfectly with enhanced practice questions.',
          color: 'text-red-600'
        };
      case 'no_api_key':
        return {
          icon: '🤖',
          title: 'AI Not Configured',
          message: 'Add Gemini API key to enable AI-generated questions. Currently using CUET 2026 practice questions.',
          color: 'text-blue-600'
        };
      case 'rate_limit':
        return {
          icon: '⏱️',
          title: 'AI Rate Limited',
          message: 'Too many requests (15/min limit). Using cached and practice questions.',
          color: 'text-yellow-600'
        };
      default:
        return null;
    }
  };

  const aiStatus = getAIStatusMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 0 
            }}
            animate={{ 
              y: [null, -100, window.innerHeight + 100],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="text-center max-w-md mx-auto px-6 relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Main Logo Animation */}
        <motion.div
          className="relative mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          {/* Aircraft Icon with Glow */}
          <motion.div
            className="w-24 h-24 mx-auto mb-4 relative"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotateY: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse" />
            
            {/* Main Icon */}
            <div className="relative w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12" viewBox="0 0 80 80" fill="none">
                <motion.path
                  d="M10 40L60 10L50 40L80 50L60 55L50 80L40 55L10 40Z"
                  fill="white"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </div>
            
            {/* Orbit Ring */}
            <motion.div
              className="absolute inset-0 border-2 border-indigo-300/30 rounded-3xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* App Title with Typewriter Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              AVION
            </motion.h1>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 text-lg font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Elevate your rank
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Loading Message with Animation */}
        <motion.div
          className="mb-8"
          key={message}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {message}
          </h2>
          
          {/* Progress Bar */}
          {progress > 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full relative"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.max(0, Math.min(100, Number(progress) || 0))}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          )}

          {/* Loading Dots Animation */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* AI Status Alert */}
        {aiStatus && (
          <motion.div
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <div className="flex items-start space-x-4">
              <motion.span 
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {aiStatus.icon}
              </motion.span>
              <div className="text-left">
                <h3 className={`font-bold text-lg ${aiStatus.color} mb-2`}>
                  {aiStatus.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {aiStatus.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase Indicators */}
        {showAIStatus && (
          <motion.div
            className="mt-8 flex justify-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            {[
              { id: 'phase1', icon: Database, label: 'Data', active: phase.includes('phase1') },
              { id: 'phase2', icon: Brain, label: 'AI', active: phase.includes('phase2') },
              { id: 'complete', icon: CheckCircle, label: 'Ready', active: phase.includes('phase3') || phase === 'complete' }
            ].map((item, index) => (
              <motion.div
                key={item.id}
                className={`flex flex-col items-center space-y-2 ${
                  item.active ? 'text-indigo-600' : 'text-gray-400'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + index * 0.1, duration: 0.4 }}
              >
                <motion.div
                  className={`p-3 rounded-full ${
                    item.active 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  animate={item.active ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Subtle Loading Text */}
        <motion.p
          className="mt-8 text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Preparing your learning experience...
        </motion.p>
      </motion.div>
    </div>
  );
};

export const QuickLoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center space-x-3">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-2 border-indigo-200 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-indigo-600 rounded-full" />
      </motion.div>
      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{message}</span>
    </div>
  );
};