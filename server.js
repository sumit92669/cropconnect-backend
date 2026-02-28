const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./database/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Make db available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Test API
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Get all crops
app.get('/api/crops', (req, res) => {
  db.all('SELECT * FROM crops ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching crops:', err);
      res.status(500).json({ error: 'Server error' });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});