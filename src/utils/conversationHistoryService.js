/**
 * Service de gestion de l'historique des conversations
 * Sauvegarde, recherche et restauration des conversations
 */

class ConversationHistoryService {
  constructor() {
    this.storageKey = 'medai_conversation_history';
    this.maxConversations = 50;
    this.maxMessagesPerConversation = 100;
  }

  /**
   * Récupère toutes les conversations
   */
  getAllConversations() {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading conversation history:', error);
      return [];
    }
  }

  /**
   * Sauvegarde une conversation
   */
  saveConversation(conversation) {
    const conversations = this.getAllConversations();
    
    // Limiter le nombre de messages par conversation
    const limitedMessages = conversation.messages.slice(-this.maxMessagesPerConversation);
    
    const newConversation = {
      id: conversation.id || Date.now(),
      title: conversation.title || this.generateTitle(conversation.messages),
      messages: limitedMessages,
      createdAt: conversation.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: conversation.userId || 'anonymous',
      tags: conversation.tags || [],
      metadata: conversation.metadata || {}
    };

    // Vérifier si la conversation existe déjà
    const existingIndex = conversations.findIndex(c => c.id === newConversation.id);
    
    if (existingIndex >= 0) {
      // Mettre à jour la conversation existante
      conversations[existingIndex] = newConversation;
    } else {
      // Ajouter la nouvelle conversation
      conversations.unshift(newConversation);
    }

    // Limiter le nombre total de conversations
    const limitedConversations = conversations.slice(0, this.maxConversations);
    
    localStorage.setItem(this.storageKey, JSON.stringify(limitedConversations));
    return newConversation;
  }

  /**
   * Récupère une conversation par ID
   */
  getConversationById(id) {
    const conversations = this.getAllConversations();
    return conversations.find(c => c.id === id) || null;
  }

  /**
   * Supprime une conversation
   */
  deleteConversation(id) {
    const conversations = this.getAllConversations();
    const filtered = conversations.filter(c => c.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  /**
   * Recherche dans les conversations
   */
  searchConversations(query) {
    const conversations = this.getAllConversations();
    const lowerQuery = query.toLowerCase();
    
    return conversations.filter(conv => {
      // Recherche dans le titre
      if (conv.title.toLowerCase().includes(lowerQuery)) return true;
      
      // Recherche dans les messages
      const hasMatchingMessage = conv.messages.some(msg => 
        msg.content.toLowerCase().includes(lowerQuery)
      );
      
      if (hasMatchingMessage) return true;
      
      // Recherche dans les tags
      if (conv.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
      
      return false;
    });
  }

  /**
   * Récupère les conversations d'un utilisateur
   */
  getConversationsByUserId(userId) {
    const conversations = this.getAllConversations();
    return conversations.filter(c => c.userId === userId);
  }

  /**
   * Génère un titre basé sur le premier message
   */
  generateTitle(messages) {
    if (!messages || messages.length === 0) return 'Nouvelle conversation';
    
    const firstUserMessage = messages.find(m => m.type === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content;
      // Tronquer à 50 caractères
      return content.length > 50 ? content.substring(0, 50) + '...' : content;
    }
    
    return 'Conversation IA Médicale';
  }

  /**
   * Exporte une conversation en JSON
   */
  exportConversation(id) {
    const conversation = this.getConversationById(id);
    if (!conversation) return null;
    
    return JSON.stringify(conversation, null, 2);
  }

  /**
   * Importe une conversation depuis JSON
   */
  importConversation(jsonString) {
    try {
      const conversation = JSON.parse(jsonString);
      conversation.id = Date.now(); // Nouvel ID pour éviter les conflits
      conversation.createdAt = new Date().toISOString();
      conversation.updatedAt = new Date().toISOString();
      
      return this.saveConversation(conversation);
    } catch (error) {
      console.error('Error importing conversation:', error);
      throw new Error('Format de conversation invalide');
    }
  }

  /**
   * Nettoie les anciennes conversations (plus de 30 jours)
   */
  cleanOldConversations(days = 30) {
    const conversations = this.getAllConversations();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const filtered = conversations.filter(conv => {
      const convDate = new Date(conv.updatedAt);
      return convDate > cutoffDate;
    });
    
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  /**
   * Récupère les statistiques de l'historique
   */
  getStats() {
    const conversations = this.getAllConversations();
    
    return {
      totalConversations: conversations.length,
      totalMessages: conversations.reduce((sum, conv) => sum + conv.messages.length, 0),
      averageMessagesPerConversation: conversations.length > 0 
        ? Math.round(conversations.reduce((sum, conv) => sum + conv.messages.length, 0) / conversations.length)
        : 0,
      oldestConversation: conversations.length > 0 
        ? conversations[conversations.length - 1].createdAt 
        : null,
      newestConversation: conversations.length > 0 
        ? conversations[0].createdAt 
        : null
    };
  }
}

const conversationHistoryService = new ConversationHistoryService();
export default conversationHistoryService;
