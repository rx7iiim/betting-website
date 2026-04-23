import { neon } from '@neondatabase/serverless';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

async function initializeTables() {
  if (!sql) return;
  await sql`
    CREATE TABLE IF NOT EXISTS bets (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      go_out_time TEXT NOT NULL,
      come_back_time TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS betting_result (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      go_out_time TEXT,
      come_back_time TEXT,
      is_set INTEGER DEFAULT 0,
      set_at TIMESTAMP
    );
  `;
  await sql`
    INSERT INTO betting_result (id, is_set)
    VALUES (1, 0)
    ON CONFLICT (id) DO NOTHING;
  `;
}

export async function getAllBets() {
  try {
    if (!sql) throw new Error("DATABASE_URL is not configured.");
    await initializeTables();
    const bets = await sql`SELECT * FROM bets ORDER BY id ASC`;
    return bets;
  } catch (err) {
    console.error('Failed to get bets:', err);
    return [];
  }
}

export async function addBet(name, go_out_time, come_back_time) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await initializeTables();
  const [newBet] = await sql`
    INSERT INTO bets (name, go_out_time, come_back_time)
    VALUES (${name}, ${go_out_time}, ${come_back_time})
    RETURNING *;
  `;
  return newBet;
}

export async function getResult() {
  try {
    if (!sql) throw new Error("DATABASE_URL is not configured.");
    await initializeTables();
    const [result] = await sql`SELECT * FROM betting_result WHERE id = 1`;
    return result || {
      id: 1,
      go_out_time: null,
      come_back_time: null,
      is_set: 0,
      set_at: null
    };
  } catch (err) {
    console.error('Failed to get result:', err);
    return {
      id: 1,
      go_out_time: null,
      come_back_time: null,
      is_set: 0,
      set_at: null
    };
  }
}

export async function setResult(go_out_time, come_back_time) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await initializeTables();
  const [result] = await sql`
    UPDATE betting_result
    SET go_out_time = ${go_out_time}, come_back_time = ${come_back_time}, is_set = 1, set_at = CURRENT_TIMESTAMP
    WHERE id = 1
    RETURNING *;
  `;
  return result;
}

export async function resetResult() {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await initializeTables();
  const [result] = await sql`
    UPDATE betting_result
    SET go_out_time = NULL, come_back_time = NULL, is_set = 0, set_at = NULL
    WHERE id = 1
    RETURNING *;
  `;
  return result;
}
