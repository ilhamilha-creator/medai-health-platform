// Appointment Reminder Service
class ReminderService {
  constructor() {
    this.reminders = [];
    this.notificationPermission = 'default';
  }

  async init() {
    // Request notification permission
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
    }
    
    // Load saved reminders
    const saved = localStorage.getItem('reminders');
    if (saved) {
      this.reminders = JSON.parse(saved);
    }
    
    // Start checking for reminders
    this.startReminderCheck();
  }

  addReminder(reminder) {
    const newReminder = {
      id: Date.now(),
      ...reminder,
      createdAt: new Date().toISOString(),
      notified: false
    };
    
    this.reminders.push(newReminder);
    this.saveReminders();
    return newReminder;
  }

  removeReminder(id) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.saveReminders();
  }

  updateReminder(id, updates) {
    const index = this.reminders.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reminders[index] = { ...this.reminders[index], ...updates };
      this.saveReminders();
    }
  }

  getReminders() {
    return this.reminders;
  }

  getUpcomingReminders() {
    const now = new Date();
    return this.reminders
      .filter(r => new Date(r.reminderTime) > now && !r.notified)
      .sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime));
  }

  saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(this.reminders));
  }

  startReminderCheck() {
    // Check every minute for reminders
    setInterval(() => {
      this.checkReminders();
    }, 60000);
  }

  checkReminders() {
    const now = new Date();
    
    this.reminders.forEach(reminder => {
      const reminderTime = new Date(reminder.reminderTime);
      const timeDiff = reminderTime - now;
      
      // Notify if reminder is due (within 1 minute) and not yet notified
      if (timeDiff <= 60000 && timeDiff > 0 && !reminder.notified) {
        this.sendNotification(reminder);
        this.updateReminder(reminder.id, { notified: true });
      }
    });
  }

  sendNotification(reminder) {
    if (this.notificationPermission === 'granted') {
      const notification = new Notification('Appointment Reminder', {
        body: reminder.title,
        icon: '/medical-icon.png',
        badge: '/medical-badge.png',
        tag: reminder.id.toString(),
        requireInteraction: true
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
    
    // Also play sound
    this.playReminderSound();
  }

  playReminderSound() {
    const audio = new Audio('/reminder-sound.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  }

  getReminderIntervals() {
    return [
      { value: 15, label: '15 minutes before' },
      { value: 30, label: '30 minutes before' },
      { value: 60, label: '1 hour before' },
      { value: 120, label: '2 hours before' },
      { value: 1440, label: '1 day before' }
    ];
  }

  scheduleReminder(appointment, intervalMinutes) {
    const appointmentTime = new Date(appointment.dateTime);
    const reminderTime = new Date(appointmentTime.getTime() - intervalMinutes * 60000);
    
    // Only schedule if reminder time is in the future
    if (reminderTime > new Date()) {
      return this.addReminder({
        title: `Appointment: ${appointment.title}`,
        description: appointment.description,
        appointmentId: appointment.id,
        reminderTime: reminderTime.toISOString(),
        interval: intervalMinutes
      });
    }
    
    return null;
  }

  clearPastReminders() {
    const now = new Date();
    this.reminders = this.reminders.filter(r => new Date(r.reminderTime) > now);
    this.saveReminders();
  }
}

export default new ReminderService();