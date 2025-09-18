import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database
const database = new sqlite3.Database('./GlobalCounter.db');

// Setup simple counter table
database.run(`CREATE TABLE IF NOT EXISTS counter (
  totalCount INTEGER DEFAULT 0
)`);

// Initialize with zero if empty
database.get("SELECT totalCount FROM counter", (error, row) => {
  if (!row) {
    database.run("INSERT INTO counter (totalCount) VALUES (0)");
  }
});

app.get('/', (req, res) => {
  res.json({ number: 1 });
});

app.get('/api/count', (req, res) => {
  database.get("SELECT totalCount FROM counter", (error, row) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ count: row ? row.totalCount : 0 });
  });
});

app.post('/api/count', (req, res) => {
  const incrementAmount = req.body.count || 0;
  database.run("UPDATE counter SET totalCount = totalCount + ?", [incrementAmount], function(error) {
    if (error) return res.status(500).json({ error: error.message });
    
    database.get("SELECT totalCount FROM counter", (error, row) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json({ count: row.totalCount });
    });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000!");
});
