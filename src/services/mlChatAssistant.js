/**
 * ML-Powered Intelligent Chat Assistant
 * Advanced conversational AI with machine learning capabilities
 */

import contextualResponseService from './contextualResponseService.js';

class MLChatAssistant {
  constructor() {
    this.conversationHistory = [];
    this.userProfile = {};
    this.medicalKnowledge = {
      symptoms: {
        headache: {
          keywords: ['mal de tête', 'céphalée', 'douleur tête', 'migraine'],
          causes: ['Stress', 'Déshydratation', 'Fatigue', 'Problèmes vue', 'Tension'],
          urgency: 'low',
          questions: [
            'Depuis quand avez-vous ce mal de tête ?',
            'La douleur est-elle pulsatile ou constante ?',
            'Avez-vous des nausées ou des vomissements ?',
            'Y a-t-il des facteurs déclenchants ?'
          ],
          advice: {
            low: 'Reposez-vous, hydratez-vous, évitez les écrans',
            medium: 'Prenez un antalgique en vente libre, consultez si persiste',
            high: 'Consultez un médecin rapidement'
          }
        },
        chest_pain: {
          keywords: ['douleur poitrine', 'douleur thoracique', 'oppression', 'brûlure poitrine'],
          causes: ['Angine', 'Infarctus', 'Anxiété', 'Reflux', 'Musculaire'],
          urgency: 'high',
          questions: [
            'La douleur est-elle soudaine ou progressive ?',
            'Irradie-t-elle vers le bras ou la mâchoire ?',
            'Avez-vous des sueurs ou des vertiges ?',
            'Êtes-vous essoufflé ?'
          ],
          advice: {
            high: 'APPELEZ LE 15 IMMÉDIATEMENT - Urgence vitale'
          }
        },
        fever: {
          keywords: ['fièvre', 'température', 'chaud', 'frissons'],
          causes: ['Infection', 'Virus', 'Bactérie', 'Inflammation'],
          urgency: 'medium',
          questions: [
            'Quelle est votre température exacte ?',
            'Avez-vous des frissons ou des sueurs ?',
            'Y a-t-il d\'autres symptômes ?',
            'Depuis combien de temps ?'
          ],
          advice: {
            low: 'Reposez-vous, hydratez-vous, surveillez l\'évolution',
            medium: 'Prenez du paracétamol, consultez si > 38.5°C depuis 48h',
            high: 'Consultez un médecin rapidement si > 39°C'
          }
        },
        fatigue: {
          keywords: ['fatigué', 'épuisé', 'faiblesse', 'manque énergie', 'somnolence'],
          causes: ['Manque sommeil', 'Anémie', 'Stress', 'Dépression', 'Hypothyroïdie'],
          urgency: 'low',
          questions: [
            'Depuis quand ressentez-vous cette fatigue ?',
            'Avez-vous des troubles du sommeil ?',
            'Votre appétit est-il modifié ?',
            'Avez-vous perdu du poids ?'
          ],
          advice: {
            low: 'Améliorez votre hygiène de vie, sommeil, alimentation',
            medium: 'Consultez pour bilan sanguin si persiste > 2 semaines',
            high: 'Consultez rapidement si fatigue extrême avec autres symptômes'
          }
        }
      },
      conditions: {
        diabetes: {
          keywords: ['diabète', 'sucre', 'glycémie', 'insuline'],
          description: 'Le diabète est une maladie chronique caractérisée par un excès de sucre dans le sang',
          symptoms: ['Soif intense', 'Urinations fréquentes', 'Fatigue', 'Perte poids', 'Vision trouble'],
          risk_factors: ['Excès poids', 'Sédentarité', 'Antécédents familiaux', 'Âge > 45 ans'],
          prevention: ['Poids santé', 'Activité physique', 'Alimentation équilibrée', 'Surveillance régulière'],
          complications: ['Problèmes cardiaques', 'Insuffisance rénale', 'Problèmes vue', 'Névropathie']
        },
        hypertension: {
          keywords: ['hypertension', 'tension haute', 'pression artérielle'],
          description: 'L\'hypertension est une élévation persistante de la pression artérielle',
          symptoms: ['Souvent asymptomatique', 'Maux de tête', 'Vertiges', 'Vision trouble', 'Saignements nez'],
          risk_factors: ['Âge', 'Excès poids', 'Tabac', 'Alcool', 'Stress', 'Sel'],
          prevention: ['Réduire sel', 'Activité physique', 'Poids santé', 'Limiter alcool', 'Gérer stress'],
          complications: ['AVC', 'Infarctus', 'Insuffisance cardiaque', 'Problèmes rénaux']
        }
      },
      lifestyle: {
        exercise: {
          benefits: ['Poids santé', 'Cœur sain', 'Stress réduit', 'Énergie', 'Sommeil meilleur'],
          recommendations: {
            beginner: 'Marche 30min/jour, 5 jours/semaine',
            intermediate: '150min/semaine activité modérée',
            advanced: '75min/semaine activité intense + musculation'
          }
        },
        nutrition: {
          principles: ['Équilibré', 'Varié', 'Modéré', 'Frais', 'Local'],
          recommendations: {
            general: '5 fruits/légumes/jour, peu de sucre, sel modéré',
            weight_loss: 'Déficit calorique 500kcal/jour, protéines suffisantes',
            heart_health: 'Peu de gras saturés, oméga-3, fibres'
          }
        },
        sleep: {
          importance: ['Récupération', 'Mémoire', 'Immunité', 'Humeur', 'Métabolisme'],
          recommendations: {
            duration: '7-9 heures/nuit pour adulte',
            quality: 'Chambre sombre, frais, calme, pas d\'écrans avant dormir',
            schedule: 'Horaires réguliers même le week-end'
          }
        }
      }
    };
  }

