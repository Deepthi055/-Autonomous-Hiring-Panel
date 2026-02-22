import React, { useState } from 'react';
import { Check, Printer } from 'lucide-react';

export default function ReportGenerator({ data, className = "mt-8 text-center" }) {
  const [isSaved, setIsSaved] = useState(false);

  const generateReportText = () => {
    const { candidateName, candidateEmail, candidatePhone, evaluationResult } = data;
    const date = new Date().toLocaleDateString();
    
    // Helper to format list items
    const formatList = (items) => {
      if (!items || !Array.isArray(items) || items.length === 0) return 'Not Available';
      return items.map(item => `- ${item}`).join('\n');
    };

    // Helper to normalize score to 0-10 scale
    const formatAgentScore = (score) => {
      if (score === undefined || score === null) return 'Not Available';
      let num = parseFloat(score);
      if (isNaN(num)) return 'Not Available';
      // Normalize: if <= 1 assume 0-1 scale -> 0-10
      // if > 10 assume 0-100 scale -> 0-10
      if (num <= 1) num = num * 10;
      else if (num > 10) num = num / 10;
      return num.toFixed(1) + '/10';
    };

    // Helper to normalize overall score to percentage
    const formatOverallScore = (score) => {
      if (score === undefined || score === null) return 'Not Available';
      let num = parseFloat(score);
      if (isNaN(num)) return 'Not Available';
      // If score is <= 1, assume it's normalized 0-1, convert to %
      if (num <= 1) num = num * 100;
      return Math.round(num) + '%';
    };

    if (!evaluationResult) return "No evaluation data available.";

    const { consensus, resume, technical, behavioral, claims } = evaluationResult;

    let report = `====================================================\n`;
    report += `AI HIRING EVALUATION REPORT\n`;
    report += `====================================================\n\n`;
    
    report += `Candidate: ${candidateName || 'Not Available'}\n`;
    report += `Email: ${candidateEmail || 'Not Available'}\n`;
    report += `Phone: ${candidatePhone || 'Not Available'}\n`;
    report += `Date: ${date}\n\n`;

    report += `1. FINAL DECISION\n`;
    report += `----------------------------------------------------\n`;
    report += `Prediction: ${consensus?.verdict || 'Not Available'}\n`;
    report += `Overall Score: ${formatOverallScore(consensus?.finalScore)}\n`;
    report += `Confidence Level: ${formatOverallScore(consensus?.confidenceLevel)}\n\n`;

    report += `2. AGENT PERFORMANCE BREAKDOWN\n`;
    report += `----------------------------------------------------\n`;
    report += `Resume Agent: ${formatAgentScore(resume?.score)}\n`;
    report += `Technical Agent: ${formatAgentScore(technical?.score)}\n`;
    report += `Behavioral Agent: ${formatAgentScore(behavioral?.score)}\n`;
    report += `Claims Agent: ${formatAgentScore(claims?.score)}\n\n`;

    report += `3. DETAILED ANALYSIS\n\n`;

    report += `3.1 Resume Evaluation\n`;
    report += `Strengths:\n${formatList(resume?.strengths)}\n`;
    report += `Concerns:\n${formatList(resume?.concerns)}\n`;
    report += `Skill Gaps:\n${formatList(resume?.gaps)}\n\n`;

    report += `3.2 Technical Evaluation\n`;
    report += `Strengths:\n${formatList(technical?.strengths)}\n`;
    report += `Concerns:\n${formatList(technical?.concerns)}\n`;
    report += `Skill Gaps:\n${formatList(technical?.gaps)}\n\n`;

    report += `3.3 Behavioral Evaluation\n`;
    report += `Strengths:\n${formatList(behavioral?.strengths)}\n`;
    report += `Concerns:\n${formatList(behavioral?.concerns)}\n`;
    report += `Skill Gaps:\n${formatList(behavioral?.gaps)}\n\n`;

    report += `3.4 Claims Verification\n`;
    report += `Strengths:\n${formatList(claims?.strengths)}\n`;
    report += `Concerns:\n${formatList(claims?.concerns)}\n`;
    report += `Skill Gaps:\n${formatList(claims?.gaps)}\n`;
    report += `Contradictions:\n${formatList(claims?.contradictions)}\n\n`;

    report += `4. OVERALL EXECUTIVE SUMMARY\n`;
    report += `----------------------------------------------------\n`;
    report += `${consensus?.summary || 'Not Available'}\n\n`;

    report += `====================================================\n`;
    report += `End of Report\n`;
    report += `====================================================\n`;

    return report;
  };

  const generateReportHTML = () => {
    const { candidateName, candidateEmail, candidatePhone, evaluationResult } = data;
    const date = new Date().toLocaleDateString();
    const { consensus, resume, technical, behavioral, claims } = evaluationResult || {};

    const formatScore = (val) => {
      if (val === undefined || val === null) return 'N/A';
      let num = parseFloat(val);
      if (num <= 1) num = num * 10;
      else if (num > 10) num = num / 10;
      return num.toFixed(1) + '/10';
    };

    const formatPercent = (val) => {
      if (val === undefined || val === null) return 'N/A';
      let num = parseFloat(val);
      if (num <= 1) num = num * 100;
      return Math.round(num) + '%';
    };

    const formatList = (items) => {
      if (!items || !items.length) return '<p class="text-gray-400 italic text-sm">None</p>';
      return `<ul class="list-disc pl-5 space-y-1 text-sm text-gray-700">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    };

    const verdictColor = (consensus?.verdict || '').toLowerCase().includes('no') ? 'text-red-600' : 'text-green-600';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Evaluation Report - ${candidateName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
          body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        </style>
      </head>
      <body class="bg-white p-8 max-w-4xl mx-auto">
        <!-- Header -->
        <div class="border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">AI Hiring Evaluation Report</h1>
            <p class="text-gray-500 mt-1">Generated by VerdictAI</p>
          </div>
          <div class="text-right">
            <h2 class="text-xl font-bold text-gray-900">${candidateName || 'Candidate Name'}</h2>
            <p class="text-gray-600">${candidateEmail || ''}</p>
            <p class="text-gray-600">${candidatePhone || ''}</p>
            <p class="text-sm text-gray-400 mt-2">Date: ${date}</p>
          </div>
        </div>

        <!-- Executive Summary -->
        <div class="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide border-b pb-2">1. Executive Summary</h3>
          <div class="grid grid-cols-3 gap-6 mb-6">
            <div class="text-center p-4 bg-white rounded-lg shadow-sm">
              <p class="text-xs text-gray-500 uppercase font-semibold">Verdict</p>
              <p class="text-2xl font-bold ${verdictColor}">${consensus?.verdict || 'Pending'}</p>
            </div>
            <div class="text-center p-4 bg-white rounded-lg shadow-sm">
              <p class="text-xs text-gray-500 uppercase font-semibold">Overall Score</p>
              <p class="text-2xl font-bold text-indigo-600">${formatPercent(consensus?.finalScore)}</p>
            </div>
            <div class="text-center p-4 bg-white rounded-lg shadow-sm">
              <p class="text-xs text-gray-500 uppercase font-semibold">Confidence</p>
              <p class="text-2xl font-bold text-gray-700">${formatPercent(consensus?.confidenceLevel)}</p>
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed">${consensus?.summary || 'No summary available.'}</p>
        </div>

        <!-- Agent Breakdown -->
        <div class="mb-8">
          <h3 class="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide border-b pb-2">2. Agent Analysis</h3>
          <div class="grid grid-cols-2 gap-6">
            ${[
              { name: 'Resume Analysis', data: resume, color: 'blue' },
              { name: 'Technical Assessment', data: technical, color: 'purple' },
              { name: 'Behavioral Assessment', data: behavioral, color: 'green' },
              { name: 'Claim Verification', data: claims, color: 'orange' }
            ].map(agent => `
              <div class="border rounded-xl p-5 break-inside-avoid">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-bold text-gray-800">${agent.name}</h4>
                  <span class="bg-${agent.color}-100 text-${agent.color}-800 text-xs font-bold px-2 py-1 rounded">
                    Score: ${formatScore(agent.data?.score)}
                  </span>
                </div>
                <div class="space-y-3">
                  <div><p class="text-xs font-bold text-green-700 uppercase mb-1">Strengths</p>${formatList(agent.data?.strengths)}</div>
                  <div><p class="text-xs font-bold text-red-700 uppercase mb-1">Concerns</p>${formatList(agent.data?.concerns)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-xs text-gray-400 mt-12 border-t pt-4">
          <p>Confidential - Generated by VerdictAI Autonomous Hiring Panel</p>
        </div>
      </body>
      </html>
    `;
  };

  const handleGenerateAndPrint = () => {
    const reportText = generateReportText();
    const { candidateName } = data;
    
    // 1. Save to Local Storage
    const reportId = Date.now();
    const reportEntry = {
      id: reportId,
      candidateName,
      date: new Date().toISOString(),
      content: reportText
    };
    
    const existingReports = JSON.parse(localStorage.getItem('interview_reports') || '[]');
    existingReports.push(reportEntry);
    localStorage.setItem('interview_reports', JSON.stringify(existingReports));
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate the report.');
      return;
    }

    printWindow.document.write(generateReportHTML());
    printWindow.document.write(`<script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); };</script>`);
    printWindow.document.close();

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className={className}>
      <button
        onClick={handleGenerateAndPrint}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
          isSaved 
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
        }`}
      >
        {isSaved ? <><Check size={20} /> Report Saved</> : <><Printer size={20} /> Print / Save as PDF</>}
      </button>
    </div>
  );
}
