import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import DoctorSpace from './components/DoctorSpace';
import PatientSpace from './components/PatientSpace';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import LearnMorePage from './components/LearnMorePage';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import RealAppointmentsPage from './components/RealAppointmentsPage';
import ReportsPage from './components/ReportsPage';
import ErrorPage from './components/ErrorPage';
import Navigation from './components/Navigation';
import ChatAIPage from './components/ChatAIPage';
import AIDemo from './components/AIDemo';
import AnalysisResultsPage from './components/AnalysisResultsPage';
import MedicalAnalysis from './components/MedicalAnalysis';
import HealthMonitoring from './components/HealthMonitoring';
import MessagingPage from './components/MessagingPage';
import MedicalRecords from './components/MedicalRecords';
import EmergencyPage from './components/EmergencyPage';
import AIDiagnosisPage from './components/AIDiagnosisPage';
import LabAnalysisPage from './components/LabAnalysisPage';
import VitalSignsPage from './components/VitalSignsPage';
import MedicalImagingPage from './components/MedicalImagingPage';
import AdvancedAIPredictionPage from './components/AdvancedAIPredictionPage';
import MedicineScanner from './components/MedicineScanner';
import HealthInsights from './components/HealthInsights';
import EmergencySOS from './components/EmergencySOS';
import VoiceInput from './components/VoiceInput';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
      {/* Navigation only shows for authenticated users */}
      {isAuthenticated && <Navigation />}
      
      {/* Emergency SOS - Always available for authenticated users */}
      {isAuthenticated && <EmergencySOS />}
      
      {/* Main Content Area - s'adapte à la navigation latérale */}
      <div className={isAuthenticated ? "lg:ml-64 min-h-screen" : "min-h-screen"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/doctor-space" 
            element={isAuthenticated ? <DoctorSpace /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/patient-space" 
            element={isAuthenticated ? <PatientSpace /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/about" 
            element={<AboutPage />} 
          />
          <Route 
            path="/contact" 
            element={<ContactPage />} 
          />
          <Route 
            path="/learn-more" 
            element={<LearnMorePage />} 
          />
          <Route 
            path="/settings" 
            element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/appointments" 
            element={isAuthenticated ? <RealAppointmentsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/medical-records" 
            element={isAuthenticated ? <MedicalRecords /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/reports" 
            element={isAuthenticated ? <ReportsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/messages" 
            element={isAuthenticated ? <MessagingPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/ai-demo" 
            element={isAuthenticated ? <AIDemo /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/chat-ai" 
            element={isAuthenticated ? <ChatAIPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/medical-analysis" 
            element={isAuthenticated ? <MedicalAnalysis /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/analysis-results" 
            element={isAuthenticated ? <AnalysisResultsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/health-monitoring" 
            element={isAuthenticated ? <HealthMonitoring /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/emergency" 
            element={isAuthenticated ? <EmergencyPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/ai-diagnosis" 
            element={isAuthenticated ? <AIDiagnosisPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/lab-analysis" 
            element={isAuthenticated ? <LabAnalysisPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/vital-signs" 
            element={isAuthenticated ? <VitalSignsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/medical-imaging" 
            element={isAuthenticated ? <MedicalImagingPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/advanced-ai-prediction" 
            element={isAuthenticated ? <AdvancedAIPredictionPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/medicine-scanner" 
            element={isAuthenticated ? <MedicineScanner /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/health-insights" 
            element={isAuthenticated ? <HealthInsights /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen"
          >
            <AppRoutes />
            <Toaster position="top-right" />
          </motion.div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
