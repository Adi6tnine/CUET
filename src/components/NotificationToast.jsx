import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export const NotificationToast = ({ 
  notifications = [], 
  onDismiss 
}) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Toast = ({ notification, onDismiss }) => {
  const { id, type, title, message, duration = 5000, persistent = false } = notification;

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, persistent, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'warning': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200';
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 500, damping: 30 }}
      className={`
        relative p-4 rounded-lg border backdrop-blur-sm shadow-lg
        ${getColors()}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">{title}</h4>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Predefined notification types
  const showSuccess = (title, message, options = {}) => {
    return addNotification({ type: 'success', title, message, ...options });
  };

  const showWarning = (title, message, options = {}) => {
    return addNotification({ type: 'warning', title, message, ...options });
  };

  const showError = (title, message, options = {}) => {
    return addNotification({ type: 'error', title, message, ...options });
  };

  const showInfo = (title, message, options = {}) => {
    return addNotification({ type: 'info', title, message, ...options });
  };

  // AI-specific notifications
  const showAILimitWarning = () => {
    return showWarning(
      'AI Limit Reached',
      'Daily AI question limit exceeded. Using high-quality practice questions instead.',
      { duration: 8000 }
    );
  };

  const showAIError = () => {
    return showError(
      'AI Unavailable',
      'AI question generation failed. Using enhanced practice questions.',
      { duration: 6000 }
    );
  };

  const showAISuccess = () => {
    return showSuccess(
      'AI Questions Ready',
      'Fresh AI-generated questions loaded successfully!',
      { duration: 3000 }
    );
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAll,
    showSuccess,
    showWarning,
    showError,
    showInfo,
    showAILimitWarning,
    showAIError,
    showAISuccess
  };
};