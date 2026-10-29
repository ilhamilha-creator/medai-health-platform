import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import databaseService from '../services/databaseService';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle,
  Phone,
  Video,
  Search,
  Check,
  CheckCheck
} from 'lucide-react';

export default function MessagingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.user.id);
      // Marquer les messages comme lus
      databaseService.markMessagesAsRead(selectedConversation.user.id, user.id);
    }
  }, [selectedConversation, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = () => {
    if (user) {
      const userConversations = databaseService.getConversationsForUser(user.id);
      setConversations(userConversations);
    }
  };

  const loadMessages = (otherUserId) => {
    const conversationMessages = databaseService.getConversation(user.id, otherUserId);
    setMessages(conversationMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const messageData = {
        senderId: user.id,
        receiverId: selectedConversation.user.id,
        content: newMessage.trim()
      };

      databaseService.sendMessage(messageData);
      setMessages([...messages, messageData]);
      setNewMessage('');
      
      // Mettre à jour la conversation
      loadConversations();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
      <div className="flex h-screen">
        {/* Sidebar - Conversations List */}
        <div className="w-80 bg-white/10 backdrop-blur-lg border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </motion.button>
                <h1 className="text-xl font-bold text-white">Messages</h1>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-white/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 rounded-lg text-white placeholder-medical-white/50 border border-white/20 focus:border-medical-green focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-medical-white/50 mx-auto mb-4" />
                <p className="text-medical-white/70">Aucune conversation</p>
              </div>
            ) : (
              filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-white/10 cursor-pointer transition-all duration-200 ${
                    selectedConversation?.user.id === conversation.user.id
                      ? 'bg-medical-green/20 border-medical-green/50'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-medical-green to-medical-blue rounded-full flex items-center justify-center text-white font-bold">
                      {conversation.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white truncate">
                          {conversation.user.name}
                        </h3>
                        <span className="text-xs text-medical-white/50">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-medical-white/70 truncate">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-medical-green text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-medical-white/50 mt-1">
                        {conversation.user.userType === 'doctor' ? 
                          `Dr. ${conversation.user.profile?.specialty || 'Médecin'}` : 
                          'Patient'
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-medical-green to-medical-blue rounded-full flex items-center justify-center text-white font-bold">
                      {selectedConversation.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">
                        {selectedConversation.user.name}
                      </h2>
                      <p className="text-sm text-medical-white/70">
                        {selectedConversation.user.userType === 'doctor' ? 
                          `Dr. ${selectedConversation.user.profile?.specialty || 'Médecin'}` : 
                          'Patient'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Phone className="w-5 h-5 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Video className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                      message.senderId === user.id
                        ? 'bg-medical-green text-white'
                        : 'bg-white/20 text-white backdrop-blur-lg'
                    } rounded-2xl px-4 py-3`}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                        message.senderId === user.id ? 'text-medical-green/100' : 'text-medical-white/50'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.senderId === user.id && (
                          message.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/20 text-white rounded-2xl px-4 py-3 backdrop-blur-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white/10 backdrop-blur-lg border-t border-white/20 p-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-3 bg-white/10 rounded-lg text-white placeholder-medical-white/50 border border-white/20 focus:border-medical-green focus:outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-medical-green text-white rounded-lg hover:bg-medical-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            // No conversation selected
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-medical-white/50 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Sélectionnez une conversation</h2>
                <p className="text-medical-white/70">Choisissez une conversation dans la liste pour commencer à discuter</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
