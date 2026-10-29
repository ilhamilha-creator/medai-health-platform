import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import databaseService from '../services/databaseService';
import notificationService from '../utils/notificationService';
import { 
  ArrowLeft, 
  Brain, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Activity,
  Download,
  RefreshCw,
  User,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';

export default function AIDiagnosisPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [patientHistory, setPatientHistory] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Récupérer les patients depuis la base de données
  const patients = databaseService.getUsersByType('patient');

  const handleAnalyze = async () => {
    if (!selectedPatient || !symptoms) {
      notificationService.warning('Veuillez sélectionner un patient et décrire les symptômes');
      return;
    }

    setIsAnalyzing(true);
    
    // Simuler l'analyse IA
    setTimeout(() => {
      const mockAnalysis = {
        id: Date.now(),
        patientName: selectedPatient.name,
        timestamp: new Date().toISOString(),
        symptoms: symptoms,
        diagnosis: 'Possible hypertension légère avec signes de stress',
        confidence: 87,
        recommendations: [
          'Prescrire des médicaments antihypertenseurs',
          'Recommander des changements de style de vie',
          'Programmer un suivi dans 2 semaines',
          'Surveiller la tension artérielle quotidiennement'
        ],
        riskFactors: [
          'Âge: ' + selectedPatient.profile?.dateOfBirth ? 
            new Date().getFullYear() - new Date(selectedPatient.profile.dateOfBirth).getFullYear() : 'Non spécifié',
          'Historique familial',
          'Mode de vie sédentaire'
        ],
        urgency: 'medium',
        followUpRequired: true,
        additionalTests: [
          'Test de tension artérielle',
          'Analyse sanguine complète',
          'Électrocardiogramme'
        ]
      };
      
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
      
      // Sauvegarder l'analyse dans la base de données
      databaseService.createMedicalRecord({
        patientId: selectedPatient.id,
        doctorId: user.id,
        type: 'AI Diagnosis',
        title: 'Analyse IA - ' + mockAnalysis.diagnosis,
        content: mockAnalysis,
        urgency: mockAnalysis.urgency
      });
    }, 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

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
                <Brain className="w-8 h-8 text-medical-green" />
                <span>AI Diagnosis</span>
              </h1>
              <p className="text-medical-white/70">Advanced AI-powered diagnostic analysis</p>
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
                    {patient.name} - {patient.profile?.dateOfBirth ? 
                      new Date().getFullYear() - new Date(patient.profile.dateOfBirth).getFullYear() : 'Âge N/A'} ans
                  </option>
                ))}
              </select>

              {selectedPatient && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{selectedPatient.name}</p>
                      <p className="text-medical-white/70 text-sm">
                        {selectedPatient.profile?.phone || 'Téléphone non spécifié'}
                      </p>
                      <p className="text-medical-white/70 text-sm">
                        {selectedPatient.profile?.dateOfBirth ? 
                          `Né le: ${new Date(selectedPatient.profile.dateOfBirth).toLocaleDateString('fr-FR')}` : 
                          'Date de naissance non spécifiée'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-medical-white/70 text-sm">Groupe sanguin</p>
                      <p className="text-white font-medium">{selectedPatient.profile?.bloodType || 'Non spécifié'}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Symptoms Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-medical-green" />
                <span>Symptoms Description</span>
              </h2>
              
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Décrivez les symptômes du patient en détail..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-medical-white/50 focus:border-medical-green focus:outline-none resize-none"
              />
            </motion.div>

            {/* Patient History */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-medical-green" />
                <span>Patient History</span>
              </h2>
              
              <textarea
                value={patientHistory}
                onChange={(e) => setPatientHistory(e.target.value)}
                placeholder="Historique médical du patient, maladies chroniques, traitements en cours..."
                rows={3}
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
                <span>Medical Documents</span>
              </h2>
              
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-medical-white/50 mx-auto mb-4" />
                <p className="text-medical-white/70 mb-2">
                  Glissez les fichiers médicaux ici ou cliquez pour télécharger
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-medical-green text-white rounded-lg hover:bg-medical-green/90 transition-colors cursor-pointer"
                >
                  Choisir un fichier
                </label>
                
                {uploadedFile && (
                  <div className="mt-4 p-3 bg-white/10 rounded-lg flex items-center justify-between">
                    <span className="text-white text-sm">{uploadedFile.name}</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                )}
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
              disabled={isAnalyzing || !selectedPatient || !symptoms}
              className="w-full py-4 bg-gradient-to-r from-medical-green to-medical-blue text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Lancer l'Analyse IA</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* AI Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-medical-green" />
                <span>AI Status</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-medical-white/70">Modèle</span>
                  <span className="text-white">MedAI v2.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-medical-white/70">Précision</span>
                  <span className="text-green-400">94.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-medical-white/70">Dernière mise à jour</span>
                  <span className="text-white">2 jours</span>
                </div>
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
                  <Target className="w-5 h-5 text-medical-green" />
                  <span>Résultats de l'Analyse</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Diagnosis */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-1">Diagnostic</p>
                    <p className="text-white font-medium">{analysisResult.diagnosis}</p>
                  </div>
                  
                  {/* Confidence */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-1">Confiance</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-medical-green to-medical-blue h-2 rounded-full"
                          style={{ width: `${analysisResult.confidence}%` }}
                        />
                      </div>
                      <span className={`font-medium ${getConfidenceColor(analysisResult.confidence)}`}>
                        {analysisResult.confidence}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Urgency */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-1">Urgence</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(analysisResult.urgency)}`}>
                      {analysisResult.urgency === 'high' ? 'Élevée' : 
                       analysisResult.urgency === 'medium' ? 'Moyenne' : 'Faible'}
                    </span>
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
                  
                  {/* Risk Factors */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Facteurs de risque</p>
                    <ul className="space-y-1">
                      {analysisResult.riskFactors.map((risk, index) => (
                        <li key={index} className="text-white text-sm flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Additional Tests */}
                  <div>
                    <p className="text-medical-white/70 text-sm mb-2">Tests additionnels</p>
                    <ul className="space-y-1">
                      {analysisResult.additionalTests.map((test, index) => (
                        <li key={index} className="text-white text-sm flex items-start space-x-2">
                          <BarChart3 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{test}</span>
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
                      <span>Exporter</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors flex items-center justify-center space-x-1"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Dossier</span>
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
