/**
 * ADTC Chat Wrapper Component
 * Integrates local LLM backend with existing ChatWithAI design
 * No changes to UI - just backend integration
 */

import React, { useState, useEffect } from 'react';
import adtcService from '../services/adtcService';
import { Bot, Activity, Cpu, Thermometer } from 'lucide-react';

const ADTCChatWrapper = ({ children, onMessage, conversationHistory }) => {
  const [adtcStatus, setAdtcStatus] = useState({
    connected: false,
    modelLoaded: false,
    ragLoaded: false,
    memory: null,
    temperature: null
  });
  const [showMetrics, setShowMetrics] = useState(false);

  // Check ADTC backend health on mount
  useEffect(() => {
    checkADTCHealth();
    const interval = setInterval(checkADTCHealth, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const checkADTCHealth = async () => {
    const health = await adtcService.checkHealth();
    if (health.success) {
      setAdtcStatus({
        connected: true,
        modelLoaded: health.data.model_loaded,
        ragLoaded: health.data.rag_loaded,
        memory: health.data.memory_gb,
        temperature: health.data.temperature_c
      });
    } else {
      setAdtcStatus(prev => ({ ...prev, connected: false }));
    }
  };

  const handleADTCMessage = async (message) => {
    if (!adtcStatus.connected) {
      return {
        success: false,
        response: "⚠️ Backend ADTC non connecté. Démarrez avec: python backend-adtc/start.py",
        sources: []
      };
    }

    const result = await adtcService.chat(message, conversationHistory, true);
    
    if (result.success) {
      return {
        success: true,
        response: result.response,
        sources: result.sources,
        metrics: result.metrics
      };
    } else {
      return {
        success: false,
        response: "❌ Erreur de connexion au backend ADTC",
        sources: []
      };
    }
  };

  // Pass the ADTC handler to parent if provided
  useEffect(() => {
    if (onMessage) {
      onMessage(handleADTCMessage);
    }
  }, [onMessage, adtcStatus]);

  return (
    <>
      {/* ADTC Status Indicator - Minimal, non-intrusive */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className={`p-2 rounded-full shadow-lg transition-all ${
            adtcStatus.connected 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={adtcStatus.connected ? 'ADTC Connected' : 'ADTC Disconnected'}
        >
          <Bot size={20} className="text-white" />
        </button>

        {/* Metrics Popup */}
        {showMetrics && (
          <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-64 border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Activity size={16} />
              ADTC 2026 Metrics
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={adtcStatus.connected ? 'text-green-500' : 'text-red-500'}>
                  {adtcStatus.connected ? '✅ Connected' : '❌ Disconnected'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Model:</span>
                <span className={adtcStatus.modelLoaded ? 'text-green-500' : 'text-yellow-500'}>
                  {adtcStatus.modelLoaded ? '✅ Loaded' : '⏳ Loading...'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">RAG:</span>
                <span className={adtcStatus.ragLoaded ? 'text-green-500' : 'text-yellow-500'}>
                  {adtcStatus.ragLoaded ? '✅ Loaded' : '⏳ Loading...'}
                </span>
              </div>
              
              {adtcStatus.memory && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Cpu size={12} />
                    Memory:
                  </span>
                  <span className={adtcStatus.memory < 7 ? 'text-green-500' : 'text-red-500'}>
                    {adtcStatus.memory.toFixed(2)} GB
                  </span>
                </div>
              )}
              
              {adtcStatus.temperature && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Thermometer size={12} />
                    Temp:
                  </span>
                  <span className={adtcStatus.temperature < 85 ? 'text-green-500' : 'text-red-500'}>
                    {adtcStatus.temperature.toFixed(1)}°C
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
              <p>🌍 African Medical AI</p>
              <p>📴 Offline-First</p>
              <p>🎯 ADTC 2026 Optimized</p>
            </div>
          </div>
        )}
      </div>

      {/* Render children (existing ChatWithAI component) */}
      {children}
    </>
  );
};

export default ADTCChatWrapper;
