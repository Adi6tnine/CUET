import { motion } from 'framer-motion';
import CircularProgress from './CircularProgress';
import { Badge } from './Badge';

const SubjectMasteryCard = ({ 
  subject, 
  mastery, 
  icon, 
  variant = 'detailed',
  className = '',
  onClick 
}) => {
  // Calculate mastery level and visual representation
  const getMasteryDetails = (mastery) => {
    if (mastery >= 90) {
      return {
        level: "Expert",
        color: "emerald",
        icon: "🏆",
        description: "Mastery achieved! Ready for CUET 2026",
        bgGradient: "from-emerald-500/10 to-green-500/5"
      };
    } else if (mastery >= 75) {
      return {
        level: "Advanced",
        color: "blue",
        icon: "🎯",
        description: "Strong foundation, keep practicing",
        bgGradient: "from-blue-500/10 to-cyan-500/5"
      };
    } else if (mastery >= 60) {
      return {
        level: "Intermediate",
        color: "yellow",
        icon: "📚",
        description: "Good progress, focus on weak areas",
        bgGradient: "from-yellow-500/10 to-orange-500/5"
      };
    } else if (mastery >= 40) {
      return {
        level: "Beginner",
        color: "orange",
        icon: "🌱",
        description: "Building foundation, keep practicing",
        bgGradient: "from-orange-500/10 to-red-500/5"
      };
    } else {
      return {
        level: "Starting",
        color: "red",
        icon: "🚀",
        description: "Just getting started, lots of potential",
        bgGradient: "from-red-500/10 to-pink-500/5"
      };
    }
  };

  const masteryDetails = getMasteryDetails(mastery);

  if (variant === 'compact') {
    return (
      <motion.div
        className={`relative p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer ${className}`}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${masteryDetails.bgGradient} rounded-xl`} />
        
        <div className="relative flex items-center space-x-4">
          <CircularProgress
            percentage={mastery}
            size={60}
            strokeWidth={6}
            color={masteryDetails.color}
            showPercentage={false}
          >
            <div className="text-xl">{icon}</div>
          </CircularProgress>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {subject}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm">{masteryDetails.icon}</span>
              <span className={`text-xs font-medium ${
                masteryDetails.color === 'emerald' ? 'text-emerald-600' :
                masteryDetails.color === 'blue' ? 'text-blue-600' :
                masteryDetails.color === 'yellow' ? 'text-yellow-600' :
                masteryDetails.color === 'orange' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {masteryDetails.level}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-lg font-bold ${
              masteryDetails.color === 'emerald' ? 'text-emerald-600' :
              masteryDetails.color === 'blue' ? 'text-blue-600' :
              masteryDetails.color === 'yellow' ? 'text-yellow-600' :
              masteryDetails.color === 'orange' ? 'text-orange-600' :
              'text-red-600'
            }`}>
              {mastery}%
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${masteryDetails.bgGradient}`} />
      
      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <CircularProgress
              percentage={mastery}
              size={80}
              strokeWidth={6}
              color={masteryDetails.color}
              showPercentage={false}
            >
              <div className="text-2xl">{icon}</div>
            </CircularProgress>
            
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                {subject}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg">{masteryDetails.icon}</span>
                <Badge variant={masteryDetails.color} size="sm">
                  {masteryDetails.level}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              masteryDetails.color === 'emerald' ? 'text-emerald-600' :
              masteryDetails.color === 'blue' ? 'text-blue-600' :
              masteryDetails.color === 'yellow' ? 'text-yellow-600' :
              masteryDetails.color === 'orange' ? 'text-orange-600' :
              'text-red-600'
            }`}>
              {mastery}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mastery Level
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Progress to Expert</span>
            <span>{mastery}/100</span>
          </div>
          
          <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                masteryDetails.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                masteryDetails.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                masteryDetails.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                masteryDetails.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
              initial={{ width: "0%" }}
              animate={{ width: `${mastery}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {masteryDetails.description}
        </p>

        {/* Mastery Milestones */}
        <div className="flex justify-between text-xs">
          <div className={`flex items-center space-x-1 ${mastery >= 25 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${mastery >= 25 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Basics</span>
          </div>
          <div className={`flex items-center space-x-1 ${mastery >= 50 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${mastery >= 50 ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <span>Intermediate</span>
          </div>
          <div className={`flex items-center space-x-1 ${mastery >= 75 ? 'text-purple-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${mastery >= 75 ? 'bg-purple-500' : 'bg-gray-300'}`} />
            <span>Advanced</span>
          </div>
          <div className={`flex items-center space-x-1 ${mastery >= 90 ? 'text-yellow-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${mastery >= 90 ? 'bg-yellow-500' : 'bg-gray-300'}`} />
            <span>Expert</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectMasteryCard;