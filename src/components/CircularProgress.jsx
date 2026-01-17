import { motion } from 'framer-motion';

const CircularProgress = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = 'indigo',
  showPercentage = true,
  children,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    indigo: 'stroke-indigo-500',
    emerald: 'stroke-emerald-500',
    blue: 'stroke-blue-500',
    yellow: 'stroke-yellow-500',
    orange: 'stroke-orange-500',
    red: 'stroke-red-500',
    purple: 'stroke-purple-500',
    pink: 'stroke-pink-500'
  };

  const backgroundColorClasses = {
    indigo: 'stroke-indigo-200 dark:stroke-indigo-800',
    emerald: 'stroke-emerald-200 dark:stroke-emerald-800',
    blue: 'stroke-blue-200 dark:stroke-blue-800',
    yellow: 'stroke-yellow-200 dark:stroke-yellow-800',
    orange: 'stroke-orange-200 dark:stroke-orange-800',
    red: 'stroke-red-200 dark:stroke-red-800',
    purple: 'stroke-purple-200 dark:stroke-purple-800',
    pink: 'stroke-pink-200 dark:stroke-pink-800'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          className={backgroundColorClasses[color]}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          className={colorClasses[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Glow Effect */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          className={`${colorClasses[color]} opacity-30`}
          strokeWidth={strokeWidth + 2}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          filter="blur(2px)"
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <div className="text-center">
            <motion.div
              className={`text-2xl font-bold ${
                color === 'indigo' ? 'text-indigo-600' :
                color === 'emerald' ? 'text-emerald-600' :
                color === 'blue' ? 'text-blue-600' :
                color === 'yellow' ? 'text-yellow-600' :
                color === 'orange' ? 'text-orange-600' :
                color === 'red' ? 'text-red-600' :
                color === 'purple' ? 'text-purple-600' :
                'text-pink-600'
              }`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {Math.round(percentage)}%
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircularProgress;