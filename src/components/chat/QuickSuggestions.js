/**
 * Composant de suggestions de réponses rapides
 * Affiche des boutons suggérés basés sur le contexte de la conversation
 */

import React from 'react';
import { motion } from 'framer-motion';

const SUGGESTIONS = {
  general: [
    "Quels sont les symptômes du diabète ?",
    "Comment puis-je améliorer ma santé cardiovasculaire ?",
    "Qu'est-ce que l'hypertension ?",
    "Comment prévenir les maladies cardiaques ?"
  ],
  symptoms: [
    "J'ai mal à la tête depuis 2 jours",
    "Je me sens fatigué tout le temps",
    "J'ai des douleurs dans la poitrine",
    "J'ai du mal à respirer"
  ],
  prevention: [
    "Comment puis-je réduire mon risque de diabète ?",
    "Quels exercices pour le cœur ?",
    "Alimentation saine pour le cœur",
    "Comment arrêter de fumer ?"
  ],
  emergency: [
    "Que faire en cas d'urgence ?",
    "Quand appeler les secours ?",
    "Signes d'alerte d'infarctus",
    "Symptômes d'AVC"
  ]
};

export default function QuickSuggestions({ context = 'general', personalizedSuggestions = [], onSelectSuggestion }) {
  // Combiner les suggestions par défaut avec les suggestions personnalisées
  const defaultSuggestions = SUGGESTIONS[context] || SUGGESTIONS.general;
  
  // Prioriser les suggestions personnalisées, puis compléter avec les défauts
  const combinedSuggestions = [
    ...personalizedSuggestions.slice(0, 2), // Max 2 suggestions personnalisées
    ...defaultSuggestions.slice(0, 2) // Compléter avec 2 suggestions par défaut
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mb-4"
    >
      {combinedSuggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectSuggestion(suggestion)}
          className={`px-4 py-2 border rounded-full text-sm transition-colors ${
            index < personalizedSuggestions.length
              ? 'bg-medical-light-blue/30 border-medical-light-blue/50 text-white'
              : 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20'
          }`}
        >
          {index < personalizedSuggestions.length && '✨ '}
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  );
}
