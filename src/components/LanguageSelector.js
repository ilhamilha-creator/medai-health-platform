import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import translationService from '../utils/translationService';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    translationService.init();
    setCurrentLanguage(translationService.getLanguage());
  }, []);

  const languages = translationService.getAvailableLanguages();

  const handleLanguageChange = (languageCode) => {
    translationService.setLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setIsOpen(false);
    // Trigger page refresh to apply translations
    window.location.reload();
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{currentLang?.flag} {currentLang?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl z-50"
        >
          {languages.map((language) => (
            <motion.button
              key={language.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                currentLanguage === language.code
                  ? 'bg-medical-green/20 text-medical-green'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{language.flag}</span>
              <span className="text-sm">{language.name}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}