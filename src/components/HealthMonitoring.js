import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import notificationService from '../utils/notificationService';
import { 
  Heart, 
  Activity, 
  Droplets, 
  Thermometer,
  Wind,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

export default function HealthMonitoring() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDoctorView] = useState(user?.userType === 'doctor');
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 36.6,
    oxygenSaturation: 98,
    glucose: 5.5,
    weight: 70,
    steps: 8500,
    sleep: 7.5,
    stress: 3
  });

  const [alerts, setAlerts] = useState([]);
  const [trends, setTrends] = useState({
    heartRate: { trend: 'stable', change: 0 },
    bloodPressure: { trend: 'up', change: 5 },
    glucose: { trend: 'down', change: -0.3 },
    weight: { trend: 'stable', change: 0 }
  });

  // Load real health data on mount
  useEffect(() => {
    loadHealthData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadHealthData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Load health data from backend
      const data = await apiService.getHealthData(user.id);
      
      if (data && data.vitals) {
        // Update health data with real values
        setHealthData({
          heartRate: data.vitals.heartRate || 72,
          bloodPressure: { 
            systolic: data.vitals.systolic || 120, 
            diastolic: data.vitals.diastolic || 80 
          },
          temperature: data.vitals.temperature || 36.6,
          oxygenSaturation: data.vitals.oxygenSaturation || 98,
          glucose: data.vitals.glucose || 5.5,
          weight: data.vitals.weight || 70,
          steps: data.goals?.steps || 8500,
          sleep: data.goals?.sleep || 7.5,
          stress: data.goals?.stress || 3
        });

        // Update trends if available
        if (data.trends) {
          setTrends(data.trends);
        }

        // Generate alerts based on real data
        const realAlerts = generateHealthAlerts(data.vitals);
        setAlerts(realAlerts);
      } else {
        // Use default data if no data available
        notificationService.info('No health data found. Using default values.');
        
        // Generate default alerts
        setAlerts([
          {
            id: 1,
            type: 'info',
            message: 'Welcome! Start entering your health data.',
            timestamp: new Date().toLocaleString('en-US'),
            icon: CheckCircle
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
      notificationService.error('Error loading health data.');
      
      // Use default data in case of error
      setAlerts([
        {
          id: 1,
          type: 'warning',
          message: 'Unable to load data. Check your connection.',
          timestamp: new Date().toLocaleString('en-US'),
          icon: AlertTriangle
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateHealthAlerts = (vitals) => {
    const alerts = [];
    
    if (vitals.heartRate > 100) {
      alerts.push({
        id: Date.now(),
        type: 'warning',
        message: `High heart rate: ${vitals.heartRate} bpm`,
        timestamp: new Date().toLocaleString('en-US'),
        icon: AlertTriangle
      });
    }
    
    if (vitals.systolic > 140) {
      alerts.push({
        id: Date.now() + 1,
        type: 'warning',
        message: `High systolic blood pressure: ${vitals.systolic} mmHg`,
        timestamp: new Date().toLocaleString('en-US'),
        icon: AlertTriangle
      });
    }
    
    if (vitals.temperature > 37.5) {
      alerts.push({
        id: Date.now() + 2,
        type: 'warning',
        message: `High temperature: ${vitals.temperature}°C`,
        timestamp: new Date().toLocaleString('en-US'),
        icon: AlertTriangle
      });
    }
    
    if (vitals.glucose > 7) {
      alerts.push({
        id: Date.now() + 3,
        type: 'warning',
        message: `High glucose level: ${vitals.glucose} mmol/L`,
        timestamp: new Date().toLocaleString('en-US'),
        icon: AlertTriangle
      });
    }
    
    // If no alert, add a positive message
    if (alerts.length === 0) {
      alerts.push({
        id: Date.now() + 4,
        type: 'info',
        message: 'All your parameters are normal!',
        timestamp: new Date().toLocaleString('en-US'),
        icon: CheckCircle
      });
    }
    
    return alerts;
  };

  const getHealthStatus = (value, type) => {
    const ranges = {
      heartRate: { min: 60, max: 100, unit: 'bpm' },
      systolic: { min: 90, max: 140, unit: 'mmHg' },
      diastolic: { min: 60, max: 90, unit: 'mmHg' },
      temperature: { min: 36.0, max: 37.5, unit: '°C' },
      oxygen: { min: 95, max: 100, unit: '%' },
      glucose: { min: 3.9, max: 6.1, unit: 'mmol/L' }
    };

    const range = ranges[type];
    if (!range) return { status: 'normal', color: 'green' };

    if (value < range.min || value > range.max) {
      return { status: 'alert', color: 'red' };
    } else if (value < range.min * 1.1 || value > range.max * 0.9) {
      return { status: 'warning', color: 'yellow' };
    }
    return { status: 'normal', color: 'green' };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-green-400 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const healthMetrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: healthData.heartRate,
      unit: 'bpm',
      status: getHealthStatus(healthData.heartRate, 'heartRate'),
      trend: trends.heartRate,
      color: 'red'
    },
    {
      icon: Activity,
      label: 'Blood Pressure',
      value: `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`,
      unit: 'mmHg',
      status: getHealthStatus(healthData.bloodPressure.systolic, 'systolic'),
      trend: trends.bloodPressure,
      color: 'blue'
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: healthData.temperature,
      unit: '°C',
      status: getHealthStatus(healthData.temperature, 'temperature'),
      trend: { trend: 'stable', change: 0 },
      color: 'orange'
    },
    {
      icon: Wind,
      label: 'Oxygen Saturation',
      value: healthData.oxygenSaturation,
      unit: '%',
      status: getHealthStatus(healthData.oxygenSaturation, 'oxygen'),
      trend: { trend: 'stable', change: 0 },
      color: 'cyan'
    },
    {
      icon: Droplets,
      label: 'Glucose',
      value: healthData.glucose,
      unit: 'mmol/L',
      status: getHealthStatus(healthData.glucose, 'glucose'),
      trend: trends.glucose,
      color: 'purple'
    },
    {
      icon: Target,
      label: 'Weight',
      value: healthData.weight,
      unit: 'kg',
      status: { status: 'normal', color: 'green' },
      trend: trends.weight,
      color: 'green'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-medical-white/80">Loading health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Activity className="w-8 h-8 mr-3 text-medical-green" />
                Health Monitoring
              </h1>
              <p className="text-medical-white/80">
                {isDoctorView ? 'Professional view of patient data' : 'Tracking your vital signs'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-medical-white/60 text-sm">Last update</p>
                <p className="text-white font-medium">{new Date().toLocaleTimeString('en-US')}</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Alerts */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="space-y-3">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`medical-card p-4 border-l-4 ${
                    alert.type === 'warning' ? 'border-yellow-500' : 'border-green-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <alert.icon className={`w-5 h-5 ${
                        alert.type === 'warning' ? 'text-yellow-400' : 'text-green-400'
                      }`} />
                      <div>
                        <p className="text-white font-medium">{alert.message}</p>
                        <p className="text-medical-white/60 text-sm">{alert.timestamp}</p>
                      </div>
                    </div>
                    <button className="text-medical-white/60 hover:text-white transition-colors">
                      <Clock className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {healthMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`medical-card p-4 border ${
                metric.status.color === 'red' ? 'border-red-500/30' :
                metric.status.color === 'yellow' ? 'border-yellow-500/30' :
                'border-green-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                {getTrendIcon(metric.trend.trend)}
              </div>
              <div>
                <p className="text-medical-white/70 text-xs mb-1">{metric.label}</p>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  <span className="text-medical-white/60 text-sm ml-1">{metric.unit}</span>
                </div>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    metric.status.color === 'red' ? 'bg-red-400' :
                    metric.status.color === 'yellow' ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`} />
                  <span className={`text-xs ${
                    metric.status.color === 'red' ? 'text-red-400' :
                    metric.status.color === 'yellow' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {metric.status.status === 'alert' ? 'Alert' :
                     metric.status.status === 'warning' ? 'Warning' : 'Normal'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Daily Activity */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="medical-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-medical-green" />
              Daily Activity
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Steps</p>
                    <p className="text-medical-white/60 text-sm">Goal: 10,000</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{healthData.steps.toLocaleString()}</p>
                  <p className="text-medical-green text-sm">85% achieved</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Sleep</p>
                    <p className="text-medical-white/60 text-sm">Goal: 8h</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{healthData.sleep}h</p>
                  <p className="text-yellow-400 text-sm">94% achieved</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Stress</p>
                    <p className="text-medical-white/60 text-sm">Scale 1-10</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{healthData.stress}/10</p>
                  <p className="text-green-400 text-sm">Low</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent History */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="medical-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-medical-green" />
              Recent History
            </h3>
            <div className="space-y-3">
              {[
                { date: 'Today', heartRate: healthData.heartRate, pressure: `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`, glucose: healthData.glucose },
                { date: 'Yesterday', heartRate: healthData.heartRate - 2, pressure: `${healthData.bloodPressure.systolic - 5}/${healthData.bloodPressure.diastolic - 2}`, glucose: healthData.glucose + 0.3 },
                { date: '2 days ago', heartRate: healthData.heartRate + 1, pressure: `${healthData.bloodPressure.systolic - 2}/${healthData.bloodPressure.diastolic - 2}`, glucose: healthData.glucose - 0.2 },
                { date: '3 days ago', heartRate: healthData.heartRate - 1, pressure: `${healthData.bloodPressure.systolic + 2}/${healthData.bloodPressure.diastolic + 1}`, glucose: healthData.glucose + 0.1 }
              ].map((day, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{day.date}</p>
                    <p className="text-medical-white/60 text-sm">
                      FC: {day.heartRate} | TA: {day.pressure} | Gly: {day.glucose}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/analysis-results')}
            className="bg-medical-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-green/80 transition-all flex items-center justify-center space-x-2"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Complete Analysis</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat-ai')}
            className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
          >
            <Activity className="w-5 h-5" />
            <span>AI Advisor</span>
          </motion.button>
        </motion.div>

        {/* Medical Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 medical-card p-6 border-l-4 border-blue-500"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Continuous Monitoring</h4>
              <p className="text-medical-white/80 text-sm">
                This data is collected automatically and allows continuous monitoring of your health status.
                In case of persistent abnormalities, consult a healthcare professional.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
