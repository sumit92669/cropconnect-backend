const express = require('express');
const cors = require('cors');
const { pool, createTables } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS for Vercel frontend and local
app.use(cors({
  origin: ['https://cropconnect-gamma.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Create tables on startup
createTables();

// Test API
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working on Railway!' });
});

// Get all crops
app.get('/api/crops', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM crops ORDER BY createdat DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single crop
app.get('/api/crops/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM crops WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching crop:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Auth routes (simplified for now)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Temporary demo login
    if (email === 'farmer@demo.com' && password === 'farmer123') {
      return res.json({
        message: 'Login successful',
        token: 'demo-token',
        user: { id: 1, fullName: 'Demo Farmer', email, role: 'farmer' }
      });
    }
    
    if (email === 'buyer@demo.com' && password === 'buyer123') {
      return res.json({
        message: 'Login successful',
        token: 'demo-token',
        user: { id: 2, fullName: 'Demo Buyer', email, role: 'buyer' }
      });
    }
    
    res.status(400).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});