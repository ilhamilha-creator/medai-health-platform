import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import databaseService from '../services/databaseService';
import notificationService from '../utils/notificationService';
import { 
  ArrowLeft, 
  Eye, 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  ZoomIn,
  ZoomOut,
  RotateCw,
  User,
  RefreshCw,
  Search,
  Filter,
  Camera,
  Brain,
  Bone,
  Heart,
  Maximize2,
  Share2,
  FileText,
  BarChart3,
  Cpu,
  Sliders
} from 'lucide-react';

export default function MedicalImagingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageType, setImageType] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);

  // Récupérer les patients depuis la base de données
  const patients = databaseService.getUsersByType('patient');

  const imageTypes = [
    'X-Ray',
    'MRI',
    'CT Scan',
    'Ultrasound',
    'Mammography',
    'PET Scan',
    'Angiography',
    'DEXA Scan'
  ];

  const mockImages = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      imageType: 'X-Ray',
      date: '2024-01-28',
      status: 'completed',
      description: 'Chest X-Ray - PA View',
      findings: 'Clear lungs, no acute findings',
      doctor: 'Dr. Smith',
      imageUrl: '/api/placeholder/400/300'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      imageType: 'MRI',
      date: '2024-01-27',
      status: 'reviewing',
      description: 'Brain MRI - T1 Weighted',
      findings: 'Mild white matter changes',
      doctor: 'Dr. Johnson',
      imageUrl: '/api/placeholder/400/300'
    },
    {
      id: 3,
      patientName: 'Emma Williams',
      imageType: 'CT Scan',
      date: '2024-01-26',
      status: 'completed',
      description: 'Abdominal CT with contrast',
      findings: 'Normal abdominal structures',
      doctor: 'Dr. Brown',
      imageUrl: '/api/placeholder/400/300'
    }
  ];

  const handleAnalyze = async () => {
    if (!selectedPatient || !imageType || !uploadedFile) {
      notificationService.warning('Veuillez sélectionner un patient, un type d\'image et télécharger un fichier');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      // Prepare form data
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('image_type', imageType);
      formData.append('patient_id', selectedPatient.id);
      
      // Determine endpoint based on image type
      let endpoint = '/api/vision/analyze/xray';
      if (imageType === 'MRI') endpoint = '/api/vision/analyze/mri';
      else if (imageType === 'CT Scan') endpoint = '/api/vision/analyze/ct';
      else if (imageType === 'X-Ray') endpoint = '/api/vision/analyze/xray';
      else {
        notificationService.warning('Type d\'image non supporté pour l\'analyse automatique');
        setIsAnalyzing(false);
        return;
      }
      
      // Call real backend
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse de l\'image');
      }
      
      const analysisData = await response.json();
      
      // Format analysis result
      const formattedAnalysis = {
        id: Date.now(),
        patientName: selectedPatient.name,
        imageType: imageType,
        timestamp: new Date().toISOString(),
        findings: analysisData.findings,
        interpretation: analysisData.interpretation,
        detailedFindings: analysisData.abnormalities || [],
        confidence: Math.round(analysisData.confidence * 100),
        recommendations: analysisData.recommendations || [],
        urgency: analysisData.urgency || 'low',
        followUpRequired: analysisData.urgency !== 'low',
        aiModel: 'MedAI-Vision CNN (ResNet50)',
        processingTime: `${analysisData.processing_time?.toFixed(2) || 'N/A'} seconds`
      };
      
      setAnalysisResult(formattedAnalysis);
      notificationService.success('Analyse terminée avec succès');
      
      // Sauvegarder l'analyse dans la base de données
      databaseService.createMedicalRecord({
        patientId: selectedPatient.id,
        doctorId: user.id,
        type: 'Medical Imaging',
        title: 'Analyse d\'Imagerie - ' + imageType,
        content: formattedAnalysis,
        urgency: formattedAnalysis.urgency
      });
      
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      notificationService.error('Erreur lors de l\'analyse de l\'image');
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Créer une URL pour l'aperçu
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoomLevel(100);
    setRotation(0);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'reviewing': return 'text-yellow-400 bg-yellow-400/20';
      case 'pending': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getImageIcon = (type) => {
    switch(type) {
      case 'X-Ray': return <Camera className="w-6 h-6" />;
      case 'MRI': return <Brain className="w-6 h-6" />;
      case 'CT Scan': return <Bone className="w-6 h-6" />;
      case 'Ultrasound': return <Heart className="w-6 h-6" />;
      default: return <Eye className="w-6 h-6" />;
    }
  };

  const filteredImages = mockImages.filter(image =>
    image.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.imageType.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Eye className="w-8 h-8 text-medical-green" />
                <span>Medical Imaging</span>
              </h1>
              <p className="text-medical-white/70">X-ray, MRI, and CT scan analysis</p>
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

            {/* Image Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-medical-green" />
                <span>Image Type</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {imageTypes.map(type => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setImageType(type)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      imageType === type
                        ? 'bg-medical-green/20 border-medical-green text-white'
                        : 'bg-white/10 border-white/20 text-medical-white/70 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      {getImageIcon(type)}
                      <span className="text-xs">{type}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-medical-green" />
                <span>Image Upload</span>
              </h2>
              
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                <Eye className="w-12 h-12 text-medical-white/50 mx-auto mb-4" />
                <p className="text-medical-white/70 mb-2">
                  Téléchargez l\'image médicale (DICOM, JPG, PNG)
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".dcm,.jpg,.jpeg,.png,.tiff"
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-4 py-2 bg-medical-green text-white rounded-lg hover:bg-medical-green/90 transition-colors cursor-pointer"
                >
                  Choisir une image
                </label>
                
                {uploadedFile && (
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-white text-sm mb-2">{uploadedFile.name}</p>
                    <p className="text-medical-white/50 text-xs">
                      Taille: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Image Preview */}
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-medical-green" />
                    <span>Image Preview</span>
                  </h2>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleZoomOut}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <ZoomOut className="w-4 h-4 text-white" />
                    </motion.button>
                    <span className="text-white text-sm">{zoomLevel}%</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleZoomIn}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRotate}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <RotateCw className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReset}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4 overflow-auto max-h-96">
                  <img
                    src={selectedImage}
                    alt="Medical scan result showing detailed anatomical structure"
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                      transition: 'transform 0.3s ease',
                      maxWidth: '100%',
                      height: 'auto'
                    }}
                    className="mx-auto"
                  />
                </div>
              </motion.div>
            )}

            {/* Analyze Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedPatient || !imageType || !uploadedFile}
              className="w-full py-4 bg-gradient-to-r from-medical-green to-medical-blue text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyse IA en cours...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-5 h-5" />
                  <span>Lancer l'Analyse IA</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Recent Images */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-medical-green" />
                <span>Images Récentes</span>
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
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedImage(image.imageUrl)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">{image.patientName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(image.status)}`}>
                        {image.status === 'completed' ? 'Terminé' : 
                         image.status === 'reviewing' ? 'En cours' : 'En attente'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      {getImageIcon(image.imageType)}
                      <span className="text-medical-white/70 text-xs">{image.imageType}</span>
                    </div>
                    <p className="text-medical-white/50 text-xs">{image.date}</p>
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
                  <Cpu className="w-5 h-5 text-medical-green" />
                  <span>Résultats de l'Analyse IA</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Summary */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Interprétation</p>
                    <p className="text-white text-sm">{analysisResult.interpretation}</p>
                  </div>
                  
                  {/* Findings Summary */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Statistiques des Découvertes</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-white/5 rounded">
                        <p className="text-green-400 font-bold">{analysisResult.findings.normal}</p>
                        <p className="text-medical-white/70 text-xs">Normal</p>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded">
                        <p className="text-yellow-400 font-bold">{analysisResult.findings.abnormal}</p>
                        <p className="text-medical-white/70 text-xs">Anormal</p>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded">
                        <p className="text-red-400 font-bold">{analysisResult.findings.critical}</p>
                        <p className="text-medical-white/70 text-xs">Critique</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Confidence */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Confiance de l'IA</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-medical-green to-medical-blue h-2 rounded-full"
                          style={{ width: `${analysisResult.confidence}%` }}
                        />
                      </div>
                      <span className="text-green-400 font-medium">{analysisResult.confidence}%</span>
                    </div>
                  </div>
                  
                  {/* Detailed Findings */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Découvertes Détaillées</p>
                    <ul className="space-y-1">
                      {analysisResult.detailedFindings.map((finding, index) => (
                        <li key={index} className="text-white text-sm flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Recommendations */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Recommandations</p>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="text-white text-sm flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* AI Info */}
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-medical-white/70">Modèle IA:</span>
                      <span className="text-white">{analysisResult.aiModel}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-medical-white/70">Temps de traitement:</span>
                      <span className="text-white">{analysisResult.processingTime}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-2 bg-medical-green text-white rounded-lg text-sm hover:bg-medical-green/90 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Rapport</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Partager</span>
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
