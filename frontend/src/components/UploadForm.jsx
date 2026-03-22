import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    if (
      selectedFile.type === 'application/pdf' ||
      selectedFile.type === 'application/msword' ||
      selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF or DOC resume.');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError('Both resume and job description are required.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard', { state: { result: response.data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to analyze resume. Please ensure the backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h1 className="hero-title">Optimize Your Resume for the Job</h1>
        <p className="hero-subtitle">Upload your resume and the job description to get AI-powered feedback and a match score in seconds.</p>
      </div>

      <div className="upload-grid">
        <div className="card upload-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="card-title"><FileText className="text-primary" /> Step 1: Upload Resume</h2>
          
          <div 
            className={`dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.doc,.docx" 
              hidden 
            />
            
            {file ? (
              <div className="file-preview">
                <FileText size={48} className="text-success mb-4" />
                <p className="file-name">{file.name}</p>
                <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  className="btn btn-outline btn-sm mt-4" 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="dropzone-content">
                <div className="icon-circle">
                  <UploadCloud size={32} />
                </div>
                <h3>Drag & Drop your resume here</h3>
                <p>or click to browse files</p>
                <span className="file-hint">Supports PDF, DOC, DOCX (Max 5MB)</span>
              </div>
            )}
          </div>
        </div>

        <div className="card upload-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="card-title"><Briefcase className="text-primary" /> Step 2: Job Description</h2>
          <div className="form-group h-full">
            <textarea
              className="form-control jd-textarea"
              placeholder="Paste the job description here (e.g., requirements, responsibilities, skills)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="error-alert animate-fade-in">
          {error}
        </div>
      )}

      <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <button 
          className="btn btn-primary btn-lg analyze-btn" 
          onClick={handleSubmit}
          disabled={!file || !jobDescription || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="spinner" size={24} /> Analyzing...
            </>
          ) : (
            <>
              Analyze Match <ChevronRight size={24} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
