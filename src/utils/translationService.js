// Multilingual Translation Service
class TranslationService {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {
      en: {
        // Common
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        
        // Navigation
        dashboard: 'Dashboard',
        appointments: 'Appointments',
        medicalRecords: 'Medical Records',
        healthMonitoring: 'Health Monitoring',
        doctorSpace: 'Doctor Space',
        patientSpace: 'Patient Space',
        
        // Health
        heartRate: 'Heart Rate',
        bloodPressure: 'Blood Pressure',
        temperature: 'Temperature',
        glucose: 'Glucose',
        oxygen: 'Oxygen Saturation',
        
        // Emergency
        emergency: 'Emergency',
        sos: 'SOS',
        callEmergency: 'Call Emergency',
        shareLocation: 'Share Location',
        
        // Medicine
        medicineScanner: 'Medicine Scanner',
        scanMedicine: 'Scan Medicine',
        uploadImage: 'Upload Image',
        sideEffects: 'Side Effects',
        interactions: 'Interactions',
        warnings: 'Warnings',
        
        // Voice
        voiceInput: 'Voice Input',
        tapToSpeak: 'Tap to speak',
        listening: 'Listening...',
        
        // Insights
        healthInsights: 'Health Insights',
        aiAnalysis: 'AI Analysis',
        recommendations: 'Recommendations'
      },
      fr: {
        // Common
        welcome: 'Bienvenue',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        
        // Navigation
        dashboard: 'Tableau de bord',
        appointments: 'Rendez-vous',
        medicalRecords: 'Dossiers médicaux',
        healthMonitoring: 'Surveillance santé',
        doctorSpace: 'Espace médecin',
        patientSpace: 'Espace patient',
        
        // Health
        heartRate: 'Fréquence cardiaque',
        bloodPressure: 'Pression artérielle',
        temperature: 'Température',
        glucose: 'Glucose',
        oxygen: 'Saturation en oxygène',
        
        // Emergency
        emergency: 'Urgence',
        sos: 'SOS',
        callEmergency: 'Appeler les urgences',
        shareLocation: 'Partager la localisation',
        
        // Medicine
        medicineScanner: 'Scanner de médicaments',
        scanMedicine: 'Scanner médicament',
        uploadImage: 'Télécharger image',
        sideEffects: 'Effets secondaires',
        interactions: 'Interactions',
        warnings: 'Avertissements',
        
        // Voice
        voiceInput: 'Saisie vocale',
        tapToSpeak: 'Appuyer pour parler',
        listening: 'Écoute...',
        
        // Insights
        healthInsights: 'Aperçus de santé',
        aiAnalysis: 'Analyse IA',
        recommendations: 'Recommandations'
      },
      es: {
        // Common
        welcome: 'Bienvenido',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        
        // Navigation
        dashboard: 'Panel',
        appointments: 'Citas',
        medicalRecords: 'Registros médicos',
        healthMonitoring: 'Monitoreo de salud',
        doctorSpace: 'Espacio médico',
        patientSpace: 'Espacio paciente',
        
        // Health
        heartRate: 'Frecuencia cardíaca',
        bloodPressure: 'Presión arterial',
        temperature: 'Temperatura',
        glucose: 'Glucosa',
        oxygen: 'Saturación de oxígeno',
        
        // Emergency
        emergency: 'Emergencia',
        sos: 'SOS',
        callEmergency: 'Llamar emergencias',
        shareLocation: 'Compartir ubicación',
        
        // Medicine
        medicineScanner: 'Escáner de medicamentos',
        scanMedicine: 'Escanear medicamento',
        uploadImage: 'Subir imagen',
        sideEffects: 'Efectos secundarios',
        interactions: 'Interacciones',
        warnings: 'Advertencias',
        
        // Voice
        voiceInput: 'Entrada de voz',
        tapToSpeak: 'Toca para hablar',
        listening: 'Escuchando...',
        
        // Insights
        healthInsights: 'Perspectivas de salud',
        aiAnalysis: 'Análisis IA',
        recommendations: 'Recomendaciones'
      },
      ar: {
        // Common
        welcome: 'مرحبا',
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجاح',
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        edit: 'تعديل',
        
        // Navigation
        dashboard: 'لوحة التحكم',
        appointments: 'المواعيد',
        medicalRecords: 'السجلات الطبية',
        healthMonitoring: 'مراقبة الصحة',
        doctorSpace: 'مساحة الطبيب',
        patientSpace: 'مساحة المريض',
        
        // Health
        heartRate: 'معدل ضربات القلب',
        bloodPressure: 'ضغط الدم',
        temperature: 'درجة الحرارة',
        glucose: 'الجلوكوز',
        oxygen: 'تشبع الأكسجين',
        
        // Emergency
        emergency: 'طوارئ',
        sos: 'SOS',
        callEmergency: 'اتصل بالطوارئ',
        shareLocation: 'مشاركة الموقع',
        
        // Medicine
        medicineScanner: 'ماسح الأدوية',
        scanMedicine: 'مسح الدواء',
        uploadImage: 'تحميل صورة',
        sideEffects: 'الآثار الجانبية',
        interactions: 'التفاعلات',
        warnings: 'تحذيرات',
        
        // Voice
        voiceInput: 'إدخال صوتي',
        tapToSpeak: 'اضغط للتحدث',
        listening: 'جاري الاستماع...',
        
        // Insights
        healthInsights: 'رؤى الصحة',
        aiAnalysis: 'تحليل الذكاء الاصطناعي',
        recommendations: 'التوصيات'
      }
    };
  }

  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('language', language);
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  translate(key) {
    return this.translations[this.currentLanguage][key] || key;
  }

  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' }
    ];
  }

  init() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && this.translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    }
  }
}

export default new TranslationService();