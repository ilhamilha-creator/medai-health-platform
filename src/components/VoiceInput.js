import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import voiceService from '../utils/voiceService';

export default function VoiceInput({ onTranscript, placeholder = "Tap to speak..." }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = voiceService.init();
    setIsSupported(supported);
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    voiceService.startListening(
      (result) => {
        if (result.isFinal) {
          const finalText = transcript + result.final;
          setTranscript(finalText);
          setInterimTranscript('');
          if (onTranscript) onTranscript(finalText);
        } else {
          setInterimTranscript(result.interim);
        }
      },
      () => {
        setIsListening(false);
      },
      (error) => {
        console.error('Voice error:', error);
        setIsListening(false);
      }
    );
    setIsListening(true);
  };

  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakText = () => {
    if (transcript) {
      voiceService.speak(transcript);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center space-x-2 text-medical-white/50 text-sm">
        <MicOff className="w-4 h-4" />
        <span>Voice not supported</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Transcript Display */}
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            value={transcript + interimTranscript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-medical-white/50 focus:border-medical-green focus:outline-none"
            readOnly={isListening}
          />
          {isListening && (
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Voice Controls */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`p-3 rounded-lg transition-all duration-300 ${
          isListening
            ? 'bg-red-500/20 border border-red-500/50 text-red-400'
            : 'bg-medical-green/20 border border-medical-green/50 text-medical-green'
        }`}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </motion.button>

      {/* Text-to-Speech */}
      {transcript && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={speakText}
          className="p-3 bg-white/10 border border-white/20 rounded-lg text-medical-white/70 hover:text-white transition-all duration-300"
        >
          <Volume2 className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}