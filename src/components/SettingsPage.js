import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Bell, Shield, Palette, Globe, HelpCircle, Save, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    appointments: true,
    results: true,
    updates: false
  });
  const [privacy, setPrivacy] = useState({
    shareData: false,
    analytics: true,
    marketing: false,
    twoFactor: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-5 h-5" /> },
    { id: 'language', label: 'Language', icon: <Globe className="w-5 h-5" /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> }
  ];

  const handleSave = () => {
    // Simulate saving settings
    console.log('Settings saved:', { notifications, privacy });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-medical-green opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-medical-light-blue opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="medical-card">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-medical-green/20 border border-medical-green/50 text-medical-green'
                        : 'text-medical-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="medical-card">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-medical-white/80 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name || 'Dr. John Smith'}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-medical-white/80 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || 'doctor@hospital.com'}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-medical-white/80 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-medical-white/80 mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        defaultValue="General Medicine"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-medical-white/80 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      defaultValue="Passionate about integrating AI technology into healthcare delivery to improve patient outcomes and streamline medical workflows."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {Object.entries({
                      email: 'Email Notifications',
                      push: 'Push Notifications',
                      sms: 'SMS Notifications',
                      appointments: 'Appointment Reminders',
                      results: 'Test Results',
                      updates: 'Platform Updates'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{label}</h4>
                          <p className="text-sm text-medical-white/70">
                            {key === 'email' && 'Receive updates via email'}
                            {key === 'push' && 'Get instant notifications on your device'}
                            {key === 'sms' && 'Receive text message alerts'}
                            {key === 'appointments' && 'Remind me about upcoming appointments'}
                            {key === 'results' && 'Notify when test results are ready'}
                            {key === 'updates' && 'Get news about platform features'}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setNotifications({...notifications, [key]: !notifications[key]})}
                          className={`w-12 h-6 rounded-full transition-all duration-300 ${
                            notifications[key] ? 'bg-medical-green' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                            notifications[key] ? 'translate-x-6' : 'translate-x-0.5'
                          }`}></div>
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-4">
                    {Object.entries({
                      shareData: 'Share anonymized data for research',
                      analytics: 'Allow usage analytics',
                      marketing: 'Receive marketing communications',
                      twoFactor: 'Two-factor authentication'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{label}</h4>
                          <p className="text-sm text-medical-white/70">
                            {key === 'shareData' && 'Help improve medical AI research'}
                            {key === 'analytics' && 'Help us improve the platform'}
                            {key === 'marketing' && 'Receive promotional content'}
                            {key === 'twoFactor' && 'Add an extra layer of security'}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setPrivacy({...privacy, [key]: !privacy[key]})}
                          className={`w-12 h-6 rounded-full transition-all duration-300 ${
                            privacy[key] ? 'bg-medical-green' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                            privacy[key] ? 'translate-x-6' : 'translate-x-1'
                          }`}></div>
                        </motion.button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 className="text-red-400 font-semibold mb-2">Danger Zone</h4>
                    <p className="text-sm text-red-300 mb-4">These actions cannot be undone</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 font-semibold hover:bg-red-500/30 transition-all duration-300"
                    >
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Other tabs with placeholder content */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Appearance</h2>
                  <p className="text-medical-white/70">Customize your platform appearance</p>
                  <div className="p-8 bg-white/5 rounded-lg text-center">
                    <div className="text-4xl mb-4">🎨</div>
                    <p className="text-white">Theme customization coming soon</p>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Language & Region</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-medical-white/80 mb-2">
                        Language
                      </label>
                      <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300">
                        <option>English</option>
                        <option>Français</option>
                        <option>Español</option>
                        <option>Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Help & Support</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-300"
                    >
                      <h4 className="text-white font-semibold mb-2">Documentation</h4>
                      <p className="text-sm text-medical-white/70">Browse our help articles</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-300"
                    >
                      <h4 className="text-white font-semibold mb-2">Video Tutorials</h4>
                      <p className="text-sm text-medical-white/70">Watch guided tutorials</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-300"
                    >
                      <h4 className="text-white font-semibold mb-2">Contact Support</h4>
                      <p className="text-sm text-medical-white/70">Get help from our team</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-300"
                    >
                      <h4 className="text-white font-semibold mb-2">FAQ</h4>
                      <p className="text-sm text-medical-white/70">Frequently asked questions</p>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="medical-button flex items-center space-x-2 px-6 py-3"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
