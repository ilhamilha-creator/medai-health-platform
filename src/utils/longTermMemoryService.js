/**
 * Service de mémoire conversationnelle à long terme
 * Apprend des préférences et du contexte utilisateur au fil des conversations
 */

class LongTermMemoryService {
  constructor() {
    this.storageKey = 'medai_long_term_memory';
    this.maxMemories = 100;
  }

  /**
   * Récupère la mémoire d'un utilisateur
   */
  getUserMemory(userId) {
    try {
      const allMemories = this.getAllMemories();
      return allMemories[userId] || this.createEmptyMemory(userId);
    } catch (error) {
      console.error('Error loading user memory:', error);
      return this.createEmptyMemory(userId);
    }
  }

  /**
   * Crée une mémoire vide pour un utilisateur
   */
  createEmptyMemory(userId) {
    return {
      userId: userId,
      preferences: {
        language: 'french',
        communicationStyle: 'professional',
        detailLevel: 'medium',
        topicsOfInterest: [],
        medicalConditions: [],
        medications: [],
        allergies: []
      },
      patterns: {
        commonQuestions: {},
        frequentTopics: {},
        timePatterns: {},
        urgencyPatterns: {}
      },
      context: {
        lastVisit: null,
        totalConversations: 0,
        totalMessages: 0,
        averageSessionLength: 0,
        preferredAnalysisModes: []
      },
      learning: {
        successfulInteractions: 0,
        misunderstoodQueries: 0,
        helpfulResponses: [],
        unhelpfulResponses: []
      },
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Sauvegarde la mémoire d'un utilisateur
   */
  saveUserMemory(userId, memory) {
    try {
      const allMemories = this.getAllMemories();
      memory.updatedAt = new Date().toISOString();
      allMemories[userId] = memory;
      
      // Limiter le nombre total de mémoires
      const userIds = Object.keys(allMemories);
      if (userIds.length > this.maxMemories) {
        // Supprimer les mémoires les plus anciennes
        const sortedIds = userIds.sort((a, b) => 
          new Date(allMemories[a].updatedAt) - new Date(allMemories[b].updatedAt)
        );
        sortedIds.slice(0, userIds.length - this.maxMemories).forEach(id => {
          delete allMemories[id];
        });
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(allMemories));
    } catch (error) {
      console.error('Error saving user memory:', error);
    }
  }

  /**
   * Récupère toutes les mémoires
   */
  getAllMemories() {
    try {
      const memories = localStorage.getItem(this.storageKey);
      return memories ? JSON.parse(memories) : {};
    } catch (error) {
      console.error('Error loading memories:', error);
      return {};
    }
  }

  /**
   * Apprend d'une conversation
   */
  learnFromConversation(userId, conversation) {
    const memory = this.getUserMemory(userId);
    
    // Mettre à jour le contexte
    memory.context.lastVisit = new Date().toISOString();
    memory.context.totalConversations += 1;
    memory.context.totalMessages += conversation.messages.length;
    
    // Analyser les messages pour extraire des patterns
    conversation.messages.forEach(message => {
      if (message.type === 'user') {
        this.analyzeUserMessage(memory, message);
      } else if (message.type === 'ai') {
        this.analyzeAIResponse(memory, message);
      }
    });
    
    // Mettre à jour les modes d'analyse préférés
    if (conversation.metadata?.analysisMode) {
      memory.context.preferredAnalysisModes.push(conversation.metadata.analysisMode);
      // Garder seulement les 5 derniers modes
      memory.context.preferredAnalysisModes = memory.context.preferredAnalysisModes.slice(-5);
    }
    
    this.saveUserMemory(userId, memory);
    return memory;
  }

  /**
   * Analyse un message utilisateur pour extraire des informations
   */
  analyzeUserMessage(memory, message) {
    const content = message.content.toLowerCase();
    
    // Détecter les conditions médicales mentionnées
    const medicalConditions = ['diabète', 'diabetes', 'hypertension', 'cancer', 'asthme', 'arthrite'];
    medicalConditions.forEach(condition => {
      if (content.includes(condition) && !memory.preferences.medicalConditions.includes(condition)) {
        memory.preferences.medicalConditions.push(condition);
      }
    });
    
    // Détecter les médicaments mentionnés
    const medications = ['insuline', 'metformine', 'aspirine', 'ibuprofène', 'paracétamol'];
    medications.forEach(med => {
      if (content.includes(med) && !memory.preferences.medications.includes(med)) {
        memory.preferences.medications.push(med);
      }
    });
    
    // Suivre les questions fréquentes
    const words = content.split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) {
        memory.patterns.commonQuestions[word] = (memory.patterns.commonQuestions[word] || 0) + 1;
      }
    });
    
