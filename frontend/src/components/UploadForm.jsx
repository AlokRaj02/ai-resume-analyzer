import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Briefcase, Zap, BrainCircuit, ChevronRight, Loader2, Terminal, Activity } from 'lucide-react';
import axios from 'axios';

import ParticleNetwork from './animations/ParticleNetwork';
import GridBackground from './animations/GridBackground';
import TypingHero from './animations/TypingHero';
import TechTicker from './animations/TechTicker';
import TerminalDemo from './animations/TerminalDemo';
import ProcessTimeline from './animations/ProcessTimeline';
import SkillMatchBars from './animations/SkillMatchBars';

import GlobalStats from './homepage/GlobalStats';
import CoreFeaturesGrid from './homepage/CoreFeaturesGrid';
import LiveActivityFeed from './homepage/LiveActivityFeed';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [model, setModel] = useState('gemini');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) handleFileSelection(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) handleFileSelection(e.target.files[0]);
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile.type.includes('pdf') || selectedFile.type.includes('word')) {
      setFile(selectedFile); setError('');
    } else {
      setError('Please upload a PDF or DOC resume.'); setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) return setError('Both resume and job description are required.');
    setIsAnalyzing(true); setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);
    formData.append('model', model);

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard', { state: { result: response.data } });
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Target core offline.');
    } finally { setIsAnalyzing(false); }
  };

  return (
    <div className="page-wrapper">
      <ParticleNetwork />
      <GridBackground />
      <div className="scanline-overlay"></div>

      {/* Main Content */}
      <div className="container" style={{ marginTop: '2rem' }}>
        
        {/* HERO SECTION */}
        <div className="text-center mb-8 animate-fade-in" style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', textShadow: '0 0 20px var(--glow-color)' }}>
            <TypingHero 
              phrases={[
                "SYSTEM OVERRIDE: PERFECT MATCH", 
                "OPTIMIZE YOUR CORE METRICS", 
                "NEURAL ATS BYPASS INITIATED", 
                "CALCULATING SYNERGY PROBABILITY"
              ]} 
              typingSpeed={50}
            />
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Upload your candidate data and the target spec. 
            Our semantic engine will evaluate the alignment index in real-time.
          </p>
          <ProcessTimeline />
          <GlobalStats />
        </div>

        {/* ENGINE SELECTOR */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '30px', padding: '0.3rem', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setModel('gemini')}
              style={{ padding: '0.8rem 1.5rem', borderRadius: '30px', border: 'none', background: model === 'gemini' ? 'var(--primary-color)' : 'transparent', color: model === 'gemini' ? '#000' : 'var(--text-color)', fontWeight: 'bold', cursor: 'pointer', transition: 'var(--transition)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Zap size={18} /> GEMINI NEURAL
            </button>
            <button 
              onClick={() => setModel('claude')}
              style={{ padding: '0.8rem 1.5rem', borderRadius: '30px', border: 'none', background: model === 'claude' ? 'var(--success)' : 'transparent', color: model === 'claude' ? '#000' : 'var(--text-color)', fontWeight: 'bold', cursor: 'pointer', transition: 'var(--transition)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <BrainCircuit size={18} /> CLAUDE COGNITIVE
            </button>
          </div>
        </div>

        {/* UPLOAD CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <FileText size={24} /> // DATA_INPUT: RESUME
            </h2>
            <div 
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? 'var(--primary-color)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)', padding: '3rem 2rem', textAlign: 'center',
                cursor: 'pointer', background: isDragging ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)',
                transition: 'var(--transition)'
              }}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" hidden />
              {file ? (
                <div>
                  <FileText size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
                  <div style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-secondary)' }}>{file.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(file.size/1024/1024).toFixed(2)} MB</div>
                </div>
              ) : (
                <div>
                  <UploadCloud size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                  <div style={{ color: 'var(--text-color)', marginBottom: '0.5rem', fontFamily: 'var(--font-secondary)' }}>DRAG & DROP FILE HERE</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SUPPORTED: PDF, DOCX (MAX 5MB)</div>
                </div>
              )}
            </div>
          </div>

          <div className="card animate-fade-in" style={{ animationDelay: '0.3s', display: 'flex', flexDirection: 'column' }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <Briefcase size={24} /> // TARGET_SPEC: JOB DESC
            </h2>
            <textarea
              className="form-control"
              style={{ flex: 1, resize: 'none', minHeight: '150px' }}
              placeholder="Paste the target job description parameters here to compute semantic match..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '2rem', textAlign: 'center', fontFamily: 'var(--font-secondary)' }}>
            ⚠️ CRITICAL ERROR: {error}
          </div>
        )}

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s', marginTop: '3rem', marginBottom: '3rem' }}>
          <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }} onClick={handleSubmit} disabled={!file || !jobDescription || isAnalyzing}>
            {isAnalyzing ? (
              <><Loader2 className="spinner" size={24} style={{ animation: 'spin 1s linear infinite' }} /> PROCESSING_REQUEST...</>
            ) : (
              <><Activity size={24}/> INITIATE_ANALYSIS</>
            )}
          </button>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>

        {/* DEMO / FEATURES SECTION */}
        <CoreFeaturesGrid />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', paddingBottom: '4rem' }}>
          <div className="card">
             <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Terminal size={20}/> LOG_OUTPUT</h3>
             {!showDemo ? (
               <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                 <button className="btn btn-outline" onClick={() => setShowDemo(true)}>RUN SIMULATION</button>
               </div>
             ) : (
               <TerminalDemo />
             )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>PREDICTIVE_MATCH_MODEL</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Example rendering of the deep learning skill evaluation matrix.</p>
              <SkillMatchBars skills={[
                { name: 'React Architecture', score: 94 },
                { name: 'Node.js Microservices', score: 88 },
                { name: 'Docker / Kubernetes', score: 72 },
                { name: 'System Design', score: 81 }
              ]} />
            </div>
            <LiveActivityFeed />
          </div>
        </div>

      </div>
      
      {/* Tech Ticker full width at bottom */}
      <TechTicker />
    </div>
  );
};

export default UploadForm;
