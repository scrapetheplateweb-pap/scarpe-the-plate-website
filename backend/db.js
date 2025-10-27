const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// For local development, use SQLite if DATABASE_URL contains 'sqlite'
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sqlite')) {
  const dbPath = process.env.DATABASE_URL.replace('sqlite:', '');
  const db = new sqlite3.Database(path.resolve(__dirname, dbPath));
  
  // Create a pool-like interface for SQLite
  const sqlitePool = {
    query: (text, params = []) => {
      return new Promise((resolve, reject) => {
        if (text.toLowerCase().includes('select')) {
          db.all(text, params, (err, rows) => {
            if (err) reject(err);
            else resolve({ rows });
          });
        } else {
          db.run(text, params, function(err) {
            if (err) reject(err);
            else resolve({ rows: [], rowCount: this.changes });
          });
        }
      });
    },
    end: () => db.close()
  };
  
  module.exports = sqlitePool;
} else {
  // Use PostgreSQL for production
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  module.exports = pool;
}
