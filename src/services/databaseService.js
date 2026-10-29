/**
 * Base de données partagée pour la plateforme médicale
 * Gère les relations patient-médecin, rendez-vous, dossiers médicaux
 */

import bcrypt from 'bcryptjs';

class DatabaseService {
  constructor() {
    // Initialisation de la base de données locale
    this.initializeDatabase();
  }

  initializeDatabase() {
    // Reset database completely to fix authentication issues
    localStorage.removeItem('medai_database');
    
    // Créer les données initiales avec mots de passe hashés
    const saltRounds = 10;
    const doctorPasswordHash = bcrypt.hashSync('doctor123', saltRounds);
    const patientPasswordHash = bcrypt.hashSync('patient123', saltRounds);
    
    this.data = {
        users: [
          {
            id: 1,
            name: 'Dr. Sarah Martin',
            email: 'sarah.martin@medai.com',
            userType: 'doctor',
            specialty: 'Cardiologie',
            password: doctorPasswordHash,
            profile: {
              phone: '+33 1 23 45 67 89',
              address: '123 Avenue des Champs-Élysées, Paris',
              experience: '10 ans',
              languages: ['Français', 'Anglais'],
              rating: 4.8
            }
          },
          {
            id: 2,
            name: 'Dr. Jean Dubois',
            email: 'jean.dubois@medai.com',
            userType: 'doctor',
            specialty: 'Médecine Générale',
            password: doctorPasswordHash,
            profile: {
              phone: '+33 1 23 45 67 90',
              address: '456 Rue de la Paix, Paris',
              experience: '15 ans',
              languages: ['Français'],
              rating: 4.9
            }
          },
          {
            id: 3,
            name: 'Marie Dupont',
            email: 'marie.dupont@email.com',
            userType: 'patient',
            password: patientPasswordHash,
            profile: {
              phone: '+33 6 12 34 56 78',
              address: '789 Boulevard Saint-Germain, Paris',
              dateOfBirth: '1985-05-15',
              bloodType: 'A+',
              emergencyContact: '+33 6 98 76 54 32'
            }
          },
          {
            id: 4,
            name: 'Pierre Bernard',
            email: 'pierre.bernard@email.com',
            userType: 'patient',
            password: patientPasswordHash,
            profile: {
              phone: '+33 6 23 45 67 89',
              address: '321 Rue Montmartre, Paris',
              dateOfBirth: '1990-08-22',
              bloodType: 'O+',
              emergencyContact: '+33 6 87 65 43 21'
            }
          }
        ],
        appointments: [],
        medicalRecords: [],
        messages: [],
        healthMetrics: {},
        notifications: []
      };
      this.saveData();
  }

  saveData() {
    localStorage.setItem('medai_database', JSON.stringify(this.data));
  }

  // Authentification avec bcrypt synchrone
  authenticateUser(email, password) {
    const user = this.data.users.find(u => u.email === email);
    if (user) {
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (isPasswordValid) {
        // Retourner une copie sans le mot de passe
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return null;
  }

  getUserById(userId) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  // Enregistrement d'un nouvel utilisateur avec hash du mot de passe synchrone
  registerUser(userData) {
    const existingUser = this.data.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('This email is already registered');
    }

    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(userData.password, saltRounds);

    const newUser = {
      id: this.data.users.length + 1,
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
      password: passwordHash,
      profile: userData.profile || {}
    };

    this.data.users.push(newUser);
    this.saveData();

    // Retourner une copie sans le mot de passe
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Méthodes pour les rendez-vous
  createAppointment(appointmentData) {
    const newAppointment = {
      id: this.data.appointments.length + 1,
      ...appointmentData,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    this.data.appointments.push(newAppointment);
    this.saveData();
    return newAppointment;
  }

  getAppointmentsByPatient(patientId) {
    return this.data.appointments.filter(a => a.patientId === patientId);
  }

  getAppointmentsByDoctor(doctorId) {
    return this.data.appointments.filter(a => a.doctorId === doctorId);
  }

  // Méthodes pour les dossiers médicaux
  createMedicalRecord(recordData) {
    const newRecord = {
      id: this.data.medicalRecords.length + 1,
      ...recordData,
      createdAt: new Date().toISOString()
    };
    this.data.medicalRecords.push(newRecord);
    this.saveData();
    return newRecord;
  }

  getMedicalRecordsByPatient(patientId) {
    return this.data.medicalRecords.filter(r => r.patientId === patientId);
  }

  // Méthodes pour les messages
  createMessage(messageData) {
    const newMessage = {
      id: this.data.messages.length + 1,
      ...messageData,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.data.messages.push(newMessage);
    this.saveData();
    return newMessage;
  }

  getMessagesBetweenUsers(userId1, userId2) {
    return this.data.messages.filter(
      m => (m.senderId === userId1 && m.receiverId === userId2) ||
           (m.senderId === userId2 && m.receiverId === userId1)
    );
  }

  // Méthodes pour les métriques de santé
  saveHealthMetrics(patientId, metrics) {
    this.data.healthMetrics[patientId] = {
      ...this.data.healthMetrics[patientId],
      ...metrics,
      lastUpdated: new Date().toISOString()
    };
    this.saveData();
  }

  getHealthMetrics(patientId) {
    return this.data.healthMetrics[patientId] || null;
  }

  // Méthodes pour les notifications
  createNotification(notificationData) {
    const newNotification = {
      id: this.data.notifications.length + 1,
      ...notificationData,
      createdAt: new Date().toISOString(),
      read: false
    };
    this.data.notifications.push(newNotification);
    this.saveData();
    return newNotification;
  }

  getNotificationsByUser(userId) {
    return this.data.notifications.filter(n => n.userId === userId);
  }

  markNotificationAsRead(notificationId) {
    const notification = this.data.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveData();
    }
  }

  // Méthodes utilitaires
  getAllDoctors() {
    return this.data.users.filter(u => u.userType === 'doctor').map(u => {
      const { password, ...doctorWithoutPassword } = u;
      return doctorWithoutPassword;
    });
  }

  getAllPatients() {
    return this.data.users.filter(u => u.userType === 'patient').map(u => {
      const { password, ...patientWithoutPassword } = u;
      return patientWithoutPassword;
    });
  }

  updateUser(userId, updates) {
    const userIndex = this.data.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.data.users[userIndex] = { ...this.data.users[userIndex], ...updates };
      this.saveData();
      const { password, ...userWithoutPassword } = this.data.users[userIndex];
      return userWithoutPassword;
    }
    return null;
  }

  deleteUser(userId) {
    const userIndex = this.data.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.data.users.splice(userIndex, 1);
      this.saveData();
      return true;
    }
    return false;
  }
}

export default new DatabaseService();