  async processMessage(message, context = {}) {
    try {
      // Analyse du message avec NLP-like processing
      const analysis = this.analyzeMessage(message);
      
      // Enrichissement avec le contexte conversationnel
      if (context.conversationHistory && context.conversationHistory.length > 0) {
        analysis.conversationContext = this.analyzeConversationContext(context.conversationHistory);
      }
      
      // Enrichissement avec le contexte médical actuel
      if (context.currentContext) {
        analysis.currentSymptoms = context.currentContext.symptoms || [];
        analysis.currentUrgency = context.currentContext.urgency || 'low';
        analysis.previousTopics = context.currentContext.previousTopics || [];
      }
      
      // Mise à jour du profil utilisateur avec contexte
      this.updateUserProfile(analysis);
      
      // Génération de réponse contextuelle enrichie
      const response = await this.generateContextualResponse(analysis, context);
      
      // Sauvegarde dans l'historique avec métadonnées
      this.saveToHistory(message, response, analysis);
      
      return response;
    } catch (error) {
      console.error('Error in ML Chat Assistant:', error);
      return this.generateErrorResponse();
    }
  }

  analyzeConversationContext(conversationHistory) {
    const recentMessages = conversationHistory.slice(-6); // 3 derniers échanges
    
    return {
      topicContinuity: this.detectTopicContinuity(recentMessages),
      symptomEvolution: this.trackSymptomEvolution(recentMessages),
      urgencyProgression: this.trackUrgencyProgression(recentMessages),
      userConcerns: this.extractUserConcerns(recentMessages),
      previousAdvice: this.extractPreviousAdvice(recentMessages)
    };
  }

  detectTopicContinuity(messages) {
    const topics = new Set();
    messages.forEach(msg => {
      if (msg.role === 'user') {
        const content = msg.content.toLowerCase();
        // Détection de sujets médicaux
        if (content.includes('diabète') || content.includes('sucre')) topics.add('diabetes');
        if (content.includes('tension') || content.includes('coeur')) topics.add('cardiovascular');
        if (content.includes('mal') || content.includes('douleur')) topics.add('symptoms');
        if (content.includes('médicament') || content.includes('traitement')) topics.add('medication');
      }
    });
    return Array.from(topics);
  }

