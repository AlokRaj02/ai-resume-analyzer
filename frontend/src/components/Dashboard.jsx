import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, AlertCircle, CheckCircle, Lightbulb, ArrowLeft, Target, Award } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dashboardRef = useRef(null);
  
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="text-center mt-8">
        <h2>No analysis data found.</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
          Go back to Upload
        </button>
      </div>
    );
  }

  const { score, missing_skills, feedback } = result;

  // Handle PDF Export
  const downloadPDF = () => {
    const element = dashboardRef.current;
    if (!element) return;

    // We can hide the 'download' button temporarily in CSS with .html2pdf__container or just configure options
    const opt = {
      margin: 10,
      filename: 'resume-analysis-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Circular progress math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let scoreColor = '#ef4444'; // default danger
  if (score >= 75) scoreColor = '#10b981'; // success
  else if (score >= 50) scoreColor = '#f59e0b'; // warning

  return (
    <div className="dashboard-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn btn-outline" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> New Analysis
        </button>
        <button className="btn btn-primary" onClick={downloadPDF}>
          <Download size={18} /> Export as PDF
        </button>
      </div>

      <div ref={dashboardRef} className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: 'var(--bg-color)', padding: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Analysis Report</h1>
          <p className="text-muted">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="card-title" style={{ justifyContent: 'center', borderBottom: 'none' }}>
            <Target className="text-primary" /> Overall Match Score
          </h2>
          <div className="score-circle-wrapper" style={{ position: 'relative', width: '160px', height: '160px', margin: '1rem auto' }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx="80" cy="80" r={radius}
                fill="transparent"
                stroke="var(--border-color)"
                strokeWidth="12"
              />
              <circle
                cx="80" cy="80" r={radius}
                fill="transparent"
                stroke={scoreColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1.5s ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: scoreColor }}>{score}%</span>
            </div>
          </div>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto' }}>
            {score >= 75 ? "Great match! You're a strong candidate for this role." : 
             score >= 50 ? "Good match, but there are some missing skills to address." : 
             "Low match. You may need significant upskilling for this role."}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h2 className="card-title text-warning"><AlertCircle /> Missing Skills</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {missing_skills && missing_skills.length > 0 ? (
                missing_skills.map((skill, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <AlertCircle size={16} className="text-warning" /> <span>{skill}</span>
                  </li>
                ))
              ) : (
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                  <CheckCircle size={16} /> No major skills missing!
                </li>
              )}
            </ul>
          </div>

          <div className="card">
            <h2 className="card-title text-success"><Lightbulb /> Improvement Suggestions</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {feedback?.suggestions?.length > 0 ? (
                feedback.suggestions.map((sug, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle size={16} className="text-success" style={{ marginTop: '0.2rem', flexShrink: 0 }} /> 
                    <span>{sug}</span>
                  </li>
                ))
              ) : (
                <li>No suggestions available.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="card" style={{ marginTop: '1rem' }}>
          <h2 className="card-title text-primary"><Award /> ATS Optimization Tips</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {feedback?.ats_tips?.length > 0 ? (
              feedback.ats_tips.map((tip, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.75rem', borderLeft: '3px solid var(--primary-color)', background: 'rgba(99, 102, 241, 0.05)' }}>
                  <span>{tip}</span>
                </li>
              ))
            ) : (
              <li>No ATS tips given.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
