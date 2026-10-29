import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import databaseService from '../services/databaseService';
import apiService from '../services/apiService';
import notificationService from '../utils/notificationService';
import { 
  ArrowLeft, 
  Microscope, 
  Upload, 
  Search,
  User,
  Calendar,
  Clock,
  TestTube,
  Beaker,
  Droplet,
  Dna,
  BarChart3,
  Filter,
  Eye,
  RefreshCw,
  CheckCircle,
  Download
} from 'lucide-react';

export default function LabAnalysisPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [testType, setTestType] = useState('');
  const [results, setResults] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [labResults, setLabResults] = useState([]);

  // Retrieve patients from database
  const patients = databaseService.getUsersByType('patient');

  // Load real lab results on mount
  useEffect(() => {
    loadLabResults();
  }, [user?.id]);

  const loadLabResults = async () => {
    try {
      setLoading(true);
      
      // Load medical records of type lab-results
      const medicalRecords = await apiService.getMedicalRecords('all');
      
      if (medicalRecords && medicalRecords.length > 0) {
        const labRecords = medicalRecords
          .filter(record => record.type === 'lab-results' || record.record_type === 'lab-results')
          .map(record => ({
            id: record.id,
            patientName: record.patient_name || 'Unknown',
            testType: record.title || 'Blood Test',
            date: record.created_at ? new Date(record.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: record.status || 'completed',
            results: record.results || {},
            interpretation: record.description || 'No interpretation available',
            doctor: record.doctor_name || 'Dr. Unknown'
          }));
        
        if (labRecords.length > 0) {
          setLabResults(labRecords);
        } else {
          // Use demo data if no lab results
          setLabResults([
            {
              id: 1,
              patientName: 'Sarah Johnson',
              testType: 'Blood Test',
              date: '2024-01-28',
              status: 'completed',
              results: {
                hemoglobin: '14.2 g/dL',
                hematocrit: '42%',
                wbc: '7.5 K/μL',
                rbc: '4.8 M/μL',
                platelets: '250 K/μL'
              },
              interpretation: 'Normal blood parameters',
              doctor: 'Dr. Smith'
            }
          ]);
          notificationService.info('No lab results found. Using demo data.');
        }
      } else {
        // Use demo data
        setLabResults([
          {
            id: 1,
            patientName: 'Sarah Johnson',
            testType: 'Blood Test',
            date: '2024-01-28',
            status: 'completed',
            results: {
              hemoglobin: '14.2 g/dL',
              hematocrit: '42%',
              wbc: '7.5 K/μL',
              rbc: '4.8 M/μL',
              platelets: '250 K/μL'
            },
            interpretation: 'Normal blood parameters',
            doctor: 'Dr. Smith'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading lab results:', error);
      notificationService.error('Error loading results. Using default data.');
      
      // Fallback to demo data
      setLabResults([
        {
          id: 1,
          patientName: 'Sarah Johnson',
          testType: 'Blood Test',
          date: '2024-01-28',
          status: 'completed',
          results: {
            hemoglobin: '14.2 g/dL',
            hematocrit: '42%',
            wbc: '7.5 K/μL',
            rbc: '4.8 M/μL',
            platelets: '250 K/μL'
          },
          interpretation: 'Normal blood parameters',
          doctor: 'Dr. Smith'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const testTypes = [
    'Blood Test',
    'Urine Analysis',
    'Complete Blood Count (CBC)',
    'Lipid Panel',
    'Liver Function Test',
    'Kidney Function Test',
    'Thyroid Panel',
    'Glucose Test',
    'Electrolyte Panel',
    'Vitamin D Test'
  ];

  const handleAnalyze = (e) => {
    if (!selectedPatient || !testType || !results) {
      notificationService.warning('Please fill in all fields');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate lab analysis
    setTimeout(() => {
      const mockAnalysis = {
        id: Date.now(),
        patientName: selectedPatient.name,
        testType: testType,
        timestamp: new Date().toISOString(),
        results: {
          normal: 12,
          abnormal: 3,
          critical: 0
        },
        interpretation: 'Results show mainly values in normal range with some slight variations requiring monitoring.',
        recommendations: [
          'Repeat tests in 3 months',
          'Monitor cholesterol levels',
          'Maintenir un régime alimentaire équilibré',
          'Augmenter l\'activité physique'
        ],
        detailedResults: generateDetailedResults(testType),
        urgency: 'low',
        followUpRequired: true,
        ml_used: false
      };
      
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
    }, 2500);
  };

  const generateDetailedResults = (testType) => {
    // Generate detailed results based on test type
    const commonResults = {
      'Hémoglobine': { value: '14.2 g/dL', status: 'normal', range: '12.0-15.5 g/dL' },
      'Hématocrite': { value: '42%', status: 'normal', range: '36%-46%' },
      'Leucocytes': { value: '7.5 K/μL', status: 'normal', range: '4.5-11.0 K/μL' },
      'Plaquettes': { value: '250 K/μL', status: 'normal', range: '150-450 K/μL' }
    };

    if (testType.includes('Lipid')) {
      return {
        ...commonResults,
        'Total Cholesterol': { value: '210 mg/dL', status: 'borderline', range: '<200 mg/dL' },
        'LDL': { value: '140 mg/dL', status: 'high', range: '<100 mg/dL' },
        'HDL': { value: '45 mg/dL', status: 'normal', range: '>40 mg/dL' },
        'Triglycerides': { value: '180 mg/dL', status: 'borderline', range: '<150 mg/dL' }
      };
    }

    if (testType.includes('Liver')) {
      return {
        ...commonResults,
        'ALT': { value: '35 U/L', status: 'normal', range: '7-56 U/L' },
        'AST': { value: '30 U/L', status: 'normal', range: '10-40 U/L' },
        'Bilirubine': { value: '1.0 mg/dL', status: 'normal', range: '0.3-1.2 mg/dL' },
        'Albumine': { value: '4.2 g/dL', status: 'normal', range: '3.5-5.0 g/dL' }
      };
    }

    return commonResults;
  };

  const handleFileUpload = (e) => {
    // Placeholder for file upload functionality
    console.log('File upload placeholder');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'reviewing': return 'text-yellow-400 bg-yellow-400/20';
      case 'pending': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getResultStatusColor = (status) => {
    switch(status) {
      case 'normal': return 'text-green-400';
      case 'borderline': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const filteredResults = labResults.filter(result =>
    result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.testType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-medical-white/80">Loading lab analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/doctor-space')}
              className="p-2 bg-white/10 backdrop-blur-lg rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                <Microscope className="w-8 h-8 text-medical-green" />
                <span>Lab Analysis</span>
              </h1>
              <p className="text-medical-white/70">Comprehensive laboratory test results</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 bg-medical-green/20 rounded-lg">
              <span className="text-medical-green font-medium">Dr. {user?.name}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-medical-green" />
                <span>Patient Selection</span>
              </h2>
              
              <select
                value={selectedPatient?.id || ''}
                onChange={(e) => {
                  const patient = patients.find(p => p.id === parseInt(e.target.value));
                  setSelectedPatient(patient);
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-medical-green focus:outline-none"
              >
                <option value="" className="bg-gray-800">Sélectionner un patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id} className="bg-gray-800">
                    {patient.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Test Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <TestTube className="w-5 h-5 text-medical-green" />
                <span>Test Type</span>
              </h2>
              
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-medical-green focus:outline-none"
              >
                <option value="" className="bg-gray-800">Select test type</option>
                {testTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-800">
                    {type}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Results Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Beaker className="w-5 h-5 text-medical-green" />
                <span>Test Results</span>
              </h2>
              
              <textarea
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="Enter laboratory test results..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-medical-white/50 focus:border-medical-green focus:outline-none resize-none"
              />
            </motion.div>

            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-medical-green" />
                <span>Lab Reports</span>
              </h2>
              
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                <Droplet className="w-12 h-12 text-medical-white/50 mx-auto mb-4" />
                <p className="text-medical-white/70 mb-2">
                  Download laboratory reports
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  id="lab-file-upload"
                />
                <label
                  htmlFor="lab-file-upload"
                  className="inline-block px-4 py-2 bg-medical-green text-white rounded-lg hover:bg-medical-green/90 transition-colors cursor-pointer"
                >
                  Choisir un fichier
                </label>
              </div>
            </motion.div>

            {/* Analyze Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedPatient || !testType || !results}
              className="w-full py-4 bg-gradient-to-r from-medical-green to-medical-blue text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <Microscope className="w-5 h-5" />
                  <span>Analyser les Résultats</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Recent Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-medical-green" />
                <span>Résultats Récents</span>
              </h3>
              
              {/* Search */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medical-white/50" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-medical-white/50 focus:border-medical-green focus:outline-none text-sm"
                />
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">{result.patientName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(result.status)}`}>
                        {result.status === 'completed' ? 'Terminé' : 
                         result.status === 'reviewing' ? 'En cours' : 'En attente'}
                      </span>
                    </div>
                    <p className="text-medical-white/70 text-xs mb-1">{result.testType}</p>
                    <p className="text-medical-white/50 text-xs">{result.date}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Analysis Results */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Dna className="w-5 h-5 text-medical-green" />
                  <span>Analyse Détaillée</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Summary */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Résumé</p>
                    <p className="text-white text-sm">{analysisResult.interpretation}</p>
                  </div>
                  
                  {/* Results Summary */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Statistiques</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-white/5 rounded">
                        <p className="text-green-400 font-bold">{analysisResult.results.normal}</p>
                        <p className="text-medical-white/70 text-xs">Normal</p>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded">
                        <p className="text-yellow-400 font-bold">{analysisResult.results.abnormal}</p>
                        <p className="text-medical-white/70 text-xs">Abnormal</p>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded">
                        <p className="text-red-400 font-bold">{analysisResult.results.critical}</p>
                        <p className="text-medical-white/70 text-xs">Critique</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed Results */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Résultats Détaillés</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {Object.entries(analysisResult.detailedResults).map(([test, data]) => (
                        <div key={test} className="p-2 bg-white/5 rounded">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm font-medium">{test}</span>
                            <span className={`text-xs ${getResultStatusColor(data.status)}`}>
                              {data.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-medical-white/70 text-xs">{data.value}</span>
                            <span className="text-medical-white/50 text-xs">{data.range}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Recommandations</p>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="text-white text-sm flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-2 bg-medical-green text-white rounded-lg text-sm hover:bg-medical-green/90 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Voir</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
