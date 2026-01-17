import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Settings, Moon, Sun, Download, Upload, RotateCcw, 
  Zap, Trophy, Target, Calendar, BookOpen, Brain, Database,
  Bug, FileText, BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { storage } from '../utils/storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
// import StudyTrackerTest from '../components/StudyTrackerTest';
import { useNavigate } from 'react-router-dom';

const ProfileView = () => {
  const navigate = useNavigate();
  const { profile, stats, settings, updateProfile, updateSettings, resetAllData } = useApp();
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const handleDarkModeToggle = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const handleExportData = () => {
    try {
      const userData = storage.getUserData();
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `avion-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data: ' + error.message);
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          storage.saveUserData(importedData);
          alert('Data imported successfully! Please refresh the page.');
          window.location.reload();
        } catch (error) {
          alert('Failed to import data: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      resetAllData();
      localStorage.clear();
      alert('All data has been reset.');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 pb-24">
      <div className="max-w-4xl mx-auto p-4 pt-8">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile?.name || 'AVION User'}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>{profile?.xp || 0} XP</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-orange-500" />
                    <span>Level {Math.floor(((profile?.xp || 0) / 100) + 1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>{profile?.streak || 0} day streak</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats?.totalQuestions || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Questions</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {stats?.averageAccuracy || 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {stats?.quizHistory?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Quizzes</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {profile?.badges?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Badges</div>
            </Card>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Settings</h2>
          <Card className="p-6">
            <div className="space-y-4">
              
              {/* Profile Name */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Profile Name</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Customize your display name</p>
                </div>
                <input
                  type="text"
                  value={profile?.name || ''}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your name"
                />
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Toggle dark/light theme</p>
                </div>
                <Button
                  onClick={handleDarkModeToggle}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {settings?.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{settings?.darkMode ? 'Light' : 'Dark'}</span>
                </Button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Enable study reminders</p>
                </div>
                <Button
                  onClick={() => updateSettings({ notifications: !settings?.notifications })}
                  variant={settings?.notifications ? "primary" : "secondary"}
                  size="sm"
                >
                  {settings?.notifications ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Data Management</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Export Data */}
              <Button
                onClick={handleExportData}
                variant="secondary"
                className="flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </Button>

              {/* Import Data */}
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  onClick={() => document.getElementById('import-file').click()}
                  variant="secondary"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Data</span>
                </Button>
              </div>

              {/* Reset Data */}
              <Button
                onClick={handleResetData}
                variant="danger"
                className="flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All</span>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Developer Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Developer Tools</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              
              {/* Debug Info Toggle */}
              <Button
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                variant={showDebugInfo ? "primary" : "secondary"}
                className="flex items-center justify-center space-x-2"
              >
                <Bug className="w-4 h-4" />
                <span>{showDebugInfo ? 'Hide' : 'Show'} Debug Info</span>
              </Button>

              {/* Progress Check */}
              <Button
                onClick={() => navigate('/progress-check')}
                variant="secondary"
                className="flex items-center justify-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Progress Check</span>
              </Button>

              {/* Analytics */}
              <Button
                onClick={() => navigate('/analytics')}
                variant="secondary"
                className="flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Analytics</span>
              </Button>
            </div>

            {/* Debug Info Panel */}
            {showDebugInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6"
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Advanced settings and debug tools available in development mode
                  </p>
                </div>
                {/* <StudyTrackerTest /> */}
              </motion.div>
            )}
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default ProfileView;