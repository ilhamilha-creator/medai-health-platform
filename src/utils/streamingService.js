/**
 * Service de streaming pour les réponses du chat
 * Simule l'effet d'écriture progressive comme ChatGPT
 */

class StreamingService {
  /**
   * Convertit une réponse en stream de caractères
   * @param {string} text - Le texte complet à streamer
   * @param {number} speed - Vitesse du streaming (ms par caractère)
   * @param {Function} onChunk - Callback pour chaque chunk
   * @param {Function} onComplete - Callback quand terminé
   */
  static streamResponse(text, speed = 15, onChunk, onComplete) {
    let index = 0;
    const chars = text.split('');
    
    const interval = setInterval(() => {
      if (index < chars.length) {
        // Envoyer un chunk de plusieurs caractères pour plus de fluidité
        const chunkSize = Math.min(3, chars.length - index);
        const chunk = chars.slice(index, index + chunkSize).join('');
        onChunk(chunk);
        index += chunkSize;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    
    return interval;
  }

  /**
   * Stream avec variation de vitesse pour effet naturel
   * Plus lent au début, plus rapide au milieu, plus lent à la fin
   */
  static streamWithVariableSpeed(text, onChunk, onComplete) {
    let index = 0;
    const chars = text.split('');
    const totalLength = chars.length;
    
    const getSpeed = (currentIndex) => {
      const progress = currentIndex / totalLength;
      // Plus lent au début (0-10%), plus rapide au milieu (10-90%), plus lent à la fin (90-100%)
      if (progress < 0.1) return 30; // Début lent
      if (progress > 0.9) return 40; // Fin lent
      return 10; // Milieu rapide
    };
    
    const streamNext = () => {
      if (index < chars.length) {
        const chunkSize = Math.min(2, chars.length - index);
        const chunk = chars.slice(index, index + chunkSize).join('');
        onChunk(chunk);
        index += chunkSize;
        
        setTimeout(streamNext, getSpeed(index));
      } else {
        if (onComplete) onComplete();
      }
    };
    
    streamNext();
  }

  /**
   * Stream par mots (plus naturel pour le texte)
   */
  static streamByWords(text, onChunk, onComplete) {
    const words = text.split(' ');
    let index = 0;
    
    const streamNext = () => {
      if (index < words.length) {
        const word = words[index] + ' ';
        onChunk(word);
        index++;
        
        // Variation de vitesse selon la longueur du mot
        const delay = word.length > 8 ? 80 : word.length > 4 ? 50 : 30;
        setTimeout(streamNext, delay);
      } else {
        if (onComplete) onComplete();
      }
    };
    
    streamNext();
  }

  /**
   * Stream par phrases (pour les réponses structurées)
   */
  static streamBySentences(text, onChunk, onComplete) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let index = 0;
    
    const streamNext = () => {
      if (index < sentences.length) {
        onChunk(sentences[index]);
        index++;
        setTimeout(streamNext, 400); // Pause entre phrases
      } else {
        if (onComplete) onComplete();
      }
    };
    
    streamNext();
  }

  /**
   * Annule un stream en cours
   */
  static cancelStream(intervalId) {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
}

export default StreamingService;
