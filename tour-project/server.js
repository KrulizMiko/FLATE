const http = require('http');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Автоматически создаст таблицы при первом запуске
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS tours (id INTEGER PRIMARY KEY, title TEXT, price REAL)");
  db.run("CREATE TABLE IF NOT EXISTS admins (login TEXT UNIQUE, password TEXT)");
  db.run("INSERT OR IGNORE INTO admins VALUES ('admin', 'admin123')");
});

const server = http.createServer((req, res) => {
  // Клиентская часть
  if (req.url === '/') {
    serveFile(res, './client/index.html', 'text/html');
  } 
  // Админка
  else if (req.url === '/admin') {
    serveFile(res, './admin/index.html', 'text/html');
  }
  // Остальная логика...
});

function serveFile(res, filePath, contentType) {
  const fullPath = path.join(__dirname, filePath);
  fs.readFile(fullPath, (err, data) => {
    err ? (res.writeHead(404), res.end('Not found')) 
        : (res.writeHead(200, { 'Content-Type': contentType }), res.end(data));
  });
}


server.listen(4000, '192.168.3.4', () => {
  console.log(`
  Клиент: http://192.168.3.4:4000
  Админ: http://192.168.3.4:4000/admin
  `);
});