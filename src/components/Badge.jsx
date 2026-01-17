import { motion } from 'framer-motion';

export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  animate = true 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    primary: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    physics: 'bg-physics-100 text-physics-800 dark:bg-physics-900 dark:text-physics-200',
    chemistry: 'bg-chemistry-100 text-chemistry-800 dark:bg-chemistry-900 dark:text-chemistry-200',
    mathematics: 'bg-mathematics-100 text-mathematics-800 dark:bg-mathematics-900 dark:text-mathematics-200',
    english: 'bg-english-100 text-english-800 dark:bg-english-900 dark:text-english-200',
    gt: 'bg-gt-100 text-gt-800 dark:bg-gt-900 dark:text-gt-200'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };

  const baseClasses = `
    inline-flex items-center font-medium rounded-full
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  const Component = animate ? motion.span : 'span';

  return (
    <Component
      className={baseClasses}
      initial={animate ? { scale: 0, opacity: 0 } : {}}
      animate={animate ? { scale: 1, opacity: 1 } : {}}
      transition={animate ? { type: 'spring', stiffness: 500, damping: 30 } : {}}
    >
      {children}
    </Component>
  );
};

export const AchievementBadge = ({ 
  title, 
  description, 
  icon, 
  earned = false, 
  progress = 0,
  onClick 
}) => {
  return (
    <motion.div
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${earned 
          ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg' 
          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 opacity-60'
        }
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-center">
        <div className={`text-3xl mb-2 ${earned ? 'animate-pulse-slow' : ''}`}>
          {icon}
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
          {description}
        </p>
        
        {!earned && progress > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <motion.div
              className="bg-yellow-400 h-1.5 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.max(0, Math.min(100, Number(progress) || 0))}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
        
        {earned && (
          <Badge variant="warning" size="sm">
            Earned!
          </Badge>
        )}
      </div>
    </motion.div>
  );
};