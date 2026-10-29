/**
 * Composant de sélection du mode d'analyse
 * Permet de choisir entre différents modes d'analyse ML
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Heart, Activity, AlertTriangle } from 'lucide-react';

const ANALYSIS_MODES = [
  { id: 'risk-assessment', name: 'Évaluation Risque', icon: BarChart3, description: 'Analyse globale des risques' },
  { id: 'diabetes', name: 'Diabète', icon: Heart, description: 'Prédiction risque diabète' },
  { id: 'cardiovascular', name: 'Cardiovasculaire', icon: Activity, description: 'Risque cardiovasculaire' },
  { id: 'cancer', name: 'Cancer', icon: AlertTriangle, description: 'Détection risque cancer' },
];

export default function AnalysisModeSelector({ currentMode, onModeChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 mb-4"
    >
      <h3 className="text-white font-semibold mb-3">Mode d'Analyse</h3>
      <div className="grid grid-cols-2 gap-2">
        {ANALYSIS_MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`p-3 rounded-lg transition-all ${
                currentMode === mode.id
                  ? 'bg-gradient-to-r from-medical-light-blue to-medical-blue text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <div className="text-sm font-medium">{mode.name}</div>
              <div className="text-xs opacity-70">{mode.description}</div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
