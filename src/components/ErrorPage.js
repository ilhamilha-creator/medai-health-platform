import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw, AlertTriangle, Search } from 'lucide-react';

export default function ErrorPage({ errorCode = 404, message = 'Page not found' }) {
  const navigate = useNavigate();

  const getErrorContent = (code) => {
    switch(code) {
      case 404:
        return {
          icon: <Search className="w-16 h-16" />,
          title: 'Page Not Found',
          description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
          action: 'Go to Dashboard'
        };
      case 500:
        return {
          icon: <AlertTriangle className="w-16 h-16" />,
          title: 'Server Error',
          description: 'Something went wrong on our end. Our team has been notified and is working to fix this issue.',
          action: 'Try Again'
        };
      case 403:
        return {
          icon: <AlertTriangle className="w-16 h-16" />,
          title: 'Access Denied',
          description: 'You don\'t have permission to access this page. Please contact your administrator if you think this is a mistake.',
          action: 'Go to Dashboard'
        };
      default:
        return {
          icon: <AlertTriangle className="w-16 h-16" />,
          title: 'Something Went Wrong',
          description: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
          action: 'Go to Dashboard'
        };
    }
  };

  const errorContent = getErrorContent(errorCode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-medical-green opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-medical-light-blue opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="text-6xl font-bold text-white mb-4">{errorCode}</div>
          <div className="text-medical-green mb-6 flex justify-center">
            {errorContent.icon}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="medical-card p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">{errorContent.title}</h1>
          <p className="text-medical-white/80 mb-8 leading-relaxed">
            {errorContent.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="medical-button flex items-center justify-center space-x-2 px-6 py-3"
            >
              <Home className="w-5 h-5" />
              <span>{errorContent.action}</span>
            </motion.button>

            {errorCode === 500 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Page</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <p className="text-medical-white/60 text-sm">
            If you continue to experience issues, please contact our support team.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
