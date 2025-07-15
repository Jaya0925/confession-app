// Confession Form (Frontend)
// To start: npm run dev
// Test: http://localhost:5173
// Backend API: http://localhost:5000

import React, { useState } from 'react';
import './index.css';

const MAX_CHARS = 300;

export default function ConfessionForm() {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  // Handle textarea changes and character limit
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > MAX_CHARS) {
      setWarning(`Character limit of ${MAX_CHARS} exceeded!`);
    } else {
      setWarning('');
      setMessage(value);
    }
  };

  // Submit confession to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!message.trim()) {
      setError('Confession cannot be empty.');
      return;
    }
    if (message.length > MAX_CHARS) {
      setError(`Confession cannot exceed ${MAX_CHARS} characters.`);
      return;
    }
    setSubmitting(true);
    setWarning('');
    try {
      // POST to backend API
      const res = await fetch('https://confession-app-rl3h.onrender.com/api/confess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        let data = {};
        try {
          data = await res.json();
        } catch (jsonErr) {}
        throw new Error(data.error || res.statusText || 'Failed to submit.');
      }
      setSuccess(true);
      setMessage('');
      window.dispatchEvent(new Event('confession-submitted'));
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Unable to connect to the server. Please check your connection and ensure the backend is running.' : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="confession-form" onSubmit={handleSubmit}>
      <h2>Submit Your Confession</h2>
      <textarea
        className="confession-textarea"
        placeholder="Type your confession here..."
        value={message}
        onChange={handleChange}
        maxLength={MAX_CHARS}
        required
        disabled={submitting}
      ></textarea>
      <div className="char-counter">
        {message.length} / {MAX_CHARS} characters
      </div>
      {warning && <div style={{color:'#b45309', marginBottom:'0.5rem'}}>{warning}</div>}
      {error && <div style={{color:'#b91c1c', marginBottom:'0.5rem'}}>{error}</div>}
      {success && <div style={{color:'#059669', marginBottom:'0.5rem'}}>Confession submitted!</div>}
      <button type="submit" className="confession-submit" disabled={submitting || !message.trim()}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
