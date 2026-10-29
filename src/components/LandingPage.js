import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Brain } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Hello! I am Dr. AI, your intelligent medical assistant. I am here to guide you with care and expertise.",
    "My role is to inspire confidence and intelligence in your health journey. I am your dedicated medical partner.",
    "Your well-being is my priority. Let me show you how technology can improve your health.",
    "Together, we will create an innovative and personalized medical experience for you."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue relative overflow-hidden">
      {/* Video Background Fusion */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
          style={{
            filter: 'blur(2px) brightness(0.7) saturate(1.2)',
            mixBlendMode: 'screen'
          }}
        >
          <source src="/OIG3.iv.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay for Fusion */}
        <div className="absolute inset-0 bg-gradient-to-br from-medical-dark-blue/50 via-medical-blue/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-medical-dark-blue/80 via-transparent to-transparent" />
      </div>

      {/* Floating Medical Elements */}
      <div className="absolute inset-0 z-10">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 text-medical-green/20"
        >
          <Heart className="w-16 h-16" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 text-medical-light-blue/20"
        >
          <Activity className="w-20 h-20" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-32 left-20 text-medical-green/20"
        >
          <Brain className="w-24 h-24" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 py-6"
        >
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-medical-green to-medical-blue rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">MedAI</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <motion.a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about');
                }}
                className="text-white/80 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Features
              </motion.a>
              <motion.a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about');
                }}
                className="text-white/80 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                About
              </motion.a>
              <motion.a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/contact');
                }}
                className="text-white/80 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Contact
              </motion.a>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="medical-button"
            >
              Login
            </motion.button>
          </div>
        </motion.nav>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-white space-y-8"
            >
              <div>
                <motion.h1 
                  className="text-5xl lg:text-7xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <span className="bg-gradient-to-r from-white to-medical-light-blue bg-clip-text text-transparent">
                    Your Health,
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-medical-green to-medical-light-blue bg-clip-text text-transparent">
                    Our Priority
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-white/80 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Discover the future of medicine with our intelligent AI platform. 
                  A personalized, accessible, and innovative health experience.
                </motion.p>
              </div>

              {/* AI Message Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-medical-green to-medical-blue rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-medical-green font-medium">Dr. AI Assistant</span>
                </div>
                <motion.p 
                  key={currentMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-white/90 italic"
                >
                  "{messages[currentMessage]}"
                </motion.p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-gradient-to-r from-medical-green to-medical-blue text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                >
                  Get Started Now
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/learn-more')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Interactive Visual Section */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] lg:h-[600px]"
            >
              {/* Glass morphism card with video integration */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Integrated video within the design */}
                <div className="relative h-full">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-3xl"
                    style={{
                      filter: 'brightness(0.8) saturate(1.1)',
                      transform: 'scale(1.05)'
                    }}
                  >
                    <source src="/OIG3.iv.mp4" type="video/mp4" />
                  </video>
                  
                  {/* Overlay gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-medical-dark-blue/60 via-transparent to-transparent rounded-3xl" />
                  
                  {/* Floating UI Elements - Moved to corners */}
                  <div className="absolute top-4 left-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/10 backdrop-blur-lg rounded-md p-2 border border-white/20"
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <Heart className="w-3 h-3 text-red-400" />
                        <span className="text-white font-medium text-xs">Monitoring</span>
                      </div>
                      <p className="text-white/70 text-xs">24/7</p>
                    </motion.div>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white/10 backdrop-blur-lg rounded-md p-2 border border-white/20"
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <Brain className="w-3 h-3 text-green-400" />
                        <span className="text-white font-medium text-xs">AI</span>
                      </div>
                      <p className="text-white/70 text-xs">Diagnostic</p>
                    </motion.div>
                  </div>
                  
                  {/* Bottom stats - Centered but smaller */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white/10 backdrop-blur-lg rounded-md p-2 border border-white/20">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-sm font-bold text-white">98%</p>
                          <p className="text-white/70 text-xs">Accuracy</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">24/7</p>
                          <p className="text-white/70 text-xs">Available</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">10K+</p>
                          <p className="text-white/70 text-xs">Patients</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