    // Détecter les sujets d'intérêt
    const topics = ['cardio', 'cœur', 'diabète', 'santé', 'prévention', 'symptômes', 'nutrition', 'exercice'];
    topics.forEach(topic => {
      if (content.includes(topic)) {
        memory.patterns.frequentTopics[topic] = (memory.patterns.frequentTopics[topic] || 0) + 1;
      }
    });
  }

  /**
   * Analyse une réponse IA pour évaluer la qualité
   */
  analyzeAIResponse(memory, message) {
    const content = message.content.toLowerCase();
    
    // Évaluer si la réponse semble utile (basé sur la longueur et le contenu)
    if (content.length > 100 && (content.includes('conseil') || content.includes('recommandation'))) {
      memory.learning.successfulInteractions += 1;
      memory.learning.helpfulResponses.push({
        timestamp: new Date().toISOString(),
        preview: content.substring(0, 100)
      });
    }
  }

  /**
   * Récupère des suggestions basées sur la mémoire
   */
  getPersonalizedSuggestions(userId) {
    const memory = this.getUserMemory(userId);
    const suggestions = [];
    
    // Basé sur les conditions médicales
    if (memory.preferences.medicalConditions.length > 0) {
      memory.preferences.medicalConditions.forEach(condition => {
        suggestions.push(`Comment gérer ma ${condition} ?`);
      });
    }
    
    // Basé sur les sujets fréquents
    const frequentTopics = Object.entries(memory.patterns.frequentTopics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    frequentTopics.forEach(([topic, count]) => {
      if (count > 2) {
        suggestions.push(`En savoir plus sur ${topic}`);
      }
    });
    
    // Basé sur les modes d'analyse préférés
    if (memory.context.preferredAnalysisModes.length > 0) {
      const lastMode = memory.context.preferredAnalysisModes[memory.context.preferredAnalysisModes.length - 1];
      suggestions.push(`Analyser mes données (${lastMode})`);
    }
    
    return suggestions.slice(0, 4);
  }

  /**
   * Récupère le contexte enrichi pour une nouvelle conversation
   */
  getEnrichedContext(userId) {
    const memory = this.getUserMemory(userId);
    
    return {
      userId: userId,
      preferences: memory.preferences,
      patterns: memory.patterns,
      context: {
        isReturningUser: memory.context.totalConversations > 0,
        totalConversations: memory.context.totalConversations,
        lastVisit: memory.context.lastVisit,
        preferredTopics: Object.keys(memory.patterns.frequentTopics).sort((a, b) => 
          memory.patterns.frequentTopics[b] - memory.patterns.frequentTopics[a]
        ).slice(0, 5)
      },
      suggestions: this.getPersonalizedSuggestions(userId)
    };
  }

  /**
   * Met à jour les préférences utilisateur
   */
  updatePreferences(userId, preferences) {
    const memory = this.getUserMemory(userId);
    memory.preferences = { ...memory.preferences, ...preferences };
    this.saveUserMemory(userId, memory);
  }

  /**
   * Efface la mémoire d'un utilisateur
   */
  clearUserMemory(userId) {
    const allMemories = this.getAllMemories();
    delete allMemories[userId];
    localStorage.setItem(this.storageKey, JSON.stringify(allMemories));
  }

  /**
   * Récupère les statistiques d'apprentissage
   */
  getLearningStats(userId) {
    const memory = this.getUserMemory(userId);
    
    return {
      totalConversations: memory.context.totalConversations,
      totalMessages: memory.context.totalMessages,
      successRate: memory.context.totalConversations > 0 
        ? (memory.learning.successfulInteractions / memory.context.totalConversations * 100).toFixed(1)
        : 0,
      topicsExplored: Object.keys(memory.patterns.frequentTopics).length,
      medicalConditionsTracked: memory.preferences.medicalConditions.length,
      lastActive: memory.context.lastVisit
    };
  }
}

const longTermMemoryService = new LongTermMemoryService();
export default longTermMemoryService;
