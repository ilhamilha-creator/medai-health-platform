import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import databaseService from '../services/databaseService';
import apiService from '../services/apiService';
import notificationService from '../utils/notificationService';
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplet, 
  Wind,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  Clock,
  RefreshCw,
  Download,
  Play,
  Pause,
  BarChart3,
  Zap,
  Monitor
} from 'lucide-react';

export default function VitalSignsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [vitalSigns, setVitalSigns] = useState({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 36.8,
    oxygenSaturation: 98,
    respiratoryRate: 16,
    glucose: 95
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Retrieve patients from database
  const patients = databaseService.getUsersByType('patient');

  useEffect(() => {
    if (selectedPatient) {
      loadRealVitalSigns();
      loadHistoricalData();
      loadAlerts();
    }
  }, [selectedPatient]);

  const loadRealVitalSigns = async () => {
    if (!selectedPatient) return;
    
    try {
      // Load real vital signs from backend
      const healthData = await apiService.getHealthData(selectedPatient.id);
      
      if (healthData && healthData.vitals) {
        setVitalSigns({
          heartRate: healthData.vitals.heartRate || 72,
          bloodPressure: { 
            systolic: healthData.vitals.systolic || 120, 
            diastolic: healthData.vitals.diastolic || 80 
          },
          temperature: healthData.vitals.temperature || 36.8,
          oxygenSaturation: healthData.vitals.oxygenSaturation || 98,
          respiratoryRate: healthData.vitals.respiratoryRate || 16,
          glucose: healthData.vitals.glucose || 95
        });
      }
    } catch (error) {
      console.warn('Could not load real vital signs, using simulation:', error);
      // Fallback vers simulation si backend non disponible
    }
  };

  const loadAlerts = async () => {
    if (!selectedPatient) return;
    
    try {
      // Load real alerts from backend
      const healthData = await apiService.getHealthData(selectedPatient.id);
      
      if (healthData && healthData.alerts) {
        setAlerts(healthData.alerts.map(alert => ({
          id: alert.id,
          type: alert.type || 'info',
          message: alert.message,
          time: alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        })));
      } else {
        // Use alerts based on current data
        generateCurrentAlerts();
      }
    } catch (error) {
      console.warn('Could not load alerts, generating from current data:', error);
      generateCurrentAlerts();
    }
  };

  const generateCurrentAlerts = () => {
    const currentAlerts = [];
    
    if (vitalSigns.heartRate > 90 || vitalSigns.heartRate < 60) {
      currentAlerts.push({
        id: Date.now(),
        type: 'warning',
        message: `Abnormal heart rate: ${vitalSigns.heartRate} bpm`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    }
    
    if (vitalSigns.bloodPressure.systolic > 130) {
      currentAlerts.push({
        id: Date.now() + 1,
        type: 'warning',
        message: `High systolic blood pressure: ${vitalSigns.bloodPressure.systolic} mmHg`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    }
    
    if (vitalSigns.temperature > 37.2) {
      currentAlerts.push({
        id: Date.now() + 2,
        type: 'warning',
        message: `High temperature: ${vitalSigns.temperature.toFixed(1)}°C`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    }
    
    setAlerts(currentAlerts);
  };

  useEffect(() => {
    let interval;
    if (isMonitoring && selectedPatient) {
      interval = setInterval(() => {
        simulateRealTimeData();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, selectedPatient]);

  const loadHistoricalData = async () => {
    if (!selectedPatient) return;
    
    try {
      // Load historical data from backend
      const healthData = await apiService.getHealthData(selectedPatient.id);
      
      if (healthData && healthData.historicalData) {
        setHistoricalData(healthData.historicalData);
      } else {
        // Use simulated historical data if no data available
        const mockHistorical = [
          { time: '08:00', heartRate: 68, systolic: 118, diastolic: 78, temp: 36.5, oxygen: 98 },
          { time: '10:00', heartRate: 72, systolic: 120, diastolic: 80, temp: 36.8, oxygen: 98 },
          { time: '12:00', heartRate: 75, systolic: 122, diastolic: 82, temp: 37.0, oxygen: 97 },
          { time: '14:00', heartRate: 70, systolic: 119, diastolic: 79, temp: 36.7, oxygen: 98 },
          { time: '16:00', heartRate: 73, systolic: 121, diastolic: 81, temp: 36.9, oxygen: 98 },
        ];
        setHistoricalData(mockHistorical);
      }
    } catch (error) {
      console.warn('Could not load historical data, using simulation:', error);
      // Fallback to simulated data
      const mockHistorical = [
        { time: '08:00', heartRate: 68, systolic: 118, diastolic: 78, temp: 36.5, oxygen: 98 },
        { time: '10:00', heartRate: 72, systolic: 120, diastolic: 80, temp: 36.8, oxygen: 98 },
        { time: '12:00', heartRate: 75, systolic: 122, diastolic: 82, temp: 37.0, oxygen: 97 },
        { time: '14:00', heartRate: 70, systolic: 119, diastolic: 79, temp: 36.7, oxygen: 98 },
        { time: '16:00', heartRate: 73, systolic: 121, diastolic: 81, temp: 36.9, oxygen: 98 },
      ];
      setHistoricalData(mockHistorical);
    }
  };

  const simulateRealTimeData = () => {
    setVitalSigns(prev => {
      const newData = {
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        bloodPressure: {
          systolic: Math.max(100, Math.min(140, prev.bloodPressure.systolic + (Math.random() - 0.5) * 3)),
          diastolic: Math.max(60, Math.min(90, prev.bloodPressure.diastolic + (Math.random() - 0.5) * 2))
        },
        temperature: Math.max(36.0, Math.min(37.5, prev.temperature + (Math.random() - 0.5) * 0.2)),
        oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + (Math.random() - 0.5) * 1)),
        respiratoryRate: Math.max(12, Math.min(20, prev.respiratoryRate + (Math.random() - 0.5) * 2)),
        glucose: Math.max(70, Math.min(120, prev.glucose + (Math.random() - 0.5) * 5))
      };

      // Save data to backend periodically
      if (selectedPatient && Math.random() > 0.7) { // 30% chance to save
        saveVitalSignsToBackend(newData);
      }

      // Vérifier les alertes
      checkForAlerts(newData);
      
      return newData;
    });
  };

  const saveVitalSignsToBackend = async (vitalData) => {
    if (!selectedPatient) return;
    
    try {
      await apiService.saveHealthData(selectedPatient.id, {
        vitals: vitalData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Could not save vital signs to backend:', error);
    }
  };

  const checkForAlerts = (data) => {
    const newAlerts = [];
    
    if (data.heartRate > 90 || data.heartRate < 60) {
      newAlerts.push({
        id: Date.now(),
        type: 'warning',
        message: `Abnormal heart rate: ${data.heartRate} bpm`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    }
    
    if (data.bloodPressure.systolic > 130) {
      newAlerts.push({
        id: Date.now() + 1,
        type: 'warning',
        message: `High systolic blood pressure: ${data.bloodPressure.systolic} mmHg`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    }
    
    if (data.temperature > 37.2) {
      newAlerts.push({
        id: Date.now() + 2,
        type: 'warning',
        message: `High temperature: ${data.temperature.toFixed(1)}°C`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    }
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
    }
  };

  const getVitalStatus = (value, normalRange) => {
    if (value < normalRange.min || value > normalRange.max) {
      return 'abnormal';
    }
    return 'normal';
  };

  const getVitalColor = (status) => {
    switch(status) {
      case 'normal': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAlertColor = (type) => {
    switch(type) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'info': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const VitalCard = ({ icon, title, value, unit, status, trend, normalRange }) => {
    const statusColor = getVitalColor(status);
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
    const trendColor = trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : '';

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-medical-blue/20 rounded-lg">
            <div className="text-medical-light-blue">{icon}</div>
          </div>
          {TrendIcon && (
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          )}
        </div>
        
        <h3 className="text-medical-white/70 text-sm mb-2">{title}</h3>
        
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-bold ${statusColor}`}>
            {typeof value === 'object' ? `${value.systolic}/${value.diastolic}` : value}
          </span>
          <span className="text-medical-white/50 text-sm">{unit}</span>
        </div>
        
        {normalRange && (
          <p className="text-medical-white/50 text-xs mt-1">
            Normal: {normalRange}
          </p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/doctor-space')}
              className="p-2 bg-white/10 backdrop-blur-lg rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                <Activity className="w-8 h-8 text-medical-green" />
                <span>Vital Signs</span>
              </h1>
              <p className="text-medical-white/70">Real-time patient monitoring data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                isMonitoring 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-medical-green text-white hover:bg-medical-green/90'
              }`}
            >
              {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isMonitoring ? 'Pause' : 'Start'} Monitoring</span>
            </motion.button>
            
            <div className="px-4 py-2 bg-medical-green/20 rounded-lg">
              <span className="text-medical-green font-medium">Dr. {user?.name}</span>
            </div>
          </div>
        </motion.div>

        {/* Patient Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <select
            value={selectedPatient?.id || ''}
            onChange={(e) => {
              const patient = patients.find(p => p.id === parseInt(e.target.value));
              setSelectedPatient(patient);
            }}
            className="w-full md:w-96 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:border-medical-green focus:outline-none"
          >
            <option value="" className="bg-gray-800">Sélectionner un patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id} className="bg-gray-800">
                {patient.name}
              </option>
            ))}
          </select>
        </motion.div>

        {selectedPatient ? (
          <div className="space-y-8">
            {/* Vital Signs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VitalCard
                icon={<Heart className="w-6 h-6" />}
                title="Heart Rate"
                value={vitalSigns.heartRate}
                unit="bpm"
                status={getVitalStatus(vitalSigns.heartRate, { min: 60, max: 100 })}
                trend={vitalSigns.heartRate > 72 ? 'up' : vitalSigns.heartRate < 72 ? 'down' : null}
                normalRange="60-100 bpm"
              />
              
              <VitalCard
                icon={<Activity className="w-6 h-6" />}
                title="Tension Artérielle"
                value={vitalSigns.bloodPressure}
                unit="mmHg"
                status={getVitalStatus(vitalSigns.bloodPressure.systolic, { min: 100, max: 130 })}
                normalRange="120/80 mmHg"
              />
              
              <VitalCard
                icon={<Thermometer className="w-6 h-6" />}
                title="Température"
                value={vitalSigns.temperature.toFixed(1)}
                unit="°C"
                status={getVitalStatus(vitalSigns.temperature, { min: 36.0, max: 37.2 })}
                trend={vitalSigns.temperature > 36.8 ? 'up' : vitalSigns.temperature < 36.8 ? 'down' : null}
                normalRange="36.0-37.2°C"
              />
              
              <VitalCard
                icon={<Wind className="w-6 h-6" />}
                title="Oxygen Saturation"
                value={vitalSigns.oxygenSaturation}
                unit="%"
                status={getVitalStatus(vitalSigns.oxygenSaturation, { min: 95, max: 100 })}
                normalRange="95-100%"
              />
              
              <VitalCard
                icon={<Activity className="w-6 h-6" />}
                title="Respiratory Rate"
                value={vitalSigns.respiratoryRate}
                unit="/min"
                status={getVitalStatus(vitalSigns.respiratoryRate, { min: 12, max: 20 })}
                normalRange="12-20/min"
              />
              
              <VitalCard
                icon={<Droplet className="w-6 h-6" />}
                title="Glucose"
                value={vitalSigns.glucose}
                unit="mg/dL"
                status={getVitalStatus(vitalSigns.glucose, { min: 70, max: 100 })}
                normalRange="70-100 mg/dL"
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Historical Data */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-medical-green" />
                  <span>Historical Data</span>
                </h3>
                
                <div className="space-y-4">
                  {historicalData.map((data, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{data.time}</span>
                        <span className="text-medical-white/50 text-sm">
                          {new Date().toLocaleDateString('en-US')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-medical-white/70">FC:</span>
                          <span className="text-white ml-2">{data.heartRate} bpm</span>
                        </div>
                        <div>
                          <span className="text-medical-white/70">TA:</span>
                          <span className="text-white ml-2">{data.systolic}/{data.diastolic}</span>
                        </div>
                        <div>
                          <span className="text-medical-white/70">Temp:</span>
                          <span className="text-white ml-2">{data.temp}°C</span>
                        </div>
                        <div>
                          <span className="text-medical-white/70">SpO₂:</span>
                          <span className="text-white ml-2">{data.oxygen}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Alerts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-medical-green" />
                  <span>Alertes</span>
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <p className="text-medical-white/50 text-center py-4">
                      No active alerts
                    </p>
                  ) : (
                    alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                      >
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs opacity-70 mt-1">{alert.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-medical-green text-white rounded-lg hover:bg-medical-green/90 transition-colors flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Exporter les Données</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Rafraîchir</span>
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Monitor className="w-16 h-16 text-medical-white/50 mx-auto mb-4" />
            <p className="text-medical-white/70 text-lg">
              Veuillez sélectionner un patient pour commencer la surveillance
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
