import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Terminal, ShieldAlert, Cpu, Sparkles, HelpCircle } from 'lucide-react';

const Docs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual');

  const tabs = [
    { id: 'manual', label: 'OPERATION MANUAL', icon: <HelpCircle size={18} /> },
    { id: 'engine', label: 'ATS ENGINE & METRICS', icon: <Cpu size={18} /> },
    { id: 'security', label: 'SECURITY & ACCOUNTS', icon: <ShieldAlert size={18} /> },
    { id: 'deploy', label: 'DEPLOYMENT ARCHITECTURE', icon: <Terminal size={18} /> }
  ];

  return (
    <div className="dashboard-container animate-fade-in" style={{ paddingBottom: '3rem', marginTop: '1rem' }}>
      {/* Header / Navigation back */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> BACK
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
          <BookOpen size={22} />
          <span style={{ fontFamily: 'var(--font-primary)', letterSpacing: '1px', fontWeight: 'bold' }}>SYSTEM DOCUMENTATION</span>
        </div>
      </div>

      {/* Docs Body with layout: Sidebar on left (for desktop) and Content on right */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Sidebar Tabs */}
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '1rem',
                background: activeTab === tab.id ? 'var(--primary-color)' : 'rgba(0,0,0,0.3)',
                color: activeTab === tab.id ? '#000' : 'var(--text-color)',
                border: activeTab === tab.id ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontFamily: 'var(--font-primary)',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'var(--transition)',
                boxShadow: activeTab === tab.id ? '0 0 15px var(--glow-color)' : 'none'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="card" style={{ flex: '3 1 500px', padding: '2rem', minHeight: '400px' }}>
          
          {/* TAB 1: OPERATION MANUAL */}
          {activeTab === 'manual' && (
            <div className="animate-fade-in">
              <h2 style={{ color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-primary)' }}>
                SYSTEM MANUAL & OPERATIONS
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                    <Sparkles size={16} /> 1. Uploading Resumes
                  </h3>
                  <p className="text-muted" style={{ marginLeft: '1.5rem' }}>
                    Drag and drop your candidate resume in the designated upload box. The system supports **PDF** and **DOCX** files up to **5MB**. Text is extracted instantly using raw buffer decoders.
                  </p>
                </div>

                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                    <Sparkles size={16} /> 2. Entering Job Specifications
                  </h3>
                  <p className="text-muted" style={{ marginLeft: '1.5rem' }}>
                    Paste the target job description (parameters, expectations, and tech stack requirements) into the **TARGET_SPEC** input panel. A comprehensive spec yields a more precise evaluation.
                  </p>
                </div>

                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                    <Sparkles size={16} /> 3. Parsing & Evaluation
                  </h3>
                  <p className="text-muted" style={{ marginLeft: '1.5rem' }}>
                    Clicking **INITIATE_ANALYSIS** triggers the core processing module, parsing text data and calling the Google Gemini model. It evaluates parameters like skill matching, formatting compliance, and missing keywords.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ATS ENGINE & METRICS */}
          {activeTab === 'engine' && (
            <div className="animate-fade-in">
              <h2 style={{ color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-primary)' }}>
                ATS ENGINE & SCORING METRICS
              </h2>

              <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                The semantic evaluation uses the `@google/genai` library powering `gemini-2.5-flash` to parse alignment between candidate parameters and target profiles.
              </p>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontFamily: 'var(--font-primary)' }}>SCORE RANGE</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontFamily: 'var(--font-primary)' }}>ALIGNMENT VALUE</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontFamily: 'var(--font-primary)' }}>ACTION RECOMMENDED</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0.75rem', color: 'var(--success)', fontWeight: 'bold' }}>75% - 100%</td>
                    <td style={{ padding: '1rem 0.75rem' }}>High Fit / Pass</td>
                    <td style={{ padding: '1rem 0.75rem' }}>Strong fit. Proceed directly to screening.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0.75rem', color: 'var(--warning)', fontWeight: 'bold' }}>50% - 74%</td>
                    <td style={{ padding: '1rem 0.75rem' }}>Moderate Fit</td>
                    <td style={{ padding: '1rem 0.75rem' }}>Address missing keywords and optimization tips.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem 0.75rem', color: 'var(--danger)', fontWeight: 'bold' }}>0% - 49%</td>
                    <td style={{ padding: '1rem 0.75rem' }}>Low Fit / Reject</td>
                    <td style={{ padding: '1rem 0.75rem' }}>Significant skills gap. Upskilling required.</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderLeft: '3px solid var(--primary-color)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-primary)', color: 'var(--text-color)' }}>AI SYSTEM PROMPT COMPLIANCE</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
                  The model extracts missing core skills, suggests resume optimizations, and flags ATS-specific errors (such as complex columns, non-standard fonts, or missing headers) based on senior recruiter standards.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & ACCOUNTS */}
          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <h2 style={{ color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-primary)' }}>
                SECURITY ARCHITECTURE & ACCESS
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ color: 'var(--success)' }}>🔐 Authentication & JWTs</h3>
                  <p className="text-muted">
                    Session integrity is protected by JSON Web Tokens (JWT). When you sign in, the token is saved in browser storage (`localStorage`) and sent automatically in the headers of request logs (`Authorization: Bearer &lt;token&gt;`).
                  </p>
                </div>

                <div>
                  <h3 style={{ color: 'var(--success)' }}>🛡️ Database Encryption</h3>
                  <p className="text-muted">
                    User credentials (like passwords) are never stored in plain text. We utilize `bcryptjs` with a secure work factor of 10 to hash passwords before database insertion, protecting account security.
                  </p>
                </div>

                <div>
                  <h3 style={{ color: 'var(--success)' }}>✉️ Password Recovery Flow (OTP)</h3>
                  <p className="text-muted">
                    If you request a password reset, a secure 6-digit One-Time Password (OTP) is generated randomly, hashed, stored temporarily with a 10-minute expiration, and sent to your email. Enter the OTP code in the "Verify OTP" form along with your new password to overwrite the security parameters.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEPLOYMENT ARCHITECTURE */}
          {activeTab === 'deploy' && (
            <div className="animate-fade-in">
              <h2 style={{ color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-primary)' }}>
                DEPLOYMENT LOGISTICS
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ color: 'var(--success)' }}>☁️ Render.com (Backend Web Service)</h3>
                  <p className="text-muted">
                    The Express application is deployed on Render.com as an independent web service. It binds to the system port dynamically and exposes backend API routes under `https://ai-resume-analyzer-o4s2.onrender.com`.
                  </p>
                </div>

                <div>
                  <h3 style={{ color: 'var(--success)' }}>⚡ Vercel (Frontend & Serverless Routing)</h3>
                  <p className="text-muted">
                    The React SPA assets are deployed on Vercel. Static assets are compiled into the `dist/` directory. Vercel utilizes rewrites defined in `vercel.json` to proxy API requests directly, ensuring seamless routing.
                  </p>
                </div>

                <div>
                  <h3 style={{ color: 'var(--success)' }}>🗄️ Database (MongoDB Atlas)</h3>
                  <p className="text-muted">
                    Data storage runs on a multi-region MongoDB Atlas cluster. The database connection maintains secure user and analysis records, linked seamlessly with both Render and Vercel instances.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Docs;
