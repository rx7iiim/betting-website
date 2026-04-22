import { getResult, getAllBets } from '@/lib/db';

export async function GET() {
  try {
    const result = await getResult();

    if (!result || !result.is_set) {
      return Response.json({ is_set: false, scores: [] });
    }

    // Fetch all bets and calculate scores
    const bets = await getAllBets();

    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const actualGoOutMinutes = timeToMinutes(result.go_out_time);
    const actualComeBackMinutes = timeToMinutes(result.come_back_time);

    const scores = bets
      .map((bet) => {
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
      })
      .sort((a, b) => a.total_diff - b.total_diff);

    return Response.json({
      is_set: true,
      actual_go_out_time: result.go_out_time,
      actual_come_back_time: result.come_back_time,
      scores,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
