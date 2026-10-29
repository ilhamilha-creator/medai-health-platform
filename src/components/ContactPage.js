import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send, Clock, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      label: 'Email',
      value: 'support@medai-platform.com',
      description: 'Get support within 24 hours'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Address',
      value: '123 Medical Center Drive',
      description: 'Boston, MA 02115, USA'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-medical-green opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-medical-light-blue opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="flex items-center space-x-4">
            <MessageCircle className="w-10 h-10 text-medical-green" />
            <h1 className="text-3xl font-bold text-white">Contact Us</h1>
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

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="medical-card">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-medical-white/70 mb-8">
                Have questions about our medical AI platform? We're here to help you transform healthcare delivery.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center"
                >
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Message Sent!</h3>
                  <p className="text-green-300">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-medical-white/80 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      placeholder="Dr. John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-medical-white/80 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      placeholder="doctor@hospital.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-medical-white/80 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-medical-white/80 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300 resize-none"
                      placeholder="Tell us about your healthcare needs..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full medical-button flex items-center justify-center space-x-2 py-4 text-lg"
                  >
                    {isSubmitting ? (
                      <div className="loading-spinner w-6 h-6 border-2 border-white/30 border-t-white"></div>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="medical-card">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="text-medical-green flex-shrink-0 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{info.label}</h4>
                      <p className="text-white font-medium">{info.value}</p>
                      <p className="text-sm text-medical-white/70">{info.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="medical-card border-2 border-red-500/30 bg-red-500/10">
              <h3 className="text-xl font-bold text-white mb-4">Emergency Support</h3>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-red-400" />
                <div>
                  <p className="text-white font-semibold">24/7 Medical Support</p>
                  <p className="text-sm text-red-300">For urgent medical AI assistance</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 font-semibold hover:bg-red-500/30 transition-all duration-300"
              >
                Call Emergency Line
              </motion.button>
            </div>

            <div className="medical-card">
              <h3 className="text-xl font-bold text-white mb-4">Response Times</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-medical-white/70">General Inquiries</span>
                  <span className="text-medical-green font-semibold">24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-medical-white/70">Technical Support</span>
                  <span className="text-medical-light-blue font-semibold">12 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-medical-white/70">Emergency</span>
                  <span className="text-red-400 font-semibold">1 hour</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
