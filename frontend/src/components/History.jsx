import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/api/history');
                setHistory(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) {
        return <div className="text-center mt-8"><h2>Loading history...</h2></div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-danger"><h2>{error}</h2></div>;
    }

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
                <Clock className="text-primary inline mr-2" /> Past Analyses
            </h1>

            {history.length === 0 ? (
                <div className="card text-center">
                    <p className="text-muted mb-4">You haven't run any resume analyses yet.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>Analyze Resume</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.map((item) => {
                        const date = new Date(item.created_at).toLocaleString();
                        let scoreColor = 'var(--danger)';
                        if (item.score >= 75) scoreColor = 'var(--success)';
                        else if (item.score >= 50) scoreColor = 'var(--warning)';

                        return (
                            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Analysis #{item.id}</h3>
                                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>{date}</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                                        {item.missing_skills?.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} style={{ background: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
                                                {skill}
                                            </span>
                                        ))}
                                        {item.missing_skills?.length > 3 && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>+{item.missing_skills.length - 3} more missing</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 800, color: scoreColor }}>{item.score}%</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match Score</div>
                                    </div>
                                    <button disabled className="btn btn-outline" style={{ display: 'none' }} title="Viewing full past analysis not fully implemented yet">
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default History;
