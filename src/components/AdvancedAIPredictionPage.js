import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  Heart, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Shield,
  Target,
  Clock,
  CheckCircle,
  Info
} from 'lucide-react';
import workingMLService from '../services/workingMLService';

export default function AdvancedAIPredictionPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    bmi: '',
    smoker: false,
    alcohol: false,
    diabetes_family: false,
    heart_disease_family: false,
    cancer_family: false,
    blood_pressure: '',
    cholesterol: '',
    exercise_hours: '',
    diet_quality: '',
    stress_level: '',
    sleep_hours: '',
    pollution_exposure: '',
    radiation_exposure: false
  });
  const [predictions, setPredictions] = useState(null);
  const [cancerDetails, setCancerDetails] = useState(null);
  const [longTermData, setLongTermData] = useState(null);
  const [selectedYears, setSelectedYears] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const runAllPredictions = async () => {
    setIsLoading(true);
    try {
      const diabetesResult = await workingMLService.getDiabetesPrediction(patientData);
      const cardioResult = await workingMLService.getCardiovascularPrediction(patientData);
      const cancerResult = await workingMLService.getCancerPrediction(patientData);
      const longTermResult = await workingMLService.getLongTermPrediction(patientData, selectedYears);
      
      setPredictions({
        predictions: {
          diabetes: diabetesResult,
          cardiovascular: cardioResult,
          cancer: cancerResult
        },
        longTerm: longTermResult,
        overall_assessment: generateOverallAssessment(diabetesResult, cardioResult, cancerResult),
        recommendations: generateCombinedRecommendations(diabetesResult, cardioResult, cancerResult)
      });
      
      // Switch to overview tab
      setActiveTab('overview');
    } catch (error) {
      console.error('Error running predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateOverallAssessment = (diabetes, cardio, cancer) => {
    const totalRisk = (diabetes.risk_score + cardio.risk_score + cancer.overall_risk) / 3;
    
    let assessment = `Based on your health data analysis:\n\n`;
    assessment += `• Diabetes Risk: ${diabetes.risk_score.toFixed(1)}% (${diabetes.risk_level})\n`;
    assessment += `• Cardiovascular Risk: ${cardio.risk_score.toFixed(1)}% (${cardio.risk_level})\n`;
    assessment += `• Cancer Risk: ${cancer.overall_risk.toFixed(1)}% (${cancer.risk_level})\n\n`;
    
    if (totalRisk > 50) {
      assessment += `Overall assessment indicates elevated health risks. Immediate medical consultation recommended.\n`;
    } else if (totalRisk > 30) {
      assessment += `Overall assessment indicates moderate health risks. Regular monitoring and lifestyle improvements recommended.\n`;
    } else {
      assessment += `Overall assessment indicates good health status. Continue healthy lifestyle and regular check-ups.\n`;
    }
    
    return assessment;
  };

  const generateCombinedRecommendations = (diabetes, cardio, cancer) => {
    let recommendations = `Combined Health Recommendations:\n\n`;
    
    recommendations += `DIABETES:\n`;
    diabetes.recommendations.forEach(rec => {
      recommendations += `• ${rec}\n`;
    });
    
    recommendations += `\nCARDIOVASCULAR:\n`;
    cardio.recommendations.forEach(rec => {
      recommendations += `• ${rec}\n`;
    });
    
    recommendations += `\nCANCER:\n`;
    cancer.recommendations.forEach(rec => {
      recommendations += `• ${rec}\n`;
    });
    
    return recommendations;
  };

  const getCancerDetails = async () => {
    setIsLoading(true);
    try {
      const result = await workingMLService.getCancerPrediction(patientData);
      setCancerDetails(result);
      setActiveTab('cancer');
    } catch (error) {
      console.error('Error getting cancer details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLongTermVisualization = async () => {
    setIsLoading(true);
    try {
      const result = await workingMLService.getLongTermPrediction(patientData, selectedYears);
      setLongTermData(result);
      setActiveTab('longterm');
    } catch (error) {
      console.error('Error getting long term visualization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white">
          <Brain className="w-8 h-8 mb-4" />
          <h3 className="text-xl font-bold mb-2">Cancer Prediction</h3>
          <p className="text-3xl font-bold mb-2">
            {predictions?.predictions?.cancer?.overall_risk || '--'}%
          </p>
          <p className="text-sm opacity-90">Overall Risk</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <Heart className="w-8 h-8 mb-4" />
          <h3 className="text-xl font-bold mb-2">Cardiovascular</h3>
          <p className="text-3xl font-bold mb-2">
            {predictions?.predictions?.cardiovascular?.risk_score || '--'}%
          </p>
          <p className="text-sm opacity-90">Heart Risk</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
          <Activity className="w-8 h-8 mb-4" />
          <h3 className="text-xl font-bold mb-2">Diabetes</h3>
          <p className="text-3xl font-bold mb-2">
            {predictions?.predictions?.diabetes?.risk_score || '--'}%
          </p>
          <p className="text-sm opacity-90">Metabolic Risk</p>
        </div>
      </div>

      {predictions?.overall_assessment && (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2" />
            Overall Assessment
          </h3>
          <div className="whitespace-pre-line text-gray-300">
            {predictions.overall_assessment}
          </div>
        </div>
      )}

      {predictions?.recommendations && (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Action Plan
          </h3>
          <div className="whitespace-pre-line text-gray-300">
            {predictions.recommendations}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderCancerDetails = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <AlertTriangle className="w-8 h-8 mr-3 text-red-400" />
          Detailed Cancer Analysis
        </h3>

        {cancerDetails?.cancer_types && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(cancerDetails.cancer_types).map(([type, data]) => (
              <div key={type} className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-lg mb-2">{data.name}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Risk:</span>
                  <span className={`text-lg font-bold ${
                    data.risk_level === 'high' ? 'text-red-400' :
                    data.risk_level === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {data.risk.toFixed(1)}%
                  </span>
                </div>
                <div className={`w-full bg-gray-700 rounded-full h-2 mb-2`}>
                  <div 
                    className={`h-2 rounded-full ${
                      data.risk_level === 'high' ? 'bg-red-500' :
                      data.risk_level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${data.risk}%` }}
                  />
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  data.risk_level === 'high' ? 'bg-red-500/20 text-red-400' :
                  data.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-green-500/20 text-green-400'
                }`}>
                  {data.risk_level === 'high' ? 'High' :
                   data.risk_level === 'medium' ? 'Medium' : 'Low'}
                </span>
              </div>
            ))}
          </div>
        )}

        {cancerDetails?.prevention_tips && (
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Prevention Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cancerDetails.prevention_tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderLongTerm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <TrendingUp className="w-8 h-8 mr-3 text-blue-400" />
          Long Term Predictions ({selectedYears} years)
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Prediction Period</label>
          <select 
            value={selectedYears} 
            onChange={(e) => setSelectedYears(parseInt(e.target.value))}
            className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
          >
            <option value={5}>5 years</option>
            <option value={10}>10 years</option>
            <option value={15}>15 years</option>
            <option value={20}>20 years</option>
          </select>
        </div>

        {longTermData?.progression_chart && (
          <div className="mb-6">
            <h4 className="font-bold text-lg mb-4">Risk Evolution</h4>
            <div className="space-y-4">
              {longTermData.progression_chart.datasets.map((dataset, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">{dataset.label}</h5>
                  <div className="space-y-2">
                    {dataset.data.map((value, yearIndex) => (
                      <div key={yearIndex} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Year {yearIndex + 1}:</span>
                        <span className="font-medium">{value.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {longTermData?.key_milestones && longTermData.key_milestones.length > 0 && (
          <div className="mb-6">
            <h4 className="font-bold text-lg mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Key Milestones
            </h4>
            <div className="space-y-3">
              {longTermData.key_milestones.map((milestone, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  milestone.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                  milestone.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-blue-500/10 border-blue-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Year {milestone.year}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      milestone.type === 'critical' ? 'bg-red-500/20 text-red-400' :
                      milestone.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {milestone.type === 'critical' ? 'Critical' :
                       milestone.type === 'warning' ? 'Warning' : 'Information'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{milestone.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
            <Brain className="w-10 h-10 mr-4" />
            Prédictions Médicales Avancées
          </h1>
          <p className="text-xl text-gray-300">
            Analyse IA complète avec prédiction du cancer et évolution à long terme
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
              <h2 className="text-xl font-bold mb-6">Données Patient</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Âge</label>
                  <input
                    type="number"
                    name="age"
                    value={patientData.age}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
                    placeholder="Âge"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sexe</label>
                  <select
                    name="gender"
                    value={patientData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
                  >
                    <option value="">Sélectionner</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">BMI</label>
                  <input
                    type="number"
                    name="bmi"
                    value={patientData.bmi}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
                    placeholder="BMI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cholestérol</label>
                  <input
                    type="number"
                    name="cholesterol"
                    value={patientData.cholesterol}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
                    placeholder="mg/dL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pression Artérielle</label>
                  <input
                    type="text"
                    name="blood_pressure"
                    value={patientData.blood_pressure}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
                    placeholder="120/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Heures d'exercice/semaine</label>
                  <input
                    type="number"
                    name="exercise_hours"
                    value={patientData.exercise_hours}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Heures de sommeil</label>
                  <input
                    type="number"
                    name="sleep_hours"
                    value={patientData.sleep_hours}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
                    placeholder="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Qualité alimentaire</label>
                  <select
                    name="diet_quality"
                    value={patientData.diet_quality}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
                  >
                    <option value="">Sélectionner</option>
                    <option value="excellent">Excellente</option>
                    <option value="good">Bonne</option>
                    <option value="average">Moyenne</option>
                    <option value="poor">Mauvaise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Niveau de stress</label>
                  <select
                    name="stress_level"
                    value={patientData.stress_level}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
                  >
                    <option value="">Sélectionner</option>
                    <option value="low">Faible</option>
                    <option value="medium">Modéré</option>
                    <option value="high">Élevé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Exposition pollution</label>
                  <select
                    name="pollution_exposure"
                    value={patientData.pollution_exposure}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg"
                  >
                    <option value="">Sélectionner</option>
                    <option value="low">Faible</option>
                    <option value="medium">Modérée</option>
                    <option value="high">Élevée</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-medium">Antécédents et Habitudes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'smoker', label: 'Fumeur' },
                    { key: 'alcohol', label: 'Alcool' },
                    { key: 'diabetes_family', label: 'Diabète familial' },
                    { key: 'heart_disease_family', label: 'Maladie cardiaque familiale' },
                    { key: 'cancer_family', label: 'Cancer familial' },
                    { key: 'radiation_exposure', label: 'Exposition radiations' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={key}
                        checked={patientData[key]}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={runAllPredictions}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Brain className="w-4 h-4 mr-2" />
                      Run All Predictions
                    </span>
                  )}
                </button>

                <button
                  onClick={getCancerDetails}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
                >
                  Cancer Details
                </button>

                <button
                  onClick={getLongTermVisualization}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                >
                  Long Term
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Informations
              </h2>
              
              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">🎯 Types de Cancers</h4>
                  <ul className="space-y-1">
                    <li>• Poumon</li>
                    <li>• Sein</li>
                    <li>• Côlon</li>
                    <li>• Peau</li>
                    <li>• Prostate</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">📊 Prédictions</h4>
                  <ul className="space-y-1">
                    <li>• Risques actuels</li>
                    <li>• Évolution sur 20 ans</li>
                    <li>• Points de vigilance</li>
                    <li>• Recommandations personnalisées</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">🤖 Technologies IA</h4>
                  <ul className="space-y-1">
                    <li>• Machine Learning avancé</li>
                    <li>• Régression Logistique</li>
                    <li>• Random Forest</li>
                    <li>• Gradient Boosting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <div className="flex space-x-1 p-1 border-b border-white/20">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'cancer', label: 'Cancer Details', icon: AlertTriangle },
              { id: 'longterm', label: 'Long Term', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                  activeTab === id
                    ? 'bg-white/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'cancer' && renderCancerDetails()}
            {activeTab === 'longterm' && renderLongTerm()}
          </div>
        </div>
      </div>
    </div>
  );
}
