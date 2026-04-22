import { getResult, setResult, resetResult, getAllBets } from '@/lib/db';

export async function GET() {
  try {
    const result = await getResult();
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { go_out_time, come_back_time } = await request.json();

    if (!go_out_time || !come_back_time) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert time strings to minutes for calculation
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const actualGoOutMinutes = timeToMinutes(go_out_time);
    const actualComeBackMinutes = timeToMinutes(come_back_time);

    // Get all bets and calculate scores
    const bets = await getAllBets();
    
    const scores = bets.map((bet) => {
      const bettedGoOutMinutes = timeToMinutes(bet.go_out_time);
      const bettedComeBackMinutes = timeToMinutes(bet.come_back_time);

      const goOutDiff = Math.abs(actualGoOutMinutes - bettedGoOutMinutes);
      const comeBackDiff = Math.abs(actualComeBackMinutes - bettedComeBackMinutes);
      const totalDiff = goOutDiff + comeBackDiff;

      return {
        id: bet.id,
        name: bet.name,
        go_out_time: bet.go_out_time,
        come_back_time: bet.come_back_time,
        go_out_diff: goOutDiff,
        come_back_diff: comeBackDiff,
        total_diff: totalDiff,
      };
    }).sort((a, b) => a.total_diff - b.total_diff);

    // Update result
    await setResult(go_out_time, come_back_time);

    return Response.json({ success: true, scores });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Reset results
    await resetResult();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
