import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import databaseService from '../services/databaseService';
import notificationService from '../utils/notificationService';
import { validateSchema, appointmentSchema } from '../utils/validationSchemas';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Video, 
  MapPin, 
  Filter, 
  Search,
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X,
  Users,
  Stethoscope
} from 'lucide-react';

export default function RealAppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    date: selectedDate,
    time: '',
    type: 'video',
    reason: ''
  });

  useEffect(() => {
    loadAppointments();
    loadAvailableDoctors();
  }, [user, selectedDate]);

  const loadAppointments = () => {
    if (user) {
      const userAppointments = databaseService.getAppointmentsForUser(user.id);
      const today = new Date().toISOString().split('T')[0];
      
      const upcoming = userAppointments.filter(apt => 
        apt.date >= today && apt.status === 'scheduled'
      );
      
      const past = userAppointments.filter(apt => 
        apt.date < today || apt.status === 'completed'
      );
      
      const cancelled = userAppointments.filter(apt => apt.status === 'cancelled');
      
      setAppointments({
        upcoming,
        past,
        cancelled
      });
    }
  };

  const loadAvailableDoctors = () => {
    const doctors = databaseService.getAvailableDoctors(selectedDate);
    setAvailableDoctors(doctors);
  };

  const handleBookAppointment = () => {
    const appointmentData = {
      doctorId: parseInt(bookingForm.doctorId),
      patientId: user.id,
      date: bookingForm.date,
      time: bookingForm.time,
      type: bookingForm.type,
      reason: bookingForm.reason
    };

    // Validation Zod
    const validation = validateSchema(appointmentSchema, appointmentData);
    if (!validation.success) {
      const firstError = validation.errors[0];
      notificationService.error(firstError.message);
      return;
    }

    databaseService.createAppointment(appointmentData);
    notificationService.success('Rendez-vous créé avec succès');
    setShowBookingModal(false);
    setBookingForm({
      doctorId: '',
      date: selectedDate,
      time: '',
      type: 'video',
      reason: ''
    });
    loadAppointments();
    loadAvailableDoctors();
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      databaseService.updateAppointmentStatus(appointmentId, 'cancelled');
      loadAppointments();
    }
  };

  const handleCompleteAppointment = (appointmentId) => {
    databaseService.updateAppointmentStatus(appointmentId, 'completed');
    loadAppointments();
  };

  const filteredAppointments = appointments[activeTab]?.filter(apt => {
    const matchesSearch = apt.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.userType === 'doctor' ? 
                           databaseService.getUserById(apt.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) :
                           databaseService.getUserById(apt.doctorId)?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || apt.type === filterType;
    
    return matchesSearch && matchesFilter;
  }) || [];

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAppointmentStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 backdrop-blur-lg rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-white">Rendez-vous</h1>
              <p className="text-medical-white/70">Gestion de vos rendez-vous médicaux</p>
            </div>
          </div>
          
          {user.userType === 'patient' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3 bg-medical-green text-white rounded-lg hover:bg-medical-green/90 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau Rendez-vous</span>
            </motion.button>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-medical-white/70 text-sm">À venir</p>
                <p className="text-2xl font-bold text-white">{appointments.upcoming?.length || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-medical-green" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-medical-white/70 text-sm">Terminés</p>
                <p className="text-2xl font-bold text-white">{appointments.past?.length || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-medical-white/70 text-sm">Annulés</p>
                <p className="text-2xl font-bold text-white">{appointments.cancelled?.length || 0}</p>
              </div>
              <X className="w-8 h-8 text-red-400" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/10 backdrop-blur-lg rounded-lg p-1">
          {['upcoming', 'past', 'cancelled'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-medical-green text-white'
                  : 'text-medical-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab === 'upcoming' ? 'À venir' : tab === 'past' ? 'Terminés' : 'Annulés'}
            </motion.button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un rendez-vous..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg rounded-lg text-white placeholder-medical-white/50 border border-white/20 focus:border-medical-green focus:outline-none"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-lg rounded-lg text-white border border-white/20 focus:border-medical-green focus:outline-none"
          >
            <option value="all">Tous les types</option>
            <option value="video">Visioconférence</option>
            <option value="in-person">En personne</option>
          </select>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center border border-white/20"
            >
              <Calendar className="w-12 h-12 text-medical-white/50 mx-auto mb-4" />
              <p className="text-medical-white/70">Aucun rendez-vous trouvé</p>
            </motion.div>
          ) : (
            filteredAppointments.map((appointment, index) => {
              const otherUser = user.userType === 'doctor' 
                ? databaseService.getUserById(appointment.patientId)
                : databaseService.getUserById(appointment.doctorId);
              
              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-medical-green to-medical-blue rounded-full flex items-center justify-center text-white">
                        {user.userType === 'doctor' ? <Users className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {user.userType === 'doctor' ? otherUser?.name : `Dr. ${otherUser?.name}`}
                        </h3>
                        <p className="text-medical-white/70">{appointment.reason}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center space-x-1 text-medical-white/70 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{appointment.date}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-medical-white/70 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-medical-white/70 text-sm">
                            {appointment.type === 'video' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                            <span>{appointment.type === 'video' ? 'Visioconférence' : 'En personne'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getAppointmentStatusColor(appointment.status)}`}>
                        {getAppointmentStatusIcon(appointment.status)}
                        <span>
                          {appointment.status === 'scheduled' ? 'Programmé' : 
                           appointment.status === 'completed' ? 'Terminé' : 'Annulé'}
                        </span>
                      </span>
                      
                      {appointment.status === 'scheduled' && (
                        <div className="flex space-x-2">
                          {user.userType === 'doctor' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCompleteAppointment(appointment.id)}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </motion.button>
                          )}
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Nouveau Rendez-vous</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => {
                      setBookingForm({...bookingForm, date: e.target.value});
                      setSelectedDate(e.target.value);
                      loadAvailableDoctors();
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Médecin</label>
                  <select
                    value={bookingForm.doctorId}
                    onChange={(e) => setBookingForm({...bookingForm, doctorId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent"
                  >
                    <option value="">Sélectionner un médecin</option>
                    {availableDoctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.profile.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                
                {bookingForm.doctorId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
                    <select
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent"
                    >
                      <option value="">Sélectionner une heure</option>
                      {availableDoctors.find(d => d.id === parseInt(bookingForm.doctorId))?.availableSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={bookingForm.type}
                    onChange={(e) => setBookingForm({...bookingForm, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent"
                  >
                    <option value="video">Visioconférence</option>
                    <option value="in-person">En personne</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motif</label>
                  <textarea
                    value={bookingForm.reason}
                    onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                    placeholder="Décrivez le motif de votre consultation..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleBookAppointment}
                    className="flex-1 px-4 py-2 bg-medical-green text-white rounded-lg hover:bg-medical-green/90 transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
