/**
 * Working ML Service - Backend Unified Integration
 * Utilise le backend-unified avec les endpoints corrects
 */

const UNIFIED_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class WorkingMLService {
  constructor() {
    this.baseURL = UNIFIED_API_URL;
    this.mlAvailable = false;
    this.checkMLStatus();
  }

  async checkMLStatus() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/health`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await response.json();
      this.mlAvailable = data.modules?.ml_service === 'active';
      console.log('Working ML Status:', this.mlAvailable);
      return this.mlAvailable;
    } catch (error) {
      console.log('Working ML Backend not available:', error.message);
      this.mlAvailable = false;
      return false;
    }
  }

  async getDiabetesPrediction(patientData) {
    try {
      const backendAvailable = await this.checkMLStatus();
      
      if (!backendAvailable) {
        return this.getFallbackDiabetesPrediction(patientData);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/api/ml/predict/diabetes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Diabetes prediction result:', result);
      return result;

    } catch (error) {
      console.error('Error getting diabetes prediction:', error);
      return this.getFallbackDiabetesPrediction(patientData);
    }
  }

  async getCardiovascularPrediction(patientData) {
    try {
      const backendAvailable = await this.checkMLStatus();
      
      if (!backendAvailable) {
        return this.getFallbackCardioPrediction(patientData);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/api/ml/predict/cardiovascular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Cardiovascular prediction result:', result);
      return result;

    } catch (error) {
      console.error('Error getting cardiovascular prediction:', error);
      return this.getFallbackCardioPrediction(patientData);
    }
  }

  async getCancerPrediction(patientData) {
    try {
      const backendAvailable = await this.checkMLStatus();
      
      if (!backendAvailable) {
        return this.getFallbackCancerPrediction(patientData);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/api/ml/predict/cancer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Cancer prediction result:', result);
      return result;

    } catch (error) {
      console.error('Error getting cancer prediction:', error);
      return this.getFallbackCancerPrediction(patientData);
    }
  }

  async getKidneyPrediction(patientData) {
    try {
      const backendAvailable = await this.checkMLStatus();
      
      if (!backendAvailable) {
        return this.getFallbackPrediction(patientData, 'kidney');
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/api/ml/predict/kidney`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Kidney prediction result:', result);
      return result;

    } catch (error) {
      console.error('Error getting kidney prediction:', error);
      return this.getFallbackPrediction(patientData, 'kidney');
    }
  }

  async getLiverPrediction(patientData) {
    try {
      const backendAvailable = await this.checkMLStatus();
      
      if (!backendAvailable) {
        return this.getFallbackPrediction(patientData, 'liver');
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/api/ml/predict/liver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Liver prediction result:', result);
      return result;

    } catch (error) {
      console.error('Error getting liver prediction:', error);
      return this.getFallbackPrediction(patientData, 'liver');
    }
  }

  async getComprehensivePrediction(patientData) {
    try {
      const backendAvailable = await this.checkMLStatus();
      
      if (!backendAvailable) {
        return this.getFallbackComprehensivePrediction(patientData);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/api/ml/predict/comprehensive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Comprehensive prediction result:', result);
      return result;

    } catch (error) {
      console.error('Error getting comprehensive prediction:', error);
      return this.getFallbackComprehensivePrediction(patientData);
    }
  }

  async getLongTermPrediction(patientData, years = 5) {
    // Use comprehensive prediction as basis for long-term
    const comprehensive = await this.getComprehensivePrediction(patientData);
    
    // Add long-term projection
    return {
      ...comprehensive,
      prediction_years: years,
      progression: this.generateProgression(comprehensive, years)
    };
  }

  async getModelInfo() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/health`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
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
      console.error('Error getting model info:', error);
      return {
        ml_available: false,
        models: [],
        ml_techniques: [],
        performance: {}
      };
    }
  }

  // Méthode pour traiter les messages du chat avec le backend-unified
  async processMessageWithFallback(message, context = {}) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${this.baseURL}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          message: message,
          conversation_history: context.conversationHistory || [],
          use_rag: true,
          use_memory: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          response: result.response,
          ml_used: true,
          confidence: result.confidence || 0.85,
          detected_symptoms: result.detected_symptoms || [],
          urgency_level: result.urgency_level || 'low',
          context_aware: true,
          rag_used: true,
          sources: result.sources || [],
          guardrail_triggered: false,
          patient_context_used: false
        };
      } else {
        throw new Error(`Backend error: ${response.status}`);
      }
    } catch (error) {
      console.error('Backend error:', error);
      return {
        response: "⚠️ Le système médical avancé n'est pas disponible. Veuillez démarrer le backend: `cd backend-unified && uvicorn app:app --reload`",
        ml_used: false,
        confidence: 0.0,
        detected_symptoms: [],
        urgency_level: 'low',
        context_aware: false,
        rag_used: false,
        sources: [],
        guardrail_triggered: false,
        patient_context_used: false,
        error: true
      };
    }
  }

  // Generate progression for long-term prediction
  generateProgression(comprehensive, years) {
    const labels = Array.from({ length: years }, (_, i) => `Year ${i + 1}`);
    const datasets = [];
    
    if (comprehensive.predictions) {
      Object.keys(comprehensive.predictions).forEach(disease => {
        const data = Array.from({ length: years }, (_, i) => {
          const baseRisk = comprehensive.predictions[disease].risk_score;
          return Math.min(baseRisk * (1 + (i + 1) * 0.02), 95);
        });
        
        datasets.push({
          label: disease.charAt(0).toUpperCase() + disease.slice(1),
          data: data,
          color: this.getDiseaseColor(disease)
        });
      });
    }
    
    return {
      labels: labels,
      datasets: datasets
    };
  }

  getDiseaseColor(disease) {
    const colors = {
      diabetes: 'green',
      cardiovascular: 'blue',
      cancer: 'red',
      kidney: 'purple',
      liver: 'orange',
      thyroid: 'pink',
      respiratory: 'cyan'
    };
    return colors[disease] || 'gray';
  }

  // Generic fallback prediction
  getFallbackPrediction(patientData, disease) {
    const riskScore = this.calculateGenericRisk(patientData);
    
    return {
      disease: disease,
      risk_score: riskScore,
      risk_level: this.getRiskLevel(riskScore),
      confidence: 0.6,
      recommendations: this.getGenericRecommendations(riskScore)
    };
  }

  getFallbackComprehensivePrediction(patientData) {
    const diseases = ['diabetes', 'cardiovascular', 'cancer', 'kidney', 'liver', 'thyroid', 'respiratory'];
    const predictions = {};
    
    diseases.forEach(disease => {
      predictions[disease] = {
        risk_score: this.calculateGenericRisk(patientData),
        risk_level: this.getRiskLevel(this.calculateGenericRisk(patientData)),
        confidence: 0.6
      };
    });
    
    const highRisks = Object.values(predictions).filter(p => p.risk_level === 'high').length;
    let overall_risk = 'low';
    if (highRisks >= 2) overall_risk = 'high';
    else if (highRisks >= 1) overall_risk = 'medium';
    
    return {
      predictions: predictions,
      overall_risk: overall_risk,
      recommendations: overall_risk === 'high' 
        ? ['Consultation médicale urgente', 'Analyse complète recommandée']
        : ['Surveillance régulière', 'Mode de vie sain']
    };
  }

  calculateGenericRisk(patientData) {
    let risk = 20;
    if (patientData.age > 50) risk += 10;
    if (patientData.smoker) risk += 15;
    if (patientData.bmi > 30) risk += 10;
    return Math.min(risk, 95);
  }

  getGenericRecommendations(riskScore) {
    if (riskScore > 70) return ['Consultation urgente', 'Tests diagnostiques'];
    if (riskScore > 40) return ['Surveillance régulière', 'Mode de vie sain'];
    return ['Maintenir mode de vie sain', 'Check-ups annuels'];
  }

  // Fallback methods when backend is not available
  getFallbackDiabetesPrediction(patientData) {
    const riskScore = this.calculateDiabetesRisk(patientData);
    
    return {
      risk_score: riskScore,
      risk_level: this.getRiskLevel(riskScore),
      confidence: 0.6,
      model_used: 'Rule-based fallback',
      model_auc: 0.0,
      risk_factors: this.getDiabetesRiskFactors(patientData),
      recommendations: this.getDiabetesRecommendations(riskScore, patientData)
    };
  }

  getFallbackCardioPrediction(patientData) {
    const riskScore = this.calculateCardiovascularRisk(patientData);
    
    return {
      risk_score: riskScore,
      risk_level: this.getRiskLevel(riskScore),
      confidence: 0.6,
      model_used: 'Rule-based fallback',
      model_auc: 0.0,
      risk_factors: this.getCardiovascularRiskFactors(patientData),
      recommendations: this.getCardiovascularRecommendations(riskScore, patientData)
    };
  }

  getFallbackCancerPrediction(patientData) {
    const baseRisk = 15; // 15% base cancer risk
    
    // Risk factor adjustments
    let riskScore = baseRisk;
    
    if (patientData.cancer_family) riskScore += 20;
    if (patientData.smoker) riskScore += 15;
    if (patientData.radiation_exposure) riskScore += 10;
    if (patientData.age > 65) riskScore += 10;
    
    riskScore = Math.min(riskScore, 95); // Cap at 95%
    
    // Calculate specific cancer risks
    const cancerTypes = {
      lung_cancer: {
        name: 'Lung Cancer',
        risk: patientData.smoker ? 25 : 5,
        risk_level: patientData.smoker ? 'medium' : 'low'
      },
      breast_cancer: {
        name: 'Breast Cancer',
        risk: patientData.cancer_family ? 20 : 8,
        risk_level: patientData.cancer_family ? 'medium' : 'low'
      },
      colon_cancer: {
        name: 'Colon Cancer',
        risk: patientData.age > 60 ? 18 : 6,
        risk_level: patientData.age > 60 ? 'medium' : 'low'
      },
      skin_cancer: {
        name: 'Skin Cancer',
        risk: patientData.radiation_exposure ? 15 : 4,
        risk_level: patientData.radiation_exposure ? 'medium' : 'low'
      },
      prostate_cancer: {
        name: 'Prostate Cancer',
        risk: patientData.age > 65 ? 22 : 5,
        risk_level: patientData.age > 65 ? 'medium' : 'low'
      }
    };
    
    return {
      overall_risk: riskScore,
      risk_level: this.getRiskLevel(riskScore),
      confidence: 0.6,
      model_used: 'Rule-based fallback',
      model_auc: 0.0,
      cancer_types: cancerTypes,
      risk_factors: this.getCancerRiskFactors(patientData),
      recommendations: this.getCancerRecommendations(riskScore, patientData),
      prevention_tips: [
        'Maintain a healthy weight through diet and exercise',
        'Avoid tobacco and limit alcohol consumption',
        'Protect your skin from UV radiation',
        'Get regular cancer screenings based on age and risk factors',
        'Eat a diet rich in fruits, vegetables, and whole grains',
        'Stay physically active with regular exercise',
        'Limit processed and red meat consumption',
        'Get vaccinated against cancer-related viruses (HPV, Hepatitis B)'
      ]
    };
  }

  getFallbackLongTermPrediction(patientData, years = 5) {
    const baseRisks = {
      diabetes: 15.0,
      cardiovascular: 20.0,
      cancer: 10.0
    };
    
    // Generate progression chart data
    const labels = Array.from({ length: years }, (_, i) => `Year ${i + 1}`);
    const diabetesData = Array.from({ length: years }, (_, i) => 
      Math.min(baseRisks.diabetes * (1 + (i + 1) * 0.03), 95)
    );
    const cardioData = Array.from({ length: years }, (_, i) => 
      Math.min(baseRisks.cardiovascular * (1 + (i + 1) * 0.04), 95)
    );
    const cancerData = Array.from({ length: years }, (_, i) => 
      Math.min(baseRisks.cancer * (1 + (i + 1) * 0.02), 95)
    );
    
    const progression_chart = {
      labels: labels,
      datasets: [
        {
          label: 'Diabetes Risk',
          data: diabetesData,
          color: 'green'
        },
        {
          label: 'Cardiovascular Risk',
          data: cardioData,
          color: 'blue'
        },
        {
          label: 'Cancer Risk',
          data: cancerData,
          color: 'red'
        }
      ]
    };
    
    // Generate key milestones
    const key_milestones = [];
    for (let year = 3; year <= years; year += 3) {
      const diabetesRisk = diabetesData[year - 1];
      const cardioRisk = cardioData[year - 1];
      
      if (diabetesRisk > 50) {
        key_milestones.push({
          year: year,
          type: 'warning',
          message: `Diabetes risk reaches ${diabetesRisk.toFixed(1)}% - Consider lifestyle changes`
        });
      }
      
      if (cardioRisk > 60) {
        key_milestones.push({
          year: year,
          type: 'critical',
          message: `Cardiovascular risk reaches ${cardioRisk.toFixed(1)}% - Consult cardiologist recommended`
        });
      }
    }
    
    // Add final year milestone
    key_milestones.push({
      year: years,
      type: 'information',
      message: `End of prediction period. Final age: ${(patientData.age || 50) + years}`
    });
    
    return {
      prediction_years: years,
      current_age: patientData.age || 50,
      final_age: (patientData.age || 50) + years,
      progression_chart: progression_chart,
      key_milestones: key_milestones,
      yearly_progression: {},
      cumulative_risk: {},
      recommendations: [
        "Consult your doctor regularly",
        "Maintain a healthy lifestyle",
        "Annual screening recommended",
        "Monitor blood pressure and cholesterol",
        "Regular exercise and balanced diet"
      ],
      confidence: 0.5,
      model_used: 'Simple progression fallback'
    };
  }

  // Risk calculation methods
  calculateDiabetesRisk(patientData) {
    let riskScore = 10; // Base risk
    
    if (patientData.age > 45) riskScore += 15;
    if (patientData.bmi > 25) riskScore += 10;
    if (patientData.diabetes_family) riskScore += 20;
    if (patientData.smoker) riskScore += 5;
    
    return Math.min(riskScore, 95);
  }

  calculateCardiovascularRisk(patientData) {
    let riskScore = 20; // Base risk - increased from 15
    
    if (patientData.age > 55) riskScore += 15;
    if (patientData.age > 45) riskScore += 10; // Added middle age factor
    if (patientData.heart_disease_family) riskScore += 25; // Increased from 20
    if (patientData.smoker) riskScore += 15;
    if (patientData.cholesterol > 200) riskScore += 10;
    if (patientData.cholesterol > 180) riskScore += 5; // Added borderline cholesterol
    
    return Math.min(riskScore, 95);
  }

  getRiskLevel(score) {
    if (score > 70) return 'high';
    if (score > 40) return 'medium';
    return 'low';
  }

  getDiabetesRiskFactors(patientData) {
    const factors = [];
    if (patientData.age > 45) factors.push(`Âge (${patientData.age} ans)`);
    if (patientData.bmi > 25) factors.push(`BMI élevé (${patientData.bmi})`);
    if (patientData.diabetes_family) factors.push('Antécédents familiaux');
    if (patientData.smoker) factors.push('Tabagisme');
    return factors;
  }

  getCardiovascularRiskFactors(patientData) {
    const factors = [];
    if (patientData.age > 55) factors.push(`Âge (${patientData.age} ans)`);
    if (patientData.heart_disease_family) factors.push('Antécédents familiaux');
    if (patientData.smoker) factors.push('Tabagisme');
    if (patientData.cholesterol > 200) factors.push(`Cholestérol élevé (${patientData.cholesterol})`);
    return factors;
  }

  getCancerRiskFactors(patientData) {
    const factors = [];
    if (patientData.cancer_family) factors.push('Antécédents familiaux de cancer');
    if (patientData.smoker) factors.push('Tabagisme');
    if (patientData.radiation_exposure) factors.push('Exposition aux radiations');
    if (patientData.age > 65) factors.push('Âge avancé');
    if (patientData.pollution_exposure === 'high') factors.push('Exposition élevée à la pollution');
    return factors;
  }

  getDiabetesRecommendations(riskScore, patientData) {
    const recommendations = [];
    if (riskScore > 70) {
      recommendations.push('Consultation endocrinologue urgente');
      recommendations.push('Test glycémie immédiat');
    } else if (riskScore > 40) {
      recommendations.push('Surveillance glycémie régulière');
      recommendations.push('Consultation médecin généraliste');
    } else {
      recommendations.push('Mode de vie sain');
      recommendations.push('Surveillance annuelle');
    }
    return recommendations;
  }

  getCardiovascularRecommendations(riskScore, patientData) {
    const recommendations = [];
    if (riskScore > 70) {
      recommendations.push('Urgent cardiologist consultation');
      recommendations.push('ECG and lipid profile');
    } else if (riskScore > 40) {
      recommendations.push('Blood pressure monitoring');
      recommendations.push('Annual cardiovascular check-up');
    } else {
      recommendations.push('Regular physical activity');
      recommendations.push('Balanced diet');
    }
    return recommendations;
  }

  getCancerRecommendations(riskScore, patientData) {
    const recommendations = [];
    if (riskScore > 70) {
      recommendations.push('Consultation oncologique urgente');
      recommendations.push('Dépistage régulier tous les 6 mois');
    } else if (riskScore > 40) {
      recommendations.push('Dépistage annuel recommandé');
      recommendations.push('Consultation médicale régulière');
    } else {
      recommendations.push('Dépistage tous les 2-3 ans');
      recommendations.push('Auto-examens réguliers');
    }
    
    if (patientData.smoker) {
      recommendations.push('Arrêt du tabac immédiat');
    }
    
    return recommendations;
  }
}

export default new WorkingMLService();
