const express = require('express');
const path = require('path');

const app = express();
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'database.db');

// Раздаём статические файлы из текущей директории
app.use(express.static(path.join(__dirname, '..')));

const db = new sqlite3.Database(
  DB_PATH,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  err => {
    if (err) {
      console.error('Ошибка при подключении к SQLite:', err.message);
      process.exit(1);
    }
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users2 (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          is_admin INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });
  }
);

app.get('/', (req, res) => 
  res.sendFile(path.join(__dirname, '..', 'client/index.html'))
);

app.get('/admin', (req, res) => 
  res.sendFile(path.join(__dirname, '..', 'admin/index.html'))
);

//post, get, delete, patch




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});