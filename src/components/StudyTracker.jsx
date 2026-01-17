import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, CheckCircle, Calendar, BarChart, List, Clock, Zap, Star, Trash2, 
  ChevronDown, ChevronUp, Target, Brain, Save, Loader2, Wifi, WifiOff,
  TrendingUp, Award, Users, RefreshCw, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cloudStorage } from '../utils/cloudStorage';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

// Study Plan Data
const WEEKLY_PLAN = [
  { 
    week: "Week 1", 
    topics: [
      { subject: "Physics", topic: "Motion + Units" },
      { subject: "Chemistry", topic: "Mole + Atomic" },
      { subject: "Mathematics", topic: "Sets + Functions" },
      { subject: "English", topic: "3 Passages" },
      { subject: "General Test", topic: "Series + Directions" }
    ]
  },
  { 
    week: "Week 2", 
    topics: [
      { subject: "Physics", topic: "NLM + WEP" },
      { subject: "Chemistry", topic: "Bonding" },
      { subject: "Mathematics", topic: "Trigo basics" },
      { subject: "English", topic: "Error spotting" },
      { subject: "General Test", topic: "Coding-Decoding" }
    ]
  },
  { 
    week: "Week 3", 
    topics: [
      { subject: "Physics", topic: "Gravitation" },
      { subject: "Chemistry", topic: "Thermodynamics" },
      { subject: "Mathematics", topic: "Quadratic" },
      { subject: "English", topic: "4 Passages" },
      { subject: "General Test", topic: "Percentage + P/L" }
    ]
  },
  { 
    week: "Week 4", 
    topics: [
      { subject: "Physics", topic: "Waves + Current" },
      { subject: "Chemistry", topic: "Equilibrium" },
      { subject: "Mathematics", topic: "Matrices" },
      { subject: "English", topic: "Para jumbles" },
      { subject: "General Test", topic: "Seating + SI" }
    ]
  },
  { 
    week: "Week 5", 
    topics: [
      { subject: "Physics", topic: "Electrostatics" },
      { subject: "Chemistry", topic: "Hydrocarbons" },
      { subject: "Mathematics", topic: "Determinants" },
      { subject: "English", topic: "5 Passages" },
      { subject: "General Test", topic: "CI + DI tables" }
    ]
  },
  { 
    week: "Week 6", 
    topics: [
      { subject: "Physics", topic: "Magnetism" },
      { subject: "Chemistry", topic: "IUPAC + GOC" },
      { subject: "Mathematics", topic: "Limits" },
      { subject: "English", topic: "5 Passages" },
      { subject: "General Test", topic: "DI graphs" }
    ]
  },
  { 
    week: "Week 7", 
    topics: [
      { subject: "Physics", topic: "EMI + AC basics" },
      { subject: "Chemistry", topic: "Alcohol/Ether" },
      { subject: "Mathematics", topic: "Differentiation" },
      { subject: "English", topic: "6 Passages" },
      { subject: "General Test", topic: "Puzzles" }
    ]
  },
  { 
    week: "Week 8", 
    topics: [
      { subject: "Physics", topic: "Optics" },
      { subject: "Chemistry", topic: "A/K + Carboxylic" },
      { subject: "Mathematics", topic: "Integration" },
      { subject: "English", topic: "6 Passages" },
      { subject: "General Test", topic: "DI charts + GK" }
    ]
  },
  { 
    week: "Week 9", 
    topics: [
      { subject: "Physics", topic: "Modern Physics" },
      { subject: "Chemistry", topic: "Blocks + Coordination" },
      { subject: "Mathematics", topic: "Vectors" },
      { subject: "English", topic: "7 Passages" },
      { subject: "General Test", topic: "Mixed reasoning" }
    ]
  },
  { 
    week: "Week 10", 
    topics: [
      { subject: "Physics", topic: "Semiconductors" },
      { subject: "Chemistry", topic: "Env Chem" },
      { subject: "Mathematics", topic: "Probability/Stats" },
      { subject: "English", topic: "7 Passages" },
      { subject: "General Test", topic: "GK + CA" }
    ]
  },
  { 
    week: "Week 11–16", 
    topics: [
      { subject: "All", topic: "Full Revision + 1 Mock/week + mistakes fix" }
    ] 
  },
  { 
    week: "Week 17–19", 
    topics: [
      { subject: "All", topic: "Mocks only + calm revision + CA reading" }
    ] 
  }
];

