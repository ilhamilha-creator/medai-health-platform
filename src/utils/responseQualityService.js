/**
 * Service d'évaluation et d'amélioration de la qualité des réponses
 * Analyse la précision, cohérence, et réduit les hallucinations
 */

class ResponseQualityService {
  constructor() {
    this.confidenceThreshold = 0.7;
    this.ambiguityThreshold = 0.5;
    this.responseCache = new Map();
  }

  /**
   * Évalue la qualité d'une réponse avant de l'envoyer
   */
  evaluateResponse(response, context = {}) {
    const evaluation = {
      precision: this.assessPrecision(response, context),
      coherence: this.assessCoherence(response, context),
      hallucinationRisk: this.assessHallucinationRisk(response, context),
      ambiguity: this.assessAmbiguity(response, context),
      completeness: this.assessCompleteness(response, context),
      overallScore: 0
    };

    // Calculer le score global
    evaluation.overallScore = (
      evaluation.precision * 0.3 +
      evaluation.coherence * 0.25 +
      (1 - evaluation.hallucinationRisk) * 0.25 +
      (1 - evaluation.ambiguity) * 0.2
    );

    return evaluation;
  }

  /**
   * Évalue la précision médicale de la réponse
   */
  assessPrecision(response, context) {
    let score = 0.5; // Score de base

    // Vérifier si la réponse contient des informations médicales spécifiques
    if (response.includes('diabète') || response.includes('diabetes')) {
      score += 0.2;
      // Vérifier si les informations sont correctes
      if (response.includes('glycémie') || response.includes('sucre')) {
        score += 0.1;
      }
    }

    if (response.includes('cardio') || response.includes('cœur')) {
      score += 0.2;
      if (response.includes('tension') || response.includes('pression')) {
        score += 0.1;
      }
    }

    // Vérifier la présence de références médicales
    if (response.includes('WHO') || response.includes('NIH') || response.includes('HAS')) {
      score += 0.1;
    }

    // Vérifier les avertissements médicaux
    if (response.includes('⚠️') || response.includes('attention') || response.includes('consultez')) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Évalue la cohérence de la réponse avec le contexte
   */
  assessCoherence(response, context) {
    let score = 0.5;

    // Vérifier la cohérence avec les messages précédents
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      const lastMessage = context.conversationHistory[context.conversationHistory.length - 1];
      
      // Vérifier si la réponse répond à la question
      if (lastMessage.toLowerCase().includes('symptôme') && response.includes('symptôme')) {
        score += 0.2;
      }
      
      if (lastMessage.toLowerCase().includes('douleur') && response.includes('douleur')) {
        score += 0.2;
      }
    }

    // Vérifier la cohérence interne de la réponse
    const sentences = response.split(/[.!?]+/);
    if (sentences.length > 1) {
      score += 0.1; // Réponse structurée
    }

    // Vérifier si la réponse contient des contradictions
    if (response.includes('mais') && response.includes('cependant')) {
      // Peut indiquer une nuance, pas forcément une contradiction
      score += 0.05;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Évalue le risque d'hallucination
   */
  assessHallucinationRisk(response, context) {
    let risk = 0.3; // Risque de base

    // Signes d'hallucination potentielle
    const hallucinationIndicators = [
      'je suis sûr que',
      'certainement',
      'absolument',
      'garanti',
      'sans aucun doute'
    ];

    hallucinationIndicators.forEach(indicator => {
      if (response.toLowerCase().includes(indicator)) {
        risk += 0.1;
      }
    });

    // Vérifier si la réponse contient des statistiques spécifiques sans source
    if (response.match(/\d+%/) && !response.includes('source') && !response.includes('étude')) {
      risk += 0.15;
    }

    // Vérifier si la réponse contient des informations très spécifiques sans contexte
    if (response.includes('exactement') || response.includes('précisément')) {
      risk += 0.1;
    }

    // Réduire le risque si la réponse contient des avertissements
    if (response.includes('peut varier') || response.includes('en général') || response.includes('environ')) {
      risk -= 0.15;
    }

    // Réduire le risque si la réponse contient des références
    if (response.includes('selon') || response.includes('d\'après') || response.includes('source')) {
      risk -= 0.2;
    }

    return Math.max(0, Math.min(risk, 1.0));
  }

  /**
   * Évalue le niveau d'ambiguïté de la réponse
   */
  assessAmbiguity(response, context) {
    let ambiguity = 0.3;

    // Signes d'ambiguïté
    const ambiguityIndicators = [
      'peut-être',
      'possiblement',
      'il se peut que',
      'dépend',
      'contexte'
    ];

    ambiguityIndicators.forEach(indicator => {
      if (response.toLowerCase().includes(indicator)) {
        ambiguity += 0.1;
      }
    });

    // Vérifier si la réponse pose des questions de clarification
    if (response.includes('?') && response.includes('pourriez-vous')) {
      ambiguity += 0.15;
    }

    // Réduire l'ambiguïté si la réponse est directe
    if (response.includes('voici') || response.includes('voici les') || response.includes('les symptômes sont')) {
      ambiguity -= 0.1;
    }

    return Math.max(0, Math.min(ambiguity, 1.0));
  }

  /**
   * Évalue la complétude de la réponse
   */
  assessCompleteness(response, context) {
    let score = 0.5;

    // Vérifier si la réponse répond à toutes les parties de la question
    if (context.userMessage) {
      const questionWords = context.userMessage.split(/\s+/);
      const responseWords = response.split(/\s+/);
      
      // Ratio de longueur (réponse / question)
      const lengthRatio = responseWords.length / Math.max(questionWords.length, 1);
      if (lengthRatio > 2 && lengthRatio < 10) {
        score += 0.2;
      }
    }

    // Vérifier si la réponse contient plusieurs sections
    if (response.includes('•') || response.includes('-') || response.includes('*')) {
      score += 0.15;
    }

    // Vérifier si la réponse a une conclusion
    if (response.includes('conclusion') || response.includes('en résumé') || response.includes('en bref')) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Améliore une réponse en fonction de l'évaluation
   */
  improveResponse(response, evaluation, context) {
    let improvedResponse = response;

    // Ajouter des avertissements si le risque d'hallucination est élevé
    if (evaluation.hallucinationRisk > 0.6) {
      improvedResponse += '\n\n⚠️ **Note :** Ces informations sont basées sur des connaissances générales et peuvent varier selon les cas individuels. Consultez toujours un professionnel de santé.';
    }

    // Ajouter des références si la précision est faible
    if (evaluation.precision < 0.6) {
      improvedResponse += '\n\n📚 **Pour en savoir plus :** Consultez les guidelines de la HAS ou de l\'OMS pour des informations à jour.';
    }

    // Ajouter des questions de clarification si l'ambiguïté est élevée
    if (evaluation.ambiguity > 0.6) {
      improvedResponse += '\n\n🔍 **Pour mieux vous aider :** Pourriez-vous me donner plus de détails sur votre situation spécifique ?';
    }

    // Ajouter un résumé si la complétude est faible
    if (evaluation.completeness < 0.6) {
      improvedResponse += '\n\n**En résumé :** Si vous avez besoin de plus d\'informations, n\'hésitez pas à poser des questions plus spécifiques.';
    }

    return improvedResponse;
  }

  /**
   * Ajoute des limites explicites à la réponse
   */
  addLimitations(response) {
    const limitations = '\n\n**⚠️ Limites de cette réponse :**\n';
    limitations += '• Je suis une IA, pas un médecin professionnel\n';
    limitations += '• Ces informations ne remplacent pas un avis médical\n';
    limitations += '• En cas d\'urgence, contactez le 15\n';
    limitations += '• Consultez toujours un professionnel de santé pour un diagnostic';

    return response + limitations;
  }

  /**
   * Détecte si une question est ambiguë et demande des clarifications
   */
  detectAmbiguityAndClarify(message, context) {
    const ambiguityIndicators = [
      'ça dépend',
      'parfois',
      'peut-être',
      'généralement',
      'souvent'
    ];

    const isAmbiguous = ambiguityIndicators.some(indicator => 
      message.toLowerCase().includes(indicator)
    );

    if (isAmbiguous) {
      return {
        isAmbiguous: true,
        clarification: 'Votre question semble avoir plusieurs interprétations possibles. Pourriez-vous préciser :',
        suggestions: [
          'Donner plus de contexte sur votre situation',
          'Spécifier les symptômes exacts',
          'Indiquer la durée du problème',
          'Mentionner vos antécédents médicaux'
        ]
      };
    }

    return { isAmbiguous: false };
  }

  /**
   * Mesure le temps de réponse
   */
  measureResponseTime(startTime, endTime) {
    const duration = endTime - startTime;
    
    return {
      duration: duration,
      category: this.categorizeResponseTime(duration),
      acceptable: duration < 3000 // 3 secondes
    };
  }

  /**
   * Catégorise le temps de réponse
   */
  categorizeResponseTime(duration) {
    if (duration < 500) return 'excellent';
    if (duration < 1000) return 'good';
    if (duration < 2000) return 'acceptable';
    if (duration < 3000) return 'slow';
    return 'very_slow';
  }

  /**
   * Génère un rapport de qualité
   */
  generateQualityReport(evaluation, responseTime) {
    return {
      overall: evaluation.overallScore,
      precision: evaluation.precision,
      coherence: evaluation.coherence,
      hallucinationRisk: evaluation.hallucinationRisk,
      ambiguity: evaluation.ambiguity,
      completeness: evaluation.completeness,
      responseTime: responseTime,
      timestamp: new Date().toISOString(),
      recommendation: this.getRecommendation(evaluation)
    };
  }

  /**
   * Donne une recommandation basée sur l'évaluation
   */
  getRecommendation(evaluation) {
    if (evaluation.overallScore > 0.8) {
      return 'Response quality is excellent';
    } else if (evaluation.overallScore > 0.6) {
      return 'Response quality is good with minor improvements possible';
    } else if (evaluation.overallScore > 0.4) {
      return 'Response quality is acceptable but needs improvement';
    } else {
      return 'Response quality is poor and requires significant improvement';
    }
  }
}

const responseQualityService = new ResponseQualityService();
export default responseQualityService;
