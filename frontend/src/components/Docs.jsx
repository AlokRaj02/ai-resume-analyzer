import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Sparkles, AlertCircle, Bookmark, Compass, HelpCircle } from 'lucide-react';
import axios from 'axios';

const Docs = () => {
  const navigate = useNavigate();
  const [cvInfo, setCvInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCVData = async () => {
      try {
        // 1. Try loading from localStorage first
        const localData = localStorage.getItem('latest_analysis');
        if (localData) {
          const parsed = JSON.parse(localData);
          setCvInfo(parsed);
          setLoading(false);
          return;
        }

        // 2. If not in localStorage, fetch their most recent analysis from history
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('/api/history');
          if (res.data && res.data.length > 0) {
            const mostRecent = res.data[0];
            setCvInfo(mostRecent);
            localStorage.setItem('latest_analysis', JSON.stringify(mostRecent));
          }
        }
      } catch (err) {
        console.error('Error fetching CV details:', err);
        setError('Failed to retrieve system archives.');
      } finally {
        setLoading(false);
      }
    };

    loadCVData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-8" style={{ padding: '4rem 0' }}>
        <div style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-primary)' }}>
          🔄 RETRIEVING CV DATA STREAMS...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in" style={{ paddingBottom: '3rem', marginTop: '1rem' }}>
      {/* Header */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> BACK
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
          <BookOpen size={22} />
          <span style={{ fontFamily: 'var(--font-primary)', letterSpacing: '1px', fontWeight: 'bold' }}>CV KNOWLEDGE BASE</span>
        </div>
      </div>

      {/* Main Content */}
      {!cvInfo ? (
        /* Empty State: No CV Uploaded */
        <div className="card text-center" style={{ padding: '4rem 2rem', border: '1px dashed var(--border-color)', animation: 'fadeIn 0.3s' }}>
          <AlertCircle size={48} className="text-warning" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
          <h2 style={{ color: 'var(--warning)', fontFamily: 'var(--font-primary)', marginBottom: '1rem' }}>NO ACTIVE CV FOUND</h2>
          <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
            No resume has been analyzed in this session yet. Go to the Hub, upload your CV and target spec, and run the scanner to generate your personalized CV documentation.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            GO TO HUB
          </button>
        </div>
      ) : (
        /* Populated State: CV details identified */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Panel: Summary Banner */}
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-primary)', margin: '0 0 0.5rem 0' }}>
                PROCESSED CANDIDATE INDEX
              </h2>
              <p className="text-muted" style={{ margin: 0 }}>
                This document explains the skills, frameworks, and methodologies found in your analyzed resume.
              </p>
            </div>
            <div style={{ padding: '0.5rem 1.5rem', border: '1px solid var(--primary-color)', borderRadius: '4px', background: 'rgba(0, 243, 255, 0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>MATCH INDEX</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>{cvInfo.score}%</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Left Column: Skills & Explanations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: '2 1 400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <Bookmark size={20} className="text-primary" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-primary)', color: 'var(--text-color)' }}>IDENTIFIED COMPETENCIES</h3>
              </div>

              {cvInfo.cv_explanations && cvInfo.cv_explanations.length > 0 ? (
                cvInfo.cv_explanations.map((item, idx) => (
                  <div key={idx} className="card" style={{ borderLeft: '4px solid var(--primary-color)', position: 'relative' }}>
                    <h4 style={{ color: 'var(--primary-color)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                      <Sparkles size={16} /> {item.skill}
                    </h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                  </div>
                ))
              ) : (
                /* Fallback if older database record doesn't have explanations */
                <div className="card text-center" style={{ padding: '2rem' }}>
                  <p className="text-muted">No specific skill descriptions extracted for this CV. Try scanning a new resume to view definitions here.</p>
                </div>
              )}
            </div>

            {/* Right Column: Recommendations & Target spec info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: '1 1 300px' }}>
              
              {/* Missing Skills section */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                  <Compass size={20} className="text-warning" />
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-primary)', color: 'var(--text-color)' }}>SKILLS GAP SUMMARY</h3>
                </div>
                
                <div className="card" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⚠️ UNRESOLVED SPECIFICATIONS
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0 }}>
                    {cvInfo.missing_skills && cvInfo.missing_skills.length > 0 ? (
                      cvInfo.missing_skills.map((skill, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.05)', padding: '0.6rem', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '4px', fontSize: '0.9rem' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--warning)' }}></span>
                          <span>{skill}</span>
                        </li>
                      ))
                    ) : (
                      <li style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        ✅ All targeted job competencies are present in your CV.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Quick Guidance Info */}
              <div className="card" style={{ border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.02)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💡 RECIPROCAL STRATEGY
                </h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>
                  Study the identified competencies on the left to gain a brief knowledge of your own profile. Use this to prepare for interviews and explain the technologies confidently to senior recruiters.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Docs;
