import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Landing Page Hero Image
export function LandingHeroImage() {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="relative"
      whileHover={{ scale: 1.02 }}
    >
      {!imageError ? (
        <img
          src="/medical-tech-1.jpg"
          alt="Medical Technology"
          className="w-full h-full object-cover rounded-3xl shadow-2xl"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-medical-blue to-medical-green rounded-3xl flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">🏥</div>
            <p className="font-semibold">Medical Innovation</p>
          </div>
        </div>
      )}
      
      {/* Floating glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/20 to-medical-green/20 rounded-3xl blur-xl animate-pulse-slow -z-10"></div>
    </motion.div>
  );
}

// Technology Image for Dashboard
export function TechDashboardImage() {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
      whileHover={{ scale: 1.05 }}
    >
      {!imageError ? (
        <img
          src="/medical-tech-2.jpg"
          alt="Medical Dashboard"
          className="w-full h-full object-cover rounded-xl shadow-lg"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-medical-blue to-medical-dark-blue rounded-xl flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm">Dashboard</p>
          </div>
        </div>
      )}
      
      {/* Tech glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/15 to-medical-dark-blue/15 rounded-xl blur-lg -z-10"></div>
    </motion.div>
  );
}

// Professional Medical Image for Doctor Space
export function DoctorSpaceImage() {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
      whileHover={{ scale: 1.03 }}
    >
      {!imageError ? (
        <img
          src="/medical-tech-3.jpg"
          alt="Doctor Professional"
          className="w-full h-full object-cover rounded-xl shadow-xl"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-56 bg-gradient-to-br from-medical-green to-medical-blue rounded-xl flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">👨‍⚕️</div>
            <p className="font-semibold">Professional Care</p>
          </div>
        </div>
      )}
      
      {/* Professional glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-medical-green/20 to-medical-blue/20 rounded-xl blur-xl -z-10"></div>
    </motion.div>
  );
}

// Patient Care Image for Patient Space
export function PatientCareImage() {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative"
      whileHover={{ scale: 1.03 }}
    >
      {!imageError ? (
        <img
          src="/medical-tech-4.jpg"
          alt="Patient Care"
          className="w-full h-full object-cover rounded-xl shadow-xl"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-56 bg-gradient-to-br from-medical-light-blue to-medical-green rounded-xl flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">👩‍⚕️</div>
            <p className="font-semibold">Patient Care</p>
          </div>
        </div>
      )}
      
      {/* Care glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-medical-light-blue/20 to-medical-green/20 rounded-xl blur-xl -z-10"></div>
    </motion.div>
  );
}

// Floating particles component
export function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-10 left-10 w-3 h-3 bg-medical-green rounded-full animate-float opacity-60"></div>
      <div className="absolute top-20 right-20 w-2 h-2 bg-medical-light-blue rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-4 h-4 bg-white rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-10 right-10 w-3 h-3 bg-medical-green rounded-full animate-float opacity-50" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
}
