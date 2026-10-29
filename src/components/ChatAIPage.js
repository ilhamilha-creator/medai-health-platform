import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  User, 
  Bot, 
  Send, 
  Activity, 
  FileText, 
  LogOut, 
  Shield, 
  Heart, 
  Info 
} from 'lucide-react';

export default function ChatAIPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDoctorView] = useState(user?.userType === 'doctor');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! 😊 I am your personal medical AI assistant.\n\n**I am here to help you with:**\n🔍 **Careful analysis** of your symptoms\n📊 **Reliable health evaluations**\n💊 **Clear medical advice** based on evidence\n🎯 **Personalized follow-up** for your situation\n\nI work as a medical counselor: ask me your questions in natural language and I will respond with care and empathy.\n\n**How can I help you today?** Feel free to describe your symptoms or health concerns!",
      timestamp: new Date().toLocaleTimeString(),
      status: 'delivered'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [patientData, setPatientData] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load patient data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem('patientData');
    if (savedData) {
      try {
        setPatientData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing patient data:', error);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getFallbackResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Pattern matching for common medical queries
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('ache')) {
      return "I understand you're experiencing pain. Here are some general guidelines:\n\n• If the pain is severe or sudden, seek immediate medical attention\n• For mild pain, rest and over-the-counter pain relievers may help\n• Keep track of when the pain occurs and what makes it better/worse\n• Stay hydrated and rest as much as possible\n\n⚠️ **This is general information only. Please consult a healthcare provider for proper diagnosis and treatment.**";
    }
    
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || lowerMessage.includes('hot')) {
      return "Regarding fever symptoms:\n\n• Normal body temperature is around 37°C (98.6°F)\n• A fever is generally considered 38°C (100.4°F) or higher\n• Rest, stay hydrated, and monitor your temperature\n• Seek medical attention if fever exceeds 39°C (102.2°F) or lasts more than 3 days\n\n⚠️ **This is general information only. Please consult a healthcare provider for proper diagnosis and treatment.**";
    }
    
    if (lowerMessage.includes('diabetes') || lowerMessage.includes('sugar') || lowerMessage.includes('glucose')) {
      return "Regarding diabetes and blood sugar:\n\n• Normal fasting blood sugar: 70-99 mg/dL\n• Normal post-meal blood sugar: less than 140 mg/dL\n• Regular monitoring, balanced diet, and exercise are important\n• Limit sugary foods and refined carbohydrates\n\n⚠️ **This is general information only. Please consult a healthcare provider for proper diagnosis and treatment.**";
    }
    
    if (lowerMessage.includes('heart') || lowerMessage.includes('cardio') || lowerMessage.includes('chest')) {
      return "Regarding heart and cardiovascular health:\n\n• Maintain a healthy diet low in saturated fats\n• Regular physical activity (30 minutes most days)\n• Manage stress and get adequate sleep\n• Monitor blood pressure regularly\n• Don't smoke and limit alcohol consumption\n\n⚠️ **If you experience chest pain, shortness of breath, or other cardiac symptoms, seek immediate medical attention.**";
    }
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('migraine')) {
      return "For headaches and migraines:\n\n• Rest in a quiet, dark room\n• Stay hydrated\n• Over-the-counter pain relievers may help\n• Identify and avoid triggers (certain foods, stress, lack of sleep)\n• Keep a headache diary to track patterns\n\n⚠️ **Seek medical attention for severe, sudden, or persistent headaches.**";
    }
    
    if (lowerMessage.includes('tired') || lowerMessage.includes('fatigue') || lowerMessage.includes('exhausted')) {
      return "Regarding fatigue and tiredness:\n\n• Ensure you're getting 7-9 hours of quality sleep\n• Stay hydrated and eat a balanced diet\n• Regular physical activity can boost energy levels\n• Manage stress and take breaks when needed\n• Persistent fatigue may indicate underlying health issues\n\n⚠️ **If fatigue persists or affects daily life, consult a healthcare provider.**";
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('analyze') || lowerMessage.includes('assessment')) {
      return "For a comprehensive health risk assessment, I recommend:\n\n• Using our Medical Analysis feature for detailed evaluation\n• Regular health check-ups with your healthcare provider\n• Monitoring vital signs like blood pressure, heart rate, and blood sugar\n• Maintaining a healthy lifestyle with proper diet and exercise\n\nWould you like me to guide you through our medical analysis tools?";
    }
    
    // Default response
    return "I understand your concern. As an AI medical assistant, I can provide general health information and guidance, but I cannot replace professional medical advice.\n\nFor proper diagnosis and treatment, please consult with a qualified healthcare provider who can examine you in person.\n\nIs there a specific health topic you'd like me to provide general information about?";
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      status: 'sent'
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      // Prepare conversation history
      const conversationHistory = messages
        .filter(m => m.type !== 'ai' || m.id !== 1) // Exclude initial greeting
        .map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content
        }));
      
      // Try real backend chatbot with LLM
      let response;
      try {
        response = await fetch(`${API_URL}/api/chatbot/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({
            message: inputMessage,
            conversation_history: conversationHistory,
            use_rag: true,
            use_memory: true
          })
        });
      } catch (networkError) {
        console.log('Backend not available, using fallback response');
        response = null;
      }
      
      if (response && !response.ok) {
        throw new Error('Error communicating with chatbot');
      }
      
      setIsTyping(false);
      
      // Use fallback response if backend unavailable
      let content;
      if (response) {
        const chatbotResponse = await response.json();
        content = chatbotResponse.response;
      } else {
        // Fallback response when backend is unavailable
        content = getFallbackResponse(inputMessage);
      }
      
      // Add contextual suggestions
      const lowerMessage = inputMessage.toLowerCase();
      if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
        content += "\n\n**💡 Additional suggestions:**\n• Would you like me to help assess your health risks?\n• Do you want to complete a full medical analysis?\n• Do you have specific questions about these symptoms?";
      }
      
      if (lowerMessage.includes('risk') || lowerMessage.includes('analyze') || lowerMessage.includes('assessment')) {
        content += "\n\n**🔬 For a complete analysis:**\n• Click on 'Analysis' button above\n• Or tell me 'start analysis' to begin";
      }
      
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: content,
        timestamp: new Date().toLocaleTimeString(),
        status: 'delivered'
      };

      setMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      const errorResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: "❌ An error occurred. Please try again. If the problem persists, the AI system may be temporarily unavailable.",
        timestamp: new Date().toLocaleTimeString(),
        status: 'error'
      };

      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNewAnalysis = () => {
    navigate('/medical-analysis');
  };

  const handleViewResults = () => {
    navigate('/analysis-results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-medical-green" />
            <h1 className="text-2xl font-bold text-white">Medical AI Assistant</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewAnalysis}
              className="px-4 py-2 bg-medical-green/20 border border-medical-green/30 rounded-lg text-medical-green hover:bg-medical-green/30 transition-all duration-300 flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Analysis</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewResults}
              className="px-4 py-2 bg-medical-blue/20 border border-medical-blue/30 rounded-lg text-medical-light-blue hover:bg-medical-blue/30 transition-all duration-300 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Results</span>
            </motion.button>
            <div className="text-right">
              <p className="text-sm text-medical-white/60">{user?.name || 'User'}</p>
              <p className="text-xs text-medical-light-blue font-medium">
                {isDoctorView ? 'Doctor' : 'Patient'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column - Chat */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="medical-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-medical-green rounded-full animate-pulse"></div>
                    <span className="text-sm text-medical-white/80">Medical AI Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-medical-light-blue" />
                    <span className="text-sm text-medical-white/80">ML: Advanced + Fallback</span>
                  </div>
                </div>
                {Object.keys(patientData).length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-medical-white/80">Data Available</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="medical-card"
              style={{ height: '500px' }}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Conversation</h3>
                  <div className="text-xs text-medical-white/60">
                    {messages.length} messages
                  </div>
                </div>
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                    >
                      <div className={`flex items-start space-x-3 w-full ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`p-2 rounded-lg ${message.type === 'user' ? 'bg-medical-blue' : 'bg-white/10 border border-white/20'} flex-shrink-0`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-medical-green" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`inline-block p-3 rounded-lg w-full ${
                            message.type === 'user' 
                              ? 'bg-medical-blue text-white rounded-br-none' 
                              : 'bg-white/10 border border-white/20 text-white rounded-bl-none'
                          }`}>
                            <div className="whitespace-pre-line leading-relaxed text-sm">{message.content}</div>
                          </div>
                          <div className={`text-xs text-medical-white/60 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start w-full"
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div className="p-2 rounded-lg bg-white/10 border border-white/20 flex-shrink-0">
                          <Bot className="w-4 h-4 text-medical-green" />
                        </div>
                        <div className="flex-1">
                          <div className="inline-block p-3 rounded-lg bg-white/10 border border-white/20 text-white rounded-bl-none w-full">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-medical-white rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-medical-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-medical-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-medical-white/80">AI analyzing...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </motion.div>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="medical-card"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your symptoms or ask your question..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-medical-green resize-none text-white placeholder-medical-white/60 text-sm leading-relaxed"
                      rows={2}
                      disabled={isTyping}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                      !inputMessage.trim() || isTyping
                        ? 'bg-white/10 text-medical-white/40 cursor-not-allowed border border-white/20'
                        : 'medical-button'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </motion.button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInputMessage("I have chest pain and feel short of breath")}
                    className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-300 rounded-full text-xs hover:bg-red-500/30 transition-colors"
                  >
                    🚨 Chest Pain
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInputMessage("I'm thirsty, urinate frequently, and feel very tired")}
                    className="px-2 py-1 bg-medical-blue/20 border border-medical-blue/30 text-medical-light-blue rounded-full text-xs hover:bg-medical-blue/30 transition-colors"
                  >
                    🩸 Diabetes Symptoms
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInputMessage("Assess my health risks")}
                    className="px-2 py-1 bg-medical-green/20 border border-medical-green/30 text-medical-green rounded-full text-xs hover:bg-medical-green/30 transition-colors"
                  >
                    📊 Risk Assessment
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInputMessage("Advice for preventing cardiovascular disease")}
                    className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-xs hover:bg-purple-500/30 transition-colors"
                  >
                    ❤️ Cardio Prevention
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Side Column - Info and Actions */}
          <div className="space-y-6">
            
            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="medical-card"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-medical-light-blue" />
                  <h3 className="font-semibold text-medical-light-blue">AI Capabilities</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-medical-green rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-sm text-white font-medium">Intelligent Analysis</p>
                      <p className="text-xs text-medical-white/60">Advanced pattern recognition</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-medical-green rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-sm text-white font-medium">Contextual Responses</p>
                      <p className="text-xs text-medical-white/60">Tailored to your situation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-medical-green rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-sm text-white font-medium">Fallback System</p>
                      <p className="text-xs text-medical-white/60">Works even when backend is offline</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-medical-green rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-sm text-white font-medium">Safe Responses</p>
                      <p className="text-xs text-medical-white/60">Always recommends professional consultation</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="medical-card border-l-4 border-l-yellow-500"
            >
              <div className="flex items-start space-x-2">
                <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-400 text-sm mb-1">Medical Disclaimer</h4>
                  <p className="text-xs text-medical-white/70 leading-relaxed">
                    This AI assistant provides general health information only and cannot replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="medical-card"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-medical-white/70">Backend Status</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-xs text-yellow-400">Fallback Mode</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-medical-white/70">Response Mode</span>
                  <span className="text-xs text-medical-green">Pattern Matching</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-medical-white/70">Response Time</span>
                  <span className="text-xs text-medical-white/60">Instant</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}