const SYLLABUS_ANALYSIS = {
  Physics: {
    description: "Focus on Electrostatics & Modern Physics for maximum ROI.",
    units: [
      { title: "Electrostatics & Current", topics: "Charges, Fields, Potential, Capacitance, Ohm's Law, Kirchhoff's Laws", importance: "High", difficulty: "Hard" },
      { title: "Magnetism & EMI", topics: "Moving Charges, Magnetism, EMI, AC", importance: "High", difficulty: "Medium" },
      { title: "Optics", topics: "Ray Optics, Wave Optics, Optical Instruments", importance: "High", difficulty: "Medium" },
      { title: "Modern Physics", topics: "Dual Nature, Atoms, Nuclei, Semiconductors", importance: "High", difficulty: "Easy" },
      { title: "Mechanics (Class 11)", topics: "Motion, Laws of Motion, Work Energy, Gravitation", importance: "Medium", difficulty: "Hard" },
      { title: "Heat & Waves", topics: "Thermodynamics, KTG, Oscillations, Waves", importance: "Medium", difficulty: "Medium" }
    ]
  },
  Chemistry: {
    description: "Organic Chemistry holds the highest weightage. NCERT is bible.",
    units: [
      { title: "Physical Chemistry", topics: "Solutions, Electrochemistry, Kinetics, Surface Chem", importance: "High", difficulty: "Medium" },
      { title: "Inorganic Chemistry", topics: "p-block, d-and-f block, Coordination Compounds", importance: "Medium", difficulty: "Easy (Memorization)" },
      { title: "Organic Chemistry", topics: "Haloalkanes, Alcohols, Aldehydes, Amines, Biomolecules", importance: "Very High", difficulty: "Hard" }
    ]
  },
  Mathematics: {
    description: "Calculus is the backbone (~40% of paper). Algebra is scoring.",
    units: [
      { title: "Calculus", topics: "Continuity, Differentiability, Derivatives, Integrals, Differential Equations", importance: "Very High", difficulty: "Hard" },
      { title: "Algebra", topics: "Matrices, Determinants", importance: "High", difficulty: "Easy" },
      { title: "Vectors & 3D", topics: "Vectors, 3D Geometry", importance: "High", difficulty: "Medium" },
      { title: "Probability & LP", topics: "Probability Distributions, Linear Programming", importance: "Medium", difficulty: "Medium" },
      { title: "Relations & Functions", topics: "Relations, Functions, ITF", importance: "Medium", difficulty: "Medium" }
    ]
  }
};

// Flatten the weekly plan data
const FLATTENED_DATA = WEEKLY_PLAN.flatMap((weekPlan, wIndex) => 
  weekPlan.topics.map((t, tIndex) => ({
    id: `w${wIndex}-t${tIndex}`,
    week: weekPlan.week,
    subject: t.subject,
    topic: t.topic,
    status: "Not Started",
    mockScore: "",
    revisionDate: "",
    notesLink: ""
  }))
);

