import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Pill, AlertTriangle, CheckCircle, Search, Upload } from 'lucide-react';

export default function MedicineScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const mockMedicines = [
    {
      name: 'Paracetamol 500mg (Pandol/Panadol)',
      generic: 'Acetaminophen',
      uses: 'Pain relief, fever reduction, headache, muscle aches',
      sideEffects: 'Rare: allergic reactions, liver damage (high doses)',
      interactions: 'Alcohol, blood thinners, other pain medications',
      warnings: 'Do not exceed 4g daily. Avoid with liver disease. Not for children under 6.',
      category: 'Pain Relief',
      riskLevel: 'low'
    },
    {
      name: 'Amoxicillin 500mg',
      generic: 'Amoxicillin',
      uses: 'Bacterial infections, ear infections, pneumonia',
      sideEffects: 'Nausea, diarrhea, allergic reactions, rash',
      interactions: 'Probenecid, oral contraceptives, methotrexate',
      warnings: 'Complete full course. Check for penicillin allergy. May reduce contraceptive effectiveness.',
      category: 'Antibiotic',
      riskLevel: 'medium'
    },
    {
      name: 'Metformin 850mg',
      generic: 'Metformin',
      uses: 'Type 2 diabetes, blood sugar control',
      sideEffects: 'Nausea, diarrhea, vitamin B12 deficiency, metallic taste',
      interactions: 'Contrast media, alcohol, certain diuretics',
      warnings: 'Monitor kidney function. Stop before surgery. Risk of lactic acidosis.',
      category: 'Diabetes',
      riskLevel: 'medium'
    }
  ];

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process - default to Paracetamol (most common)
    setTimeout(() => {
      setScanResult(mockMedicines[0]); // Default to Paracetamol
      setIsScanning(false);
    }, 2000);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsScanning(true);
      setTimeout(() => {
        // Try to match medicine based on filename (better simulation)
        const fileName = file.name.toLowerCase();
        let matchedMedicine;
        
        if (fileName.includes('paracetamol') || fileName.includes('pandol') || fileName.includes('panadol') || fileName.includes('tylenol')) {
          matchedMedicine = mockMedicines[0]; // Paracetamol
        } else if (fileName.includes('amoxicillin') || fileName.includes('antibiotic')) {
          matchedMedicine = mockMedicines[1]; // Amoxicillin
        } else if (fileName.includes('metformin') || fileName.includes('diabetes') || fileName.includes('glucophage')) {
          matchedMedicine = mockMedicines[2]; // Metformin
        } else {
          // Default to Paracetamol for unknown medicines
          matchedMedicine = mockMedicines[0];
        }
        
        setScanResult(matchedMedicine);
        setIsScanning(false);
      }, 1500);
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-dark-blue via-medical-blue to-medical-light-blue p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Pill className="w-10 h-10 text-medical-green" />
            <h1 className="text-3xl font-bold text-white">Medicine Scanner</h1>
          </div>
          <p className="text-medical-white/70 mb-2">
            AI-powered medicine recognition and safety analysis
          </p>
          <p className="text-xs text-yellow-400/80">
            ⚠️ Demo Mode: Filename-based matching. Requires ML backend for real image recognition.
          </p>
        </motion.div>

        {/* Scanner Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="medical-card mb-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Camera Scan */}
            <div className="text-center">
              <div className="bg-white/5 rounded-xl p-8 mb-4 border-2 border-dashed border-white/20">
                {isScanning ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 mx-auto mb-4"
                  >
                    <Camera className="w-full h-full text-medical-green" />
                  </motion.div>
                ) : (
                  <Camera className="w-20 h-20 mx-auto mb-4 text-medical-white/50" />
                )}
                <p className="text-medical-white/70 text-sm">
                  {isScanning ? 'Scanning medicine...' : 'Tap to scan medicine'}
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScan}
                disabled={isScanning}
                className="w-full py-3 bg-medical-green text-white rounded-lg font-semibold hover:bg-medical-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Scan Medicine</span>
              </motion.button>
            </div>

            {/* Upload */}
            <div className="text-center">
              <div className="bg-white/5 rounded-xl p-8 mb-4 border-2 border-dashed border-white/20">
                <Upload className="w-20 h-20 mx-auto mb-4 text-medical-white/50" />
                <p className="text-medical-white/70 text-sm">
                  Upload medicine image
                </p>
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                id="medicine-upload"
              />
              <label
                htmlFor="medicine-upload"
                className="w-full py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Image</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Scan Results */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="medical-card"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{scanResult.name}</h2>
                  <p className="text-medical-white/70 text-sm">{scanResult.generic}</p>
                  {uploadedFileName && (
                    <p className="text-xs text-medical-green/80 mt-1">
                      📁 Uploaded: {uploadedFileName}
                    </p>
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(scanResult.riskLevel)}`}>
                  {scanResult.riskLevel.toUpperCase()} RISK
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-medical-green" />
                    <h3 className="font-semibold text-white">Uses</h3>
                  </div>
                  <p className="text-medical-white/70 text-sm">{scanResult.uses}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold text-white">Side Effects</h3>
                  </div>
                  <p className="text-medical-white/70 text-sm">{scanResult.sideEffects}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Search className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Interactions</h3>
                  </div>
                  <p className="text-medical-white/70 text-sm">{scanResult.interactions}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-white">Warnings</h3>
                  </div>
                  <p className="text-medical-white/70 text-sm">{scanResult.warnings}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setScanResult(null);
                    setUploadedFileName(null);
                  }}
                  className="flex-1 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
                >
                  Scan Another
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-medical-green text-white rounded-lg font-semibold hover:bg-medical-green/90 transition-colors"
                >
                  Save to Records
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mt-6"
        >
          {[
            { icon: Camera, title: 'AI Recognition', desc: 'Advanced image recognition' },
            { icon: AlertTriangle, title: 'Safety Analysis', desc: 'Risk assessment & warnings' },
            { icon: Search, title: 'Drug Interactions', desc: 'Interaction checker' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="medical-card p-4 text-center"
            >
              <feature.icon className="w-8 h-8 text-medical-green mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-medical-white/70 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}