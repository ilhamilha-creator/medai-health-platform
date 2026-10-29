import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Heart,
  Activity,
  Brain,
  Bone,
  Eye,
  CheckCircle,
  X,
  Navigation
} from 'lucide-react';
import { PatientCareImage } from './MedicalImages';

export default function EmergencyPage() {
  const navigate = useNavigate();
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (isCalling) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCalling]);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const emergencyTypes = [
    {
      id: 'cardiac',
      icon: <Heart className="w-8 h-8" />,
      title: 'Cardiac Emergency',
      description: 'Chest pain, heart attack, breathing difficulties',
      severity: 'critical',
      color: 'bg-red-500/20 border-red-500/50 text-red-400',
      action: 'Call 911 Immediately',
      symptoms: ['Chest pain', 'Shortness of breath', 'Pain in arm/jaw', 'Cold sweat', 'Nausea']
    },
    {
      id: 'neurological',
      icon: <Brain className="w-8 h-8" />,
      title: 'Neurological Emergency',
      description: 'Stroke, seizure, severe headache, loss of consciousness',
      severity: 'critical',
      color: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
      action: 'Call 911 Immediately',
      symptoms: ['Sudden confusion', 'Numbness/weakness', 'Vision problems', 'Severe headache', 'Loss of balance']
    },
    {
      id: 'trauma',
      icon: <Bone className="w-8 h-8" />,
      title: 'Trauma/Injury',
      description: 'Fractures, bleeding, head injury, accidents',
      severity: 'high',
      color: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
      action: 'Call 911 or Go to ER',
      symptoms: ['Bleeding', 'Broken bones', 'Head injury', 'Severe pain', 'Loss of consciousness']
    },
    {
      id: 'respiratory',
      icon: <Activity className="w-8 h-8" />,
      title: 'Respiratory Emergency',
      description: 'Difficulty breathing, asthma attack, choking',
      severity: 'high',
      color: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      action: 'Call 911 or Go to ER',
      symptoms: ['Cannot breathe', 'Wheezing', 'Choking', 'Blue lips', 'Rapid breathing']
    },
    {
      id: 'eye',
      icon: <Eye className="w-8 h-8" />,
      title: 'Eye Emergency',
      description: 'Eye injury, vision loss, chemical exposure',
      severity: 'medium',
      color: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
      action: 'Go to Emergency Room',
      symptoms: ['Vision loss', 'Eye pain', 'Chemical exposure', 'Eye injury', 'Flashing lights']
    },
    {
      id: 'other',
      icon: <AlertTriangle className="w-8 h-8" />,
      title: 'Other Emergency',
      description: 'Severe pain, allergic reaction, poisoning',
      severity: 'medium',
      color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      action: 'Call 911 or Go to ER',
      symptoms: ['Severe pain', 'Allergic reaction', 'Poisoning', 'High fever', 'Dehydration']
    }
  ];

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', type: 'emergency' },
    { name: 'Poison Control', number: '1-800-222-1222', type: 'poison' },
    { name: 'Local Hospital', number: '1-555-MEDICAL', type: 'hospital' },
    { name: 'Your Doctor', number: '1-555-123-4567', type: 'doctor' }
  ];

  const handleEmergencyCall = (number) => {
    setIsCalling(true);
    // In a real app, this would initiate an actual call
    window.open(`tel:${number}`);
  };

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    setIsCalling(false);
    setCallDuration(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-500 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500 opacity-20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Emergency Services</h1>
                <p className="text-red-300 text-sm">24/7 Medical Emergency Assistance</p>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEmergencyCall('911')}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 border border-red-500 rounded-lg text-white hover:bg-red-700 transition-all duration-300 animate-pulse"
          >
            <Phone className="w-5 h-5" />
            <span className="font-bold">Call 911</span>
          </motion.button>
        </motion.header>

        {isCalling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          >
            <div className="medical-card p-8 max-w-md w-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Emergency Call in Progress</h3>
                <p className="text-red-300 mb-4">Connecting to Emergency Services...</p>
                <p className="text-3xl font-mono text-white mb-6">{formatCallDuration(callDuration)}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={endCall}
                  className="px-6 py-3 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-all duration-300"
                >
                  End Call
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Types */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="medical-card mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">Select Emergency Type</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {emergencyTypes.map((emergency, index) => (
                  <motion.button
                    key={emergency.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedEmergency(emergency)}
                    className={`p-6 rounded-lg border text-left transition-all duration-300 ${
                      selectedEmergency?.id === emergency.id
                        ? emergency.color
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={selectedEmergency?.id === emergency.id ? 'text-current' : 'text-red-400'}>
                        {emergency.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{emergency.title}</h3>
                        <p className="text-sm text-medical-white/80 mb-3">{emergency.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            emergency.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            emergency.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {emergency.severity} severity
                          </span>
                          <span className="text-xs text-medical-white/60">{emergency.action}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Emergency Details */}
            {selectedEmergency && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="medical-card"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${selectedEmergency.color}`}>
                      {selectedEmergency.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedEmergency.title}</h3>
                      <p className="text-medical-white/80">{selectedEmergency.description}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedEmergency(null)}
                    className="p-2 text-medical-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Common Symptoms</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedEmergency.symptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-medical-white/80">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmergencyCall('911')}
                    className="flex-1 medical-button flex items-center justify-center space-x-2 py-3"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Emergency</span>
                  </motion.button>
                  
                  {userLocation && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                    >
                      <Navigation className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Emergency Contacts */}
            <div className="medical-card">
              <h3 className="text-lg font-semibold text-white mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        contact.type === 'emergency' ? 'bg-red-500/20' :
                        contact.type === 'poison' ? 'bg-purple-500/20' :
                        contact.type === 'hospital' ? 'bg-blue-500/20' :
                        'bg-green-500/20'
                      }`}>
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{contact.name}</p>
                        <p className="text-medical-white/60 text-xs">{contact.number}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEmergencyCall(contact.number)}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
                    >
                      <Phone className="w-4 h-4 text-white" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Location Info */}
            {userLocation && (
              <div className="medical-card">
                <h3 className="text-lg font-semibold text-white mb-4">Your Location</h3>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-white text-sm">Location detected</p>
                    <p className="text-medical-white/60 text-xs">
                      Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* First Aid Tips */}
            <div className="medical-card border-2 border-yellow-500/30 bg-yellow-500/10">
              <h3 className="text-lg font-semibold text-white mb-4">While Waiting for Help</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-300 text-sm">Stay calm and keep the patient comfortable</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-300 text-sm">Clear the area around the patient</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-300 text-sm">Have medical information ready</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-300 text-sm">Follow emergency operator instructions</p>
                </div>
              </div>
            </div>

            {/* Patient Care Image */}
            <PatientCareImage />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
