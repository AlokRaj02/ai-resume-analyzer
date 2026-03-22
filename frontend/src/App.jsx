import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadForm from './components/UploadForm';
import Dashboard from './components/Dashboard';
import History from './components/History';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container animate-fade-in">
        <Routes>
          <Route path="/" element={<UploadForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
