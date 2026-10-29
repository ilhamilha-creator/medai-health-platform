/**
 * Service pour Voice-to-text et Text-to-speech
 * Utilise l'API Web Speech native du navigateur
 */

class SpeechService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.isSpeaking = false;
  }

  /**
   * Initialise la reconnaissance vocale
   */
  initRecognition(onResult, onError) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      if (onResult) onResult(transcript, event.results[0].isFinal);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    return true;
  }

  /**
   * Commence l'écoute vocale
   */
  startListening(onResult, onError) {
    if (this.isListening) return;
    
    if (!this.recognition) {
      const initialized = this.initRecognition(onResult, onError);
      if (!initialized) {
        if (onError) onError('not_supported');
        return;
      }
    } else {
      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        if (onResult) onResult(transcript, event.results[0].isFinal);
      };
      
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        if (onError) onError(event.error);
      };
    }

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Error starting recognition:', error);
      if (onError) onError(error.message);
    }
  }

  /**
   * Arrête l'écoute vocale
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Vérifie si la reconnaissance vocale est supportée
   */
  isRecognitionSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  /**
   * Synthèse vocale (Text-to-speech)
   */
  speak(text, options = {}) {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return false;
    }

    // Annuler toute parole en cours
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configuration des options
    utterance.lang = options.lang || 'fr-FR';
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Sélectionner une voix française si disponible
    if (options.voice) {
      utterance.voice = options.voice;
    } else {
      const voices = this.synthesis.getVoices();
      const frenchVoice = voices.find(voice => voice.lang.startsWith('fr'));
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.isSpeaking = false;
    };

    this.synthesis.speak(utterance);
    return true;
  }

  /**
   * Arrête la synthèse vocale
   */
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Vérifie si la synthèse vocale est supportée
   */
  isSynthesisSupported() {
    return 'speechSynthesis' in window;
  }

  /**
   * Récupère les voix disponibles
   */
  getVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  /**
   * Récupère les voix françaises
   */
  getFrenchVoices() {
    const voices = this.getVoices();
    return voices.filter(voice => voice.lang.startsWith('fr'));
  }
}

const speechService = new SpeechService();
export default speechService;
