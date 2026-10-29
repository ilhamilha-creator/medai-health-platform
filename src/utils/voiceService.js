// Voice Service using Web Speech API (Free, Browser-native)
class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  init() {
    if (!this.supported) {
      console.warn('Speech recognition not supported in this browser');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    return true;
  }

  startListening(onResult, onEnd, onError) {
    if (!this.supported || !this.recognition) {
      console.error('Speech recognition not available');
      return;
    }

    this.isListening = true;
    
    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      onResult({
        final: finalTranscript,
        interim: interimTranscript,
        isFinal: event.results[event.results.length - 1].isFinal
      });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      console.error('Speech recognition error:', event.error);
      if (onError) onError(event.error);
    };

    this.recognition.start();
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text, options = {}) {
    if (!this.synthesis) {
      console.error('Speech synthesis not available');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  getVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }
}

export default new VoiceService();