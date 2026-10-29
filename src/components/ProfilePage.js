import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Calendar, Award, FileText, Activity, Heart, Edit3, Camera, Save, X } from 'lucide-react';
import { DoctorSpaceImage, PatientCareImage } from './MedicalImages';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Dr. Sarah Johnson',
    email: user?.email || 'sarah.johnson@medai.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Cardiology',
    experience: '15 years',
    education: 'Harvard Medical School',
    certifications: ['Board Certified Cardiologist', 'Advanced Life Support'],
    bio: 'Passionate about integrating AI technology into cardiovascular care to improve patient outcomes and streamline diagnostic processes.',
    achievements: [
      'Published 25+ research papers',
      'Led clinical trials for AI diagnostics',
      'Speaker at 10+ international conferences'
    ]
  });

  const handleSave = () => {
    setIsEditing(false);
    // Simulate saving profile
    console.log('Profile saved:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  const stats = [
    { icon: <Activity className="w-6 h-6" />, label: 'Patients Treated', value: '2,847' },
    { icon: <FileText className="w-6 h-6" />, label: 'AI Diagnostics', value: '1,523' },
    { icon: <Heart className="w-6 h-6" />, label: 'Success Rate', value: '98.5%' },
    { icon: <Award className="w-6 h-6" />, label: 'Awards', value: '12' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
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
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <User className="w-10 h-10 text-medical-green" />
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
          </div>
          
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
            
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-medical-green/20 border border-medical-green/50 rounded-lg text-medical-green hover:bg-medical-green/30 transition-all duration-300"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </div>
        </motion.header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="medical-card text-center">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-medical-green to-medical-blue rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-1/3 w-8 h-8 bg-medical-green rounded-full flex items-center justify-center text-white"
                  >
                    <Camera className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{profileData.name}</h2>
              <p className="text-medical-green font-semibold mb-4">{profileData.specialization}</p>
              <p className="text-medical-white/70 text-sm mb-6">{profileData.experience} of experience</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-medical-green mb-1 flex justify-center">
                      {stat.icon}
                    </div>
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                    <p className="text-medical-white/70 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-medical-green/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-medical-green" />
                  </div>
                  <div>
                    <p className="text-medical-white/70 text-xs">Email</p>
                    <p className="text-white text-sm">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-medical-green/20 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-medical-green" />
                  </div>
                  <div>
                    <p className="text-medical-white/70 text-xs">Phone</p>
                    <p className="text-white text-sm">{profileData.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="mt-6">
              <DoctorSpaceImage />
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {stats.slice(2).map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="medical-card"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-medical-green">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-white font-bold text-2xl">{stat.value}</p>
                      <p className="text-medical-white/70">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Professional Information */}
            <div className="medical-card">
              <h3 className="text-xl font-bold text-white mb-6">Professional Information</h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-medical-white/80 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-medical-white/80 mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={profileData.specialization}
                        onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-medical-white/80 mb-2">
                        Experience
                      </label>
                      <input
                        type="text"
                        value={profileData.experience}
                        onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-medical-white/80 mb-2">
                        Education
                      </label>
                      <input
                        type="text"
                        value={profileData.education}
                        onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-medical-white/80 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300 resize-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 font-semibold hover:bg-red-500/30 transition-all duration-300"
                    >
                      <X className="w-5 h-5 inline mr-2" />
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="medical-button px-6 py-3"
                    >
                      <Save className="w-5 h-5 inline mr-2" />
                      Save Changes
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-medical-green font-semibold mb-2">Education</h4>
                      <p className="text-white">{profileData.education}</p>
                    </div>
                    <div>
                      <h4 className="text-medical-green font-semibold mb-2">Experience</h4>
                      <p className="text-white">{profileData.experience}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-medical-green font-semibold mb-2">Professional Bio</h4>
                    <p className="text-medical-white/90 leading-relaxed">{profileData.bio}</p>
                  </div>

                  <div>
                    <h4 className="text-medical-green font-semibold mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.certifications.map((cert, index) => (
                        <span key={index} className="px-3 py-1 bg-medical-green/20 border border-medical-green/50 rounded-full text-medical-green text-sm">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="medical-card">
              <h3 className="text-xl font-bold text-white mb-6">Achievements & Recognition</h3>
              <div className="space-y-4">
                {profileData.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-medical-green/20 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-medical-green" />
                    </div>
                    <p className="text-white">{achievement}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Patient Care Image */}
            <div className="medical-card">
              <h3 className="text-xl font-bold text-white mb-6">Patient Care Philosophy</h3>
              <PatientCareImage />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
