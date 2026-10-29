import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DoctorRobot({ animationClass = "animate-float", isGreeting = false, showVideo = true }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!showVideo) return;
    
    const video = videoRef.current;
    if (video) {
      // Auto-play video when component mounts
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log('Video autoplay prevented:', error);
        setIsPlaying(false);
      });

      // Add event listeners
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        // Loop the video
        video.currentTime = 0;
        video.play();
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [showVideo]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  // Fallback image for non-landing pages
  if (!showVideo || videoError) {
    return (
      <div className={`w-full h-full ${animationClass} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="/doctor-character.png"
            alt="Doctor AI Assistant"
            className="w-full h-full object-contain max-w-md max-h-md rounded-2xl shadow-2xl"
          />
          
          {/* Simple glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/10 to-medical-green/10 rounded-2xl blur-xl animate-pulse-slow -z-10"></div>
          
          {/* Simple greeting overlay */}
          {isGreeting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                <span className="text-2xl animate-bounce">👋</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${animationClass} flex items-center justify-center`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative w-full max-w-4xl"
        whileHover={{ scale: 1.02 }}
      >
        {/* Video Container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-medical-dark-blue to-medical-blue">
          {/* Robot Video */}
          <video
            ref={videoRef}
            src="/robot-video.mp4"
            alt="Medical AI Robot"
            className="w-full h-auto object-cover rounded-3xl"
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            onClick={handleVideoClick}
            style={{
              minHeight: '500px',
              maxHeight: '600px',
              cursor: 'pointer',
              width: '100%'
            }}
          />
          
          {/* Overlay UI Elements that blend with video */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent"></div>
            
            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Side gradient overlays */}
            <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-black/30 to-transparent"></div>
            <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-black/30 to-transparent"></div>
          </div>

          {/* Interactive UI Elements */}
          <div className="absolute top-4 right-4 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="bg-white/20 backdrop-blur-md rounded-full p-3"
            >
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
          </div>

          {/* Play/Pause Indicator */}
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 flex items-center space-x-2"
            >
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span className="text-white text-sm font-medium">
                {isPlaying ? 'AI Active' : 'AI Ready'}
              </span>
            </motion.div>
          </div>

          {/* Floating Particles that blend with video */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 right-20 w-4 h-4 bg-medical-green rounded-full blur-sm"
            />
            <motion.div
              animate={{
                y: [0, 15, 0],
                x: [0, -8, 0],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-20 left-20 w-3 h-3 bg-medical-light-blue rounded-full blur-sm"
            />
            <motion.div
              animate={{
                y: [0, -25, 0],
                x: [0, 12, 0],
                opacity: [0.2, 0.7, 0.2]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-40 left-32 w-5 h-5 bg-white rounded-full blur-sm"
            />
          </div>

          {/* Greeting Effect */}
          {isGreeting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-white/90 backdrop-blur-sm rounded-full p-6 shadow-lg"
              >
                <span className="text-3xl animate-bounce">👋</span>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/20 to-medical-green/20 rounded-3xl blur-xl animate-pulse-slow -z-10"></div>
      </motion.div>
    </div>
  );
}
