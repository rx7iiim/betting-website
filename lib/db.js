import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const BETS_KEY = 'bets';
const RESULT_KEY = 'result';

async function initializeResult() {
  const existing = await redis.get(RESULT_KEY);
  if (!existing) {
    await redis.set(RESULT_KEY, JSON.stringify({
      id: 1,
      go_out_time: null,
      come_back_time: null,
      is_set: 0,
      set_at: null
    }));
  }
}

export async function getAllBets() {
  try {
    const data = await redis.get(BETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addBet(name, go_out_time, come_back_time) {
  await initializeResult();
  const bets = await getAllBets();
  const newId = (bets.length > 0 ? Math.max(...bets.map(b => b.id)) : 0) + 1;
  
  const newBet = {
    id: newId,
    name,
    go_out_time,
    come_back_time,
    created_at: new Date().toISOString()
  };
  
  bets.push(newBet);
  await redis.set(BETS_KEY, JSON.stringify(bets));
  return newBet;
}

export async function getResult() {
  try {
    await initializeResult();
    const data = await redis.get(RESULT_KEY);
    return data ? JSON.parse(data) : {
      id: 1,
      go_out_time: null,
      come_back_time: null,
      is_set: 0,
      set_at: null
    };
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
  const result = {
    id: 1,
    go_out_time,
    come_back_time,
    is_set: 1,
    set_at: new Date().toISOString()
  };
  await redis.set(RESULT_KEY, JSON.stringify(result));
  return result;
}

export async function resetResult() {
  const result = {
    id: 1,
    go_out_time: null,
    come_back_time: null,
    is_set: 0,
    set_at: null
  };
  await redis.set(RESULT_KEY, JSON.stringify(result));
  return result;
}