  trackSymptomEvolution(messages) {
    const symptoms = [];
    messages.forEach(msg => {
      if (msg.role === 'user') {
        const detected = this.extractMedicalEntities(msg.content.toLowerCase()).symptoms;
        if (detected.length > 0) {
          symptoms.push({
            symptoms: detected,
            timestamp: msg.timestamp || new Date().toISOString()
          });
        }
      }
    });
    return symptoms;
  }

  trackUrgencyProgression(messages) {
    const urgencyLevels = [];
    messages.forEach(msg => {
      if (msg.role === 'user') {
        const urgency = this.assessUrgency(msg.content.toLowerCase(), {});
        urgencyLevels.push(urgency);
      }
    });
    return urgencyLevels;
  }

  extractUserConcerns(messages) {
    const concerns = [];
    messages.forEach(msg => {
      if (msg.role === 'user') {
        const emotion = this.detectEmotion(msg.content.toLowerCase());
        if (emotion !== 'neutral') {
          concerns.push({
            emotion,
            content: msg.content,
            timestamp: msg.timestamp
          });
        }
      }
    });
    return concerns;
  }

  extractPreviousAdvice(messages) {
    const advice = [];
    messages.forEach(msg => {
      if (msg.role === 'assistant' && msg.content.includes('Conseil')) {
        advice.push(msg.content);
      }
    });
    return advice.slice(-3); // 3 derniers conseils
  }

  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Détection de l'intention
    const intent = this.detectIntent(lowerMessage);
    
    // Extraction d'entités médicales
    const entities = this.extractMedicalEntities(lowerMessage);
    
    // Analyse de l'urgence
    const urgency = this.assessUrgency(lowerMessage, entities);
    
    // Détection de l'émotion
    const emotion = this.detectEmotion(lowerMessage);
    
