import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateSchema, loginSchema, registerSchema } from '../utils/validationSchemas';
import notificationService from '../utils/notificationService';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Calendar, 
  Heart, 
  Eye, 
  EyeOff,
  Stethoscope,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient',
    phone: '',
    dateOfBirth: '',
    specialty: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      // Validation Zod pour login
      const validation = validateSchema(loginSchema, {
        email: formData.email,
        password: formData.password,
      });

      if (!validation.success) {
        const firstError = validation.errors[0];
        notificationService.error(firstError.message);
        setError(firstError.message);
        return;
      }

      // Login
      const result = await login(formData.email, formData.password);
      if (result.success) {
        notificationService.success('Login successful! Redirecting...');
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        notificationService.error(result.error);
        setError(result.error);
      }
    } else {
      // Validation Zod pour register
      const validation = validateSchema(registerSchema, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userType: formData.userType,
      });

      if (!validation.success) {
        const firstError = validation.errors[0];
        notificationService.error(firstError.message);
        setError(firstError.message);
        return;
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        profile: formData.userType === 'doctor' ? {
          phone: formData.phone,
          specialty: formData.specialty,
          experience: 'New doctor',
          languages: ['English'],
          rating: 0
        } : {
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          bloodType: 'Not specified',
          emergencyContact: 'Not specified'
        }
      };

      const result = await register(userData);
      if (result.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="w-10 h-10 text-medical-green" />
            <h1 className="text-3xl font-bold text-white">MedAI Platform</h1>
          </div>
          <p className="text-medical-white/70">
            Intelligent Medical Platform
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          {/* Toggle Login/Register */}
          <div className="flex mb-6 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md transition-all duration-200 ${
                isLogin
                  ? 'bg-medical-green text-white'
                  : 'text-medical-white/70 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md transition-all duration-200 ${
                !isLogin
                  ? 'bg-medical-green text-white'
                  : 'text-medical-white/70 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-300 text-sm">{success}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-medical-white/70 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-white/50 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-medical-white/50 focus:border-medical-green focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-medical-white/70 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-white/50 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-medical-white/50 focus:border-medical-green focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-medical-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-white/50 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-medical-white/50 focus:border-medical-green focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medical-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-medical-white/70 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-white/50 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-medical-white/50 focus:border-medical-green focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-medical-white/70 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'patient' }))}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        formData.userType === 'patient'
                          ? 'bg-medical-green/20 border-medical-green text-white'
                          : 'bg-white/10 border-white/20 text-medical-white/70 hover:text-white'
                      }`}
                    >
                      <User className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm">Patient</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'doctor' }))}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        formData.userType === 'doctor'
                          ? 'bg-medical-green/20 border-medical-green text-white'
                          : 'bg-white/10 border-white/20 text-medical-white/70 hover:text-white'
                      }`}
                    >
                      <Stethoscope className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm">Doctor</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-medical-white/70 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-white/50 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-medical-white/50 focus:border-medical-green focus:outline-none"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                {formData.userType === 'patient' ? (
                  <div>
                    <label className="block text-sm font-medium text-medical-white/70 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-white/50 w-5 h-5" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-medical-green focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-medical-white/70 mb-2">
                      Specialty
                    </label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-white/50 w-5 h-5" />
                      <select
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-medical-green focus:outline-none"
                      >
                        <option value="" className="bg-gray-800">Select a specialty</option>
                        <option value="General Medicine" className="bg-gray-800">General Medicine</option>
                        <option value="Cardiology" className="bg-gray-800">Cardiology</option>
                        <option value="Pediatrics" className="bg-gray-800">Pediatrics</option>
                        <option value="Gynecology" className="bg-gray-800">Gynecology</option>
                        <option value="Dermatology" className="bg-gray-800">Dermatology</option>
                        <option value="Neurology" className="bg-gray-800">Neurology</option>
                        <option value="Orthopedics" className="bg-gray-800">Orthopedics</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-3 bg-medical-green text-white rounded-lg hover:bg-medical-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <span>{isLogin ? 'Login' : 'Sign up'}</span>
              )}
            </motion.button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-medical-white/70 text-sm mb-3">
              Demo accounts:
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-medical-green font-medium">Doctor:</p>
                <p className="text-medical-white/70">sarah.martin@medai.com / doctor123</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-medical-green font-medium">Patient:</p>
                <p className="text-medical-white/70">marie.dupont@email.com / patient123</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
