import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../data/betting.db');

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS bets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    go_out_time TEXT NOT NULL,
    come_back_time TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS betting_result (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    go_out_time TEXT,
    come_back_time TEXT,
    is_set INTEGER DEFAULT 0,
    set_at DATETIME
  );

  INSERT OR IGNORE INTO betting_result (id, is_set) VALUES (1, 0);
`);

console.log('Database initialized successfully at:', dbPath);
db.close();
