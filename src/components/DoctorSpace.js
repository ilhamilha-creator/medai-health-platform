import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import databaseService from '../services/databaseService';
import notificationService from '../utils/notificationService';
import { 
  ArrowLeft, 
  ArrowRight,
  Users, 
  FileText, 
  Brain, 
  Activity, 
  Calendar,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Stethoscope,
  Heart,
  Eye,
  Microscope,
  Pill
} from 'lucide-react';

export default function DoctorSpace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('patients');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load real data on mount
  useEffect(() => {
    loadDoctorData();
  }, [user?.id]);

  const loadDoctorData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Load patients from database
      const patientsData = databaseService.getUsersByType('patient');
      
      if (patientsData && patientsData.length > 0) {
        // Transform data to expected format
        const formattedPatients = patientsData.map(patient => ({
          id: patient.id,
          name: patient.name || 'Unknown Patient',
          age: patient.age || 30,
          condition: patient.condition || 'General',
          lastVisit: patient.lastVisit ? formatDate(patient.lastVisit) : 'Never',
          status: patient.status || 'stable',
          email: patient.email
        }));
        setPatients(formattedPatients);
      } else {
        // Fallback to demo data if no patient
        setPatients([
          { id: 1, name: 'Sarah Johnson', age: 34, condition: 'Hypertension', lastVisit: '2 days ago', status: 'stable' },
          { id: 2, name: 'Michael Chen', age: 45, condition: 'Diabetes Type 2', lastVisit: '1 week ago', status: 'improving' },
          { id: 3, name: 'Emma Williams', age: 28, condition: 'Asthma', lastVisit: '3 days ago', status: 'critical' },
          { id: 4, name: 'Robert Davis', age: 62, condition: 'Heart Disease', lastVisit: '1 day ago', status: 'stable' },
        ]);
        notificationService.info('No patient found. Using demo data.');
      }

      // Load recent reports from backend
      try {
        const reportsData = await apiService.getMedicalRecords('all'); // ou filtrer par médecin
        if (reportsData && reportsData.length > 0) {
          const formattedReports = reportsData.slice(0, 10).map(report => ({
            id: report.id,
            patient: report.patient_name || 'Unknown',
            type: report.type || 'General',
            date: report.created_at ? formatDate(report.created_at) : new Date().toISOString().split('T')[0],
            status: report.status || 'completed'
          }));
          setRecentReports(formattedReports);
        } else {
          // Rapports de démonstration
          setRecentReports([
            { id: 1, patient: 'Sarah Johnson', type: 'Blood Test', date: '2024-01-28', status: 'completed' },
            { id: 2, patient: 'Michael Chen', type: 'ECG Report', date: '2024-01-27', status: 'reviewing' },
            { id: 3, patient: 'Emma Williams', type: 'X-Ray', date: '2024-01-26', status: 'completed' },
            { id: 4, patient: 'Robert Davis', type: 'MRI Scan', date: '2024-01-25', status: 'pending' },
          ]);
        }
      } catch (reportsError) {
        console.warn('Could not load reports from backend:', reportsError);
        // Use demo reports
        setRecentReports([
          { id: 1, patient: 'Sarah Johnson', type: 'Blood Test', date: '2024-01-28', status: 'completed' },
          { id: 2, patient: 'Michael Chen', type: 'ECG Report', date: '2024-01-27', status: 'reviewing' },
          { id: 3, patient: 'Emma Williams', type: 'X-Ray', date: '2024-01-26', status: 'completed' },
          { id: 4, patient: 'Robert Davis', type: 'MRI Scan', date: '2024-01-25', status: 'pending' },
        ]);
      }

    } catch (error) {
      console.error('Error loading doctor data:', error);
      notificationService.error('Error loading data. Using default data.');
      
      // Fallback to demo data
      setPatients([
        { id: 1, name: 'Sarah Johnson', age: 34, condition: 'Hypertension', lastVisit: '2 days ago', status: 'stable' },
        { id: 2, name: 'Michael Chen', age: 45, condition: 'Diabetes Type 2', lastVisit: '1 week ago', status: 'improving' },
        { id: 3, name: 'Emma Williams', age: 28, condition: 'Asthma', lastVisit: '3 days ago', status: 'critical' },
        { id: 4, name: 'Robert Davis', age: 62, condition: 'Heart Disease', lastVisit: '1 day ago', status: 'stable' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return 'Unknown';
    }
  };

  const handlePatientSelect = async (patient) => {
    setSelectedPatient(patient);
    
    // Load detailed patient data from backend
    try {
      const patientHealthData = await apiService.getHealthData(patient.id);
      if (patientHealthData) {
        setSelectedPatient({
          ...patient,
          healthData: patientHealthData
        });
      }
    } catch (error) {
      console.warn('Could not load patient health data:', error);
    }
  };

  const handleDiagnosticTool = async (toolName) => {
    if (!selectedPatient) {
      notificationService.warning('Please select a patient first');
      return;
    }

    // Navigation vers les outils de diagnostic appropriés
    switch (toolName) {
      case 'AI Diagnosis':
        navigate('/medical-analysis', { state: { patientId: selectedPatient.id } });
        break;
      case 'Lab Analysis':
        navigate('/lab-analysis', { state: { patientId: selectedPatient.id } });
        break;
      case 'Vital Signs':
        navigate('/vital-signs', { state: { patientId: selectedPatient.id } });
        break;
      case 'Medical Imaging':
        navigate('/medical-imaging', { state: { patientId: selectedPatient.id } });
        break;
      default:
        notificationService.info('Outil en cours de développement');
    }
  };

  const diagnosticTools = [
    { icon: <Brain className="w-8 h-8" />, name: 'AI Diagnosis', description: 'Advanced AI-powered diagnostic analysis', action: () => handleDiagnosticTool('AI Diagnosis') },
    { icon: <Microscope className="w-8 h-8" />, name: 'Lab Analysis', description: 'Comprehensive laboratory test results', action: () => handleDiagnosticTool('Lab Analysis') },
    { icon: <Activity className="w-8 h-8" />, name: 'Vital Signs', description: 'Real-time patient monitoring data', action: () => handleDiagnosticTool('Vital Signs') },
    { icon: <Eye className="w-8 h-8" />, name: 'Medical Imaging', description: 'X-ray, MRI, and CT scan analysis', action: () => handleDiagnosticTool('Medical Imaging') },
  ];

  // Filter patients by search
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'stable': return 'text-green-400 bg-green-400/20';
      case 'improving': return 'text-blue-400 bg-blue-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-medical-white/80">Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-80 h-80 bg-medical-green opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-medical-light-blue opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-white">Doctor Space</h1>
              <p className="text-medical-white/70">Advanced Medical Professional Interface</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Data</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 medical-button"
            >
              <Download className="w-5 h-5" />
              <span>Export Reports</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex space-x-1 mb-8 bg-white/5 p-1 rounded-lg backdrop-blur-sm"
        >
          {['patients', 'diagnostics', 'analytics'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-medical-blue text-white shadow-lg'
                  : 'text-medical-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'patients' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-medical-white/50" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                  </motion.button>
                </div>

                {/* Patients List */}
                <div className="grid gap-4">
                  {filteredPatients.map((patient, index) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handlePatientSelect(patient)}
                      className="medical-card cursor-pointer hover:border-medical-light-blue transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-medical-blue/20 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-medical-light-blue" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{patient.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-medical-white/70">
                              <span>Age: {patient.age}</span>
                              <span>{patient.condition}</span>
                              <span>Last visit: {patient.lastVisit}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                          <div className="w-10 h-10 bg-medical-green/20 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-medical-green" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'diagnostics' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Diagnostic Tools</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {diagnosticTools.map((tool, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={tool.action}
                      className="medical-card cursor-pointer group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-medical-blue/20 rounded-lg group-hover:bg-medical-blue/30 transition-colors duration-300">
                          <div className="text-medical-light-blue">{tool.icon}</div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
                          <p className="text-sm text-medical-white/70 mb-4">{tool.description}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-medical-light-blue text-sm font-medium flex items-center space-x-2"
                          >
                            <span>Launch Tool</span>
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Reports */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Reports</h3>
                  <div className="space-y-3">
                    {recentReports.map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="medical-card flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="w-5 h-5 text-medical-light-blue" />
                          <div>
                            <p className="text-white font-medium">{report.patient}</p>
                            <p className="text-sm text-medical-white/70">{report.type} • {report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            report.status === 'completed' ? 'bg-green-400/20 text-green-400' :
                            report.status === 'reviewing' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-gray-400/20 text-gray-400'
                          }`}>
                            {report.status}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
                          >
                            <Eye className="w-4 h-4 text-medical-white/70" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Analytics & Insights</h2>
                
                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { label: 'Total Patients', value: '1,234', change: '+12%', icon: <Users className="w-6 h-6" /> },
                    { label: 'Success Rate', value: '96.5%', change: '+2.3%', icon: <CheckCircle className="w-6 h-6" /> },
                    { label: 'Avg. Response Time', value: '2.3 min', change: '-18%', icon: <Clock className="w-6 h-6" /> },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="medical-card"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-medical-blue/20 rounded-lg">
                          <div className="text-medical-light-blue">{stat.icon}</div>
                        </div>
                        <span className="text-sm text-medical-green font-medium">{stat.change}</span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-medical-white/70">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart Placeholder */}
                <div className="medical-card h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-medical-light-blue/50 mx-auto mb-4" />
                    <p className="text-medical-white/70">Interactive analytics dashboard</p>
                    <p className="text-sm text-medical-white/50">Patient trends and outcomes</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="medical-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4">AI Assistant</h3>
              <div className="h-40 relative bg-gradient-to-br from-medical-green/20 to-medical-blue/20 rounded-lg flex items-center justify-center">
                <Brain className="w-16 h-16 text-medical-green/50" />
              </div>
              <div className="mt-4 p-3 bg-medical-green/20 rounded-lg">
                <p className="text-sm text-medical-white/80">
                  "I've analyzed today's patient data. Three cases require immediate attention. Would you like me to prioritize them?"
                </p>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="medical-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: <Calendar className="w-4 h-4" />, label: 'Schedule Appointment' },
                  { icon: <Pill className="w-4 h-4" />, label: 'Prescribe Medication' },
                  { icon: <FileText className="w-4 h-4" />, label: 'Generate Report' },
                  { icon: <AlertCircle className="w-4 h-4" />, label: 'Emergency Alert' },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    <div className="text-medical-light-blue">{action.icon}</div>
                    <span className="text-sm text-white">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