    return {
      intent,
      entities,
      urgency,
      emotion,
      originalMessage: message,
      timestamp: new Date().toISOString()
    };
  }

  detectIntent(message) {
    // Intentions principales
    const intents = {
      symptom_check: {
        keywords: ['j\'ai', 'symptôme', 'mal', 'douleur', 'ressens', 'souffre'],
        weight: 0.8
      },
      medical_info: {
        keywords: ['c\'est quoi', 'qu\'est-ce', 'information', 'définition', 'explique'],
        weight: 0.7
      },
      health_advice: {
        keywords: ['conseil', 'recommandation', 'comment', 'améliorer', 'prévenir'],
        weight: 0.6
      },
      emergency: {
        keywords: ['urgence', 'aide', 'ambulance', '15', 'samu', 'grave'],
        weight: 1.0
      },
      medication: {
        keywords: ['médicament', 'traitement', 'médicaments', 'posologie'],
        weight: 0.7
      }
    };

    let bestIntent = { type: 'general', confidence: 0 };
    
    for (const [intentType, data] of Object.entries(intents)) {
      const matches = data.keywords.filter(keyword => message.includes(keyword)).length;
      const confidence = (matches / data.keywords.length) * data.weight;
      
      if (confidence > bestIntent.confidence) {
        bestIntent = { type: intentType, confidence };
      }
    }

    return bestIntent;
  }

  extractMedicalEntities(message) {
    const entities = {
      symptoms: [],
      body_parts: [],
      severity: null,
      duration: null,
      frequency: null
    };

    // Extraction des symptômes
    for (const [symptom, data] of Object.entries(this.medicalKnowledge.symptoms)) {
      if (data.keywords.some(keyword => message.includes(keyword))) {
        entities.symptoms.push(symptom);
      }
    }

    // Extraction de la sévérité
    const severityPatterns = [
      { pattern: /léger|faible|légerement/, level: 'mild' },
      { pattern: /modéré|moyen/, level: 'moderate' },
      { pattern: /fort|intense|sévère|grave/, level: 'severe' },
      { pattern: /très fort|insupportable|extrême/, level: 'very_severe' }
    ];

    for (const { pattern, level } of severityPatterns) {
      if (pattern.test(message)) {
        entities.severity = level;
        break;
      }
    }

    // Extraction de la durée
    const durationPatterns = [
      { pattern: /depuis (\d+) heures/, unit: 'hours' },
      { pattern: /depuis (\d+) jours/, unit: 'days' },
      { pattern: /depuis (\d+) semaines/, unit: 'weeks' },
      { pattern: /depuis (\d+) mois/, unit: 'months' },
      { pattern: /aujourd\'hui|ce matin/, unit: 'hours', value: 1 },
      { pattern: /hier/, unit: 'days', value: 1 }
    ];

    for (const { pattern, unit, value } of durationPatterns) {
      const match = message.match(pattern);
      if (match) {
        entities.duration = {
          value: value || parseInt(match[1]),
          unit
        };
        break;
      }
    }

    return entities;
  }

  assessUrgency(message, entities) {
    // Mots-clés d'urgence
    const emergencyKeywords = [
      'urgence', 'aide', 'ambulance', '15', 'samu', 'grave', 'mortel',
      'ne respire pas', 'conscience', 'saignement', 'accident'
    ];

    if (emergencyKeywords.some(keyword => message.includes(keyword))) {
      return 'critical';
    }

    // Symptômes à haute urgence
    const highUrgencySymptoms = ['chest_pain'];
    if (entities.symptoms.some(symptom => highUrgencySymptoms.includes(symptom))) {
      return 'high';
    }

    // Sévérité élevée
    if (entities.severity === 'severe' || entities.severity === 'very_severe') {
      return 'high';
    }

    // Durée récente avec symptômes modérés
    if (entities.duration && entities.duration.value < 24 && entities.symptoms.length > 0) {
      return 'medium';
    }

    return 'low';
  }

  detectEmotion(message) {
    const emotions = {
      anxiety: ['anxieux', 'inquiet', 'peur', 'angoisse', 'stressé'],
      pain: ['douleur', 'mal', 'souffrance', 'brûlure', 'piquant'],
      fatigue: ['fatigué', 'épuisé', 'faible', 'sans énergie'],
      confusion: ['comprends pas', 'perdu', 'confus', 'pas sûr']
    };

    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return emotion;
      }
    }

    return 'neutral';
  }

  async generateContextualResponse(analysis, context) {
    const { intent, entities, urgency, emotion } = analysis;

    // Gestion de l'urgence
    if (urgency === 'critical' || analysis.currentUrgency === 'critical') {
      return this.generateEmergencyResponse();
    }

    // Réponses basées sur l'intention avec contexte enrichi
    switch (intent.type) {
      case 'symptom_check':
        return await this.generateContextualSymptomResponse(entities, emotion, analysis);
      case 'medical_info':
        return await this.generateContextualInfoResponse(entities, analysis);
      case 'health_advice':
        return await this.generateContextualAdviceResponse(entities, context, analysis);
      case 'medication':
        return await this.generateContextualMedicationResponse(entities, analysis);
      default:
        return await this.generateContextualGeneralResponse(analysis, context);
    }
  }

  async generateContextualSymptomResponse(entities, emotion, analysis) {
    let response = '';
    
    // Générer la réponse de base
    const baseResponse = await this.generateBaseSymptomResponse(entities, emotion, analysis);
    
    // Enrichir avec le contexte conversationnel
    response = contextualResponseService.enhanceResponseWithContext(
      baseResponse, 
      analysis, 
      { conversationHistory: this.conversationHistory }
    );
    
    // Maintenir la cohérence avec les réponses précédentes
    const previousResponses = this.conversationHistory
      .slice(-3)
      .map(entry => entry.assistant);
    
    response = contextualResponseService.maintainConversationConsistency(
      response, 
      previousResponses
    );
    
    return response;
  }

  async generateBaseSymptomResponse(entities, emotion, analysis) {
    let response = '';
    
    if (entities.symptoms.length === 0) {
      response += `Pourriez-vous décrire plus précisément vos symptômes ?

Par exemple :
- "J'ai mal à la tête depuis ce matin"
- "J'ai de la fièvre et des courbatures"
- "Je ressens une douleur dans la poitrine"

Plus vous me donnez de détails, mieux je pourrai vous aider.`;
      return response;
    }

    const primarySymptom = entities.symptoms[0];
    const symptomInfo = this.medicalKnowledge.symptoms[primarySymptom];

    if (symptomInfo) {
      // Questions de clarification contextuelles
      if (symptomInfo.questions && symptomInfo.questions.length > 0) {
        response += `Je comprends que vous avez des symptômes. Pour mieux évaluer la situation, j'aimerais vous poser quelques questions :`;
        
        symptomInfo.questions.slice(0, 3).forEach((question, index) => {
          response += `\n${index + 1}. ${question}`;
        });
      }

      // Conseils basés sur l'urgence et l'évolution
      const urgencyLevel = this.getUrgencyLevel(entities);
      response += `\n\n**Conseils immédiats :**`;
      response += `\n${symptomInfo.advice[urgencyLevel] || symptomInfo.advice.low}`;

      // Causes possibles
      if (symptomInfo.causes) {
        response += `\n\n**Causes possibles :** ${symptomInfo.causes.join(', ')}`;
      }
    }

    // Réponse émotionnelle contextuelle
    if (emotion === 'anxiety') {
      response += `\n\nJe comprends votre inquiétude. Prenez une profonde respiration. Je suis là pour vous aider à évaluer la situation calmement.`;
    }

    response += `\n\n⚠️ **Important :** Ces informations ne remplacent pas un avis médical. Si les symptômes s'aggravent, consultez un professionnel de santé.`;

    return response;
  }

  async generateSymptomResponse(entities, emotion) {
    if (entities.symptoms.length === 0) {
      return `Je comprends que vous ne vous sentez pas bien. Pourriez-vous décrire plus précisément vos symptômes ?

Par exemple :
- "J'ai mal à la tête depuis ce matin"
- "J'ai de la fièvre et des courbatures"
- "Je ressens une douleur dans la poitrine"

Plus vous me donnez de détails, mieux je pourrai vous aider.`;
    }

    const responses = [];
    const primarySymptom = entities.symptoms[0];
    const symptomInfo = this.medicalKnowledge.symptoms[primarySymptom];

    if (symptomInfo) {
      // Questions de clarification
      if (symptomInfo.questions && symptomInfo.questions.length > 0) {
        responses.push(`Je comprends que vous avez des symptômes. Pour mieux évaluer la situation, j'aimerais vous poser quelques questions :`);
        
        symptomInfo.questions.slice(0, 3).forEach((question, index) => {
          responses.push(`${index + 1}. ${question}`);
        });
      }

      // Conseils basés sur l'urgence
      const urgencyLevel = this.getUrgencyLevel(entities);
      responses.push(`\n**Conseils immédiats :**`);
      responses.push(symptomInfo.advice[urgencyLevel] || symptomInfo.advice.low);

      // Causes possibles
      if (symptomInfo.causes) {
        responses.push(`\n**Causes possibles :** ${symptomInfo.causes.join(', ')}`);
      }
    }

    // Réponse émotionnelle
    if (emotion === 'anxiety') {
      responses.push(`\nJe comprends votre inquiétude. Prenez une profonde respiration. Je suis là pour vous aider à évaluer la situation calmement.`);
    }

    responses.push(`\n⚠️ **Important :** Ces informations ne remplacent pas un avis médical. Si les symptômes s'aggravent, consultez un professionnel de santé.`);

    return responses.join('\n\n');
  }

  async generateInfoResponse(entities) {
    // Trouver la condition médicale correspondante
    for (const [condition, info] of Object.entries(this.medicalKnowledge.conditions)) {
      if (entities.symptoms.some(symptom => 
        info.keywords && info.keywords.some(keyword => 
          entities.symptoms.includes(keyword) || symptom.includes(keyword)
        )
      )) {
        return this.generateConditionInfo(condition, info);
      }
    }

    return `Je peux vous fournir des informations sur diverses conditions médicales comme le diabète, l'hypertension, et bien d'autres.

Quelle condition médicale vous intéresse particulièrement ?`;
  }

  generateConditionInfo(condition, info) {
    return `📚 **Information : ${condition.toUpperCase()}**

**Description :**
${info.description}

**Symptômes principaux :**
${info.symptoms.map(s => `• ${s}`).join('\n')}

**Facteurs de risque :**
${info.risk_factors.map(r => `• ${r}`).join('\n')}

**Prévention :**
${info.prevention.map(p => `• ${p}`).join('\n')}

${info.complications ? `**Complications possibles :**
${info.complications.map(c => `• ${c}`).join('\n')}` : ''}

**💡 Conseil :** Si vous pensez être concerné, consultez un médecin pour un diagnostic précis et un plan de traitement personnalisé.

Souhaitez-vous plus d'informations sur un aspect particulier ?`;
  }

  async generateAdviceResponse(entities, context) {
    const adviceAreas = [];

    // Conseils basés sur les entités détectées
    if (entities.symptoms.includes('fatigue')) {
      adviceAreas.push(this.generateFatigueAdvice());
    }

    if (context.isDoctor) {
      adviceAreas.push(`En tant que professionnel de santé, voici les recommandations basées sur les guidelines actuelles pour cette situation.`);
    }

    // Conseils de vie généraux
    adviceAreas.push(this.generateLifestyleAdvice());

    return adviceAreas.join('\n\n');
  }

  generateFatigueAdvice() {
    return `**Conseils pour la fatigue :**

🛌 **Sommeil :**
- Visez 7-9 heures par nuit
- Routine de coucher régulière
- Évitez les écrans 1h avant dormir

🍎 **Nutrition :**
- Repas équilibrés riches en fer et vitamines
- Évitez le sucre rapide qui cause des pics d'énergie
- Hydratez-vous bien (1.5-2L/jour)

🏃 **Activité :**
- Exercice modéré régulier (même 15min/jour)
- Évitez l'excès d'activité si fatigue extrême
- Étirements et respiration profonde

⚠️ **Consultez un médecin si :**
- Fatigue > 2 semaines sans amélioration
- Avec perte de poids inexpliquée
- Avec essoufflement anormal`;
  }

  generateLifestyleAdvice() {
    return `**Conseils de vie saine générale :**

🥗 **Alimentation équilibrée :**
- 5 portions de fruits/légumes par jour
- Protéines maigres (poisson, volaille, légumineuses)
- Céréales complètes et peu d'aliments transformés

🏃 **Activité physique :**
- 150 minutes d'activité modérée par semaine
- Marche rapide, natation, vélo...
- Renforcement musculaire 2x/semaine

😴 **Qualité du sommeil :**
- Horaires réguliers
- Chambre fraîche (18-20°C) et sombre
- Pas de caféine après 14h

🧘 **Gestion du stress :**
- Méditation ou respiration profonde
- Activités relaxantes (lecture, musique)
- Temps pour vous chaque jour`;
  }

  async generateMedicationResponse(entities) {
    return `💊 **Informations sur les médicaments**

Je peux vous donner des informations générales sur certains médicaments courants, mais **je ne peux pas remplacer l'avis de votre médecin ou pharmacien**.

**Principes importants :**
- Suivez toujours la posologie prescrite
- Ne modifiez jamais votre traitement seul
- Signalez les effets secondaires à votre médecin
- Vérifiez les contre-indications

**Questions à poser à votre médecin :**
- Pourquoi ce médicament m'est-il prescrit ?
- Comment et quand le prendre ?
- Quels sont les effets secondaires possibles ?
- Que faire en cas d'oubli ?
- Combien de temps dure le traitement ?

⚠️ **Urgence :** En cas de réaction allergique (difficulté respirer, gonflement), appelez le 15 immédiatement.

Quel médicament vous intéresse particulièrement ?`;
  }

  async generateGeneralResponse(analysis, context) {
    const { emotion } = analysis;

    let response = `🤖 **Assistant Médical Intelligent**

Je suis là pour vous aider avec vos questions de santé. Je peux vous accompagner sur :

**🔍 Analyse de symptômes**
Décrivez ce que vous ressentez, je vous poserai des questions pour mieux comprendre.

**📚 Informations médicales**  
Posez-moi des questions sur les maladies, traitements, prévention.

**💡 Conseils santé**
Demandez des recommandations pour améliorer votre bien-être quotidien.

**⚠️ Détection d'urgence**
Je peux identifier les situations nécessitant une consultation immédiate.`;

    if (emotion === 'anxiety') {
      response += `\n\nJe sens que vous êtes inquiet. C'est normal de se préoccuper de sa santé. Prenez une profonde respiration. Je suis là pour vous aider à y voir plus clair, étape par étape.`;
    }

    response += `\n\n**Exemples de questions :**
- "J'ai mal à la tête depuis ce matin"
- "C'est quoi l'hypertension ?"  
- "Comment améliorer mon sommeil ?"

Comment puis-je vous aider aujourd'hui ?`;

    return response;
  }

  generateEmergencyResponse() {
    return `🚨 **URGENCE MÉDICALE DÉTECTÉE**

**ACTION IMMÉDIATE REQUISE :**

📞 **APPELEZ LE 15 (SAMU) MAINTENANT**
- Décrivez la situation précisément
- Donnez votre localisation exacte
- Suivez leurs instructions

🚑 **PENDANT L'ATTENTE :**
- Gardez la personne calme et allongée
- Desserrez les vêtements serrés  
- Surveillez la respiration
- Ne donnez rien à boire ou manger

⚠️ **NE DÉLAI EZ PAS** - Chaque minute compte en situation d'urgence médicale.

**Si vous n'êtes pas en France, composez le numéro d'urgence local :**
- Europe : 112
- Canada/USA : 911

Cette situation nécessite une intervention médicale immédiate !`;
  }

  generateErrorResponse() {
    return `Désolé, je rencontre une difficulté technique. 

🤖 Je suis votre assistant médical intelligent et je suis normalement là pour :
- Analyser vos symptômes et vous guider
- Répondre à vos questions médicales  
- Donner des conseils de santé préventifs
- Détecter les urgences et vous orienter

Veuillez réessayer votre question ou reformuler-la différemment.

En cas d'urgence médicale réelle, n'hésitez pas à consulter directement un professionnel ou appeler les urgences.`;
  }

  getUrgencyLevel(entities) {
    if (entities.severity === 'very_severe') return 'high';
    if (entities.severity === 'severe') return 'medium';
    if (entities.duration && entities.duration.value > 72) return 'medium';
    return 'low';
  }

  updateUserProfile(analysis) {
    // Mise à jour du profil avec les informations extraites
    if (!this.userProfile.symptoms) this.userProfile.symptoms = [];
    if (!this.userProfile.concerns) this.userProfile.concerns = [];
    
    // Ajouter les nouveaux symptômes
    analysis.entities.symptoms.forEach(symptom => {
      if (!this.userProfile.symptoms.includes(symptom)) {
        this.userProfile.symptoms.push(symptom);
      }
    });

    // Suivi des préoccupations
    if (analysis.emotion && analysis.emotion !== 'neutral') {
      this.userProfile.concerns.push({
        emotion: analysis.emotion,
        timestamp: analysis.timestamp
      });
    }
  }

  saveToHistory(userMessage, aiResponse, analysis = null) {
    const historyEntry = {
      user: userMessage,
      assistant: aiResponse,
      timestamp: new Date().toISOString()
    };
    
    // Ajouter les métadonnées d'analyse si disponibles
    if (analysis) {
      historyEntry.metadata = {
        intent: analysis.intent,
        entities: analysis.entities,
        urgency: analysis.urgency,
        emotion: analysis.emotion,
        currentSymptoms: analysis.currentSymptoms || [],
        conversationContext: analysis.conversationContext || null
      };
    }
    
    this.conversationHistory.push(historyEntry);

    // Limiter l'historique à 50 messages
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  getUserProfile() {
    return this.userProfile;
  }

  clearHistory() {
    this.conversationHistory = [];
    this.userProfile = {};
  }
}

export default new MLChatAssistant();
