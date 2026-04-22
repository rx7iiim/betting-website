'use client';

import { useState, useEffect } from 'react';

interface ScoreEntry {
  id: number;
  name: string;
  go_out_time: string;
  come_back_time: string;
  go_out_diff: number;
  come_back_diff: number;
  total_diff: number;
}

interface ScoreboardData {
  is_set: boolean;
  actual_go_out_time: string;
  actual_come_back_time: string;
  scores: ScoreEntry[];
}

export default function Scoreboard() {
  const [scoreboardData, setScoreboardData] = useState<ScoreboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScoreboard();
  }, []);

  const fetchScoreboard = async () => {
    try {
      const response = await fetch('/api/scoreboard');
      const data = await response.json();
      setScoreboardData(data);
    } catch (error) {
      console.error('Error fetching scoreboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-12">
        <div className="text-xl">Loading scoreboard...</div>
      </div>
    );
  }

  if (!scoreboardData || !scoreboardData.is_set) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-6 text-yellow-800">
        <p className="text-lg font-semibold">Scoreboard Coming Soon</p>
        <p>The admin will set the results soon. Check back!</p>
      </div>
    );
  }

  const { actual_go_out_time, actual_come_back_time, scores } = scoreboardData;

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6">Results</h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-700 rounded p-4">
            <p className="text-slate-300 text-sm mb-1">Nadir Went Out</p>
            <p className="text-white text-3xl font-bold">{actual_go_out_time}</p>
          </div>
          <div className="bg-slate-700 rounded p-4">
            <p className="text-slate-300 text-sm mb-1">Nadir Came Back</p>
            <p className="text-white text-3xl font-bold">{actual_come_back_time}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">Rank</th>
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">Go Out</th>
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">Come Back</th>
                <th className="text-center py-3 px-4 text-slate-300 font-semibold">
                  Go Out Diff
                </th>
                <th className="text-center py-3 px-4 text-slate-300 font-semibold">
                  Come Back Diff
                </th>
                <th className="text-center py-3 px-4 text-slate-300 font-semibold">
                  Total Diff
                </th>
              </tr>
            </thead>
            <tbody>
              {scores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No bets submitted
                  </td>
                </tr>
              ) : (
                scores.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-slate-700 ${
                      index === 0 ? 'bg-amber-900 bg-opacity-30' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      {index === 0 ? (
                        <span className="text-amber-400 font-bold text-lg">🥇</span>
                      ) : index === 1 ? (
                        <span className="text-gray-400 font-bold text-lg">🥈</span>
                      ) : index === 2 ? (
                        <span className="text-amber-700 font-bold text-lg">🥉</span>
                      ) : (
                        <span className="text-slate-400">#{index + 1}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-white font-semibold">{entry.name}</td>
                    <td className="py-3 px-4 text-slate-300">{entry.go_out_time}</td>
                    <td className="py-3 px-4 text-slate-300">{entry.come_back_time}</td>
                    <td className="py-3 px-4 text-center text-slate-300">
                      {entry.go_out_diff} min
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">
                      {entry.come_back_diff} min
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-white">
                      {entry.total_diff} min
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
