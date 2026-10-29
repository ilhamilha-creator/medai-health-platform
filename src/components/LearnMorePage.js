import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Brain, Activity, Shield, Zap, Users, Globe, ChevronRight, Play, BookOpen, Cpu, Stethoscope } from 'lucide-react';

export default function LearnMorePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Diagnostics",
      description: "Advanced machine learning algorithms analyze medical data with 98% accuracy",
      color: "text-medical-green"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "HIPAA Compliant Security",
      description: "Enterprise-grade encryption and privacy protection for all patient data",
      color: "text-medical-light-blue"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-User Collaboration",
      description: "Seamless communication between patients, doctors, and healthcare providers",
      color: "text-medical-green"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Healthcare Network",
      description: "Connect with medical professionals and facilities worldwide",
      color: "text-medical-light-blue"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Monitoring",
      description: "24/7 vital signs tracking and health metrics analysis",
      color: "text-medical-green"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Predictive Analytics",
      description: "Early detection of health issues using advanced predictive models",
      color: "text-medical-light-blue"
    }
  ];

  const tools = [
    {
      name: "AI Diagnosis",
      description: "Intelligent symptom analysis and preliminary diagnosis",
      icon: <Brain className="w-6 h-6" />,
      status: "Active"
    },
    {
      name: "Lab Analysis",
      description: "Automated interpretation of laboratory test results",
      icon: <Activity className="w-6 h-6" />,
      status: "Active"
    },
    {
      name: "Vital Signs",
      description: "Real-time monitoring and alerts for critical vitals",
      icon: <Heart className="w-6 h-6" />,
      status: "Active"
    },
    {
      name: "Medical Imaging",
      description: "AI-powered analysis of X-rays, MRIs, and CT scans",
      icon: <Stethoscope className="w-6 h-6" />,
      status: "Active"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist, Boston Medical Center",
      content: "MedAI has revolutionized how I diagnose and treat patients. The AI insights are invaluable.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Neurologist, Johns Hopkins",
      content: "The accuracy and speed of MedAI's diagnostic tools have improved patient outcomes significantly.",
      rating: 5
    },
    {
      name: "Emma Williams",
      role: "Patient, California",
      content: "I feel more in control of my health with the real-time monitoring and AI assistance.",
      rating: 5
    }
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
            <BookOpen className="w-10 h-10 text-medical-green" />
            <h1 className="text-3xl font-bold text-white">Learn More About MedAI</h1>
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
            The Future of Healthcare is Here
          </h2>
          <p className="text-xl text-medical-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover how MedAI is transforming healthcare with cutting-edge artificial intelligence, 
            making medical expertise accessible to everyone, everywhere.
          </p>
          
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="medical-button flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Documentation</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">Powerful Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="medical-card group cursor-pointer"
              >
                <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                <p className="text-medical-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Diagnostic Tools */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">Diagnostic Tools</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="medical-card flex items-center justify-between p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-medical-green">
                    {tool.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{tool.name}</h4>
                    <p className="text-sm text-medical-white/70">{tool.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                    {tool.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-medical-white/50" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mb-20"
        >
          <div className="medical-card">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Advanced Technology Stack</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <Cpu className="w-12 h-12 text-medical-green mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Machine Learning</h4>
                <p className="text-sm text-medical-white/70">Deep learning models trained on millions of medical cases</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-medical-light-blue mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Blockchain Security</h4>
                <p className="text-sm text-medical-white/70">Immutable medical records and secure data sharing</p>
              </div>
              <div className="text-center">
                <Globe className="w-12 h-12 text-medical-green mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Cloud Infrastructure</h4>
                <p className="text-sm text-medical-white/70">Scalable, reliable, and globally distributed</p>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-medical-light-blue mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Real-Time Processing</h4>
                <p className="text-sm text-medical-white/70">Instant analysis and emergency response capabilities</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">What Our Users Say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                className="medical-card"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-medical-white/80 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-medical-white/60">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="text-center"
        >
          <div className="medical-card max-w-4xl mx-auto p-12">
            <h3 className="text-3xl font-bold text-white mb-6">Ready to Transform Healthcare?</h3>
            <p className="text-xl text-medical-white/90 mb-8">
              Join thousands of healthcare professionals already using MedAI to improve patient outcomes.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="medical-button"
              >
                Get Started Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                Contact Sales
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
