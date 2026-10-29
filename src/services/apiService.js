/**
 * Service API Unifié - Connexion au backend-unified
 * Architecture monolithique modulaire - Tous les services sur un seul backend
 */

const UNIFIED_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.apiUrl = UNIFIED_API_URL;
  }

  /**
   * Vérifier la santé du backend unifié
   */
  async checkBackendHealth() {
    const results = {
      unified: false,
      modules: {}
    };

    try {
      const response = await fetch(`${this.apiUrl}/health`);
      if (response.ok) {
        const data = await response.json();
        results.unified = true;
        results.modules = data.modules || {};
      }
    } catch (e) {
      console.log('Unified backend not available');
    }

    return results;
  }

  /**
   * Prédiction de diabète via backend-unified
   */
  async predictDiabetes(patientData) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.apiUrl}/api/ml/predict/diabetes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error('Diabetes prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Diabetes prediction error:', error);
      throw error;
    }
  }

  /**
   * Prédiction cardiovasculaire via backend-unified
   */
  async predictCardiovascular(patientData) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.apiUrl}/api/ml/predict/cardiovascular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error('Cardiovascular prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Cardiovascular prediction error:', error);
      throw error;
    }
  }

  /**
   * Analyse complète de tous les risques via backend-unified
   */
  async predictComprehensive(patientData) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.apiUrl}/api/ml/predict/comprehensive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error('Comprehensive prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Comprehensive prediction error:', error);
      throw error;
    }
  }

  /**
   * Chat avec l'IA médicale via backend-unified (chatbot module)
   */
  async chatWithAI(message, conversationHistory = [], patientData = null) {
    try {
      const token = localStorage.getItem('accessToken');
      const payload = {
        message,
        conversation_history: conversationHistory,
        use_rag: true,
        use_memory: true
      };

      const response = await fetch(`${this.apiUrl}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }

  /**
   * Analyse de symptômes via backend-unified
   */
  async analyzeSymptoms(symptoms, patientData = null) {
    try {
      const token = localStorage.getItem('accessToken');
      const payload = {
        symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
        severity: 'moderate'
      };

      const response = await fetch(`${this.apiUrl}/api/chatbot/analyze-symptoms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Symptom analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Symptom analysis error:', error);
      throw error;
    }
  }

  /**
   * Obtenir les informations du modèle ML
   */
  async getModelInfo() {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      if (!response.ok) {
        throw new Error('Model info failed');
      }

      const data = await response.json();
      return {
        ml_available: data.modules?.ml_service === 'active',
        models: ['diabetes', 'cardiovascular', 'cancer', 'kidney', 'liver', 'thyroid', 'respiratory'],
        ml_techniques: ['XGBoost', 'Gradient Boosting'],
        performance: {
          accuracy: '0.94-0.96',
          sensitivity: '92-94%',
          specificity: '94-96%'
        }
      };
    } catch (error) {
      console.error('Model info error:', error);
      return {
        ml_available: false,
        models: [],
        ml_techniques: [],
        performance: {}
      };
    }
  }

  /**
   * Créer un rendez-vous via backend-unified
   */
  async createAppointment(appointmentData) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.apiUrl}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(appointmentData)
      });

      if (!response.ok) {
        throw new Error('Appointment creation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Appointment creation error:', error);
      throw error;
    }
  }

  /**
   * Obtenir les rendez-vous d'un patient via backend-unified
   */
  async getAppointments(patientId) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.apiUrl}/api/appointments`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        throw new Error('Get appointments failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Get appointments error:', error);
      throw error;
    }
  }

  /**
   * Créer un dossier médical
   */
  async createMedicalRecord(recordData) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.apiUrl}/api/medical-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(recordData)
      });

      if (!response.ok) {
        throw new Error('Medical record creation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Medical record creation error:', error);
      throw error;
    }
  }

  /**
   * Obtenir les dossiers médicaux d'un patient
   */
  async getMedicalRecords(patientId) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.apiUrl}/api/medical-records/${patientId}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        throw new Error('Get medical records failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Get medical records error:', error);
      throw error;
    }
  }

  /**
   * Sauvegarder les données de santé d'un patient
   */
  async saveHealthData(patientId, healthData) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.apiUrl}/api/health-data/${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(healthData)
      });

      if (!response.ok) {
        throw new Error('Health data save failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Health data save error:', error);
      throw error;
    }
  }

  /**
   * Obtenir les données de santé d'un patient
   */
  async getHealthData(patientId) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.apiUrl}/api/health-data/${patientId}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        throw new Error('Get health data failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Get health data error:', error);
      throw error;
    }
  }

  /**
   * Uploader un fichier médical pour analyse vision
   */
  async uploadMedicalFile(file, imageType = 'xray') {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.apiUrl}/api/vision/analyze/${imageType}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;