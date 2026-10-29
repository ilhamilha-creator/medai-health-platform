import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import notificationService from '../utils/notificationService';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Upload, 
  Filter, 
  Search,
  Calendar,
  User,
  Activity,
  Heart,
  Brain,
  Eye,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { DoctorSpaceImage } from './MedicalImages';

export default function MedicalRecords() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFormData, setUploadFormData] = useState({
    patient_id: '',
    record_type: 'lab-results',
    description: '',
    urgency: 'normal'
  });

  // Load real medical records on mount
  useEffect(() => {
    loadMedicalRecords();
  }, [user?.id]);

  const loadMedicalRecords = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Load records from backend
      const recordsData = await apiService.getMedicalRecords(user.id);
      
      if (recordsData && recordsData.length > 0) {
        // Transform data to expected format
        const formattedRecords = recordsData.map(record => ({
          id: record.id,
          patientName: record.patient_name || 'Unknown',
          recordType: record.type || 'general',
          date: record.created_at ? new Date(record.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          doctor: record.doctor_name || 'Dr. Unknown',
          status: record.status || 'completed',
          description: record.description || 'Medical record',
          fileUrl: record.file_url || null,
          size: record.file_size || formatFileSize(record.file_size) || 'Unknown',
          urgency: record.urgency || 'normal'
        }));
        setMedicalRecords(formattedRecords);
      } else {
        // Use demo data if no records
        setMedicalRecords([
          {
            id: 1,
            patientName: 'John Smith',
            recordType: 'lab-results',
            date: '2024-01-29',
            doctor: 'Dr. Sarah Johnson',
            status: 'completed',
            description: 'Complete blood count and metabolic panel',
            fileUrl: null,
            size: '2.4 MB',
            urgency: 'normal'
          },
          {
            id: 2,
            patientName: 'Emily Johnson',
            recordType: 'x-ray',
            date: '2024-01-28',
            doctor: 'Dr. Michael Chen',
            status: 'reviewed',
            description: 'Chest X-ray - clear lungs, no abnormalities',
            fileUrl: null,
            size: '15.7 MB',
            urgency: 'normal'
          },
          {
            id: 3,
            patientName: 'Michael Brown',
            recordType: 'prescription',
            date: '2024-01-27',
            doctor: 'Dr. Emma Williams',
            status: 'active',
            description: 'Antibiotics for respiratory infection',
            fileUrl: null,
            size: '0.8 MB',
            urgency: 'high'
          }
        ]);
        notificationService.info('No medical records found. Using demo data.');
      }
    } catch (error) {
      console.error('Error loading medical records:', error);
      notificationService.error('Error loading records. Using default data.');
      
      // Fallback to demo data
      setMedicalRecords([
        {
          id: 1,
          patientName: 'John Smith',
          recordType: 'lab-results',
          date: '2024-01-29',
          doctor: 'Dr. Sarah Johnson',
          status: 'completed',
          description: 'Complete blood count and metabolic panel',
          fileUrl: null,
          size: '2.4 MB',
          urgency: 'normal'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadFormData.patient_id) {
      notificationService.warning('Veuillez sélectionner un fichier et un patient');
      return;
    }

    try {
      const result = await apiService.uploadMedicalFile(
        uploadFile, 
        uploadFormData.patient_id, 
        uploadFormData.record_type
      );
      
      if (result) {
        notificationService.success('Fichier uploadé avec succès');
        setShowUploadForm(false);
        setUploadFile(null);
        setUploadFormData({
          patient_id: '',
          record_type: 'lab-results',
          description: '',
          urgency: 'normal'
        });
        
        // Reload records
        loadMedicalRecords();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      notificationService.error('Error uploading file');
    }
  };

  const handleFileDownload = async (recordId, fileName) => {
    try {
      const blob = await apiService.downloadMedicalFile(recordId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || `medical-record-${recordId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      notificationService.success('Fichier téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading file:', error);
      notificationService.error('Error downloading file');
    }
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.recordType === filterType;
    return matchesSearch && matchesType;
  });

  const getRecordIcon = (type) => {
    switch(type) {
      case 'lab-results': return <Activity className="w-5 h-5" />;
      case 'x-ray': return <Eye className="w-5 h-5" />;
      case 'mri': return <Brain className="w-5 h-5" />;
      case 'ecg': return <Heart className="w-5 h-5" />;
      case 'prescription': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'active': return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'reviewed': return 'text-purple-400 bg-purple-400/20 border-purple-400/50';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'high': return 'text-red-400';
      case 'normal': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const stats = [
    { icon: <FileText className="w-6 h-6" />, label: 'Total Records', value: '1,847', change: '+15%' },
    { icon: <Upload className="w-6 h-6" />, label: 'This Month', value: '324', change: '+8%' },
    { icon: <Download className="w-6 h-6" />, label: 'Downloads', value: '892', change: '+22%' },
    { icon: <Clock className="w-6 h-6" />, label: 'Pending', value: '47', change: '-5%' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-medical-white/80">Loading medical records...</p>
        </div>
      </div>
    );
  }

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
            <FileText className="w-10 h-10 text-medical-green" />
            <h1 className="text-3xl font-bold text-white">Medical Records</h1>
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
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadForm(true)}
              className="medical-button flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Record</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Upload Form */}
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="medical-card mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Upload Medical Record</h2>
              <button
                onClick={() => setShowUploadForm(false)}
                className="text-medical-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-medical-white/80 mb-2">Patient</label>
                <select
                  value={uploadFormData.patient_id}
                  onChange={(e) => setUploadFormData({...uploadFormData, patient_id: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-medical-light-blue"
                >
                  <option value="">Select Patient</option>
                  <option value="1">John Smith</option>
                  <option value="2">Emily Johnson</option>
                  <option value="3">Michael Brown</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-medical-white/80 mb-2">Record Type</label>
                <select
                  value={uploadFormData.record_type}
                  onChange={(e) => setUploadFormData({...uploadFormData, record_type: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-medical-light-blue"
                >
                  <option value="lab-results">Lab Results</option>
                  <option value="x-ray">X-Ray</option>
                  <option value="mri">MRI</option>
                  <option value="ecg">ECG</option>
                  <option value="prescription">Prescription</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-medical-white/80 mb-2">Description</label>
                <input
                  type="text"
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData({...uploadFormData, description: e.target.value})}
                  placeholder="Description of the medical record"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-medical-light-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-medical-white/80 mb-2">Urgency</label>
                <select
                  value={uploadFormData.urgency}
                  onChange={(e) => setUploadFormData({...uploadFormData, urgency: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-medical-light-blue"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-medical-white/80 mb-2">File</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-medical-light-blue"
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFileUpload}
                  className="medical-button"
                >
                  Upload Record
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="medical-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-medical-green">
                  {stat.icon}
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-medical-white/70 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Filters */}
            <div className="medical-card">
              <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medical-white/50" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-medical-white/80 mb-2">
                  Record Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                >
                  <option value="all">All Types</option>
                  <option value="lab-results">Lab Results</option>
                  <option value="x-ray">X-Ray</option>
                  <option value="mri">MRI</option>
                  <option value="ecg">ECG</option>
                  <option value="prescription">Prescription</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-medical-white/80 mb-2">
                  Date Range
                </label>
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="medical-card">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <Upload className="w-4 h-4 text-medical-green" />
                  <span className="text-white text-sm">Upload Records</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <Download className="w-4 h-4 text-medical-light-blue" />
                  <span className="text-white text-sm">Export All</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <Filter className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm">Advanced Filters</span>
                </motion.button>
              </div>
            </div>

            {/* Doctor Space Image */}
            <DoctorSpaceImage />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="lg:col-span-3"
          >
            <div className="medical-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Patient Medical Records</h2>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-medical-white/50" />
                  <span className="text-medical-white/70 text-sm">
                    {filteredRecords.length} records
                  </span>
                </div>
              </div>

              {/* Records List */}
              <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-medical-white/30 mx-auto mb-4" />
                    <p className="text-medical-white/70">No medical records found</p>
                  </div>
                ) : (
                  filteredRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-medical-green/20 rounded-full flex items-center justify-center">
                            {getRecordIcon(record.recordType)}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-lg">{record.patientName}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-medical-white/60 text-sm capitalize">{record.recordType.replace('-', ' ')}</span>
                              <span className="text-medical-white/60 text-sm">{record.date}</span>
                              <span className="text-medical-white/60 text-sm">{record.size}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                          <span className={`text-xs font-medium ${getUrgencyColor(record.urgency)}`}>
                            {record.urgency} urgency
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-medical-green font-semibold text-sm mb-1">Description</h5>
                          <p className="text-medical-white/90 text-sm">{record.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-medical-white/60" />
                            <span className="text-medical-white/60 text-sm">{record.doctor}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
                            >
                              <Edit3 className="w-4 h-4 text-white" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleFileDownload(record.id, `${record.patientName}-${record.recordType}`)}
                              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
                            >
                              <Download className="w-4 h-4 text-white" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
