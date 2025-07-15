/*
Confession App Setup & Testing Instructions

Backend (server.js):
- This project uses "type": "commonjs" in package.json, so require() works.
- To start backend: node server.js
- Test backend: Visit http://localhost:5000/api/confessions (should show [] or confessions)
- Server will log: "Server is running on http://localhost:5000"

Backend requirements:
1. express and cors are imported using require()
2. CORS is enabled for all origins
3. Routes:
   - POST /api/confess → accepts and stores confessions
   - GET /api/confessions → returns all confessions
4. Server listens on port 5000

Frontend (src/ConfessionForm.jsx):
1. Use fetch to POST to http://localhost:5000/api/confess
2. Use fetch to GET from http://localhost:5000/api/confessions
3. Add error handling for fetch failures
4. To start frontend: npm run dev
5. Test frontend: Visit http://localhost:5173
6. Submitting a confession should work and show in backend
*/
// Confession App Backend
// To start: node server.js
// Test: http://localhost:5000/api/confessions

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// In-memory storage for confessions
const confessions = [];

// POST /api/confess - Accept a new confession
app.post('/api/confess', (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  confessions.push({ message, timestamp: Date.now() });
  res.status(201).json({ success: true });
});

// GET /api/confessions - Return all confessions
app.get('/api/confessions', (req, res) => {
  res.json(confessions);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
