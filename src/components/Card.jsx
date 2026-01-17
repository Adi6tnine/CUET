import { motion } from 'framer-motion';
import { glassEffect } from '../styles/theme';

export const Card = ({ 
  children, 
  className = '', 
  onClick, 
  hover = true,
  glass = false,
  variant = 'default',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return glassEffect.card;
      case 'overlay':
        return glassEffect.overlay;
      case 'light':
        return glassEffect.light;
      case 'dark':
        return glassEffect.dark;
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
    }
  };

  const baseClasses = `
    rounded-xl transition-all duration-300
    ${glass ? glassEffect.card : getVariantClasses()}
    ${hover && onClick ? 'hover:scale-[1.02] hover:shadow-xl cursor-pointer' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  // Filter out Framer Motion props to avoid passing them to DOM
  const {
    initial,
    animate,
    exit,
    variants,
    transition,
    whileHover,
    whileTap,
    whileInView,
    whileFocus,
    whileDrag,
    drag,
    dragConstraints,
    dragElastic,
    dragMomentum,
    dragPropagation,
    dragSnapToOrigin,
    dragTransition,
    onDrag,
    onDragStart,
    onDragEnd,
    layout,
    layoutId,
    ...domProps
  } = props;

  const motionProps = {
    initial: initial || { opacity: 0, y: 20 },
    animate: animate || { opacity: 1, y: 0 },
    transition: transition || { duration: 0.3 },
    ...(whileHover && { whileHover }),
    ...(whileTap && { whileTap }),
    ...(variants && { variants }),
    ...(exit && { exit })
  };

  if (onClick) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        whileHover={hover ? { scale: 1.02 } : {}}
        whileTap={{ scale: 0.98 }}
        {...motionProps}
        {...domProps}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className={baseClasses}
      {...motionProps}
      {...domProps}
    >
      {children}
    </motion.div>
  );
};

export const SubjectCard = ({ subject, data, onClick, progress = 0 }) => {
  // Ensure progress is a valid number between 0 and 100
  const validProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  
  const colorClasses = {
    physics: 'border-l-physics-500 bg-physics-50 dark:bg-physics-900/20',
    chemistry: 'border-l-chemistry-500 bg-chemistry-50 dark:bg-chemistry-900/20',
    mathematics: 'border-l-mathematics-500 bg-mathematics-50 dark:bg-mathematics-900/20',
    english: 'border-l-english-500 bg-english-50 dark:bg-english-900/20',
    'general-test': 'border-l-gt-500 bg-gt-50 dark:bg-gt-900/20'
  };

  return (
    <Card
      onClick={onClick}
      className={`border-l-4 ${colorClasses[data.id]} relative overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">{data.icon}</div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Progress</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">{validProgress}%</div>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{subject}</h3>
      
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
        <span>{Object.keys(data.sections).length > 1 ? 'Class 11 + 12' : 'General Topics'}</span>
        <span>{Object.values(data.sections).flat().length} Chapters</span>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full bg-${data.color}-500`}
          initial={{ width: "0%" }}
          animate={{ width: `${validProgress}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </Card>
  );
};