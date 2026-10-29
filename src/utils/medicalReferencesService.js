/**
 * Service de gestion des références médicales
 * Fournit des sources crédibles et des guidelines pour les réponses médicales
 */

class MedicalReferencesService {
  constructor() {
    this.references = {
      guidelines: {
        who: {
          name: 'World Health Organization (WHO)',
          url: 'https://www.who.int',
          trust: 0.95,
          topics: ['diabetes', 'cardiovascular', 'cancer', 'respiratory', 'mental-health']
        },
        nih: {
          name: 'National Institutes of Health (NIH)',
          url: 'https://www.nih.gov',
          trust: 0.94,
          topics: ['diabetes', 'cardiovascular', 'cancer', 'research']
        },
        has: {
          name: 'Haute Autorité de Santé (HAS)',
          url: 'https://www.has-sante.fr',
          trust: 0.93,
          topics: ['diabetes', 'cardiovascular', 'guidelines', 'france']
        },
        esc: {
          name: 'European Society of Cardiology (ESC)',
          url: 'https://www.escardio.org',
          trust: 0.92,
          topics: ['cardiovascular', 'guidelines']
        },
        ada: {
          name: 'American Diabetes Association (ADA)',
          url: 'https://www.diabetes.org',
          trust: 0.91,
          topics: ['diabetes', 'guidelines']
        }
      },
      studies: {
        diabetes: [
          {
            title: 'UK Prospective Diabetes Study',
            journal: 'The Lancet',
            year: 1998,
            trust: 0.89,
            doi: '10.1016/S0140-6736(98)07019-6'
          },
          {
            title: 'Diabetes Control and Complications Trial (DCCT)',
            journal: 'New England Journal of Medicine',
            year: 1993,
            trust: 0.90,
            doi: '10.1056/NEJM199309303291301'
          }
        ],
        cardiovascular: [
          {
            title: 'Framingham Heart Study',
            journal: 'Circulation',
            year: 1948,
            trust: 0.92,
            doi: '10.1161/01.CIR.97.18.1767'
          },
          {
            title: 'INTERHEART Study',
            journal: 'The Lancet',
            year: 2004,
            trust: 0.88,
            doi: '10.1016/S0140-6736(04)17018-9'
          }
        ],
        cancer: [
          {
            title: 'SEER Cancer Statistics Review',
            journal: 'National Cancer Institute',
            year: 2020,
            trust: 0.91,
            url: 'https://seer.cancer.gov'
          }
        ]
      }
    };
  }

  /**
   * Récupère les références pertinentes pour un sujet
   */
  getReferencesForTopic(topic) {
    const relevantGuidelines = Object.entries(this.references.guidelines)
      .filter(([_, guideline]) => guideline.topics.some(t => topic.includes(t)))
      .map(([key, guideline]) => ({
        type: 'guideline',
        source: guideline.name,
        url: guideline.url,
        trust: guideline.trust
      }));

    const relevantStudies = this.references.studies[topic] || [];

    return [...relevantGuidelines, ...relevantStudies];
  }

  /**
   * Formate les références pour affichage dans les réponses
   */
  formatReferences(references) {
    if (!references || references.length === 0) return '';

    const formatted = references.map(ref => {
      if (ref.type === 'guideline') {
        return `📚 [${ref.source}](${ref.url}) - Confiance: ${(ref.trust * 100).toFixed(0)}%`;
      } else {
        return `🔬 "${ref.title}" - ${ref.journal} (${ref.year})`;
      }
    });

    return `\n\n**📚 Sources & Références:**\n${formatted.join('\n')}`;
  }

  /**
   * Ajoute des références automatiquement à une réponse
   */
  enrichResponseWithReferences(response, topic) {
    const references = this.getReferencesForTopic(topic);
    const formattedRefs = this.formatReferences(references);
    
    return {
      ...response,
      content: response.content + formattedRefs,
      references: references,
      hasReferences: references.length > 0
    };
  }

  /**
   * Détecte le sujet d'une réponse pour trouver les références appropriées
   */
  detectTopicFromResponse(response) {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('diabète') || lowerResponse.includes('diabetes') || lowerResponse.includes('glycémie')) {
      return 'diabetes';
    }
    if (lowerResponse.includes('cardio') || lowerResponse.includes('cœur') || lowerResponse.includes('hypertension') || lowerResponse.includes('pression')) {
      return 'cardiovascular';
    }
    if (lowerResponse.includes('cancer') || lowerResponse.includes('tumeur') || lowerResponse.includes('maligne')) {
      return 'cancer';
    }
    
    return 'general';
  }

  /**
   * Génère une réponse avec références automatiques
   */
  generateResponseWithReferences(response) {
    const topic = this.detectTopicFromResponse(response);
    return this.enrichResponseWithReferences({ content: response }, topic);
  }

  /**
   * Valide la crédibilité d'une source
   */
  validateSource(source) {
    const trustedSources = Object.values(this.references.guidelines);
    return trustedSources.some(guideline => 
      source.toLowerCase().includes(guideline.name.toLowerCase())
    );
  }

  /**
   * Récupère le score de confiance d'une source
   */
  getSourceTrustScore(source) {
    for (const guideline of Object.values(this.references.guidelines)) {
      if (source.toLowerCase().includes(guideline.name.toLowerCase())) {
        return guideline.trust;
      }
    }
    return 0.5; // Score par défaut pour sources non reconnues
  }
}

const medicalReferencesService = new MedicalReferencesService();
export default medicalReferencesService;
