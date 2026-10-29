import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  FileText, 
  Settings, 
  User, 
  LogOut, 
  Activity,
  Heart,
  BarChart3,
  Bot,
  Menu,
  X,
  MessageCircle,
  Stethoscope,
  AlertTriangle,
  Users,
  Brain,
  Pill
} from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Overview',
      userTypes: ['doctor', 'patient']
    },
    {
      path: '/ai-demo',
      label: 'AI Demo',
      icon: <Activity className="w-5 h-5" />,
      description: 'How to use',
      userTypes: ['doctor', 'patient']
    },
    {
      path: '/advanced-ai-prediction',
      label: 'AI Predictions',
      icon: <Brain className="w-5 h-5" />,
      description: 'Cancer & Long-term',
      userTypes: ['doctor', 'patient']
    },
    {
      path: '/doctor-space',
      label: 'Doctor Space',
      icon: <Stethoscope className="w-5 h-5" />,
      description: 'Medical tools',
      userTypes: ['doctor']
    },
    {
      path: '/patient-space',
      label: 'Patient Space',
      icon: <Heart className="w-5 h-5" />,
      description: 'Personal tracking',
      userTypes: ['patient']
    },
    {
      path: '/appointments',
      label: 'Appointments',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Appointment management',
      userTypes: ['doctor', 'patient']
    },
    {
      path: '/medical-records',
      label: 'Medical Records',
      icon: <FileText className="w-5 h-5" />,
      description: 'Documents',
      userTypes: ['doctor', 'patient']
    },
    {
      path: '/reports',
      label: 'AI Reports',
      icon: <Activity className="w-5 h-5" />,
      description: 'Analysis',
      userTypes: ['doctor']
    },
    {
      path: '/chat-ai',
      label: 'AI Assistant',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'Smart chat',
      userTypes: ['doctor', 'patient']
    },
    {
      path: '/health-monitoring',
      label: 'Monitoring',
      icon: <Activity className="w-5 h-5" />,
      description: 'Health tracking',
      userTypes: ['doctor', 'patient']
    },
    {
      path: '/emergency',
      label: 'Emergency',
      icon: <AlertTriangle className="w-5 h-5" />,
      description: 'Support',
      userTypes: ['doctor', 'patient']
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      description: 'Settings',
      userTypes: ['doctor', 'patient']
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      description: 'Configuration',
      userTypes: ['doctor', 'patient']
    },
    { 
      path: '/contact', 
      label: 'Contact', 
      icon: <Users className="w-5 h-5" />,
      description: 'Support & Help'
    },
    {
      path: '/medicine-scanner',
      label: 'Medicine Scanner',
      icon: <Pill className="w-5 h-5" />,
      description: 'AI medicine recognition',
      userTypes: ['doctor', 'patient']
    },
    {
      path: '/health-insights',
      label: 'Health Insights',
      icon: <Activity className="w-5 h-5" />,
      description: 'AI health analysis',
      userTypes: ['doctor', 'patient']
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-medical-dark-blue/95 to-medical-blue/95 backdrop-blur-lg border-r border-white/10 z-40">
        <div className="p-6 h-full overflow-y-auto">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 mb-8"
          >
            <Heart className="w-8 h-8 text-medical-green" />
            <h1 className="text-xl font-bold text-white">MedAI Platform</h1>
          </motion.div>

          {/* User Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-medical-green to-medical-blue rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{user?.name || 'User'}</p>
                <p className="text-medical-white/70 text-xs capitalize">{user?.userType || 'Professional'}</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="space-y-2 mb-8">
            {navigationItems
              .filter(item => item.userTypes && item.userTypes.includes(user?.userType || 'patient'))
              .map((item, index) => (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActivePath(item.path)
                    ? 'bg-medical-green/20 border border-medical-green/50 text-medical-green'
                    : 'text-medical-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs opacity-70">{item.description}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Logout Button */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-auto pt-8 border-t border-white/10"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-medical-dark-blue/95 to-medical-blue/95 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-medical-green" />
            <h1 className="text-lg font-bold text-white">MedAI Platform</h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-h-96 overflow-y-auto"
          >
            <div className="p-4 space-y-2">
              {navigationItems
                .filter(item => item.userTypes && item.userTypes.includes(user?.userType || 'patient'))
                .map((item) => (
                <motion.button
                  key={item.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActivePath(item.path)
                      ? 'bg-medical-green/20 border border-medical-green/50 text-medical-green'
                      : 'text-medical-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
