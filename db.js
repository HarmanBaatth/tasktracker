const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tasks.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, userId INTEGER, title TEXT, description TEXT, dueDate TEXT, priority TEXT, status TEXT)");
});

module.exports = db;
