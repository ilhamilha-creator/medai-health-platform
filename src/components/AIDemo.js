import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Users,
  Clock
} from 'lucide-react';

export default function AIDemo() {
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState('patient');

  const patientExamples = [
    {
      title: "Analyse Complète des Risques",
      description: "Patient de 55 ans, IMC 28, Glycémie 6.2",
      result: "Risque diabète: 68% (Élevé), Risque cardiaque: 45% (Modéré)",
      action: "Voir l'analyse complète"
    },
    {
      title: "Prédiction Diabète",
      description: "Patient de 42 ans, IMC 31, HbA1c 6.1%",
      result: "Risque diabète 5 ans: 52%, 10 ans: 75%",
      action: "Analyser les facteurs"
    },
    {
      title: "Évaluation Cardiovasculaire",
      description: "Patient de 65 ans, Tension 145/90, IMC 27",
      result: "Risque cardiovasculaire 10 ans: 62%",
      action: "Voir les recommandations"
    }
  ];

  const doctorExamples = [
    {
      title: "Dashboard Clinique",
      description: "Vue d'ensemble des patients avec scores de risque",
      features: ["Modèles ML", "SHAP explicabilité", "Validation clinique"],
      action: "Accéder au dashboard"
    },
    {
      title: "Analyse Avancée",
      description: "Diagnostic assisté avec données brutes",
      features: ["XGBoost", "Random Forest", "Neural Networks"],
      action: "Analyser patient"
    },
    {
      title: "Export Médical",
      description: "Rapports PDF professionnels",
      features: ["Seuils personnalisés", "Annotations médicales", "Historique"],
      action: "Générer rapport"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center space-x-3 mb-6">
            <Heart className="w-12 h-12 text-medical-green" />
            <h1 className="text-4xl font-bold text-white">IA Médicale Avancée</h1>
          </div>
          <p className="text-xl text-medical-white/80 max-w-3xl mx-auto">
            Système professionnel de diagnostics assistés et prédictions de risques avec modèles ML 
            (Logistic Regression, Random Forest, XGBoost, Neural Networks)
          </p>
        </motion.header>

        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 flex">
            <button
              onClick={() => setDemoMode('patient')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                demoMode === 'patient'
                  ? 'bg-medical-green text-white'
                  : 'text-medical-white/70 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Vue Patient
            </button>
            <button
              onClick={() => setDemoMode('doctor')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                demoMode === 'doctor'
                  ? 'bg-medical-green text-white'
                  : 'text-medical-white/70 hover:text-white'
              }`}
            >
              <Shield className="w-5 h-5 inline mr-2" />
              Vue Médecin
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="medical-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-medical-green" />
                Capacités de l'IA
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    icon: <TrendingUp className="w-5 h-5" />,
                    title: "Prédictions de Risque",
                    description: "Calcul probabiliste sur 5-10 ans basé sur modèles ML",
                    details: "Diabète, maladies cardiaques, certains cancers"
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "Diagnostics Assistés",
                    description: "Aide à la décision médicale avec explicabilité",
                    details: "SHAP, LIME, calibration clinique"
                  },
                  {
                    icon: <Activity className="w-5 h-5" />,
                    title: "Modèles Professionnels",
                    description: "Logistic Regression, Random Forest, XGBoost",
                    details: "Neural Networks pour imagerie médicale"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-medical-green mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                        <p className="text-medical-white/80 text-sm mb-2">{feature.description}</p>
                        <p className="text-medical-white/60 text-xs">{feature.details}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Examples */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="medical-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-medical-green" />
                Exemples {demoMode === 'patient' ? 'Patient' : 'Médecin'}
              </h2>
              
              <div className="space-y-4">
                {(demoMode === 'patient' ? patientExamples : doctorExamples).map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all"
                    onClick={() => navigate('/chat-ai')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold">{example.title}</h3>
                      <ArrowRight className="w-4 h-4 text-medical-green" />
                    </div>
                    <p className="text-medical-white/80 text-sm mb-2">{example.description}</p>
                    
                    {example.result && (
                      <div className="bg-medical-green/10 border border-medical-green/30 rounded p-2 mb-2">
                        <p className="text-medical-green text-xs font-medium">{example.result}</p>
                      </div>
                    )}
                    
                    {example.features && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {example.features.map((feature, idx) => (
                          <span key={idx} className="bg-white/10 text-xs text-medical-white/70 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-medical-green text-sm font-medium">{example.action}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="medical-card p-6 border-l-4 border-yellow-500"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Important : Aide à la Décision Médicale</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-medical-green font-semibold mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Ce que l'IA fait :
                  </h4>
                  <ul className="text-medical-white/80 space-y-1">
                    <li>• Analyse les données de santé fournies</li>
                    <li>• Calcule les risques basés sur modèles ML</li>
                    <li>• Fournit des recommandations générales</li>
                    <li>• Offre une explicabilité (SHAP)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-400 font-semibold mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Ce que l'IA ne fait PAS :
                  </h4>
                  <ul className="text-medical-white/80 space-y-1">
                    <li>• Ne remplace pas un diagnostic médical</li>
                    <li>• Ne prescrit pas de traitements</li>
                    <li>• Ne se substitue pas à l'avis professionnel</li>
                    <li>• Ne garantit pas l'exactitude à 100%</li>
                  </ul>
                </div>
              </div>
              <p className="text-medical-white/90 mt-4 font-medium">
                Toujours consulter un professionnel de santé pour tout diagnostic ou traitement.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat-ai')}
            className="bg-medical-green text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-medical-green/80 transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <span>Essayer l'IA Médicale</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
