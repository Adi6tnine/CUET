// Enhanced Theme System - Based on Study Tracker UI
export const theme = {
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    // Subject Colors
    physics: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    chemistry: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    
    mathematics: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    english: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    
    general: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    
    // Status Colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
    },
    
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
    },
    
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
    },
    
    // Neutral Colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  },
  
  // Gradients
  gradients: {
    primary: 'from-indigo-500 to-purple-600',
    physics: 'from-blue-500 to-indigo-600',
    chemistry: 'from-purple-500 to-pink-600',
    mathematics: 'from-green-500 to-emerald-600',
    english: 'from-indigo-500 to-blue-600',
    general: 'from-orange-500 to-red-600',
    success: 'from-green-400 to-emerald-500',
    warning: 'from-yellow-400 to-orange-500',
    error: 'from-red-400 to-pink-500',
    glass: 'from-white/10 to-white/5',
    darkGlass: 'from-gray-800/10 to-gray-900/5',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    glow: '0 0 20px rgba(59, 130, 246, 0.5)',
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  // Spacing
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

// Subject Color Utilities
export const getSubjectColor = (subject) => {
  const colors = {
    'Physics': 'physics',
    'Chemistry': 'chemistry',
    'Mathematics': 'mathematics',
    'English': 'english',
    'General Test': 'general',
    'All': 'gray',
  };
  return colors[subject] || 'gray';
};

export const getSubjectGradient = (subject) => {
  const gradients = {
    'Physics': theme.gradients.physics,
    'Chemistry': theme.gradients.chemistry,
    'Mathematics': theme.gradients.mathematics,
    'English': theme.gradients.english,
    'General Test': theme.gradients.general,
    'All': 'from-gray-500 to-gray-600',
  };
  return gradients[subject] || 'from-gray-500 to-gray-600';
};

export const getSubjectColorClasses = (subject) => {
  const classes = {
    'Physics': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    'Chemistry': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
    'Mathematics': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
    'English': 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
    'General Test': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
    'All': 'bg-gray-800 text-white border-gray-700',
  };
  return classes[subject] || 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
};

export const getStatusColor = (status) => {
  const colors = {
    'Done': 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    'Revise': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
    'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    'Not Started': 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  };
  return colors[status] || colors['Not Started'];
};

// Glass Morphism Utilities
export const glassEffect = {
  light: 'bg-white/80 backdrop-blur-md border border-white/20',
  dark: 'bg-gray-800/80 backdrop-blur-md border border-gray-700/20',
  card: 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50',
  overlay: 'bg-black/50 backdrop-blur-sm',
};

export default theme;