// Analysis Card Component
const AnalysisCard = ({ subject, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Physics': return 'from-blue-500 to-indigo-600';
      case 'Chemistry': return 'from-purple-500 to-pink-600';
      case 'Mathematics': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-3 h-12 rounded-full bg-gradient-to-b ${getSubjectColor(subject)}`} />
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{subject}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{data.description}</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Unit / Module</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Topics</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">Weightage</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {data.units.map((unit, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{unit.title}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{unit.topics}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge 
                            variant={unit.importance === 'Very High' ? 'destructive' : 
                                   unit.importance === 'High' ? 'warning' : 'secondary'}
                          >
                            {unit.importance}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-sm font-medium ${
                            unit.difficulty === 'Hard' ? 'text-red-600' : 
                            unit.difficulty === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {unit.difficulty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

const StudyTracker = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trackerData, setTrackerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle');
  const { updateStudyTracker, getStudyTracker, stats, profile } = useApp();

  // Save data to both local and cloud storage via AppContext
  const saveData = async (data) => {
    try {
      setSyncStatus('syncing');
      
      // Save to localStorage first (immediate)
      localStorage.setItem('cuet-study-tracker', JSON.stringify(data));
      
      // Save via AppContext (which handles cloud storage) in background
      try {
        await updateStudyTracker(data);
        setSyncStatus('saved');
      } catch (cloudError) {
        console.warn('Cloud save failed, data saved locally:', cloudError);
        setSyncStatus('local-only');
      }
      
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save tracker data:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  // Initialize tracker data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Set a timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          console.warn('Study tracker initialization timeout, using fallback data');
          setTrackerData(FLATTENED_DATA);
          setIsLoading(false);
        }, 5000); // 5 second timeout
        
        // First try localStorage for immediate loading
        const stored = localStorage.getItem('cuet-study-tracker');
        if (stored) {
          try {
            const localData = JSON.parse(stored);
            if (Array.isArray(localData) && localData.length > 0) {
              setTrackerData(localData);
              setIsLoading(false);
              clearTimeout(timeoutId);
              
              // Then try to sync with cloud in background
              try {
                const cloudData = await getStudyTracker();
                if (cloudData && cloudData.length > 0 && JSON.stringify(cloudData) !== JSON.stringify(localData)) {
                  setTrackerData(cloudData);
                  localStorage.setItem('cuet-study-tracker', JSON.stringify(cloudData));
                }
              } catch (cloudError) {
                console.warn('Cloud sync failed, using local data:', cloudError);
              }
              return;
            }
          } catch (parseError) {
            console.warn('Failed to parse local data:', parseError);
          }
        }
        
        // No valid local data, initialize with default
        setTrackerData(FLATTENED_DATA);
        localStorage.setItem('cuet-study-tracker', JSON.stringify(FLATTENED_DATA));
        setIsLoading(false);
        clearTimeout(timeoutId);
        
        // Try to save to cloud in background
        try {
          await updateStudyTracker(FLATTENED_DATA);
        } catch (cloudError) {
          console.warn('Failed to save initial data to cloud:', cloudError);
        }
      } catch (error) {
        console.error('Failed to initialize tracker data:', error);
        // Fallback to default data
        setTrackerData(FLATTENED_DATA);
        setIsLoading(false);
      }
    };

    initializeData();
  }, []); // Empty dependency array to run only once

  // Update item
  const updateItem = async (id, field, value) => {
    // Update local state immediately for responsive UI
    const updatedData = trackerData.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    
    setTrackerData(updatedData);
    
    // Save in background without blocking UI
    setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        localStorage.setItem('cuet-study-tracker', JSON.stringify(updatedData));
        
        try {
          await updateStudyTracker(updatedData);
          setSyncStatus('saved');
        } catch (cloudError) {
          console.warn('Cloud update failed:', cloudError);
          setSyncStatus('local-only');
        }
        
        setTimeout(() => setSyncStatus('idle'), 1500);
      } catch (error) {
        console.error('Failed to update item:', error);
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 2000);
      }
    }, 100);
  };

  // Reset data
  const handleReset = async () => {
    if (!confirm("Are you sure? This will erase all your progress.")) return;
    
    setIsLoading(true);
    const resetData = FLATTENED_DATA.map(item => ({
      ...item,
      status: "Not Started",
      mockScore: "",
      revisionDate: "",
      notesLink: ""
    }));
    
    setTrackerData(resetData);
    await saveData(resetData);
    setIsLoading(false);
  };

  // Calculate statistics with safety checks
  const getStatusCounts = () => {
    if (!trackerData || trackerData.length === 0) {
      return { "Not Started": 0, "In Progress": 0, "Done": 0, "Revise": 0 };
    }
    
    const counts = { "Not Started": 0, "In Progress": 0, "Done": 0, "Revise": 0 };
    trackerData.forEach(item => {
      if (item && item.status && counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalItems = trackerData ? trackerData.length : 0;
  const progress = totalItems > 0 ? Math.round(((statusCounts["Done"] + statusCounts["Revise"]) / totalItems) * 100) : 0;

  // Safety check - if no data, show error state
  if (!trackerData || trackerData.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl shadow-sm">
                  <BookOpen className="text-white h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  CUET 2026 Study Tracker
                </h1>
              </div>
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
          
          <main className="max-w-6xl mx-auto p-4 md:p-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Study Tracker Error
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Unable to load study tracker data. This might be a temporary issue.
              </p>
              <div className="space-x-3">
                <Button 
                  onClick={() => {
                    setTrackerData(FLATTENED_DATA);
                    localStorage.setItem('cuet-study-tracker', JSON.stringify(FLATTENED_DATA));
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Reset & Initialize
                </Button>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Physics': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Chemistry': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Mathematics': return 'bg-green-100 text-green-700 border-green-200';
      case 'English': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'General Test': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'All': return 'bg-gray-800 text-white border-gray-700';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-700';
      case 'Revise': return 'bg-yellow-100 text-yellow-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-sm">
          <div className="animate-spin h-8 w-8 mb-4 text-indigo-600 mx-auto border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading study tracker...</p>
          <p className="text-xs text-gray-500 mt-2">This should only take a moment</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl shadow-sm">
                <BookOpen className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  CUET 2026 Study Tracker
                </h1>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  {syncStatus === 'syncing' ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : syncStatus === 'saved' ? (
                    <>
                      <CheckCircle size={12} className="text-green-500" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Wifi size={12} />
                      <span>Online</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                {[
                  { id: 'dashboard', icon: BarChart, label: 'Dashboard' },
                  { id: 'roadmap', icon: Calendar, label: 'Roadmap' },
                  { id: 'analysis', icon: Zap, label: 'Analysis' },
                  { id: 'database', icon: List, label: 'Database' },
                  { id: 'method', icon: Clock, label: 'Method' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all ${
                      activeTab === tab.id 
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
              
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden px-4 py-2 flex space-x-2 overflow-x-auto">
            {['dashboard', 'roadmap', 'analysis', 'database', 'method'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize flex-shrink-0 ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <main className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Progress Overview */}
              <Card className="p-6">
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Syllabus Completion</h2>
                  <span className="text-4xl font-bold text-indigo-600">{progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden mb-6">
                  <motion.div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">{statusCounts.Done}</div>
                    <div className="text-sm text-green-700 dark:text-green-400">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">{statusCounts.Revise}</div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-400">Revision</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{statusCounts["In Progress"]}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">In Progress</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-gray-600 mb-1">{statusCounts["Not Started"]}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-400">Pending</div>
                  </div>
                </div>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium mb-1">Daily Goal</p>
                      <h3 className="text-3xl font-bold mb-2">6-7 Hours</h3>
                      <p className="text-indigo-200 text-sm">Consistency over Intensity</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Clock className="text-white" size={24} />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">Question Bank</p>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">40 PYQs</h3>
                      <p className="text-indigo-600 text-sm font-medium">Daily minimum target</p>
                    </div>
                    <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-xl">
                      <Brain className="text-indigo-600" size={24} />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Focus Alert */}
              <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start space-x-3">
                  <Star className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200">Focus of the Week</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
                      Remember to solve 1 full mock test every weekend and analyze your mistakes the <strong>same day</strong>. Don't let backlogs pile up!
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Roadmap View */}
          {activeTab === 'roadmap' && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5-Month Study Plan</h2>
                <Badge variant="success" className="flex items-center space-x-1">
                  <Wifi size={12} />
                  <span>Cloud Sync Active</span>
                </Badge>
              </div>

              <div className="space-y-6">
                {Array.from(new Set(trackerData.map(item => item.week))).map((week) => {
                  const weekItems = trackerData.filter(i => i.week === week);
                  const isCompleted = weekItems.length > 0 && weekItems.every(i => i.status === 'Done' || i.status === 'Revise');
                  
                  return (
                    <Card key={week} className={`overflow-hidden ${isCompleted ? 'ring-2 ring-green-200 bg-green-50/20 dark:bg-green-900/10' : ''}`}>
                      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white">{week}</h3>
                        {isCompleted && <CheckCircle size={20} className="text-green-500" />}
                      </div>
                      
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {weekItems.map(item => (
                          <Card key={item.id} className="p-4 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-3">
                              <Badge className={getSubjectColor(item.subject)} size="sm">
                                {item.subject}
                              </Badge>
                              <select 
                                value={item.status}
                                onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                                className={`text-xs border-0 rounded-full px-2 py-1 font-medium cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusColor(item.status)}`}
                              >
                                <option value="Not Started">Pending</option>
                                <option value="In Progress">Doing</option>
                                <option value="Done">Done</option>
                                <option value="Revise">Revise</option>
                              </select>
                            </div>
                            <p className="font-medium text-sm text-gray-700 dark:text-gray-300">{item.topic}</p>
                          </Card>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Analysis View */}
          {activeTab === 'analysis' && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Topic Weightage Analysis</h2>
                <p className="text-gray-600 dark:text-gray-300">Priority areas for Physics, Chemistry, and Mathematics.</p>
              </div>

              <div className="space-y-4">
                <AnalysisCard subject="Physics" data={SYLLABUS_ANALYSIS["Physics"]} />
                <AnalysisCard subject="Chemistry" data={SYLLABUS_ANALYSIS["Chemistry"]} />
                <AnalysisCard subject="Mathematics" data={SYLLABUS_ANALYSIS["Mathematics"]} />
              </div>
            </motion.div>
          )}

          {/* Database View */}
          {activeTab === 'database' && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Database View</h2>
                <Button onClick={handleReset} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 size={16} className="mr-2" />
                  Reset DB
                </Button>
              </div>

              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Week</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Subject</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Topic</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Score</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Rev. Date</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {trackerData.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{item.week}</td>
                        <td className="px-4 py-3">
                          <Badge className={getSubjectColor(item.subject)} size="sm">
                            {item.subject}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[200px] truncate" title={item.topic}>
                          {item.topic}
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            value={item.status}
                            onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                            className="bg-transparent text-xs font-semibold cursor-pointer outline-none border border-gray-200 dark:border-gray-600 rounded px-2 py-1"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                            <option value="Revise">Revise</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            placeholder="-"
                            className="w-16 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                            value={item.mockScore}
                            onChange={(e) => updateItem(item.id, 'mockScore', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="date" 
                            className="w-32 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                            value={item.revisionDate}
                            onChange={(e) => updateItem(item.id, 'revisionDate', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            placeholder="Link..."
                            className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-transparent"
                            value={item.notesLink}
                            onChange={(e) => updateItem(item.id, 'notesLink', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}

          {/* Method View */}
          {activeTab === 'method' && (
            <motion.div 
              className="max-w-3xl mx-auto space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <Target className="text-indigo-600" />
                  <span>Daily Study Protocol</span>
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">6–7 Hours Core Study</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Focus heavily on PCM (Physics, Chemistry, Maths). These determine your university. Use 2 hour blocks.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">40 PYQs (Previous Year Questions)</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">This is non-negotiable. Solve them in a timed manner. If you can't solve one, mark it and check the concept immediately.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Short Notes & Revision</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Before sleeping, revise the mistakes you made during the day. Make short, neat notes for formulas and exceptions.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudyTracker;