/**
 * Service for exporting conversations to PDF
 * Uses jsPDF to generate professional medical reports
 */

import jsPDF from 'jspdf';

class PDFExportService {
  /**
   * Exporte une conversation en PDF
   */
  exportConversationToPDF(conversation, options = {}) {
    const {
      title = 'AI Medical Consultation Report',
      includeMetadata = true,
      includeTimestamps = true
    } = options;

    const doc = new jsPDF();
    
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    const maxWidth = doc.internal.pageSize.width - (margin * 2);

    // Titre
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yPosition);
    yPosition += 15;

    // Métadonnées
    if (includeMetadata && conversation.metadata) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const metadata = [
        `Date: ${new Date().toLocaleDateString('en-US')}`,
        `Analysis mode: ${conversation.metadata.analysisMode || 'Not specified'}`,
        `User type: ${conversation.metadata.isDoctorView ? 'Doctor' : 'Patient'}`,
        `Nombre de messages: ${conversation.messages.length}`
      ];

      metadata.forEach(meta => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(meta, margin, yPosition);
        yPosition += lineHeight;
      });

      yPosition += 10;
    }

    // Messages
    doc.setFontSize(12);
    conversation.messages.forEach((message, index) => {
      // Vérifier si on doit changer de page
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      // Type de message
      doc.setFont('helvetica', 'bold');
      const sender = message.type === 'user' ? '👤 Vous' : '🤖 Assistant IA';
      doc.text(sender, margin, yPosition);
      yPosition += lineHeight;

      // Timestamp
      if (includeTimestamps && message.timestamp) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(message.timestamp, margin, yPosition);
        yPosition += lineHeight;
        doc.setFontSize(12);
      }

      // Contenu
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(message.content, maxWidth);
      
      lines.forEach(line => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      yPosition += 10;
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${i} / ${pageCount} - Généré par MedAI Platform`,
        margin,
        pageHeight - 10
      );
    }

    // Sauvegarder
    doc.save(`conversation_${conversation.id || Date.now()}.pdf`);
  }

  /**
   * Exporte les résultats d'analyse médicale en PDF (version améliorée)
   */
  async exportMedicalAnalysis(analysisData, patientInfo) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(0, 119, 182); // Medical blue
      doc.text('AI Medical Analysis Report', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString('en-US')} at ${new Date().toLocaleTimeString('en-US')}`, pageWidth / 2, 30, { align: 'center' });
      
      // Ligne de séparation
      doc.setDrawColor(0, 119, 182);
      doc.line(20, 35, pageWidth - 20, 35);
      
      // Informations patient
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Patient Information', 20, 50);
      
      doc.setFontSize(10);
      doc.setTextColor(60);
      let yPos = 60;
      
      if (patientInfo) {
        doc.text(`Nom: ${patientInfo.name || 'Non spécifié'}`, 25, yPos);
        yPos += 7;
        doc.text(`Âge: ${patientInfo.age || 'Non spécifié'}`, 25, yPos);
        yPos += 7;
        doc.text(`Sexe: ${patientInfo.gender || 'Non spécifié'}`, 25, yPos);
        yPos += 7;
        doc.text(`IMC: ${patientInfo.bmi || 'Non spécifié'}`, 25, yPos);
        yPos += 10;
      }
      
      // Analysis results
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Analysis Results', 20, yPos);
      yPos += 10;
      
      if (analysisData) {
        // Risque Diabète
        doc.setFontSize(12);
        doc.setTextColor(82, 183, 136); // Green
        doc.text('Risque Diabète', 25, yPos);
        yPos += 7;
        
        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text(`Score: ${analysisData.diabetes?.score || 'N/A'}%`, 30, yPos);
        yPos += 7;
        doc.text(`Niveau: ${analysisData.diabetes?.level || 'N/A'}`, 30, yPos);
        yPos += 7;
        doc.text(`Confiance: ${analysisData.diabetes?.confidence ? (analysisData.diabetes.confidence * 100).toFixed(1) : 'N/A'}%`, 30, yPos);
        yPos += 7;
        doc.text(`Modèle: ${analysisData.diabetes?.model_used || 'N/A'}`, 30, yPos);
        yPos += 10;
        
        // Risque Cardiovasculaire
        doc.setFontSize(12);
        doc.setTextColor(82, 183, 136);
        doc.text('Risque Cardiovasculaire', 25, yPos);
        yPos += 7;
        
        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text(`Score: ${analysisData.cardiovascular?.score || 'N/A'}%`, 30, yPos);
        yPos += 7;
        doc.text(`Niveau: ${analysisData.cardiovascular?.level || 'N/A'}`, 30, yPos);
        yPos += 7;
        doc.text(`Confiance: ${analysisData.cardiovascular?.confidence ? (analysisData.cardiovascular.confidence * 100).toFixed(1) : 'N/A'}%`, 30, yPos);
        yPos += 7;
        doc.text(`Modèle: ${analysisData.cardiovascular?.model_used || 'N/A'}`, 30, yPos);
        yPos += 10;
        
        // Risque Global
        doc.setFontSize(12);
        doc.setTextColor(82, 183, 136);
        doc.text('Risque Global', 25, yPos);
        yPos += 7;
        
        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text(`Score: ${analysisData.overall?.score ? analysisData.overall.score.toFixed(1) : 'N/A'}%`, 30, yPos);
        yPos += 7;
        doc.text(`Niveau: ${analysisData.overall?.level || 'N/A'}`, 30, yPos);
        yPos += 10;
        
        // Facteurs de risque
        if (analysisData.diabetes?.factors && analysisData.diabetes.factors.length > 0) {
          doc.setFontSize(12);
          doc.setTextColor(0);
          doc.text('Facteurs de Risque Identifiés', 25, yPos);
          yPos += 7;
          
          doc.setFontSize(9);
          doc.setTextColor(60);
          analysisData.diabetes.factors.forEach((factor, index) => {
            doc.text(`• ${factor}`, 30, yPos);
            yPos += 6;
          });
          yPos += 5;
        }
        
        // Recommandations
        if (analysisData.recommendations && analysisData.recommendations.length > 0) {
          doc.setFontSize(12);
          doc.setTextColor(0);
          doc.text('Recommandations', 25, yPos);
          yPos += 7;
          
          doc.setFontSize(9);
          doc.setTextColor(60);
          analysisData.recommendations.forEach((rec, index) => {
            doc.text(`${index + 1}. ${rec}`, 30, yPos);
            yPos += 6;
          });
        }
      }
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Ce rapport est généré par une IA et ne constitue pas un diagnostic médical.', pageWidth / 2, pageHeight - 20, { align: 'center' });
      doc.text('Consultez toujours un professionnel de santé pour un avis médical.', pageWidth / 2, pageHeight - 15, { align: 'center' });
      
      // Save PDF
      doc.save(`analysis_report_${Date.now()}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  }

  /**
   * Exports a health report to PDF
   */
  exportHealthReportToPDF(healthData, options = {}) {
    const {
      title = 'Health Report',
      patientName = 'Patient'
    } = options;

    const doc = new jsPDF();
    
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    // En-tête
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Patient: ${patientName}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`, margin, yPosition);
    yPosition += 15;

    // Métriques de santé
    if (healthData.metrics) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Métriques de Santé', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      Object.entries(healthData.metrics).forEach(([key, value]) => {
        if (value !== undefined && yPosition < pageHeight - margin) {
          doc.text(`${key}: ${value}`, margin, yPosition);
          yPosition += lineHeight;
        }
      });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${i} / ${pageCount} - Report generated by MedAI Platform`,
        margin,
        pageHeight - 10
      );
    }

    doc.save(`health_report_${Date.now()}.pdf`);
  }
}

const pdfExportService = new PDFExportService();
export default pdfExportService;
