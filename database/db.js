const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Simple database connection without sqlite wrapper
const db = new sqlite3.Database(
  path.join(__dirname, 'cropconnect.db'),
  (err) => {
    if (err) {
      console.error('❌ Database connection error:', err.message);
    } else {
      console.log('✅ Database connected successfully');
      
      // Create tables
      db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fullName TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'farmer',
          location TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) console.error('Error creating users table:', err.message);
          else console.log('✅ Users table ready');
        });

        // Crops table
        db.run(`CREATE TABLE IF NOT EXISTS crops (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          unit TEXT DEFAULT 'quintal',
          farmer TEXT NOT NULL,
          location TEXT NOT NULL,
          image TEXT,
          category TEXT DEFAULT 'grains',
          lat REAL DEFAULT 28.6139,
          lng REAL DEFAULT 77.2090,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) console.error('Error creating crops table:', err.message);
          else console.log('✅ Crops table ready');
        });
      });
    }
  }
);

module.exports = db;