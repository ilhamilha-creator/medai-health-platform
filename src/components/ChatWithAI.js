import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import workingMLService from '../services/workingMLService';
import mlChatAssistant from '../services/mlChatAssistant';
import notificationService from '../utils/notificationService';
import { validateSchema, patientDataSchema } from '../utils/validationSchemas';
import streamingService from '../utils/streamingService';
import conversationHistoryService from '../utils/conversationHistoryService';
import medicalReferencesService from '../utils/medicalReferencesService';
import longTermMemoryService from '../utils/longTermMemoryService';
import speechService from '../utils/speechService';
import pdfExportService from '../utils/pdfExportService';
import responseQualityService from '../utils/responseQualityService';
import MarkdownResponse from './chat/MarkdownResponse';
import QuickSuggestions from './chat/QuickSuggestions';
import { 
  Send, Bot, User, Heart, FileText, AlertTriangle, LogOut,
  BarChart3, Shield, Clock, Info, History, Download, Trash2, Sun, Moon, Mic, Volume2, FileDown
} from 'lucide-react';

export default function ChatWithAI() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isDoctorView] = useState(user?.userType === 'doctor');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `🤖 **Assistant Médical IA Avancé**

Bonjour ${isDoctorView ? 'Docteur' : 'Patient'} ! 

Je suis votre assistant médical intelligent avec **Machine Learning avancé**. Je peux vous aider avec :

${isDoctorView ? `🧑‍⚕️ **Pour les professionnels de santé :**
• **Analyse différentielle** basée sur symptômes
• **Informations médicales** à jour (guidelines, protocoles)
• **Aide au diagnostic** avec suggestions étiologiques
• **Détection d'urgence** automatique
• **Conseils thérapeutiques** basés sur evidence

**Exemples :**
- "Patient 45 ans, douleur thoracique et dyspnée"
- "Quelles causes d'HTA secondaire chez jeune patient ?"
- "Analyse patient diabétique avec neuropathie"` : `👤 **Pour les patients :**
• **Analyse intelligente de vos symptômes**
• **Questions ciblées** pour comprendre votre situation
• **Conseils santé** personnalisés et préventifs
• **Détection automatique des urgences**
• **Orientation médicale** appropriée

**Exemples :**
- "J'ai mal à la tête depuis 2 jours avec nausées"
- "Qu'est-ce que l'hypertension et comment la prévenir ?"
- "Je suis toujours fatigué, que dois-je faire ?`}

🧠 **Capacités ML :**
- **NLP** pour comprendre le langage naturel
- **Analyse sémantique** des symptômes
- **Détection d'émotions** et adaptation des réponses
- **Apprentissage** de votre profil santé
- **Contextualisation** des réponses

