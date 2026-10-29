/**
 * Unified Backend Integration Service
 * Connects frontend to unified backend with LLM capabilities
 * Single backend architecture - all services in one place
 */

const UNIFIED_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ADTCService {
  /**
   * Check backend health
   */
  async getPerformanceMetrics() {
    try {
      const response = await fetch(`${UNIFIED_API_URL}/api/llm/performance`);
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('ADTC Performance Metrics failed:', error);
      console.error('ADTC Health check failed:', error);
      return {
        success: false,
        error: 'Backend not connected. Start with: python backend-unified/app.py'
      };
    }
  }

  /**
   * Send chat message to local LLM
   */
  async chat(message, conversationHistory = [], useRAG = true) {
    try {
      const payload = {
        message: message,
        conversation_history: conversationHistory,
        use_rag: useRAG
      };

      const response = await fetch(`${UNIFIED_API_URL}/api/llm/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      return {
        success: true,
        response: data.response,
        sources: data.sources || [],
        metrics: {
          memoryUsedGb: data.memory_used_gb,
          temperatureC: data.temperature_c,
          tokensPerSecond: data.tokens_per_second
        }
      };
    } catch (error) {
      console.error('ADTC Chat failed:', error);
      return {
        success: false,
        error: 'Failed to connect to unified backend'
      };
    }
  }

  /**
   * Medical symptom analysis via backend-unified
   */
  async analyzeSymptoms(symptoms) {
    try {
      const token = localStorage.getItem('accessToken');
      const payload = {
        message: symptoms
      };

      const response = await fetch(`${UNIFIED_API_URL}/api/llm/analyze-symptoms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      return {
        success: true,
        response: data.analysis,
        urgencyLevel: data.urgency_level || 'low'
      };
    } catch (error) {
      console.error('ADTC Analysis failed:', error);
      return {
        success: false,
        error: 'Failed to analyze symptoms'
      };
    }
  }

  /**
   * Check health of backend-unified
   */
  async checkHealth() {
    try {
      const response = await fetch(`${UNIFIED_API_URL}/api/llm/health`);
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('ADTC Health check failed:', error);
      return {
        success: false,
        error: 'Backend not connected. Start with: python backend-unified/app.py'
      };
    }
  }

  /**
   * Get performance metrics for display
   */
  async getMetrics() {
    const health = await this.checkHealth();
    if (health.success) {
      return {
        memory: health.data.memory_gb,
        modelLoaded: health.data.model_loaded,
        ragLoaded: health.data.rag_loaded
      };
    }
    return null;
  }
}

// Export singleton instance
const adtcService = new ADTCService();
export default adtcService;
