import { getAllBets, addBet } from '@/lib/db';

export async function GET() {
  try {
    const bets = await getAllBets();
    return Response.json({ bets });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, go_out_time, come_back_time } = await request.json();

    if (!name || !go_out_time || !come_back_time) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await addBet(name, go_out_time, come_back_time);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
