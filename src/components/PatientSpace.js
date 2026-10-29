import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import notificationService from '../utils/notificationService';
import { 
  ArrowLeft, 
  Heart, 
  Activity, 
  Calendar,
  Pill,
  FileText,
  TrendingUp,
  AlertCircle,
  Clock,
  Video,
  MessageCircle,
  Phone,
  User,
  Droplet,
  Brain,
  Eye,
  Thermometer,
  Weight,
  Target
} from 'lucide-react';

export default function PatientSpace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(true);

  // State for real data - empty initially
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [healthGoals, setHealthGoals] = useState([]);

  // Load real data on component mount
  useEffect(() => {
    loadPatientData();
  }, [user?.id]);

  const loadPatientData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setBackendAvailable(true);

      // Load health data from backend
      const healthData = await apiService.getHealthData(user.id);

      if (healthData && healthData.vitals) {
        // Update health metrics with real data
        setHealthMetrics([
          {
            icon: <Heart className="w-6 h-6" />,
            label: 'Heart Rate',
            value: `${healthData.vitals.heartRate || 72} bpm`,
            status: getHealthStatus(healthData.vitals.heartRate, 'heartRate'),
            color: getHealthColor(healthData.vitals.heartRate, 'heartRate')
          },
          {
            icon: <Thermometer className="w-6 h-6" />,
            label: 'Temperature',
            value: `${healthData.vitals.temperature || 36.6}°C`,
            status: getHealthStatus(healthData.vitals.temperature, 'temperature'),
            color: getHealthColor(healthData.vitals.temperature, 'temperature')
          },
          {
            icon: <Droplet className="w-6 h-6" />,
            label: 'Blood Pressure',
            value: `${healthData.vitals.systolic || 120}/${healthData.vitals.diastolic || 80}`,
            status: getHealthStatus(healthData.vitals.systolic, 'systolic'),
            color: getHealthColor(healthData.vitals.systolic, 'systolic')
          },
          {
            icon: <Activity className="w-6 h-6" />,
            label: 'Oxygen Level',
            value: `${healthData.vitals.oxygenSaturation || 98}%`,
            status: getHealthStatus(healthData.vitals.oxygenSaturation, 'oxygen'),
            color: getHealthColor(healthData.vitals.oxygenSaturation, 'oxygen')
          },
        ]);
      } else {
        // No data from backend - show empty state
        setHealthMetrics([]);
      }

      // Load appointments
      const appointmentsData = await apiService.getAppointments(user.id);
      if (appointmentsData && appointmentsData.length > 0) {
        setAppointments(appointmentsData.map(apt => ({
          doctor: apt.doctor_name || 'Dr. Unknown',
          specialty: apt.specialty || 'General',
          date: new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          type: apt.type || 'in-person'
        })));
      } else {
        setAppointments([]);
      }

      // Load medical records for medications
      const medicalRecords = await apiService.getMedicalRecords(user.id);
      if (medicalRecords && medicalRecords.length > 0) {
        const prescriptions = medicalRecords
          .filter(record => record.type === 'prescription')
          .map(record => ({
            name: record.title || 'Medication',
            dosage: record.dosage || 'As prescribed',
            frequency: record.frequency || 'As directed',
            time: record.time || 'As scheduled',
            remaining: record.remaining || 'As needed'
          }));

        if (prescriptions.length > 0) {
          setMedications(prescriptions);
        } else {
          setMedications([]);
        }
      } else {
        setMedications([]);
      }

      // Update health goals if available
      if (healthData && healthData.goals) {
        setHealthGoals([
          {
            title: 'Daily Steps',
            current: healthData.goals.steps || 7500,
            target: healthData.goals.steps_target || 10000,
            unit: 'steps',
            icon: <Activity className="w-5 h-5" />
          },
          {
            title: 'Water Intake',
            current: healthData.goals.water || 6,
            target: healthData.goals.water_target || 8,
            unit: 'glasses',
            icon: <Droplet className="w-5 h-5" />
          },
          {
            title: 'Sleep Hours',
            current: healthData.goals.sleep || 6.5,
            target: healthData.goals.sleep_target || 8,
            unit: 'hours',
            icon: <Brain className="w-5 h-5" />
          },
          {
            title: 'Exercise Minutes',
            current: healthData.goals.exercise || 25,
            target: healthData.goals.exercise_target || 30,
            unit: 'minutes',
            icon: <Target className="w-5 h-5" />
          },
        ]);
      } else {
        setHealthGoals([]);
      }

    } catch (error) {
      console.error('Error loading patient data:', error);
      setBackendAvailable(false);
      notificationService.error('Unable to connect to server. Please check if the backend is running.');
      // Set empty states when backend unavailable
      setHealthMetrics([]);
      setMedications([]);
      setAppointments([]);
      setHealthGoals([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions utilitaires pour déterminer le statut de santé
  const getHealthStatus = (value, type) => {
    const ranges = {
      heartRate: { min: 60, max: 100 },
      systolic: { min: 90, max: 140 },
      temperature: { min: 36.0, max: 37.5 },
      oxygen: { min: 95, max: 100 }
    };

    const range = ranges[type];
    if (!range) return 'normal';

    if (value < range.min || value > range.max) return 'abnormal';
    if (value < range.min * 1.1 || value > range.max * 0.9) return 'warning';
    return 'normal';
  };

  const getHealthColor = (value, type) => {
    const status = getHealthStatus(value, type);
    switch(status) {
      case 'abnormal': return 'red';
      case 'warning': return 'yellow';
      default: return 'green';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'normal':
      case 'optimal':
      case 'excellent': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-medical-white/80">Loading your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-medical-green opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-medical-light-blue opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-white">Espace Patient</h1>
              <p className="text-medical-white/70">Votre Tableau de Bord Santé Personnel</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!backendAvailable && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">Backend Offline</span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with AI</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 medical-button"
            >
              <Phone className="w-5 h-5" />
              <span>Emergency</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex space-x-1 mb-8 bg-white/5 p-1 rounded-lg backdrop-blur-sm"
        >
          {['overview', 'medications', 'appointments', 'goals'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-medical-green text-white shadow-lg'
                  : 'text-medical-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* IA Santé Section */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-medical-green" />
                    IA Santé
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="medical-card cursor-pointer border border-medical-green/30"
                      onClick={() => navigate('/chat-ai')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-medical-green/20 rounded-lg">
                          <MessageCircle className="w-6 h-6 text-medical-green" />
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          Nouveau
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">Assistant IA</div>
                      <div className="text-sm text-medical-white/70">Chat intelligent pour vos questions santé</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="medical-card cursor-pointer border border-blue-500/30"
                      onClick={() => navigate('/medical-analysis')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Activity className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                          Analyse
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">AI Analysis</div>
                      <div className="text-sm text-medical-white/70">Complete evaluation with ML</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="medical-card cursor-pointer border border-purple-500/30"
                      onClick={() => navigate('/health-monitoring')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Heart className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                          Surveillance
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">Suivi Santé</div>
                      <div className="text-sm text-medical-white/70">Monitoring en temps réel</div>
                    </motion.div>
                  </div>
                </div>

                {/* Health Metrics */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Today's Health Metrics</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {healthMetrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="medical-card"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <div className="text-medical-light-blue">{metric.icon}</div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                            {metric.status}
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white mb-1">{metric.value}</div>
                        <div className="text-sm text-medical-white/70">{metric.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Recent Health Activities</h2>
                  <div className="space-y-3">
                    {[
                      { time: '2 hours ago', activity: 'Completed morning medication', type: 'medication' },
                      { time: '4 hours ago', activity: '30-minute walk completed', type: 'exercise' },
                      { time: '6 hours ago', activity: 'Blood pressure reading logged', type: 'measurement' },
                      { time: '1 day ago', activity: 'Virtual consultation with Dr. Chen', type: 'appointment' },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="medical-card flex items-center space-x-4"
                      >
                        <div className="w-10 h-10 bg-medical-green/20 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-medical-green" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{activity.activity}</p>
                          <p className="text-sm text-medical-white/50">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'medications' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Medication Schedule</h2>
                <div className="space-y-4">
                  {medications.map((med, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className="medical-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-medical-blue/20 rounded-full flex items-center justify-center">
                            <Pill className="w-6 h-6 text-medical-light-blue" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{med.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-medical-white/70">
                              <span>{med.dosage}</span>
                              <span>•</span>
                              <span>{med.frequency}</span>
                              <span>•</span>
                              <span>{med.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-medical-white/70">Remaining</p>
                          <p className="text-lg font-semibold text-white">{med.remaining}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="medical-card border-2 border-dashed border-white/20 hover:border-medical-light-blue transition-all duration-300 cursor-pointer"
                >
                  <div className="text-center py-8">
                    <Pill className="w-12 h-12 text-medical-white/50 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">Add New Medication</p>
                    <p className="text-sm text-medical-white/50">Manage your prescription schedule</p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'appointments' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">Upcoming Appointments</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="medical-button"
                  >
                    Schedule New
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {appointments.map((apt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className="medical-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-medical-green/20 rounded-full flex items-center justify-center">
                            {apt.type === 'video' ? (
                              <Video className="w-6 h-6 text-medical-green" />
                            ) : (
                              <User className="w-6 h-6 text-medical-green" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{apt.doctor}</h3>
                            <div className="flex items-center space-x-4 text-sm text-medical-white/70">
                              <span>{apt.specialty}</span>
                              <span>•</span>
                              <span>{apt.date}</span>
                              <span>•</span>
                              <span>{apt.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            apt.type === 'video' ? 'bg-blue-400/20 text-blue-400' : 'bg-green-400/20 text-green-400'
                          }`}>
                            {apt.type}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
                          >
                            <Calendar className="w-4 h-4 text-medical-white/70" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'goals' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Health Goals Progress</h2>
                <div className="space-y-4">
                  {healthGoals.map((goal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className="medical-card"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-medical-blue/20 rounded-lg">
                            <div className="text-medical-light-blue">{goal.icon}</div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                            <p className="text-sm text-medical-white/70">
                              {goal.current} / {goal.target} {goal.unit}
                            </p>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-white">
                          {Math.round(getProgressPercentage(goal.current, goal.target))}%
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="h-full bg-gradient-to-r from-medical-green to-medical-light-blue rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="medical-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Health AI Assistant</h3>
              <div className="h-40 relative bg-gradient-to-br from-medical-green/20 to-medical-blue/20 rounded-lg flex items-center justify-center">
                <Brain className="w-16 h-16 text-medical-green/50" />
              </div>
              <div className="mt-4 p-3 bg-medical-green/20 rounded-lg">
                <p className="text-sm text-medical-white/80">
                  "Great job on your health goals today! Your vitals look excellent. Remember to take your evening medication at 8 PM."
                </p>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="medical-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: <Activity className="w-4 h-4" />, label: 'Log Vitals' },
                  { icon: <Pill className="w-4 h-4" />, label: 'Medication Reminder' },
                  { icon: <FileText className="w-4 h-4" />, label: 'View Reports' },
                  { icon: <AlertCircle className="w-4 h-4" />, label: 'Symptom Checker' },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    <div className="text-medical-green">{action.icon}</div>
                    <span className="text-sm text-white">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Health Score */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="medical-card text-center"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Health Score</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-medical-green to-medical-light-blue p-1">
                  <div className="w-full h-full rounded-full bg-medical-dark-blue flex items-center justify-center">
                    <div>
                      <div className="text-3xl font-bold text-white">92</div>
                      <div className="text-xs text-medical-white/70">Excellent</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-medical-white/70">Keep up the great work!</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
