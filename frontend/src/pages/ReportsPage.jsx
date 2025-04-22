import React, { useState } from 'react';
import ReportForm from '../components/ReportForm';
import ReportView from '../components/ReportView';
import '../styles/ReportCharts.css';

const ReportsPage = () => {
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportConfig, setReportConfig] = useState(null);

  const handleReportGenerated = (data, config) => {
    setReportData(data);
    setReportConfig(config);
    setShowReport(true);
  };

  const handleBackToForm = () => {
    setShowReport(false);
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/download/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sensors: reportConfig.selectedSensors,
          reportType: reportConfig.reportType,
          startTime: reportConfig.startTime,
          endTime: reportConfig.endTime,
          dateRange: reportConfig.dateRange,
          reportData,
        }),
      });
  
      if (!response.ok) throw new Error("PDF generation failed");
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "environment_report.pdf";
      a.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  

  return (
    <div className="reports-page">
      {!showReport ? (
        <ReportForm onReportGenerate={handleReportGenerated} />
      ) : (
        <ReportView 
          reportData={reportData} 
          reportConfig={reportConfig}
          onBackToForm={handleBackToForm} 
          handleDownloadPDF={handleDownloadPDF}
        />
      )}
    </div>
  );
};

export default ReportsPage;