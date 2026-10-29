import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, AlertTriangle, X, CheckCircle, Clock } from 'lucide-react';

export default function EmergencySOS() {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isTriggered, setIsTriggered] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Emergency Services', phone: '911', type: 'emergency' },
    { name: 'Family Contact', phone: '+1234567890', type: 'family' },
    { name: 'Doctor', phone: '+0987654321', type: 'medical' }
  ]);

  useEffect(() => {
    let interval;
    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isActive && countdown === 0) {
      triggerEmergency();
    }
    return () => clearInterval(interval);
  }, [isActive, countdown]);

  const triggerEmergency = () => {
    setIsActive(false);
    setIsTriggered(true);
    setCountdown(3);
    
    // In real implementation, this would:
    // 1. Call emergency services
    // 2. Send location to contacts
    // 3. Alert nearby hospitals
    // 4. Notify emergency services
    
    console.log('EMERGENCY SOS TRIGGERED');
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setIsTriggered(false);
    }, 5000);
  };

  const cancelEmergency = () => {
    setIsActive(false);
    setCountdown(3);
  };

  const callContact = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const sendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          window.open(mapsUrl, '_blank');
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get location. Please enable location services.');
        }
      );
    }
  };

  return (
    <>
      {/* SOS Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsActive(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-red-500 hover:bg-red-600 rounded-full shadow-2xl border-4 border-red-300"
      >
        <AlertTriangle className="w-8 h-8 text-white" />
      </motion.button>

      {/* Countdown Modal */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
            >
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Emergency SOS</h2>
              <p className="text-gray-600 mb-6">Calling emergency services in...</p>
              
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-6xl font-bold text-red-500 mb-6"
              >
                {countdown}
              </motion.div>

              <button
                onClick={cancelEmergency}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Triggered Modal */}
      <AnimatePresence>
        {isTriggered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-green-500/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Help is on the way!</h2>
              <p className="text-gray-600 mb-6">Emergency services have been notified.</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => callContact('911')}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call 911</span>
                </button>
                
                <button
                  onClick={sendLocation}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Share Location</span>
                </button>
              </div>

              <button
                onClick={() => setIsTriggered(false)}
                className="w-full mt-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-800 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}