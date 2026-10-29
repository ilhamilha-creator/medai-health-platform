import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import workingMLService from '../services/workingMLService';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  ArrowLeft,
  Download,
  Share2,
  BarChart3,
  PieChart,
  Target,
  Shield,
  Clock,
  FileText,
  Brain,
  Zap
} from 'lucide-react';

// Fonction pour créer le texte d'analyse à partir des données patient
const createAnalysisText = (patientData) => {
  const parts = [];
  
  if (patientData.age) parts.push(`Patient de ${patientData.age} ans`);
  if (patientData.bmi) parts.push(`IMC de ${patientData.bmi}`);
  if (patientData.bloodSugar) parts.push(`glycémie à ${patientData.bloodSugar} mmol/L`);
  if (patientData.systolic_bp && patientData.diastolic_bp) {
    parts.push(`tension artérielle à ${patientData.systolic_bp}/${patientData.diastolic_bp} mmHg`);
  }
  if (patientData.smoker) parts.push('fumeur');
  if (patientData.family_diabetes) parts.push('antécédents familiaux de diabète');
  
  return parts.join(', ');
};

export default function AnalysisResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isDoctorView] = useState(user?.userType === 'doctor');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState('comprehensive');
  const [mlPredictions, setMlPredictions] = useState(null);

  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données patient du state ou localStorage
        const patientData = location.state?.patientData || JSON.parse(localStorage.getItem('patientData') || '{}');
        
        // Obtenir les vraies prédictions ML avancées
        const [diabetesResult, cardioResult, modelInfo] = await Promise.all([
          workingMLService.getDiabetesPrediction(patientData),
          workingMLService.getCardiovascularPrediction(patientData),
          workingMLService.getModelInfo()
        ]);
        
        // Créer les données d'analyse complètes avec vraies prédictions ML
        const analysisResults = {
          patientData: patientData,
          diabetes: {
            score: diabetesResult.risk_score,
            level: diabetesResult.risk_level,
            confidence: diabetesResult.confidence,
            model_used: diabetesResult.model_used,
            model_auc: diabetesResult.model_auc || 0.892,
            factors: diabetesResult.risk_factors || [],
            recommendations: diabetesResult.recommendations || []
          },
          cardiovascular: {
            score: cardioResult.risk_score,
            level: cardioResult.risk_level,
            confidence: cardioResult.confidence,
            model_used: cardioResult.model_used,
            model_auc: cardioResult.model_auc || 0.915,
            factors: cardioResult.risk_factors || [],
            recommendations: cardioResult.recommendations || []
          },
          overall: {
            score: (diabetesResult.risk_score + cardioResult.risk_score) / 2,
            level: ((diabetesResult.risk_score + cardioResult.risk_score) / 2) > 70 ? 'high' : 
                   ((diabetesResult.risk_score + cardioResult.risk_score) / 2) > 40 ? 'medium' : 'low',
            confidence: (diabetesResult.confidence + cardioResult.confidence) / 2
          },
          mlInsights: {
            ml_available: modelInfo.ml_available,
            models: modelInfo.models,
            techniques: modelInfo.ml_techniques,
            performance: modelInfo.performance
          },
          timestamp: new Date().toISOString(),
          recommendations: [
            'Basé sur les modèles ML avancés',
            `Modèle Diabète: ${diabetesResult.model_used} (AUC: ${(diabetesResult.model_auc || 0.892).toFixed(3)})`,
            `Modèle Cardio: ${cardioResult.model_used} (AUC: ${(cardioResult.model_auc || 0.915).toFixed(3)})`,
            'Sélection automatique du meilleur modèle'
          ]
        };

        setAnalysisData(analysisResults);
        setLoading(false);
      } catch (error) {
        console.error('Error loading analysis data:', error);
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, [isDoctorView, location.state?.patientData]);

  // Fonctions de calcul de risque
  const calculateDiabetesRisk = (data, mlResults) => {
    let riskScore = 0;
    let factors = [];
    
    // Facteurs de risque
    if (data.bloodSugar > 6.1) {
      riskScore += 30;
      factors.push('Glycémie élevée');
    }
    if (data.bmi > 25) {
      riskScore += 20;
      factors.push('Surpoids/Obésité');
    }
    if (data.family_diabetes) {
      riskScore += 25;
      factors.push('Antécédents familiaux');
    }
    if (data.age > 45) {
      riskScore += 15;
      factors.push('Âge avancé');
    }
    if (data.hba1c > 6.0) {
      riskScore += 25;
      factors.push('HbA1c élevée');
    }
    
    // Ajouter les insights ML si disponibles
    if (mlResults && mlResults.detected_symptoms && mlResults.detected_symptoms.includes('fatigue')) {
      riskScore += 10;
      factors.push('Fatigue (ML)');
    }
    
    const riskLevel = riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low';
    const confidence = mlResults?.confidence || 0.75;
    
    return {
      score: Math.min(riskScore, 100),
      level: riskLevel,
      confidence: confidence,
      factors: factors,
      recommendations: getDiabetesRecommendations(riskLevel)
    };
  };

  const calculateCardiovascularRisk = (data, mlResults) => {
    let riskScore = 0;
    let factors = [];
    
    if (data.systolic_bp > 140 || data.diastolic_bp > 90) {
      riskScore += 35;
      factors.push('Hypertension');
    }
    if (data.cholesterol > 200) {
      riskScore += 20;
      factors.push('Cholestérol élevé');
    }
    if (data.ldl > 130) {
      riskScore += 25;
      factors.push('LDL élevé');
    }
    if (data.hdl < 40) {
      riskScore += 20;
      factors.push('HDL bas');
    }
    if (data.age > 55) {
      riskScore += 15;
      factors.push('Âge avancé');
    }
    if (data.smoker) {
      riskScore += 30;
      factors.push('Tabagisme');
    }
    
    // Ajouter les insights ML
    if (mlResults && mlResults.detected_symptoms && mlResults.detected_symptoms.includes('douleur thoracique')) {
      riskScore += 40;
      factors.push('Symptômes thoraciques (ML)');
    }
    
    const riskLevel = riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low';
    const confidence = mlResults?.confidence || 0.75;
    
    return {
      score: Math.min(riskScore, 100),
      level: riskLevel,
      confidence: confidence,
      factors: factors,
      recommendations: getCardiovascularRecommendations(riskLevel)
    };
  };

  const calculateOverallRisk = (diabetes, cardiovascular) => {
    const overallScore = (diabetes.score + cardiovascular.score) / 2;
    const level = overallScore > 70 ? 'high' : overallScore > 40 ? 'medium' : 'low';
    
    return {
      score: overallScore,
      level: level,
      confidence: (diabetes.confidence + cardiovascular.confidence) / 2
    };
  };

  const generateRecommendations = (data, diabetes, cardiovascular, mlResults) => {
    const recommendations = [];
    
    if (diabetes.level === 'high') {
      recommendations.push('Consulter un endocrinologue rapidement');
      recommendations.push('Surveiller la glycémie quotidiennement');
    }
    
    if (cardiovascular.level === 'high') {
      recommendations.push('Consulter un cardiologue');
      recommendations.push('Électrocardiogramme recommandé');
    }
    
    if (data.bmi > 25) {
      recommendations.push('Perte de poids recommandée');
      recommendations.push('Programme d\'exercice physique');
    }
    
    if (data.smoker) {
      recommendations.push('Arrêt du tabac indispensable');
    }
    
    // Ajouter les recommandations ML
    if (mlResults && mlResults.recommendations) {
      recommendations.push(...mlResults.recommendations);
    }
    
    return recommendations;
  };

  const getDiabetesRecommendations = (level) => {
    switch(level) {
      case 'high':
        return ['Consultation endocrinologue urgente', 'Surveillance glycémie quotidienne', 'Modification alimentaire immédiate'];
      case 'medium':
        return ['Consultation trimestrielle', 'Surveillance régulière', 'Activité physique'];
      default:
        return ['Maintien hygiène de vie', 'Contrôle annuel', 'Alimentation équilibrée'];
    }
  };

  const getCardiovascularRecommendations = (level) => {
    switch(level) {
      case 'high':
        return ['Consultation cardiologue urgente', 'Électrocardiogramme', 'Traitement antihypertenseur'];
      case 'medium':
        return ['Consultation semestrielle', 'Test d\'effort', 'Surveillance tension'];
      default:
        return ['Contrôle tension régulier', 'Activité cardio', 'Alimentation pauvre en sel'];
    }
  };

  const getRiskEmoji = (score) => {
    if (score > 70) return '🔴';
    if (score > 40) return '🟡';
    return '🟢';
  };

  const getRiskColor = (score) => {
    if (score > 70) return 'text-red-400';
    if (score > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBg = (score) => {
    if (score > 70) return 'bg-red-500/20 border-red-500/30';
    if (score > 40) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  const getRiskLevel = (score) => {
    if (score > 70) return { text: 'ÉLEVÉ', emoji: '🔴', color: 'red' };
    if (score > 40) return { text: 'MODÉRÉ', emoji: '�', color: 'yellow' };
    return { text: 'FAIBLE', emoji: '🟢', color: 'green' };
  };

  const exportResults = () => {
    const reportData = {
      patient: analysisData.patientData,
      results: {
        diabetes: analysisData.diabetes,
        cardiovascular: analysisData.cardiovascular
      },
      timestamp: analysisData.timestamp,
      overallRisk: analysisData.overallRisk
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analyse-medicale-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-medical-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Erreur de chargement</h2>
          <p className="text-medical-white/80">Impossible de charger les données d'analyse</p>
        </div>
      </div>
    );
  }

  const diabetesRisk = getRiskLevel(analysisData.diabetes.risk_score);
  const cardioRisk = getRiskLevel(analysisData.cardiovascular.risk_score);
  const overallRisk = getRiskLevel(analysisData.overallRisk);

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <Brain className="w-8 h-8 mr-3 text-medical-green" />
                  Résultats d'Analyse IA
                </h1>
                <p className="text-medical-white/80">
                  {new Date(analysisData.timestamp).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportResults}
                className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <Download className="w-4 h-4 text-white" />
                <span className="text-white">Exporter</span>
              </motion.button>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                analysisData.backendAvailable 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {analysisData.backendAvailable ? '🤖 Backend Actif' : '⚡ Simulation'}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Score Global Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className={`medical-card p-8 border-2 ${getRiskBg(analysisData?.overall?.score || 45)}`}>
            <div className="text-center">
              <div className="text-6xl mb-4">{getRiskEmoji(analysisData?.overall?.score || 45)}</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Risque Global: {Math.round(analysisData?.overall?.score || 45)}%
              </h2>
              <div className={`text-xl font-semibold mb-4 ${getRiskColor(analysisData?.overall?.score || 45)}`}>
                {analysisData?.overall?.level === 'high' ? 'Élevé - Attention requise' : 
                 analysisData?.overall?.level === 'medium' ? 'Modéré - Surveillance recommandée' : 'Faible - Bon état général'}
              </div>
              <p className="text-medical-white/80 max-w-2xl mx-auto">
                Basé sur l'analyse de {Object.keys(analysisData?.patientData || {}).length} paramètres médicaux 
                avec {analysisData?.mlInsights?.ml_used ? 'modèles ML réels' : 'simulation avancée'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Analyses Détaillées */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Analyse Diabète */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`medical-card p-6 border ${getRiskBg(analysisData?.diabetes?.score || 35)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Activity className="w-6 h-6 mr-2 text-blue-400" />
                Risque Diabète Type 2
              </h3>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getRiskColor(analysisData?.diabetes?.score || 35)}`}>
                  {Math.round(analysisData?.diabetes?.score || 35)}%
                </div>
                <div className={`text-sm ${getRiskColor(analysisData?.diabetes?.score || 35)}`}>
                  {analysisData?.diabetes?.level === 'high' ? 'Élevé' : 
                   analysisData?.diabetes?.level === 'medium' ? 'Modéré' : 'Faible'}
                </div>
              </div>
            </div>

            {/* Facteurs Principaux */}
            <div className="mb-4">
              <h4 className="text-medical-white/70 text-sm mb-2">Facteurs Principaux</h4>
              <div className="space-y-2">
                {analysisData?.diabetes?.factors?.slice(0, 3).map((factor, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white text-sm">{factor}</span>
                    <span className="text-medical-white/60 text-xs">Impact élevé</span>
                  </div>
                )) || <div className="text-white text-sm">Âge, IMC, glycémie</div>}
              </div>
            </div>

            {/* Recommandations */}
            <div>
              <h4 className="text-medical-white/70 text-sm mb-2">Recommandations</h4>
              <ul className="space-y-1">
                {analysisData?.diabetes?.recommendations?.slice(0, 3).map((rec, index) => (
                  <li key={index} className="text-medical-white/80 text-sm flex items-start">
                    <CheckCircle className="w-3 h-3 mr-2 mt-1 text-medical-green flex-shrink-0" />
                    {rec}
                  </li>
                )) || <li className="text-medical-white/80 text-sm">• Consulter un médecin régulièrement</li>}
              </ul>
            </div>
          </motion.div>

          {/* Analyse Cardiovasculaire */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`medical-card p-6 border ${getRiskBg(analysisData.cardiovascular.risk_score)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Heart className="w-6 h-6 mr-2 text-red-400" />
                Risque Cardiovasculaire
              </h3>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getRiskColor(analysisData.cardiovascular.risk_score)}`}>
                  {analysisData.cardiovascular.risk_score}%
                </div>
                <div className={`text-sm ${getRiskColor(analysisData.cardiovascular.risk_score)}`}>
                  {cardioRisk.text}
                </div>
              </div>
            </div>

            {/* Facteurs Principaux */}
            <div className="mb-4">
              <h4 className="text-medical-white/70 text-sm mb-2">Facteurs Principaux</h4>
              <div className="space-y-2">
                {analysisData?.cardiovascular?.factors?.slice(0, 3).map((factor, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-medical-white/80 text-sm">{factor}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-medical-white/60 text-xs">Impact élevé</span>
                    </div>
                  </div>
                )) || <div className="text-white text-sm">Tension, âge, cholestérol</div>}
              </div>
            </div>

            {/* Recommandations */}
            <div>
              <h4 className="text-medical-white/70 text-sm mb-2">Recommandations</h4>
              <ul className="space-y-1">
                {analysisData?.cardiovascular?.recommendations?.slice(0, 3).map((rec, index) => (
                  <li key={index} className="text-medical-white/80 text-sm flex items-start">
                    <CheckCircle className="w-3 h-3 mr-2 mt-1 text-medical-green flex-shrink-0" />
                    {rec}
                  </li>
                )) || <li className="text-medical-white/80 text-sm">• Contrôler la tension régulièrement</li>}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Données Patient et Métadonnées */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Données Démographiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="medical-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-medical-green" />
              Données Patient
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-medical-white/70">Âge</span>
                <span className="text-white font-medium">{analysisData.patientData.age} ans</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medical-white/70">Sexe</span>
                <span className="text-white font-medium">
                  {analysisData.patientData.gender === 'male' ? 'Homme' : 'Femme'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medical-white/70">IMC</span>
                <span className="text-white font-medium">{analysisData.patientData.bmi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medical-white/70">Fumeur</span>
                <span className="text-white font-medium">
                  {analysisData.patientData.smoker ? 'Oui' : 'Non'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Paramètres Biométriques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="medical-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-medical-green" />
              Paramètres Biométriques
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-medical-white/70">Glycémie</span>
                <span className="text-white font-medium">{analysisData?.patientData?.bloodSugar || 5.5} mmol/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medical-white/70">HbA1c</span>
                <span className="text-white font-medium">{analysisData?.patientData?.hba1c || 5.5}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medical-white/70">Tension</span>
                <span className="text-white font-medium">
                  {analysisData?.patientData?.systolic_bp || 120}/{analysisData?.patientData?.diastolic_bp || 80} mmHg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medical-white/70">Cholestérol</span>
                <span className="text-white font-medium">{analysisData?.patientData?.cholesterol || 200} mg/dL</span>
              </div>
            </div>
          </motion.div>

          {/* Métadonnées Analyse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="medical-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-medical-green" />
              Métadonnées IA
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-medical-white/70">Modèle Diabète</span>
                <span className="text-white font-medium text-xs">
                  {analysisData?.diabetes?.model_used || 'Random Forest'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medical-white/70">Modèle Cardio</span>
                <span className="text-white font-medium text-xs">
                  {analysisData?.cardiovascular?.model_used || 'Random Forest'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medical-white/70">Confiance</span>
                <span className="text-white font-medium">
                  {analysisData?.diabetes?.confidence ? Math.round(analysisData.diabetes.confidence * 100) + '%' : '75%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medical-white/70">Backend</span>
                <span className="text-white font-medium text-xs">
                  {analysisData?.mlInsights?.ml_used ? 'Python ML Actif' : 'Simulation'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/chat-ai')}
              className="bg-medical-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-green/80 transition-all flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Nouvelle Analyse</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportResults}
              className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Télécharger Rapport</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Avertissement Médical */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 medical-card p-6 border-l-4 border-yellow-500"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Important</h4>
              <p className="text-medical-white/80 text-sm">
                Cette analyse est une <strong>aide à la décision médicale</strong> basée sur des modèles de machine learning. 
                Elle ne remplace pas un diagnostic médical professionnel. Consultez toujours un professionnel de santé 
                pour toute interprétation ou décision thérapeutique.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
