import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Activity, 
  FileText, 
  Settings, 
  Heart, 
  Stethoscope,
  Calendar,
  MessageCircle,
  LogOut
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedSpace, setSelectedSpace] = useState(null);

  const handleSpaceSelection = (space) => {
    setSelectedSpace(space);
    setTimeout(() => {
      navigate(space === 'doctor' ? '/doctor-space' : '/patient-space');
    }, 300);
  };

  const stats = [
    { icon: <Activity className="w-6 h-6" />, label: 'Patients Treated', value: '2,847', change: '+12%' },
    { icon: <FileText className="w-6 h-6" />, label: 'AI Diagnostics', value: '1,523', change: '+15%' },
    { icon: <Heart className="w-6 h-6" />, label: 'Success Rate', value: '98.5%', change: '+3%' },
    { icon: <Activity className="w-6 h-6" />, label: 'Accuracy', value: '94.2%', change: '+2%' }
  ];

  const features = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: "AI Diagnostics",
      description: "Advanced algorithms",
      path: '/reports'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Appointments",
      description: "Consultation management",
      path: '/appointments'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Medical Records",
      description: "Document access",
      path: '/medical-records'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Chat",
      description: "Medical assistant",
      path: '/chat-ai'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-medical-green" />
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <User className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/settings')}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="medical-card mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome, {user?.name || 'Doctor'}!
              </h2>
              <p className="text-medical-white/80">
                Access your personalized AI medical platform
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-medical-white/60">
                {user?.userType === 'doctor' ? 'Doctor' : 'Patient'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="medical-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-medical-green">
                  {stat.icon}
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{stat.value}</h3>
              <p className="text-medical-white/70 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Space Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Choose your space</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSpaceSelection('doctor')}
              className={`medical-card p-6 text-left ${
                selectedSpace === 'doctor' 
                  ? 'bg-medical-green/20 border-medical-green/50' 
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedSpace === 'doctor' 
                    ? 'bg-medical-green' 
                    : 'bg-white/20'
                }`}>
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Doctor Space</h3>
                  <p className="text-medical-white/70 text-sm">
                    Diagnostic tools and patient management
                  </p>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSpaceSelection('patient')}
              className={`medical-card p-6 text-left ${
                selectedSpace === 'patient' 
                  ? 'bg-medical-light-blue/20 border-medical-light-blue/50' 
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedSpace === 'patient' 
                    ? 'bg-medical-light-blue' 
                    : 'bg-white/20'
                }`}>
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Patient Space</h3>
                  <p className="text-medical-white/70 text-sm">
                    Medical tracking and consultations
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(feature.path)}
                className="medical-card p-4 text-left group cursor-pointer"
              >
                <div className="text-medical-green mb-2 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                <p className="text-medical-white/70 text-xs">{feature.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
