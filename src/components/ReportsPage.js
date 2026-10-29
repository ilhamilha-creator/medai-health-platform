import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Filter, 
  Search,
  Calendar,
  TrendingUp,
  Activity,
  Heart,
  Brain,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { LandingHeroImage } from './MedicalImages';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const reports = [
    {
      id: 1,
      patient: 'John Smith',
      type: 'cardiology',
      date: '2024-01-29',
      status: 'completed',
      aiScore: 95,
      confidence: 'high',
      findings: 'Normal sinus rhythm, no significant abnormalities detected',
      recommendations: 'Continue current medication, follow-up in 3 months',
      urgency: 'low'
    },
    {
      id: 2,
      patient: 'Emily Johnson',
      type: 'radiology',
      date: '2024-01-28',
      status: 'completed',
      aiScore: 87,
      confidence: 'medium',
      findings: 'Minor pulmonary infiltrates detected in lower lobes',
      recommendations: 'Further imaging recommended, consult pulmonologist',
      urgency: 'medium'
    },
    {
      id: 3,
      patient: 'Michael Brown',
      type: 'neurology',
      date: '2024-01-27',
      status: 'in-progress',
      aiScore: 92,
      confidence: 'high',
      findings: 'MRI analysis shows no acute abnormalities',
      recommendations: 'Awaiting final review by neurologist',
      urgency: 'low'
    },
    {
      id: 4,
      patient: 'Sarah Davis',
      type: 'cardiology',
      date: '2024-01-26',
      status: 'urgent',
      aiScore: 78,
      confidence: 'medium',
      findings: 'Irregular heart rhythm detected, possible arrhythmia',
      recommendations: 'Immediate cardiology consultation required',
      urgency: 'high'
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.findings.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'cardiology': return <Heart className="w-4 h-4" />;
      case 'neurology': return <Brain className="w-4 h-4" />;
      case 'radiology': return <Eye className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'high': return 'text-red-400 bg-red-400/20 border-red-400/50';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/50';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  const getConfidenceColor = (confidence) => {
    switch(confidence) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const stats = [
    { icon: <FileText className="w-6 h-6" />, label: 'Total Reports', value: '1,247', change: '+12%' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'AI Accuracy', value: '94.5%', change: '+2.3%' },
    { icon: <Clock className="w-6 h-6" />, label: 'Avg Processing', value: '2.3 min', change: '-15%' },
    { icon: <CheckCircle className="w-6 h-6" />, label: 'Completed', value: '1,189', change: '+8%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-medical-green opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-medical-light-blue opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <FileText className="w-10 h-10 text-medical-green" />
            <h1 className="text-3xl font-bold text-white">AI Diagnostic Reports</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="medical-button flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export All</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="medical-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-medical-green">
                  {stat.icon}
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-medical-white/70 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Filters */}
            <div className="medical-card">
              <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medical-white/50" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-medical-white/80 mb-2">
                  Report Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                >
                  <option value="all">All Types</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="radiology">Radiology</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-medical-white/80 mb-2">
                  Date Range
                </label>
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-medical-light-blue focus:bg-white/15 transition-all duration-300"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {/* AI Performance */}
            <div className="medical-card">
              <h3 className="text-lg font-semibold text-white mb-4">AI Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-medical-white/70 text-sm">Accuracy</span>
                  <span className="text-green-400 font-semibold">94.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-medical-white/70 text-sm">Processing Speed</span>
                  <span className="text-medical-light-blue font-semibold">2.3 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-medical-white/70 text-sm">False Positives</span>
                  <span className="text-yellow-400 font-semibold">3.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-medical-white/70 text-sm">User Satisfaction</span>
                  <span className="text-medical-green font-semibold">96%</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <LandingHeroImage />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="lg:col-span-3"
          >
            <div className="medical-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Recent Reports</h2>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-medical-white/50" />
                  <span className="text-medical-white/70 text-sm">
                    {filteredReports.length} reports
                  </span>
                </div>
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-medical-white/30 mx-auto mb-4" />
                    <p className="text-medical-white/70">No reports found</p>
                  </div>
                ) : (
                  filteredReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-medical-green/20 rounded-full flex items-center justify-center">
                            {getTypeIcon(report.type)}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-lg">{report.patient}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-medical-white/60 text-sm capitalize">{report.type}</span>
                              <span className="text-medical-white/60 text-sm">{report.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-medical-green" />
                            <span className="text-white font-semibold">{report.aiScore}%</span>
                            <span className={`text-xs ${getConfidenceColor(report.confidence)}`}>
                              ({report.confidence})
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(report.urgency)}`}>
                            {report.urgency} urgency
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-medical-green font-semibold text-sm mb-1">AI Findings</h5>
                          <p className="text-medical-white/90 text-sm">{report.findings}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-medical-green font-semibold text-sm mb-1">Recommendations</h5>
                          <p className="text-medical-white/90 text-sm">{report.recommendations}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-2">
                          {report.status === 'urgent' && (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-sm font-medium ${
                            report.status === 'completed' ? 'text-green-400' :
                            report.status === 'in-progress' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-medical-green/20 border border-medical-green/50 rounded-lg text-medical-green hover:bg-medical-green/30 transition-all duration-300"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
