import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Brain, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Zap,
  Droplets,
  Thermometer,
  Wind
} from 'lucide-react';

export default function HealthInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = () => {
    setLoading(true);
    
    // Simulate AI-powered health insights
    const mockInsights = [
      {
        id: 1,
        type: 'warning',
        icon: AlertTriangle,
        title: 'Blood Pressure Elevated',
        description: 'Your systolic blood pressure has been consistently above 130 mmHg for the past week. Consider reducing sodium intake and increasing physical activity.',
        trend: 'up',
        value: '+8%',
        category: 'Cardiovascular',
        priority: 'high',
        action: 'Schedule check-up with doctor'
      },
      {
        id: 2,
        type: 'success',
        icon: CheckCircle,
        title: 'Sleep Quality Improved',
        description: 'Your average sleep duration has increased from 6.5 to 7.5 hours. This is positively impacting your overall health metrics.',
        trend: 'up',
        value: '+15%',
        category: 'Wellness',
        priority: 'low',
        action: 'Maintain current sleep schedule'
      },
      {
        id: 3,
        type: 'info',
        icon: Brain,
        title: 'Stress Levels Moderate',
        description: 'Your stress indicators suggest moderate levels. Consider incorporating mindfulness exercises or meditation into your daily routine.',
        trend: 'stable',
        value: 'Stable',
        category: 'Mental Health',
        priority: 'medium',
        action: 'Try guided meditation'
      },
      {
        id: 4,
        type: 'warning',
        icon: Activity,
        title: 'Physical Activity Below Target',
        description: 'Your daily step count is averaging 6,500 steps, below the recommended 8,000 steps. Increasing activity could improve cardiovascular health.',
        trend: 'down',
        value: '-18%',
        category: 'Fitness',
        priority: 'medium',
        action: 'Aim for 8,000 steps daily'
      },
      {
        id: 5,
        type: 'success',
        icon: Heart,
        title: 'Heart Rate Healthy',
        description: 'Your resting heart rate of 68 bpm is within the healthy range. This indicates good cardiovascular fitness.',
        trend: 'stable',
        value: 'Optimal',
        category: 'Cardiovascular',
        priority: 'low',
        action: 'Continue current routine'
      },
      {
        id: 6,
        type: 'info',
        icon: Droplets,
        title: 'Hydration Could Be Improved',
        description: 'Based on your activity levels, you may benefit from increasing water intake by 1-2 glasses daily.',
        trend: 'down',
        value: '-10%',
        category: 'Hydration',
        priority: 'low',
        action: 'Drink more water'
      }
    ];

    setInsights(mockInsights);
    setLoading(false);
  };

  const getInsightColor = (type) => {
    switch(type) {
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'success': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'info': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-medical-white/80">Analyzing health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Health Insights</h1>
            <p className="text-medical-white/70">AI-powered health analysis and recommendations</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateInsights}
            className="px-4 py-2 bg-medical-green text-white rounded-lg font-semibold hover:bg-medical-green/90 transition-colors flex items-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Refresh</span>
          </motion.button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: AlertTriangle, label: 'Alerts', value: insights.filter(i => i.type === 'warning').length, color: 'text-yellow-400' },
            { icon: CheckCircle, label: 'Healthy', value: insights.filter(i => i.type === 'success').length, color: 'text-green-400' },
            { icon: Brain, label: 'Suggestions', value: insights.filter(i => i.type === 'info').length, color: 'text-blue-400' },
            { icon: Target, label: 'Goals Met', value: '4/6', color: 'text-medical-green' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="medical-card p-4 text-center"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-medical-white/70 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Insights List */}
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="medical-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getInsightColor(insight.type)}`}>
                    <insight.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(insight.priority)}`}>
                        {insight.priority} priority
                      </span>
                    </div>
                    <p className="text-medical-white/70 text-sm">{insight.category}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 ${getTrendColor(insight.trend)}`}>
                  {getTrendIcon(insight.trend)}
                  <span className="text-sm font-semibold">{insight.value}</span>
                </div>
              </div>

              <p className="text-medical-white/80 mb-4">{insight.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-medical-white/60 text-sm">
                  <Target className="w-4 h-4" />
                  <span>{insight.action}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-medical-green/20 text-medical-green rounded-lg font-semibold hover:bg-medical-green/30 transition-colors text-sm"
                >
                  Take Action
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="medical-card mt-8 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-medical-green" />
            <h3 className="text-xl font-semibold text-white">AI Health Analysis</h3>
          </div>
          <p className="text-medical-white/80 mb-4">
            Based on your health data patterns, our AI system has identified that your cardiovascular health 
            metrics show positive trends, while your physical activity levels could be improved. The combination 
            of improved sleep quality and stable heart rate suggests good overall health foundation.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Overall Health Score', value: '78/100', trend: '+5%' },
              { label: 'Risk Assessment', value: 'Low', trend: 'Stable' },
              { label: 'Recommendation Accuracy', value: '94%', trend: '+2%' }
            ].map((metric, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-medical-white/70 text-sm mb-1">{metric.label}</p>
                <p className="text-medical-green text-xs font-semibold">{metric.trend}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}