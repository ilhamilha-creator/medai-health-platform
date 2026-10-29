/**
 * Composant de formulaire de données patient pour l'analyse ML
 * Affiche les champs de saisie pour les données démographiques et médicales
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, AlertTriangle } from 'lucide-react';

export default function PatientDataForm({ patientData, setPatientData, analysisMode }) {
  const handleInputChange = (field, value) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 mb-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-medical-light-blue" />
        <h3 className="text-white font-semibold">Données Patient</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Démographie */}
        <div>
          <label className="text-white/70 text-sm mb-1 block">Âge</label>
          <input
            type="number"
            value={patientData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || '')}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-medical-light-blue"
          />
        </div>
        <div>
          <label className="text-white/70 text-sm mb-1 block">Sexe</label>
          <select
            value={patientData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-medical-light-blue"
          >
            <option value="">Sélectionner</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>
        <div>
          <label className="text-white/70 text-sm mb-1 block">IMC</label>
          <input
            type="number"
            value={patientData.bmi}
            onChange={(e) => handleInputChange('bmi', parseFloat(e.target.value) || '')}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-medical-light-blue"
          />
        </div>

        {/* Diabète */}
        {analysisMode === 'diabetes' && (
          <>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Glycémie (mg/dL)</label>
              <input
                type="number"
                value={patientData.bloodSugar}
                onChange={(e) => handleInputChange('bloodSugar', parseFloat(e.target.value) || '')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-medical-light-blue"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">HbA1c (%)</label>
              <input
                type="number"
                value={patientData.hba1c}
                onChange={(e) => handleInputChange('hba1c', parseFloat(e.target.value) || '')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-medical-light-blue"
              />
            </div>
          </>
        )}

        {/* Cardiovasculaire */}
        {analysisMode === 'cardiovascular' && (
          <>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Pression Systolique</label>
              <input
                type="number"
                value={patientData.systolic_bp}
                onChange={(e) => handleInputChange('systolic_bp', parseInt(e.target.value) || '')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-medical-light-blue"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Pression Diastolique</label>
              <input
                type="number"
                value={patientData.diastolic_bp}
                onChange={(e) => handleInputChange('diastolic_bp', parseInt(e.target.value) || '')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-medical-light-blue"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Fréquence Cardiaque</label>
              <input
                type="number"
                value={patientData.heart_rate}
                onChange={(e) => handleInputChange('heart_rate', parseInt(e.target.value) || '')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-medical-light-blue"
              />
            </div>
          </>
        )}

        {/* Cancer */}
        {analysisMode === 'cancer' && (
          <>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Cholestérol (mg/dL)</label>
              <input
                type="number"
                value={patientData.cholesterol}
                onChange={(e) => handleInputChange('cholesterol', parseFloat(e.target.value) || '')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-medical-light-blue"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Tabagisme</label>
              <select
                value={patientData.smoker ? 'true' : 'false'}
                onChange={(e) => handleInputChange('smoker', e.target.value === 'true')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-medical-light-blue"
              >
                <option value="false">Non</option>
                <option value="true">Oui</option>
              </select>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
