import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../utils/notificationService';
import apiService from '../services/apiService';
import {
  Heart,
  Activity,
  Brain,
  FileText,
  ArrowRight,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function MedicalAnalysis() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDoctorView] = useState(user?.userType === 'doctor');
  
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    bloodSugar: '',
    hba1c: '',
    systolic_bp: '',
    diastolic_bp: '',
    cholesterol: '',
    ldl: '',
    hdl: '',
    smoker: false,
    family_history_diabetes: false,
    family_history_cardio: false,
    symptoms: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.age || formData.age < 18 || formData.age > 120) {
      newErrors.age = 'Age must be between 18 and 120 years';
    }
    
    if (!formData.weight || formData.weight < 20 || formData.weight > 300) {
      newErrors.weight = 'Weight must be between 20 and 300 kg';
    }
    
    if (!formData.height || formData.height < 50 || formData.height > 250) {
      newErrors.height = 'Height must be between 50 and 250 cm';
    }
    
    if (!formData.bloodSugar || formData.bloodSugar < 2 || formData.bloodSugar > 30) {
      newErrors.bloodSugar = 'Blood sugar must be between 2 and 30 mmol/L';
    }
    
    if (!formData.systolic_bp || formData.systolic_bp < 60 || formData.systolic_bp > 250) {
      newErrors.systolic_bp = 'Systolic blood pressure must be between 60 and 250 mmHg';
    }
    
    if (!formData.diastolic_bp || formData.diastolic_bp < 40 || formData.diastolic_bp > 150) {
      newErrors.diastolic_bp = 'Diastolic blood pressure must be between 40 and 150 mmHg';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const heightInMeters = formData.height / 100;
      return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Check backend connection
      const backendHealth = await apiService.checkBackendHealth();
      
      if (!backendHealth.main && !backendHealth.pro) {
        notificationService.warning('Backend not available. Using simulation mode.');
      }
      
      // Prepare patient data with calculated BMI
      const patientData = {
        ...formData,
        bmi: parseFloat(calculateBMI()),
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        bloodSugar: parseFloat(formData.bloodSugar),
        systolic_bp: parseInt(formData.systolic_bp),
        diastolic_bp: parseInt(formData.diastolic_bp),
        cholesterol: formData.cholesterol ? parseFloat(formData.cholesterol) : undefined,
        ldl: formData.ldl ? parseFloat(formData.ldl) : undefined,
        hdl: formData.hdl ? parseFloat(formData.hdl) : undefined,
        hba1c: formData.hba1c ? parseFloat(formData.hba1c) : undefined,
        gender: formData.gender,
        smoker: formData.smoker,
        family_history_diabetes: formData.family_history_diabetes,
        family_history_cardio: formData.family_history_cardio,
        symptoms: formData.symptoms
      };

      // Save patient data to localStorage for results page
      localStorage.setItem('patientData', JSON.stringify(patientData));
      
      // Save health data to backend if available
      if (user?.id && (backendHealth.main || backendHealth.pro)) {
        try {
          await apiService.saveHealthData(user.id, patientData);
          notificationService.success('Patient data saved successfully');
        } catch (saveError) {
          console.warn('Could not save health data to backend:', saveError);
        }
      }
      
      // Navigate to results page
      navigate('/analysis-results', { state: { patientData } });
      
    } catch (error) {
      console.error('Error during analysis:', error);
      notificationService.error('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="medical-card mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-medical-green/20 p-3 rounded-lg border border-medical-green/30">
                <Brain className="w-8 h-8 text-medical-green" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Medical Analysis</h1>
                <p className="text-medical-white/80">Complete evaluation with artificial intelligence</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-medical-white/60">Mode</div>
              <div className="font-semibold text-medical-light-blue">
                {isDoctorView ? 'Professional' : 'Patient'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-medical-blue/20 p-4 rounded-lg border border-medical-blue/30">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5 text-medical-light-blue" />
                <span className="font-semibold text-medical-light-blue">AI Analysis</span>
              </div>
              <p className="text-sm text-medical-white/80">Advanced ML models for accurate prediction</p>
            </div>
            <div className="bg-medical-green/20 p-4 rounded-lg border border-medical-green/30">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-medical-green" />
                <span className="font-semibold text-medical-green">Risks</span>
              </div>
              <p className="text-sm text-medical-white/80">Diabetes and cardiovascular</p>
            </div>
            <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-purple-300" />
                <span className="font-semibold text-purple-300">Report</span>
              </div>
              <p className="text-sm text-medical-white/80">Detailed results and recommendations</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="medical-card"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Patient Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-medical-green" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    Age <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60 ${
                      errors.age ? 'border-red-400' : ''
                    }`}
                    placeholder="45"
                  />
                  {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    Sex <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white"
                  >
                    <option value="male" className="bg-medical-dark-blue">Male</option>
                    <option value="female" className="bg-medical-dark-blue">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    Height (cm) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60 ${
                      errors.height ? 'border-red-400' : ''
                    }`}
                    placeholder="175"
                  />
                  {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    Weight (kg) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60 ${
                      errors.weight ? 'border-red-400' : ''
                    }`}
                    placeholder="75"
                  />
                  {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    Calculated BMI
                  </label>
                  <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-medical-white/60">
                    {calculateBMI() || '-'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    Smoking
                  </label>
                  <div className="flex items-center space-x-2 mt-3">
                    <input
                      type="checkbox"
                      name="smoker"
                      checked={formData.smoker}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-medical-green bg-white/10 border-white/20 rounded focus:ring-medical-green"
                    />
                    <span className="text-sm text-medical-white/80">Smoker</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Measurements */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-medical-green" />
                Medical Measurements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    Blood Sugar (mmol/L) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="bloodSugar"
                    value={formData.bloodSugar}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60 ${
                      errors.bloodSugar ? 'border-red-400' : ''
                    }`}
                    placeholder="5.8"
                  />
                  {errors.bloodSugar && <p className="text-red-400 text-xs mt-1">{errors.bloodSugar}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    HbA1c (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="hba1c"
                    value={formData.hba1c}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60"
                    placeholder="5.9"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    Systolic Blood Pressure (mmHg) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="systolic_bp"
                    value={formData.systolic_bp}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60 ${
                      errors.systolic_bp ? 'border-red-400' : ''
                    }`}
                    placeholder="120"
                  />
                  {errors.systolic_bp && <p className="text-red-400 text-xs mt-1">{errors.systolic_bp}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    Diastolic Blood Pressure (mmHg) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="diastolic_bp"
                    value={formData.diastolic_bp}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60 ${
                      errors.diastolic_bp ? 'border-red-400' : ''
                    }`}
                    placeholder="80"
                  />
                  {errors.diastolic_bp && <p className="text-red-400 text-xs mt-1">{errors.diastolic_bp}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    Cholesterol (mg/dL)
                  </label>
                  <input
                    type="number"
                    name="cholesterol"
                    value={formData.cholesterol}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60"
                    placeholder="200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    LDL (mg/dL)
                  </label>
                  <input
                    type="number"
                    name="ldl"
                    value={formData.ldl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60"
                    placeholder="130"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-medical-white/80 mb-1">
                    HDL (mg/dL)
                  </label>
                  <input
                    type="number"
                    name="hdl"
                    value={formData.hdl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60"
                    placeholder="50"
                  />
                </div>
              </div>
            </div>

            {/* Family History */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-medical-green" />
                Family History
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="family_history_diabetes"
                    checked={formData.family_history_diabetes}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-medical-green bg-white/10 border-white/20 rounded focus:ring-medical-green"
                  />
                  <span className="text-sm text-medical-white/80">History of diabetes</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="family_history_cardio"
                    checked={formData.family_history_cardio}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-medical-green bg-white/10 border-white/20 rounded focus:ring-medical-green"
                  />
                  <span className="text-sm text-medical-white/80">Cardiovascular history</span>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-medical-green" />
                Current Symptoms
              </h3>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-medical-green focus:border-medical-green text-white placeholder-medical-white/60"
                placeholder="Describe your current symptoms (fatigue, excessive thirst, frequent urination, etc.)"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <motion.button
                type="submit"
                disabled={isAnalyzing}
                whileHover={{ scale: isAnalyzing ? 1 : 1.02 }}
                whileTap={{ scale: isAnalyzing ? 1 : 0.98 }}
                className={`px-8 py-4 rounded-xl font-semibold text-white flex items-center space-x-2 transition-all ${
                  isAnalyzing 
                    ? 'bg-white/10 cursor-not-allowed border border-white/20' 
                    : 'medical-button'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analysis in progress...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Run AI Analysis</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="medical-card"
        >
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-medical-green mt-0.5" />
            <div>
              <h4 className="font-semibold text-medical-green mb-2">How it works?</h4>
              <ul className="text-sm text-medical-white/80 space-y-1">
                <li>• Fill the form with your medical information</li>
                <li>• Click "Run AI Analysis" to start the evaluation</li>
                <li>• Our ML models (Logistic Regression, Random Forest) analyze your data</li>
                <li>• Receive a detailed report with risk scores and recommendations</li>
                <li>• Results are saved for future consultation</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
