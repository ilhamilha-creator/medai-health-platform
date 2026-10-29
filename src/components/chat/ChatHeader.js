/**
 * Composant d'en-tête pour le chat IA
 * Affiche le titre, les boutons de contrôle et l'indicateur de mode
 */

import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Info, Shield } from 'lucide-react';

export default function ChatHeader({ isDoctorView, onLogout, onShowInfo }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-medical-light-blue to-medical-blue rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Assistant Médical IA
            </h2>
            <p className="text-sm text-white/70">
              {isDoctorView ? 'Mode Professionnel' : 'Mode Patient'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onShowInfo}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Info className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
