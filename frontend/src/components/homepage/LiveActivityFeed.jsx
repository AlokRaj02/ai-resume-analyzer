import React, { useState, useEffect } from 'react';
import { Activity, TerminalSquare } from 'lucide-react';

const LiveActivityFeed = () => {
  const [logs, setLogs] = useState([
    { id: 1, time: '14:02:11', file: 'Senior_SWE_Resume.pdf', match: '94%' },
    { id: 2, time: '14:01:45', file: 'Data_Analyst_Profile.docx', match: '78%' },
    { id: 3, time: '14:00:22', file: 'Frontend_Dev_React.pdf', match: '88%' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const roles = ['DevOps_Eng', 'Backend_Ninja', 'Product_Mgr', 'UI_UX_Lead', 'CyberSec_Analyst'];
      const ext = ['.pdf', '.docx'];
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        file: `${roles[Math.floor(Math.random() * roles.length)]}_Resume${ext[Math.floor(Math.random() * ext.length)]}`,
        match: `${Math.floor(Math.random() * 30) + 70}%`
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 4));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card animate-fade-in" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
        <TerminalSquare size={18} color="var(--primary-color)" />
        <span style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.9rem', color: 'var(--primary-color)' }}>GLOBAL_NETWORK_ACTIVITY</span>
        <Activity size={16} color="var(--success)" style={{ marginLeft: 'auto', animation: 'pulse 2s infinite' }} />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {logs.map((log) => (
          <div key={log.id} className="animate-fade-in transition-all" style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>
            <span style={{ color: 'var(--text-color)', flex: 1, paddingLeft: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Evaluating &lt;{log.file}&gt;
            </span>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>SYNERGY: {log.match}</span>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        .transition-all { transition: all 0.3s ease; }
      `}} />
    </div>
  );
};

export default LiveActivityFeed;
