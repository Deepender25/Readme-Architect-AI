"use client"

import { useState, Suspense } from 'react'
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar'
import MinimalGridBackground from '@/components/minimal-geometric-background'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Palette, 
  FileText, 
  Zap, 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  RotateCcw,
  Bell,
  Globe,
  Code,
  Sparkles,
  Github
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'

function SettingsContent() {
  const { user, isAuthenticated } = useAuth();
  
  // Settings state
  const [settings, setSettings] = useState({
    // README Generation Settings
    defaultTemplate: 'comprehensive',
    includeDemo: true,
    defaultScreenshots: 2,
    defaultVideos: 1,
    autoSave: true,
    
    // UI/UX Settings
    theme: 'dark',
    animations: true,
    compactMode: false,
    showLineNumbers: true,
    
    // Privacy & Security
    publicProfile: false,
    shareHistory: false,
    analyticsOptIn: true,
    
    // Notifications
    emailNotifications: true,
    browserNotifications: false,
    weeklyDigest: true,
    
    // Advanced
    apiTimeout: 30,
    maxHistoryItems: 50,
    autoCleanup: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message (you could add a toast here)
  };

  const handleResetSettings = () => {
    setSettings({
      defaultTemplate: 'comprehensive',
      includeDemo: true,
      defaultScreenshots: 2,
      defaultVideos: 1,
      autoSave: true,
      theme: 'dark',
      animations: true,
      compactMode: false,
      showLineNumbers: true,
      publicProfile: false,
      shareHistory: false,
      analyticsOptIn: true,
      emailNotifications: true,
      browserNotifications: false,
      weeklyDigest: true,
      apiTimeout: 30,
      maxHistoryItems: 50,
      autoCleanup: true
    });
  };

  const handleExportData = () => {
    // Export user data
    const dataToExport = {
      settings,
      exportDate: new Date().toISOString(),
      user: user?.username
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autodocai-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-foreground relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 z-0 w-full h-full">
          <MinimalGridBackground />
        </div>
        <div className="fixed top-0 left-0 right-0 z-50">
          <GitHubOAuthNavbar />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-400">Please sign in to access your settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <MinimalGridBackground />
      </div>
      
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GitHubOAuthNavbar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-6 py-8"
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent mb-4">
                Settings
              </h1>
              <p className="text-gray-400 text-lg">
                Customize your AutoDoc AI experience
              </p>
            </motion.div>

            {/* Settings Sections */}
            <div className="space-y-8">
              
              {/* Profile Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Profile</h2>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={user?.avatar_url}
                      alt={user?.name}
                      className="w-16 h-16 rounded-full border-2 border-green-400/50"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                      <p className="text-gray-400">@{user?.username}</p>
                      <a 
                        href={user?.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1 mt-1"
                      >
                        <Github className="w-4 h-4" />
                        View GitHub Profile
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Public Profile</span>
                      <button
                        onClick={() => handleSettingChange('publicProfile', !settings.publicProfile)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.publicProfile ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.publicProfile ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Share History</span>
                      <button
                        onClick={() => handleSettingChange('shareHistory', !settings.shareHistory)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.shareHistory ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.shareHistory ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* README Generation Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">README Generation</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Default Template
                      </label>
                      <select
                        value={settings.defaultTemplate}
                        onChange={(e) => handleSettingChange('defaultTemplate', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
                      >
                        <option value="minimal">Minimal</option>
                        <option value="standard">Standard</option>
                        <option value="comprehensive">Comprehensive</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Include Demo by Default</span>
                      <button
                        onClick={() => handleSettingChange('includeDemo', !settings.includeDemo)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.includeDemo ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.includeDemo ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Default Screenshots: {settings.defaultScreenshots}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={settings.defaultScreenshots}
                        onChange={(e) => handleSettingChange('defaultScreenshots', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Default Videos: {settings.defaultVideos}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        value={settings.defaultVideos}
                        onChange={(e) => handleSettingChange('defaultVideos', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Auto-save Generated READMEs</span>
                      <button
                        onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.autoSave ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* UI/UX Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Interface</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Animations</span>
                      <button
                        onClick={() => handleSettingChange('animations', !settings.animations)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.animations ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.animations ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Compact Mode</span>
                      <button
                        onClick={() => handleSettingChange('compactMode', !settings.compactMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.compactMode ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Show Line Numbers</span>
                      <button
                        onClick={() => handleSettingChange('showLineNumbers', !settings.showLineNumbers)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.showLineNumbers ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.showLineNumbers ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Notifications</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Email Notifications</span>
                      <button
                        onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Browser Notifications</span>
                      <button
                        onClick={() => handleSettingChange('browserNotifications', !settings.browserNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.browserNotifications ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.browserNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Weekly Digest</span>
                      <button
                        onClick={() => handleSettingChange('weeklyDigest', !settings.weeklyDigest)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.weeklyDigest ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Analytics Opt-in</span>
                      <button
                        onClick={() => handleSettingChange('analyticsOptIn', !settings.analyticsOptIn)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.analyticsOptIn ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.analyticsOptIn ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Advanced Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Advanced</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        API Timeout (seconds): {settings.apiTimeout}
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={settings.apiTimeout}
                        onChange={(e) => handleSettingChange('apiTimeout', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max History Items: {settings.maxHistoryItems}
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="10"
                        value={settings.maxHistoryItems}
                        onChange={(e) => handleSettingChange('maxHistoryItems', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Auto-cleanup Old History</span>
                      <button
                        onClick={() => handleSettingChange('autoCleanup', !settings.autoCleanup)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.autoCleanup ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.autoCleanup ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Data Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Data Management</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      className="flex items-center gap-2 border-green-400/50 text-green-400 hover:bg-green-400/10"
                    >
                      <Download className="w-4 h-4" />
                      Export Data
                    </Button>

                    <Button
                      onClick={handleResetSettings}
                      variant="outline"
                      className="flex items-center gap-2 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset Settings
                    </Button>

                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-red-400/50 text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Save Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-green-400 text-black hover:bg-green-300 font-medium px-8 py-3 text-lg"
                >
                  {isSaving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Saving...
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      Save Settings
                    </div>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Custom Styles for Sliders */}
      <style jsx global>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
        }
      `}</style>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  )
}