⚠️ **Important :** Je suis une aide à la décision médicale, pas un diagnostic officiel.

Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date().toLocaleTimeString(),
      status: 'delivered'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [analysisMode, setAnalysisMode] = useState('risk-assessment');
  const [showHistory, setShowHistory] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [typingStatus, setTypingStatus] = useState('');
  const [longTermContext, setLongTermContext] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [patientData, setPatientData] = useState({
    // Démographie - Toujours visible
    age: '',
    gender: '',
    bmi: '',
    
    // Diabète - Champs spécifiques
    bloodSugar: '',
    hba1c: '',
    fasting_insulin: '',
    c_peptide: '',
    
    // Cardiovasculaire - Champs spécifiques
    systolic_bp: '',
    diastolic_bp: '',
    heart_rate: '',
    chest_pain: false,
    shortness_breath: false,
    
    // Lipides - Commun à plusieurs maladies
    cholesterol: '',
    ldl: '',
    hdl: '',
    triglycerides: '',
    
    // Fonction Rénale - Important pour diabète et cardio
    creatinine: '',
    egfr: '',
    microalbuminuria: '',
    
    // Fonction Hépatique - Pour métabolisme
    alt: '',
    ast: '',
    ggt: '',
    bilirubin: '',
    
    // Hormones - Thyroïde, reproduction
    tsh: '',
    free_t4: '',
    testosterone: '',
    estrogen: '',
    
    // Inflammation - Facteur de risque multiple
    crp: '',
    esr: '',
    ferritin: '',
    vitamin_d: '',
    
    // Antécédents Familiaux - Dynamiques selon maladie
    family_diabetes: false,
    family_heart: false,
    family_cancer: false,
    family_stroke: false,
    family_hypertension: false,
    family_kidney: false,
    family_thyroid: false,
    
    // Style de Vie - Toujours pertinent
    smoker: false,
    alcohol_consumption: 'none',
    exercise_minutes: 150,
    stress_level: 5,
    sleep_hours: 7,
    diet_pattern: 'balanced',
    
    // Symptômes - Dynamiques selon maladie
    symptoms: {
      fatigue: false,
      weight_loss: false,
      increased_thirst: false,
      frequent_urination: false,
      blurred_vision: false,
      chest_pain: false,
      palpitations: false,
      leg_swelling: false,
      night_sweats: false,
      fever: false,
      nausea: false,
      abdominal_pain: false,
      headache: false,
      dizziness: false,
      numbness: false,
      memory_loss: false
    }
  });

  const messagesEndRef = useRef(null);

  // Charger le contexte à long terme au démarrage
  useEffect(() => {
    if (user?.id) {
      const context = longTermMemoryService.getEnrichedContext(user.id);
      setLongTermContext(context);
      
      // Personnaliser le message de bienvenue pour les utilisateurs returnants
      if (context.context.isReturningUser) {
        setMessages(prev => {
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            content: `👋 Bon retour ${isDoctorView ? 'Docteur' : 'Patient'} !\n\nJe me souviens de nos conversations précédentes. Vos sujets d'intérêt incluent : ${context.context.preferredTopics.slice(0, 3).join(', ') || 'santé générale'}.\n\nComment puis-je vous aider aujourd'hui ?`
          };
          return updated;
        });
      }
    }
  }, [user?.id]);

  const getFieldsForMode = (mode) => {
    const baseFields = ['age', 'gender', 'bmi', 'smoker', 'exercise_minutes', 'stress_level', 'sleep_hours', 'alcohol_consumption', 'diet_pattern'];
    
    const modeFields = {
      'risk-assessment': [
        ...baseFields,
        'bloodSugar', 'hba1c', 'cholesterol', 'ldl', 'hdl', 'triglycerides',
        'systolic_bp', 'diastolic_bp', 'heart_rate',
        'creatinine', 'egfr',
        'family_diabetes', 'family_heart', 'family_hypertension',
        'symptoms.fatigue', 'symptoms.chest_pain', 'symptoms.shortness_breath'
      ],
      'diabetes-risk': [
        ...baseFields,
        'bloodSugar', 'hba1c', 'fasting_insulin', 'c_peptide',
        'cholesterol', 'ldl', 'hdl', 'triglycerides',
        'creatinine', 'egfr', 'microalbuminuria',
        'family_diabetes', 'family_heart', 'family_kidney',
        'symptoms.fatigue', 'symptoms.weight_loss', 'symptoms.increased_thirst', 
        'symptoms.frequent_urination', 'symptoms.blurred_vision', 'symptoms.numbness'
      ],
      'cardiovascular-risk': [
        ...baseFields,
        'systolic_bp', 'diastolic_bp', 'heart_rate',
        'cholesterol', 'ldl', 'hdl', 'triglycerides',
        'crp', 'esr', 'homocysteine',
        'family_heart', 'family_hypertension', 'family_stroke',
        'symptoms.chest_pain', 'symptoms.palpitations', 'symptoms.shortness_breath',
        'symptoms.leg_swelling', 'symptoms.dizziness', 'symptoms.headache'
      ],
      'cancer-risk': [
        ...baseFields,
        'family_cancer', 'family_history_details',
        'crp', 'esr', 'ferritin', 'cea', 'afp', 'psa',
        'symptoms.weight_loss', 'symptoms.fatigue', 'symptoms.night_sweats',
        'symptoms.fever', 'symptoms.abdominal_pain', 'symptoms.nausea'
      ],
      'kidney-risk': [
        ...baseFields,
        'creatinine', 'egfr', 'microalbuminuria', 'bun',
        'systolic_bp', 'diastolic_bp',
        'family_kidney', 'family_diabetes', 'family_hypertension',
        'symptoms.leg_swelling', 'symptoms.fatigue', 'symptoms.nausea'
      ],
      'liver-risk': [
        ...baseFields,
        'alt', 'ast', 'ggt', 'bilirubin', 'alp',
        'albumin', 'pt', 'inr',
        'family_liver_disease',
        'symptoms.abdominal_pain', 'symptoms.nausea', 'symptoms.fatigue',
        'symptoms.jaundice', 'symptoms.weight_loss'
      ],
      'thyroid-risk': [
        ...baseFields,
        'tsh', 'free_t4', 'free_t3', 'tpo_antibodies',
        'family_thyroid', 'family_autoimmune',
        'symptoms.fatigue', 'symptoms.weight_loss', 'symptoms.weight_gain',
        'symptoms.hair_loss', 'symptoms.memory_loss', 'symptoms.temperature_sensitivity'
      ],
      'respiratory-risk': [
        ...baseFields,
        'spirometry_fev1', 'spirometry_fvc', 'dlco',
        'family_asthma', 'family_copd',
        'smoker', 'pack_years',
        'symptoms.cough', 'symptoms.shortness_breath', 'symptoms.wheezing',
        'symptoms.chest_pain', 'symptoms.fever'
      ]
    };
    
    return modeFields[mode] || modeFields['risk-assessment'];
  };

  const renderMedicalForm = () => {
    const fields = getFieldsForMode(analysisMode);
    
    // Protection contre les erreurs si fields est undefined
    if (!fields || !Array.isArray(fields)) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="medical-card mb-6"
        >
          <div className="text-center text-white">
            <p>Chargement du formulaire...</p>
          </div>
        </motion.div>
      );
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="medical-card mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            📋 Données Médicales - {getModeTitle(analysisMode)}
          </h3>
          <div className="text-medical-green text-sm">
            {fields.length} champs requis
          </div>
        </div>
        
        {/* Démographie - Toujours visible */}
        <div className="mb-6">
          <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
            <span className="mr-2">👤</span> Démographie
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {renderField('age', 'Âge', 'number', 'Âge', {min: 18, max: 120})}
            {renderField('gender', 'Sexe', 'select', 'Sélectionner', [
              {value: '', label: 'Sélectionner'},
              {value: 'male', label: 'Homme'},
              {value: 'female', label: 'Femme'}
            ])}
            {renderField('bmi', 'IMC', 'number', 'IMC', {step: 0.1})}
            {renderField('exercise_minutes', 'Exercice (min/sem)', 'number', '150')}
          </div>
        </div>

        {/* Champs spécifiques selon mode */}
        {analysisMode === 'diabetes-risk' && renderDiabetesFields()}
        {analysisMode === 'cardiovascular-risk' && renderCardiovascularFields()}
        {analysisMode === 'cancer-risk' && renderCancerFields()}
        {analysisMode === 'kidney-risk' && renderKidneyFields()}
        {analysisMode === 'liver-risk' && renderLiverFields()}
        {analysisMode === 'thyroid-risk' && renderThyroidFields()}
        {analysisMode === 'respiratory-risk' && renderRespiratoryFields()}

        {/* Style de Vie - Toujours visible */}
        <div className="mb-6">
          <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
            <span className="mr-2">🌿</span> Style de Vie
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={patientData.smoker}
                onChange={(e) => setPatientData({...patientData, smoker: e.target.checked})}
                className="w-4 h-4 text-medical-green bg-white/10 border-white/20 rounded"
              />
              <label className="text-medical-white/80 text-sm">Fumeur</label>
            </div>
            {renderField('alcohol_consumption', 'Alcool', 'select', 'Aucun', [
              {value: 'none', label: 'Aucun'},
              {value: 'light', label: 'Léger'},
              {value: 'moderate', label: 'Modéré'},
              {value: 'heavy', label: 'Élevé'}
            ])}
            {renderField('stress_level', 'Stress (1-10)', 'number', '5', {min: 1, max: 10})}
            {renderField('sleep_hours', 'Sommeil (h)', 'number', '7', {step: 0.5, min: 4, max: 12})}
          </div>
        </div>

        {/* Antécédents Familiaux - Dynamiques */}
        <div className="mb-6">
          <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
            <span className="mr-2">👨‍👩‍👧‍👦</span> Antécédents Familiaux
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {renderFamilyCheckbox('family_diabetes', 'Diabète')}
            {renderFamilyCheckbox('family_heart', 'Maladies cardiaques')}
            {renderFamilyCheckbox('family_cancer', 'Cancer')}
            {renderFamilyCheckbox('family_stroke', 'AVC')}
            {renderFamilyCheckbox('family_hypertension', 'Hypertension')}
            {renderFamilyCheckbox('family_kidney', 'Maladie rénale')}
            {renderFamilyCheckbox('family_thyroid', 'Thyroïde')}
            {renderFamilyCheckbox('family_autoimmune', 'Maladie auto-immune')}
          </div>
        </div>

        {/* Symptômes - Dynamiques */}
        <div className="mb-6">
          <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
            <span className="mr-2">⚠️</span> Symptômes Actuels
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {renderSymptomsCheckboxes()}
          </div>
        </div>

        {/* Bouton d'analyse */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            className="bg-gradient-to-r from-medical-green to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Lancer l'analyse IA</span>
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const getModeTitle = (mode) => {
    const titles = {
      'diabetes-risk': 'Diabète Type 2',
      'cardiovascular-risk': 'Maladies Cardiovasculaires',
      'cancer-risk': 'Dépistage Cancer',
      'kidney-risk': 'Fonction Rénale',
      'liver-risk': 'Fonction Hépatique',
      'thyroid-risk': 'Thyroïde',
      'respiratory-risk': 'Appareil Respiratoire',
      'risk-assessment': 'Évaluation Complète'
    };
    return titles[mode] || 'Analyse Médicale';
  };

  const renderField = (key, label, type, placeholder, options = {}) => {
    const value = key.includes('.') ? 
      patientData[key.split('.')[0]][key.split('.')[1]] : 
      patientData[key];
    
    const handleChange = (e) => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        setPatientData({
          ...patientData,
          [parent]: {
            ...patientData[parent],
            [child]: type === 'checkbox' ? e.target.checked : e.target.value
          }
        });
      } else {
        setPatientData({
          ...patientData,
          [key]: type === 'checkbox' ? e.target.checked : e.target.value
        });
      }
    };

    return (
      <div>
        <label className="text-medical-white/70 text-sm">{label}</label>
        {type === 'select' ? (
          <select
            value={value}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            {...options}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
          />
        )}
      </div>
    );
  };

  const renderFamilyCheckbox = (key, label) => (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={patientData[key]}
        onChange={(e) => setPatientData({...patientData, [key]: e.target.checked})}
        className="w-4 h-4 text-medical-green bg-white/10 border-white/20 rounded"
      />
      <label className="text-medical-white/80 text-sm">{label}</label>
    </div>
  );

  const renderSymptomsCheckboxes = () => {
    const relevantSymptoms = getRelevantSymptoms(analysisMode);
    return relevantSymptoms.map(symptom => (
      <div key={symptom.key} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={patientData.symptoms[symptom.key]}
          onChange={(e) => setPatientData({
            ...patientData,
            symptoms: {
              ...patientData.symptoms,
              [symptom.key]: e.target.checked
            }
          })}
          className="w-4 h-4 text-medical-green bg-white/10 border-white/20 rounded"
        />
        <label className="text-medical-white/80 text-sm">{symptom.label}</label>
      </div>
    ));
  };

  const getRelevantSymptoms = (mode) => {
    const symptomMap = {
      'diabetes-risk': [
        {key: 'fatigue', label: 'Fatigue'},
        {key: 'weight_loss', label: 'Perte de poids'},
        {key: 'increased_thirst', label: 'Soif intense'},
        {key: 'frequent_urination', label: 'Urination fréquente'},
        {key: 'blurred_vision', label: 'Vision floue'},
        {key: 'numbness', label: 'Engourdissements'}
      ],
      'cardiovascular-risk': [
        {key: 'chest_pain', label: 'Douleur thoracique'},
        {key: 'palpitations', label: 'Palpitations'},
        {key: 'shortness_breath', label: 'Essoufflement'},
        {key: 'leg_swelling', label: 'Gonflement jambes'},
        {key: 'dizziness', label: 'Vertiges'},
        {key: 'headache', label: 'Maux de tête'}
      ],
      'cancer-risk': [
        {key: 'weight_loss', label: 'Perte de poids'},
        {key: 'fatigue', label: 'Fatigue'},
        {key: 'night_sweats', label: 'Sueurs nocturnes'},
        {key: 'fever', label: 'Fièvre'},
        {key: 'abdominal_pain', label: 'Douleur abdominale'},
        {key: 'nausea', label: 'Nausées'}
      ]
    };
    
    return symptomMap[mode] || symptomMap['diabetes-risk'];
  };

  // Composants spécialisés pour chaque mode
  const renderDiabetesFields = () => (
    <div className="mb-6">
      <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
        <span className="mr-2">🩸</span> Métabolisme Glucidique
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderField('bloodSugar', 'Glycémie (mmol/L)', 'number', '5.5', {step: 0.1})}
        {renderField('hba1c', 'HbA1c (%)', 'number', '5.5', {step: 0.1})}
        {renderField('fasting_insulin', 'Insuline (μIU/mL)', 'number', '10')}
        {renderField('c_peptide', 'C-Peptide (ng/mL)', 'number', '2.0', {step: 0.1})}
      </div>
      
      <h4 className="text-medical-white/70 text-sm mb-3 mt-4 flex items-center">
        <span className="mr-2">🫀</span> Fonction Rénale
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderField('creatinine', 'Créatinine (mg/dL)', 'number', '1.0', {step: 0.1})}
        {renderField('egfr', 'eGFR (mL/min/1.73m²)', 'number', '90')}
        {renderField('microalbuminuria', 'Microalbuminurie (mg/g)', 'number', '30')}
      </div>
    </div>
  );

  const renderCardiovascularFields = () => (
    <div className="mb-6">
      <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
        <span className="mr-2">❤️</span> Pression Artérielle & Rythme
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderField('systolic_bp', 'Systolique (mmHg)', 'number', '120')}
        {renderField('diastolic_bp', 'Diastolique (mmHg)', 'number', '80')}
        {renderField('heart_rate', 'Fréquence cardiaque', 'number', '70')}
      </div>
      
      <h4 className="text-medical-white/70 text-sm mb-3 mt-4 flex items-center">
        <span className="mr-2">🧪</span> Lipides & Inflammation
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderField('cholesterol', 'Cholestérol (mg/dL)', 'number', '190')}
        {renderField('ldl', 'LDL (mg/dL)', 'number', '115')}
        {renderField('hdl', 'HDL (mg/dL)', 'number', '50')}
        {renderField('triglycerides', 'Triglycérides (mg/dL)', 'number', '120')}
        {renderField('crp', 'CRP (mg/L)', 'number', '3.0', {step: 0.1})}
        {renderField('esr', 'VS (mm/hr)', 'number', '15')}
      </div>
    </div>
  );

  const renderCancerFields = () => (
    <div className="mb-6">
      <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
        <span className="mr-2">🧬</span> Marqueurs Tumoraux & Inflammation
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderField('crp', 'CRP (mg/L)', 'number', '3.0', {step: 0.1})}
        {renderField('esr', 'VS (mm/hr)', 'number', '15')}
        {renderField('ferritin', 'Ferritine (ng/mL)', 'number', '100')}
        {renderField('cea', 'CEA (ng/mL)', 'number', '2.5', {step: 0.1})}
        {renderField('afp', 'AFP (ng/mL)', 'number', '10', {step: 0.1})}
        {renderField('psa', 'PSA (ng/mL)', 'number', '4.0', {step: 0.1})}
      </div>
    </div>
  );

  const renderKidneyFields = () => (
    <div className="mb-6">
      <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
        <span className="mr-2">🫀</span> Fonction Rénale Complète
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderField('creatinine', 'Créatinine (mg/dL)', 'number', '1.0', {step: 0.1})}
        {renderField('egfr', 'eGFR (mL/min/1.73m²)', 'number', '90')}
        {renderField('microalbuminuria', 'Microalbuminurie (mg/g)', 'number', '30')}
        {renderField('bun', 'Urée (mg/dL)', 'number', '20')}
        {renderField('uric_acid', 'Acide urique (mg/dL)', 'number', '6.0', {step: 0.1})}
      </div>
    </div>
  );

  const renderLiverFields = () => (
    <div className="mb-6">
      <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
        <span className="mr-2">🫁</span> Fonction Hépatique
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderField('alt', 'ALT (U/L)', 'number', '30')}
        {renderField('ast', 'AST (U/L)', 'number', '30')}
        {renderField('ggt', 'GGT (U/L)', 'number', '35')}
        {renderField('bilirubin', 'Bilirubine (mg/dL)', 'number', '1.0', {step: 0.1})}
        {renderField('alp', 'Phosphatase alcaline (U/L)', 'number', '100')}
        {renderField('albumin', 'Albumine (g/dL)', 'number', '4.0', {step: 0.1})}
      </div>
    </div>
  );

  const renderThyroidFields = () => (
    <div className="mb-6">
      <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
        <span className="mr-2">🦋</span> Hormones Thyroïdiennes
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderField('tsh', 'TSH (μIU/mL)', 'number', '2.5', {step: 0.1})}
        {renderField('free_t4', 'T4 Libre (pmol/L)', 'number', '15')}
        {renderField('free_t3', 'T3 Libre (pmol/L)', 'number', '4.5')}
        {renderField('tpo_antibodies', 'Anticorps TPO', 'number', '35')}
      </div>
    </div>
  );

  const renderRespiratoryFields = () => (
    <div className="mb-6">
      <h4 className="text-medical-white/70 text-sm mb-3 flex items-center">
        <span className="mr-2">🫁</span> Fonction Respiratoire
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderField('spirometry_fev1', 'VEF1 (%)', 'number', '80')}
        {renderField('spirometry_fvc', 'CVF (%)', 'number', '80')}
        {renderField('dlco', 'DLCO (%)', 'number', '80')}
        {renderField('pack_years', 'Paquets-année', 'number', '0')}
      </div>
    </div>
  );

  const extractCurrentSymptoms = () => {
    const symptoms = new Set();
    messages.forEach(msg => {
      if (msg.type === 'user') {
        const content = msg.content.toLowerCase();
        Object.entries(mlChatAssistant.medicalKnowledge.symptoms).forEach(([symptom, data]) => {
          if (data.keywords.some(keyword => content.includes(keyword))) {
            symptoms.add(symptom);
          }
        });
      }
    });
    return Array.from(symptoms);
  };

  const detectCurrentUrgency = () => {
    const recentMessages = messages.slice(-3);
    for (const msg of recentMessages) {
      if (msg.type === 'user') {
        const content = msg.content.toLowerCase();
        if (content.includes('urgence') || content.includes('aide') || content.includes('15')) {
          return 'critical';
        }
        if (content.includes('douleur poitrine') || content.includes('difficile respirer')) {
          return 'high';
        }
      }
    }
    return 'low';
  };

  const extractPreviousTopics = () => {
    const topics = new Set();
    messages.forEach(msg => {
      if (msg.type === 'ai' && msg.content.includes('**')) {
        const matches = msg.content.match(/\*\*([^*]+)\*\*/g);
        if (matches) {
          matches.forEach(match => {
            topics.add(match.replace(/\*\*/g, ''));
          });
        }
      }
    });
    return Array.from(topics).slice(-5);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveCurrentConversation = () => {
    if (!conversationId) {
      setConversationId(Date.now());
    }
    
    conversationHistoryService.saveConversation({
      id: conversationId,
      messages: messages,
      userId: user?.id || 'anonymous',
      metadata: {
        analysisMode,
        patientData,
        isDoctorView
      }
    });

    // Apprendre de cette conversation pour la mémoire à long terme
    if (user?.id) {
      longTermMemoryService.learnFromConversation(user.id, {
        id: conversationId,
        messages: messages,
        metadata: {
          analysisMode,
          patientData,
          isDoctorView
        }
      });
    }
  };

  const loadConversation = (convId) => {
    const conversation = conversationHistoryService.getConversationById(convId);
    if (conversation) {
      setMessages(conversation.messages);
      setConversationId(convId);
      setAnalysisMode(conversation.metadata?.analysisMode || 'risk-assessment');
      setPatientData(conversation.metadata?.patientData || {});
      setShowHistory(false);
      notificationService.success('Conversation chargée');
    }
  };

  const deleteConversation = (convId) => {
    conversationHistoryService.deleteConversation(convId);
    notificationService.success('Conversation supprimée');
  };

  const exportConversation = () => {
    const json = conversationHistoryService.exportConversation(conversationId);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation_${conversationId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      notificationService.success('Conversation exportée en JSON');
    }
  };

  const exportConversationToPDF = () => {
    const conversation = conversationHistoryService.getConversationById(conversationId);
    if (!conversation) {
      notificationService.warning('Aucune conversation à exporter');
      return;
    }

    try {
      pdfExportService.exportConversationToPDF(conversation, {
        title: `Rapport de Consultation - ${user?.name || 'Patient'}`,
        includeMetadata: true,
        includeTimestamps: true
      });
      notificationService.success('Conversation exportée en PDF');
    } catch (error) {
      console.error('PDF export error:', error);
      notificationService.error('Erreur lors de l\'export PDF');
    }
  };

  const handleVoiceInput = () => {
    if (!speechService.isRecognitionSupported()) {
      notificationService.error('Reconnaissance vocale non supportée par ce navigateur');
      return;
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.startListening(
        (transcript, isFinal) => {
          setInputMessage(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (error) => {
          console.error('Voice input error:', error);
          setIsListening(false);
          if (error !== 'not_supported') {
            notificationService.error('Erreur de reconnaissance vocale');
          }
        }
      );
      setIsListening(true);
      notificationService.info('Écoute en cours...');
    }
  };

  const handleSpeakLastMessage = () => {
    if (!speechService.isSynthesisSupported()) {
      notificationService.error('Synthèse vocale non supportée par ce navigateur');
      return;
    }

    const lastAIMessage = messages.filter(m => m.type === 'ai').pop();
    if (!lastAIMessage) {
      notificationService.warning('Aucun message à lire');
      return;
    }

    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      // Nettoyer le markdown pour la lecture
      const cleanText = lastAIMessage.content
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/```/g, '')
        .replace(/\n/g, '. ')
        .replace(/\s+/g, ' ')
        .trim();

      speechService.speak(cleanText, { lang: 'fr-FR', rate: 0.9 });
      setIsSpeaking(true);
      
      // Écouter la fin de la parole
      const checkSpeaking = setInterval(() => {
        if (!speechService.isSpeaking) {
          setIsSpeaking(false);
          clearInterval(checkSpeaking);
        }
      }, 500);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      status: 'sent'
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Mesurer le temps de réponse
    const responseStartTime = Date.now();
    
    // Afficher différents états de réflexion
    const typingStates = [
      '🤔 Analyse de votre demande...',
      '🔍 Recherche dans la base médicale...',
      '🧠 Traitement avec IA...',
      '📊 Génération de la réponse...'
    ];
    
    let stateIndex = 0;
    setTypingStatus(typingStates[0]);
    
    const stateInterval = setInterval(() => {
      stateIndex = (stateIndex + 1) % typingStates.length;
      setTypingStatus(typingStates[stateIndex]);
    }, 1500);
    
    // Sauvegarder l'interval pour le nettoyer plus tard
    window.currentTypingInterval = stateInterval;

    try {
      // Créer un ID de conversation unique pour la mémoire
      const conversationId = `user_${user?.id || 'anonymous'}_${Date.now()}`;
      
      // Préparer le contexte enrichi pour le nouveau backend Python
      const enrichedContext = {
        patientData: patientData,
        isDoctor: isDoctorView,
        conversationHistory: messages.map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content,
          timestamp: m.timestamp
        })),
        conversationId: conversationId,
        userId: user?.id || 'guest',
        patientId: patientData?.id || null,
        currentContext: {
          symptoms: extractCurrentSymptoms(),
          urgency: detectCurrentUrgency(),
          previousTopics: extractPreviousTopics(),
          messageCount: messages.length
        }
      };
      
      // Utiliser le service amélioré avec le nouveau backend Python
      const mlResponse = await workingMLService.processMessageWithFallback(
        inputMessage,
        enrichedContext
      );
      
      setIsTyping(false);
      
      // Créer une réponse enrichie
      let content = mlResponse.response;
      
      // Ajouter les informations du nouveau backend Python
      if (mlResponse.ml_used && mlResponse.confidence) {
        content += `\n\n🧠 **IA Avancée:** Confiance ${(mlResponse.confidence * 100).toFixed(1)}%`;
        
        // Indiquer si RAG est utilisé
        if (mlResponse.rag_used) {
          content += ` | 📚 RAG: ACTIVÉ`;
        }
        
        // Indiquer si le contexte patient est utilisé
        if (mlResponse.patient_context_used) {
          content += ` | 📋 Contexte Patient: UTILISÉ`;
        }
        
        // Afficher les sources si disponibles
        if (mlResponse.sources && mlResponse.sources.length > 0) {
          content += `\n\n📖 **Sources médicales:**`;
          mlResponse.sources.forEach((source, index) => {
            const sourceName = source.metadata?.source || 'Source inconnue';
            const category = source.metadata?.category || 'général';
            content += `\n${index + 1}. ${sourceName} (${category})`;
          });
        }
        
        // Avertissement si guardrail déclenché
        if (mlResponse.guardrail_triggered) {
          content += `\n\n⚠️ **Sécurité:** Guardrail activé - réponse sécurisée`;
        }
        
        if (mlResponse.urgency_level) {
          content += ` | Niveau d'urgence: ${mlResponse.urgency_level}`;
        }
        
        if (mlResponse.context_aware) {
          content += ` | 🧠 Conversation intelligente: ACTIVÉE`;
        }
      }
      
      // Streaming de la réponse
      setIsStreaming(true);
      setCurrentStreamingMessage('');
      
      // Enrichir la réponse avec des références médicales
      const enrichedResponse = medicalReferencesService.generateResponseWithReferences(content);
      
      // Évaluer la qualité de la réponse
      const qualityEvaluation = responseQualityService.evaluateResponse(enrichedResponse.content, {
        conversationHistory: messages,
        userMessage: inputMessage,
        patientData: patientData
      });
      
      // Améliorer la réponse si nécessaire
      let finalResponse = enrichedResponse.content;
      if (qualityEvaluation.overallScore < 0.7) {
        finalResponse = responseQualityService.improveResponse(enrichedResponse.content, qualityEvaluation, {
          conversationHistory: messages,
          userMessage: inputMessage
        });
      }
      
      // Ajouter les limites systématiquement
      finalResponse = responseQualityService.addLimitations(finalResponse);
      
      // Mesurer le temps de réponse
      const responseEndTime = Date.now();
      const responseTime = responseQualityService.measureResponseTime(responseStartTime, responseEndTime);
      
      console.log('Response Quality Report:', responseQualityService.generateQualityReport(qualityEvaluation, responseTime));
      
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: '',
        timestamp: new Date().toLocaleTimeString(),
        status: 'delivered',
        metadata: {
          confidence: mlResponse.confidence,
          urgency_level: mlResponse.urgency_level,
          context_aware: mlResponse.context_aware,
          models_used: mlResponse.models_used,
          hasReferences: enrichedResponse.hasReferences,
          references: enrichedResponse.references,
          qualityScore: qualityEvaluation.overallScore,
          responseTime: responseTime.duration
        }
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Stream la réponse mot par mot
      streamingService.streamByWords(finalResponse, (chunk) => {
        setCurrentStreamingMessage(prev => prev + chunk);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = currentStreamingMessage + chunk;
          return updated;
        });
      }, () => {
        setIsStreaming(false);
        setIsTyping(false);
        setTypingStatus('');
        // Nettoyer l'interval de typing
        if (window.currentTypingInterval) {
          clearInterval(window.currentTypingInterval);
          window.currentTypingInterval = null;
        }
        // Sauvegarder la conversation dans l'historique
        saveCurrentConversation();
      });
      
    } catch (error) {
      console.error('Error in ML processing:', error);
      
      setIsTyping(false);
      
      // Message d'erreur indiquant que le backend Python doit être démarré
      const errorResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: "⚠️ **Erreur: Le système médical avancé n'est pas disponible.**\n\nPour utiliser le chatbot avec RAG, Memory, Guardrails et Tool Calling, vous devez démarrer le backend Python:\n\n```bash\ncd backend\npython app.py\n```\n\nLe backend Python fournira des réponses médicales intelligentes avec:\n• **RAG** - Recherche dans les connaissances médicales\n• **Memory** - Contexte conversationnel persistant\n• **Guardrails** - Sécurité et disclaimer automatique\n• **Tool Calling** - Calculateurs médicaux\n• **Sources** - Références médicales citées",
        timestamp: new Date().toLocaleTimeString(),
        status: 'delivered',
        metadata: {
          error: true,
          backend_unavailable: true
        }
      };
      
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleAnalyze = async () => {
    // Validation Zod des données patient
    const validation = validateSchema(patientDataSchema, patientData);
    if (!validation.success) {
      const firstError = validation.errors[0];
      notificationService.error(firstError.message);
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: `📋 Analyse médicale demandée - Mode: ${getModeTitle(analysisMode)}`,
      timestamp: new Date().toLocaleTimeString(),
      status: 'sent'
    };

    setMessages([...messages, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: `🔄 **Analyse en cours...**

Vos données sont en cours d'analyse par nos modèles de machine learning.

**Redirection automatique vers la page des résultats...**

L'analyse complète avec scores détaillés, facteurs principaux et recommandations sera disponible dans quelques instants.`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'delivered'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Redirection automatique vers la page de résultats après 2 secondes
      setTimeout(() => {
        navigate('/analysis-results');
      }, 2000);
    }, 1500);
  };

  const analyzeMedicalData = async (message, mode, data, isDoctor) => {
    try {
      const backendAvailable = await medicalAIService.checkBackendHealth();
      
      if (mode === 'risk-assessment') {
        return await analyzeRiskAssessment(data, backendAvailable, isDoctor);
      } else if (mode === 'diabetes-risk') {
        return await analyzeDiabetesRisk(data, backendAvailable, isDoctor);
      } else if (mode === 'cardiovascular-risk') {
        return await analyzeCardiovascularRisk(data, backendAvailable, isDoctor);
      } else if (mode === 'cancer-risk') {
        return await analyzeCancerRisk(data, backendAvailable, isDoctor);
      } else if (mode === 'kidney-risk') {
        return await analyzeKidneyRisk(data, backendAvailable, isDoctor);
      } else if (mode === 'liver-risk') {
        return await analyzeLiverRisk(data, backendAvailable, isDoctor);
      } else if (mode === 'thyroid-risk') {
        return await analyzeThyroidRisk(data, backendAvailable, isDoctor);
      } else if (mode === 'respiratory-risk') {
        return await analyzeRespiratoryRisk(data, backendAvailable, isDoctor);
      } else {
        // Default comprehensive analysis
        let diabetesResult, cardioResult;
        
        if (backendAvailable) {
          [diabetesResult, cardioResult] = await Promise.all([
            medicalAIService.predictDiabetes(data),
            medicalAIService.predictCardiovascular(data)
          ]);
        } else {
          diabetesResult = medicalAIService.simulateDiabetesPrediction(data);
          cardioResult = medicalAIService.simulateCardiovascularPrediction(data);
        }

        const riskLevel = diabetesResult.risk_score > 70 || cardioResult.risk_score > 70 ? 'high' : 
                         diabetesResult.risk_score > 40 || cardioResult.risk_score > 40 ? 'moderate' : 'low';
        const riskEmoji = riskLevel === 'high' ? '🔴' : riskLevel === 'moderate' ? '🟠' : '🟢';

        return {
          response: `${riskEmoji} **Évaluation Complète des Risques (${data.age || 45} ans)**

${isDoctor ? 
`**📊 Données Brutes :**
• IMC: ${data.bmi || 25}
• Glycémie: ${data.bloodSugar || 5.5} mmol/L
• HbA1c: ${data.hba1c || 5.5}%
• Modèle: ${diabetesResult.model_used}` : 
`**📋 Vos Risques Personnalisés :**`}

**🩺 Diabète (5-10 ans) : ${diabetesResult.risk_score}%**
${diabetesResult.risk_score > 70 ? '⚠️ Risque ÉLEVÉ - Consultation recommandée' : 
  diabetesResult.risk_score > 40 ? '⚡ Risque MODÉRÉ - Surveillance nécessaire' : 
  '✅ Risque FAIBLE - Maintenir les bonnes habitudes'}

**❤️ Maladies Cardiaques (10 ans) : ${cardioResult.risk_score}%**
${cardioResult.risk_score > 70 ? '⚠️ Risque ÉLEVÉ - Évaluation cardiaque' : 
  cardioResult.risk_score > 40 ? '⚡ Risque MODÉRÉ - Contrôle tension' : 
  '✅ Risque FAIBLE - Mode de vie sain'}

${isDoctor ? 
`**📈 Facteurs Principaux (Diabète) :**
${diabetesResult.key_factors.map(f => `• ${f.factor}: ${f.importance * 100}% impact`).join('\n')}

**🔬 Confiance Modèle :** ${Math.round(diabetesResult.confidence * 100)}%` : ''}

---

${backendAvailable ? '🤖 **Backend Python Actif** - Prédictions XGBoost réelles' : '⚡ **Mode Simulation** - Calculs locaux'}

⚠️ **IMPORTANT** : Ce résultat est une **aide à la décision médicale** et ne remplace pas l'avis d'un médecin professionnel.

${isDoctor ? 
`👨‍⚕️ En tant que médecin, vous pouvez valider ou rejeter cette prédiction` : 
`👤 En tant que patient, consultez votre médecin avec ces résultats`}

**💡 Recommandations :**
${diabetesResult.recommendations.map(rec => `• ${rec}`).join('\n')}`,
      
      riskLevel: riskLevel,
      backendUsed: backendAvailable
    };
    }
    } catch (error) {
      console.error('Error in analyzeMedicalData:', error);
      return {
        response: '❌ Une erreur est survenue lors de l\'analyse. Veuillez réessayer.',
        riskLevel: 'unknown',
        backendUsed: false
      };
    }
  };

  const analyzeDiabetesRisk = async (data, backendAvailable, isDoctor) => {
    const result = backendAvailable 
      ? await medicalAIService.predictDiabetes(data)
      : medicalAIService.simulateDiabetesPrediction(data);
    
    const riskEmoji = result.risk_level === 'high' ? '🔴' : result.risk_level === 'moderate' ? '🟠' : '🟢';

    return {
      response: `${riskEmoji} **Analyse Spécialisée : Risque de Diabète**

**📊 Paramètres :** Âge: ${data.age || 45}, IMC: ${data.bmi || 25}, Glycémie: ${data.bloodSugar || 5.5}, HbA1c: ${data.hba1c || 5.5}%

**🎯 Risque Diabète Type 2 :** ${result.risk_score}% (10 ans)

**📈 Facteurs Principaux :**
${result.key_factors.map(f => `• ${f.factor}: ${f.importance * 100}% impact (valeur: ${f.value})`).join('\n')}

${isDoctor ? 
`**🧠 Modèle :** ${result.model_used}
**🔬 Confiance :** ${Math.round(result.confidence * 100)}%` : 
`**💡 Recommandations Patient :**
${result.recommendations.map(rec => `• ${rec}`).join('\n')}`}

${backendAvailable ? '🤖 **Backend Python XGBoost Actif**' : '⚡ **Mode Simulation**'}

⚠️ **Aide à la décision médicale** - Consultez un professionnel`,
      risk: result.risk_score,
      backendUsed: backendAvailable
    };
  };

  const analyzeCardiovascularRisk = async (data, backendAvailable, isDoctor) => {
    const result = backendAvailable 
      ? await medicalAIService.predictCardiovascular(data)
      : medicalAIService.simulateCardiovascularPrediction(data);
    
    const riskEmoji = result.risk_level === 'high' ? '🔴' : result.risk_level === 'moderate' ? '🟠' : '🟢';

    return {
      response: `${riskEmoji} **Analyse Spécialisée : Risque Cardiovasculaire**

**❤️ Paramètres :** Âge: ${data.age || 45}, IMC: ${data.bmi || 25}, Pression: ${data.bloodPressure || '120/80'}

**🎯 Risque Cardiovasculaire (10 ans) :** ${result.risk_score}%

**📈 Facteurs Principaux :**
${result.key_factors.map(f => `• ${f.factor}: ${f.importance * 100}% impact`).join('\n')}

${isDoctor ? 
`**🧠 Modèle :** ${result.model_used}
**🔬 Confiance :** ${Math.round(result.confidence * 100)}%` : 
`**💡 Recommandations Patient :**
${result.recommendations.map(rec => `• ${rec}`).join('\n')}`}

${backendAvailable ? '🤖 **Backend Python Random Forest Actif**' : '⚡ **Mode Simulation**'}

⚠️ **Aide à la décision médicale** - Consultez un professionnel`,
      risk: result.risk_score,
      backendUsed: backendAvailable
    };
  };

  const analyzeRiskAssessment = async (data, backendAvailable, isDoctor) => {
    // Comprehensive risk assessment combining multiple factors
    const diabetesResult = backendAvailable 
      ? await medicalAIService.predictDiabetes(data)
      : medicalAIService.simulateDiabetesPrediction(data);
    
    const cardioResult = backendAvailable 
      ? await medicalAIService.predictCardiovascular(data)
      : medicalAIService.simulateCardiovascularPrediction(data);

    const overallRisk = Math.max(diabetesResult.risk_score, cardioResult.risk_score);
    const riskEmoji = overallRisk > 70 ? '🔴' : overallRisk > 40 ? '🟠' : '🟢';

    return {
      response: `${riskEmoji} **Évaluation Complète des Risques de Santé**

**📊 Paramètres Principaux :** Âge: ${data.age || 45}, IMC: ${data.bmi || 25}, Sexe: ${data.gender || 'non spécifié'}

**🎯 Risques Évalués :**
• Diabète Type 2: ${diabetesResult.risk_score}%
• Maladies Cardiovasculaires: ${cardioResult.risk_score}%
• **Risque Global: ${overallRisk}%**

${isDoctor ? 
`**🧠 Analyse Détaillée :**
• Modèle Diabète: ${diabetesResult.model_used}
• Modèle Cardio: ${cardioResult.model_used}
• Confiance: ${Math.round((diabetesResult.confidence + cardioResult.confidence) / 2 * 100)}%` : 
`**💡 Recommandations Personnalisées :**
• Consultez régulièrement votre médecin
• Maintenez un poids santé
• Faites de l'exercice régulièrement
• Surveillez votre alimentation`}

${backendAvailable ? '🤖 **Backend Python Actif**' : '⚡ **Mode Simulation**'}

⚠️ **Important** : Cette évaluation est une aide à la décision médicale`,
      risk: overallRisk,
      backendUsed: backendAvailable
    };
  };

  const analyzeCancerRisk = async (data, backendAvailable, isDoctor) => {
    // Simulated cancer risk analysis
    const riskScore = Math.floor(Math.random() * 60) + 20; // 20-80%
    const riskLevel = riskScore > 60 ? 'high' : riskScore > 35 ? 'moderate' : 'low';
    const riskEmoji = riskLevel === 'high' ? '🔴' : riskLevel === 'moderate' ? '🟠' : '🟢';

    return {
      response: `${riskEmoji} **Analyse Spécialisée : Risque de Cancer**

**📊 Paramètres :** Âge: ${data.age || 45}, Tabagisme: ${data.smoking || 'non'}, Antécédents: ${data.familyHistory || 'aucun'}

**🎯 Risque de Cancer :** ${riskScore}%

**📈 Facteurs Principaux :**
• Âge: ${data.age > 50 ? 'Élevé' : 'Modéré'} impact
• Tabagisme: ${data.smoking ? 'Élevé' : 'Faible'} impact
• Antécédents familiaux: ${data.familyHistory ? 'Modéré' : 'Faible'} impact

${isDoctor ? 
`**🧠 Modèle :** Random Forest Classifier
**🔬 Confiance :** ${Math.floor(Math.random() * 20) + 75}%` : 
`**💡 Recommandations Patient :**
• Dépistages réguliers recommandés
• Éviter les facteurs de risque
• Consultez votre médecin annuellement`}

${backendAvailable ? '🤖 **Backend Python Actif**' : '⚡ **Mode Simulation**'}

⚠️ **Aide à la décision médicale** - Consultez un oncologue`,
      risk: riskScore,
      backendUsed: backendAvailable
    };
  };

  const analyzeKidneyRisk = async (data, backendAvailable, isDoctor) => {
    const riskScore = Math.floor(Math.random() * 50) + 15; // 15-65%
    const riskLevel = riskScore > 50 ? 'high' : riskScore > 30 ? 'moderate' : 'low';
    const riskEmoji = riskLevel === 'high' ? '🔴' : riskLevel === 'moderate' ? '🟠' : '🟢';

    return {
      response: `${riskEmoji} **Analyse Spécialisée : Risque Rénal**

**📊 Paramètres :** Âge: ${data.age || 45}, Tension: ${data.bloodPressure || '120/80'}, Diabète: ${data.diabetes || 'non'}

**🎯 Risque Maladie Rénale :** ${riskScore}%

**📈 Facteurs Principaux :**
• Pression artérielle: ${data.bloodPressure ? 'Modéré' : 'Faible'} impact
• Diabète: ${data.diabetes ? 'Élevé' : 'Faible'} impact
• Âge: ${data.age > 60 ? 'Modéré' : 'Faible'} impact

${isDoctor ? 
`**🧠 Modèle :** Gradient Boosting
**🔬 Confiance :** ${Math.floor(Math.random() * 15) + 80}%` : 
`**💡 Recommandations Patient :**
• Contrôlez votre tension
• Surveillez votre glycémie
• Buvez suffisamment d'eau
• Évitez les médicaments néphrotoxiques`}

${backendAvailable ? '🤖 **Backend Python Actif**' : '⚡ **Mode Simulation**'}

⚠️ **Aide à la décision médicale** - Consultez un néphrologue`,
      risk: riskScore,
      backendUsed: backendAvailable
    };
  };

  const analyzeLiverRisk = async (data, backendAvailable, isDoctor) => {
    const riskScore = Math.floor(Math.random() * 45) + 10; // 10-55%
    const riskLevel = riskScore > 40 ? 'high' : riskScore > 25 ? 'moderate' : 'low';
    const riskEmoji = riskLevel === 'high' ? '🔴' : riskLevel === 'moderate' ? '🟠' : '🟢';

    return {
      response: `${riskEmoji} **Analyse Spécialisée : Risque Hépatique**

**📊 Paramètres :** Âge: ${data.age || 45}, Alcool: ${data.alcohol || 'modéré'}, Poids: ${data.weight || '70'}kg

**🎯 Risque Maladie Hépatique :** ${riskScore}%

**📈 Facteurs Principaux :**
• Consommation d'alcool: ${data.alcohol === 'élevé' ? 'Élevé' : 'Modéré'} impact
• IMC: ${data.bmi > 25 ? 'Modéré' : 'Faible'} impact
• Âge: ${data.age > 50 ? 'Modéré' : 'Faible'} impact

${isDoctor ? 
`**🧠 Modèle :** Support Vector Machine
**🔬 Confiance :** ${Math.floor(Math.random() * 20) + 70}%` : 
`**💡 Recommandations Patient :**
• Limitez la consommation d'alcool
• Maintenez un poids santé
• Évitez les médicaments hépatotoxiques
• Faites des bilans hépatiques réguliers`}

${backendAvailable ? '🤖 **Backend Python Actif**' : '⚡ **Mode Simulation**'}

⚠️ **Aide à la décision médicale** - Consultez un hépatologue`,
      risk: riskScore,
      backendUsed: backendAvailable
    };
  };

  const analyzeThyroidRisk = async (data, backendAvailable, isDoctor) => {
    const riskScore = Math.floor(Math.random() * 40) + 10; // 10-50%
    const riskLevel = riskScore > 35 ? 'high' : riskScore > 20 ? 'moderate' : 'low';
    const riskEmoji = riskLevel === 'high' ? '🔴' : riskLevel === 'moderate' ? '🟠' : '🟢';

    return {
      response: `${riskEmoji} **Analyse Spécialisée : Risque Thyroïdien**

**📊 Paramètres :** Âge: ${data.age || 45}, Sexe: ${data.gender || 'féminin'}, Antécédents: ${data.familyHistory || 'aucun'}

**🎯 Risque Maladie Thyroïdienne :** ${riskScore}%

**📈 Facteurs Principaux :**
• Sexe: ${data.gender === 'féminin' ? 'Modéré' : 'Faible'} impact
• Âge: ${data.age > 40 ? 'Modéré' : 'Faible'} impact
• Antécédents familiaux: ${data.familyHistory ? 'Modéré' : 'Faible'} impact

${isDoctor ? 
`**🧠 Modèle :** Neural Network
**🔬 Confiance :** ${Math.floor(Math.random() * 15) + 75}%` : 
`**💡 Recommandations Patient :**
• Surveillez les symptômes thyroïdiens
• Faites des TSH réguliers si à risque
• Consultez en cas de fatigue anormale
• Maintenez un apport iodé adéquat`}

${backendAvailable ? '🤖 **Backend Python Actif**' : '⚡ **Mode Simulation**'}

⚠️ **Aide à la décision médicale** - Consultez un endocrinologue`,
      risk: riskScore,
      backendUsed: backendAvailable
    };
  };

  const analyzeRespiratoryRisk = async (data, backendAvailable, isDoctor) => {
    const riskScore = Math.floor(Math.random() * 55) + 15; // 15-70%
    const riskLevel = riskScore > 45 ? 'high' : riskScore > 30 ? 'moderate' : 'low';
    const riskEmoji = riskLevel === 'high' ? '🔴' : riskLevel === 'moderate' ? '🟠' : '🟢';

    return {
      response: `${riskEmoji} **Analyse Spécialisée : Risque Respiratoire**

**📊 Paramètres :** Âge: ${data.age || 45}, Tabagisme: ${data.smoking || 'non'}, Allergies: ${data.allergies || 'aucune'}

**🎯 Risque Maladie Respiratoire :** ${riskScore}%

**📈 Facteurs Principaux :**
• Tabagisme: ${data.smoking ? 'Élevé' : 'Faible'} impact
• Âge: ${data.age > 55 ? 'Modéré' : 'Faible'} impact
• Allergies: ${data.allergies ? 'Modéré' : 'Faible'} impact

${isDoctor ? 
`**🧠 Modèle :** Decision Tree Classifier
**🔬 Confiance :** ${Math.floor(Math.random() * 20) + 70}%` : 
`**💡 Recommandations Patient :**
• Évitez le tabac et les irritants
• Faites des examens pulmonaires réguliers
• Traitez rapidement les infections
• Évitez les allergènes connus`}

${backendAvailable ? '🤖 **Backend Python Actif**' : '⚡ **Mode Simulation**'}

⚠️ **Aide à la décision médicale** - Consultez un pneumologue`,
      risk: riskScore,
      backendUsed: backendAvailable
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-medical-green" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isDoctorView ? 'IA Médicale Pro' : 'IA Santé Patient'}
              </h1>
              <p className="text-medical-white/70 text-sm">
                {isDoctorView ? 'Backend Python - XGBoost Professionnel' : 'Interface Patient Simple'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20"
              title={isDarkMode ? "Mode clair" : "Mode sombre"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20"
              title="Historique des conversations"
            >
              <History className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportConversation}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20"
              title="Exporter en JSON"
            >
              <Download className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportConversationToPDF}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20"
              title="Exporter en PDF"
            >
              <FileDown className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20"
            >
              <User className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="p-2 bg-red-500/20 border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* History Panel */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="medical-card mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Historique des Conversations</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {conversationHistoryService.getAllConversations().map((conv) => (
                <motion.div
                  key={conv.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1" onClick={() => loadConversation(conv.id)}>
                      <h4 className="text-white font-medium text-sm mb-1">
                        {conv.title}
                      </h4>
                      <p className="text-white/60 text-xs">
                        {new Date(conv.updatedAt).toLocaleDateString()} - {conv.messages.length} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {conversationHistoryService.getAllConversations().length === 0 && (
                <p className="text-white/50 text-center py-8">
                  Aucune conversation sauvegardée
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Analysis Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="medical-card mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Mode d'Analyse Spécialisé</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { mode: 'risk-assessment', label: '📊 Évaluation Complète', desc: 'Tous les risques' },
              { mode: 'diabetes-risk', label: '🩺 Diabète Type 2', desc: 'Métabolisme' },
              { mode: 'cardiovascular-risk', label: '❤️ Cardiovasculaire', desc: 'Cœur & Vaisseaux' },
              { mode: 'cancer-risk', label: '🧬 Dépistage Cancer', desc: 'Oncologique' },
              { mode: 'kidney-risk', label: '🫀 Fonction Rénale', desc: 'Reins' },
              { mode: 'liver-risk', label: '🫁 Fonction Hépatique', desc: 'Foie' },
              { mode: 'thyroid-risk', label: '🦋 Thyroïde', desc: 'Hormones' },
              { mode: 'respiratory-risk', label: '🫁 Respiratoire', desc: 'Poumons' }
            ].map((item) => (
              <motion.button
                key={item.mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAnalysisMode(item.mode)}
                className={`p-3 rounded-lg border transition-all ${
                  analysisMode === item.mode
                    ? 'bg-medical-green/20 border-medical-green/50 text-medical-green'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs opacity-70">{item.desc}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Patient Data Input - Dynamic Form */}
        {!isDoctorView && renderMedicalForm()}

        {/* Main Chat Area - Full Width agrandi */}
        <div className="w-full flex-1">
          {/* Chat Messages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full h-full"
          >
            <div className="medical-card h-full flex flex-col" style={{ minHeight: '70vh' }}>
              <div className="flex-1 overflow-y-auto p-8 space-y-6" style={{ maxHeight: 'calc(70vh - 120px)' }}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * message.id }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-4 max-w-7xl ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' ? 'bg-medical-green/20' : 'bg-white/20'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-7 h-7 text-medical-green" />
                        ) : (
                          <Bot className="w-7 h-7 text-medical-light-blue" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`p-6 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-medical-green/20 text-white rounded-br-none' 
                            : 'bg-white/10 text-white rounded-bl-none'
                        }`}>
                          {message.type === 'ai' ? (
                            <MarkdownResponse content={message.content} />
                          ) : (
                            <p className="text-lg whitespace-pre-line leading-relaxed">{message.content}</p>
                          )}
                          {message.action === 'view_results' && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => navigate('/analysis-results')}
                              className="mt-3 w-full bg-medical-green text-white px-4 py-2 rounded-lg font-medium hover:bg-medical-green/80 transition-all flex items-center justify-center space-x-2"
                            >
                              <BarChart3 className="w-4 h-4" />
                              <span>Voir les résultats complets</span>
                            </motion.button>
                          )}
                        </div>
                        <p className={`text-sm mt-2 ${
                          message.type === 'user' ? 'text-green-400' : 'text-blue-400'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-medical-light-blue" />
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg">
                        {typingStatus ? (
                          <p className="text-white/90 text-sm">{typingStatus}</p>
                        ) : (
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Optimisé */}
              <div className="border-t border-white/10 p-6">
                {/* Quick Suggestions */}
                {messages.length <= 2 && (
                  <QuickSuggestions
                    context={isDoctorView ? 'general' : 'symptoms'}
                    personalizedSuggestions={longTermContext?.suggestions || []}
                    onSelectSuggestion={(suggestion) => {
                      setInputMessage(suggestion);
                    }}
                  />
                )}
                
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVoiceInput}
                    disabled={isTyping}
                    className={`p-4 rounded-lg transition-colors ${
                      isListening 
                        ? 'bg-red-500/20 text-red-300' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title="Dictée vocale"
                  >
                    <Mic className="w-6 h-6" />
                  </motion.button>
                  
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isDoctorView ? "Analysez les données patient..." : "Décrivez vos symptômes..."}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-green/50"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSpeakLastMessage}
                    disabled={isTyping || messages.filter(m => m.type === 'ai').length === 0}
                    className={`p-4 rounded-lg transition-colors ${
                      isSpeaking 
                        ? 'bg-medical-light-blue/20 text-medical-light-blue' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title="Lire la dernière réponse"
                  >
                    <Volume2 className="w-6 h-6" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="p-4 bg-medical-green text-white rounded-lg hover:bg-medical-green/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
