import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Activity,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  LogOut
} from 'lucide-react';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: '2024-01-30',
      time: '09:00 AM',
      doctor: 'Dr. Sarah Johnson',
      type: 'checkup',
      status: 'confirmed',
      notes: 'Routine follow-up examination'
    },
    {
      id: 2,
      date: '2024-01-30',
      time: '11:00 AM',
      doctor: 'Dr. Michael Chen',
      type: 'consultation',
      status: 'confirmed',
      notes: 'Discussing test results'
    },
    {
      id: 3,
      date: '2024-01-31',
      time: '02:00 PM',
      doctor: 'Dr. Emma Williams',
      type: 'follow-up',
      status: 'pending',
      notes: 'Review treatment plan'
    }
  ]);

  const [healthMetrics, setHealthMetrics] = useState({
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '36.8',
    lastCheckup: '2024-01-29'
  });

  const [medications, setMedications] = useState([
    {
      name: 'Vitamine D',
      dosage: '1000mg',
      frequency: 'daily',
      remaining: 25,
      nextRefill: '2024-02-15'
    },
    {
      name: 'Metformine',
      dosage: '500mg',
      frequency: 'twice daily',
      remaining: 10,
      nextRefill: '2024-02-10'
    }
  ]);

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
            <h1 className="text-2xl font-bold text-white">Espace Patient</h1>
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
                localStorage.removeItem('token');
                localStorage.removeItem('user');
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
                Bienvenue, {user?.name || 'Patient'}!
              </h2>
              <p className="text-medical-white/80">
                Votre santé est notre priorité
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-medical-white/60">
                Patient ID: {user?.id || 'PAT-001'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Health Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="medical-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-medical-green">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-sm text-white">Pression Artérielle</span>
            </div>
            <h3 className="text-lg font-bold text-white">{healthMetrics.bloodPressure}</h3>
            <p className="text-medical-white/70 text-sm">120/80 mmHg</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="medical-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-medical-light-blue">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-sm text-white">Fréquence Cardiaque</span>
            </div>
            <h3 className="text-lg font-bold text-white">{healthMetrics.heartRate}</h3>
            <p className="text-medical-white/70 text-sm">72 bpm</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="medical-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-medical-green">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-sm text-white">Température</span>
            </div>
            <h3 className="text-lg font-bold text-white">{healthMetrics.temperature}°C</h3>
            <p className="text-medical-white/70 text-sm">36.8°C</p>
          </motion.div>
        </motion.div>

        {/* Appointments Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Mes Rendez-vous</h2>
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="medical-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    appointment.status === 'confirmed' ? 'bg-green-500' : 
                    appointment.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {appointment.status === 'confirmed' && <CheckCircle className="w-4 h-4 text-white" />}
                    {appointment.status === 'pending' && <Clock className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{appointment.time}</p>
                    <p className="text-medical-white/70 text-xs">{appointment.doctor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 
                    appointment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Medications Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Mes Médicaments</h2>
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="medical-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 bg-medical-green rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{medication.name}</p>
                    <p className="text-medical-white/70 text-xs">{medication.dosage}mg</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    medication.remaining > 5 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {medication.remaining}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/appointments')}
            className="medical-card p-4 text-center"
          >
            <div className="text-medical-green mb-2">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-white font-medium">Rendez-vous</h4>
            <p className="text-medical-white/70 text-sm">Planifier</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/medical-records')}
            className="medical-card p-4 text-center"
          >
            <div className="text-medical-light-blue mb-2">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-white font-medium">Dossiers</h4>
            <p className="text-medical-white/70 text-sm">Consulter</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat-ai')}
            className="medical-card p-4 text-center"
          >
            <div className="text-medical-green mb-2">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="text-white font-medium">Chat IA</h4>
            <p className="text-medical-white/70 text-sm">Assistant</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/emergency')}
            className="medical-card p-4 text-center"
          >
            <div className="text-red-400 mb-2">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-white font-medium">Urgence</h4>
            <p className="text-red-300 text-sm">Contactez le support</p>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
