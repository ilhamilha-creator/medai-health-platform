/**
 * Composant de saisie de message pour le chat IA
 * Zone de texte avec bouton d'envoi
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function ChatInput({ inputMessage, setInputMessage, onSendMessage, disabled }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg border-t border-white/20 p-4"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Écrivez votre message..."
          disabled={disabled}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-medical-light-blue disabled:opacity-50"
        />
        <button
          onClick={onSendMessage}
          disabled={disabled || !inputMessage.trim()}
          className="px-6 py-3 bg-gradient-to-r from-medical-light-blue to-medical-blue text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Envoyer
        </button>
      </div>
    </motion.div>
  );
}
