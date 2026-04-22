import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');
const betsFile = path.join(dataDir, 'bets.json');
const resultFile = path.join(dataDir, 'result.json');

let nextBetId = 1;

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    // Directory may already exist
  }
}

async function initializeFiles() {
  await ensureDataDir();

  try {
    await fs.access(betsFile);
  } catch {
    await fs.writeFile(betsFile, JSON.stringify([], null, 2));
  }

  try {
    await fs.access(resultFile);
  } catch {
    await fs.writeFile(resultFile, JSON.stringify({
      id: 1,
      go_out_time: null,
      come_back_time: null,
      is_set: 0,
      set_at: null
    }, null, 2));
  }
}

export async function getAllBets() {
  await initializeFiles();
  try {
    const data = await fs.readFile(betsFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function addBet(name, go_out_time, come_back_time) {
  await initializeFiles();
  const bets = await getAllBets();
  const newBet = {
    id: Math.max(0, ...bets.map(b => b.id)) + 1,
    name,
    go_out_time,
    come_back_time,
    created_at: new Date().toISOString()
  };
  bets.push(newBet);
  await fs.writeFile(betsFile, JSON.stringify(bets, null, 2));
  return newBet;
}

export async function getResult() {
  await initializeFiles();
  try {
    const data = await fs.readFile(resultFile, 'utf-8');
    return JSON.parse(data);
  } catch {
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
  await initializeFiles();
  const result = {
    id: 1,
    go_out_time,
    come_back_time,
    is_set: 1,
    set_at: new Date().toISOString()
  };
  await fs.writeFile(resultFile, JSON.stringify(result, null, 2));
  return result;
}

export async function resetResult() {
  await initializeFiles();
  const result = {
    id: 1,
    go_out_time: null,
    come_back_time: null,
    is_set: 0,
    set_at: null
  };
  await fs.writeFile(resultFile, JSON.stringify(result, null, 2));
  return result;
}
