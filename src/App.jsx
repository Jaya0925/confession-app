
import { useState, useEffect } from 'react';


import ConfessionForm from './ConfessionForm';
import './index.css';

function App() {
  // Scroll to confession form
  const handleScroll = () => {
    const form = document.getElementById('confession-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // State for confessions
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Fetch confessions from backend
  useEffect(() => {
    const fetchConfessions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('https://confession-app-rl3h.onrender.com/api/confessions');
        if (!res.ok) {
          let data = {};
          try {
            data = await res.json();
          } catch (jsonErr) {}
          throw new Error(data.error || res.statusText || 'Failed to fetch confessions');
        }
        const data = await res.json();
        setConfessions(data.slice().reverse()); // latest first
      } catch (err) {
        setError(err.message === 'Failed to fetch' ? 'Unable to connect to the server. Please check your connection and ensure the backend is running.' : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConfessions();
    // Listen for new confession event
    window.addEventListener('confession-submitted', fetchConfessions);
    return () => window.removeEventListener('confession-submitted', fetchConfessions);
  }, []);

  return (
    <>
      <div className="landing-bg">
        <div className="landing-container">
          <h1 className="landing-title">Campus Confessions</h1>
          <p className="landing-tagline">Your secrets. Your stories. 100% anonymous.</p>
          <button className="landing-btn" onClick={handleScroll}>Confess Now</button>
        </div>
      </div>
      <div id="confession-form" className="confession-form-section">
        <ConfessionForm />
      </div>
      <div className="confessions-list-section">
        <h2 className="confessions-list-title">Recent Confessions</h2>
        {loading ? (
          <div>Loading confessions...</div>
        ) : error ? (
          <div style={{color:'#b91c1c'}}>{error}</div>
        ) : confessions.length === 0 ? (
          <div style={{color:'#888'}}>No confessions yet. Be the first!</div>
        ) : (
          <div className="confessions-list">
            {confessions.map((c, i) => (
              <div
                className={`confession-item${i === 0 ? ' confession-new' : ''}`}
                key={c.timestamp || i}
              >
                <div className="confession-message">{c.message}</div>
                <div className="confession-time">{new Date(c.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default App
