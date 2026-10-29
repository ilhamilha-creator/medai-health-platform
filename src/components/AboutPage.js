import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, Award, Users, Globe } from 'lucide-react';
import { LandingHeroImage } from './MedicalImages';

export default function AboutPage() {
  const navigate = useNavigate();

  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Chief Medical Officer', image: '👩‍⚕️' },
    { name: 'Dr. Michael Chen', role: 'AI Research Director', image: '👨‍⚕️' },
    { name: 'Dr. Emma Williams', role: 'Head of Innovation', image: '👩‍⚕️' },
    { name: 'Dr. Robert Davis', role: 'Clinical Lead', image: '👨‍⚕️' },
  ];

  const achievements = [
    { icon: <Users className="w-8 h-8" />, title: '1M+ Users Served', description: 'Trusted by healthcare professionals worldwide' },
    { icon: <Award className="w-8 h-8" />, title: '98% Accuracy', description: 'Industry-leading diagnostic precision' },
    { icon: <Shield className="w-8 h-8" />, title: 'HIPAA Compliant', description: 'Enterprise-grade security and privacy' },
    { icon: <Globe className="w-8 h-8" />, title: '50+ Countries', description: 'Global healthcare network coverage' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-medical-green opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-medical-light-blue opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="flex items-center space-x-4">
            <Heart className="w-10 h-10 text-medical-green" />
            <h1 className="text-3xl font-bold text-white">About MedAI Platform</h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </motion.button>
        </motion.header>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Revolutionizing Healthcare with AI
          </h2>
          <p className="text-xl text-medical-white/90 max-w-3xl mx-auto leading-relaxed">
            We are pioneering the future of medical technology, combining cutting-edge artificial intelligence 
            with compassionate healthcare delivery to create a healthier, more connected world.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="mb-20"
        >
          <LandingHeroImage />
        </motion.div>

        {/* Achievements */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">Our Impact</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="medical-card text-center"
              >
                <div className="text-medical-green mb-4 flex justify-center">
                  {achievement.icon}
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{achievement.title}</h4>
                <p className="text-sm text-medical-white/70">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">Our Medical Team</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="medical-card text-center"
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h4 className="text-lg font-semibold text-white mb-1">{member.name}</h4>
                <p className="text-sm text-medical-white/70">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-center"
        >
          <div className="medical-card max-w-4xl mx-auto p-12">
            <h3 className="text-2xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-lg text-medical-white/90 leading-relaxed">
              To democratize access to world-class medical expertise through artificial intelligence, 
              making quality healthcare accessible, affordable, and personalized for everyone, everywhere.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
