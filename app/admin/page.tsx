'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Bet {
  id: number;
  name: string;
  go_out_time: string;
  come_back_time: string;
  created_at: string;
}

export default function AdminPage() {
  const [goOutTime, setGoOutTime] = useState('');
  const [comeBackTime, setComeBackTime] = useState('');
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resultsSet, setResultsSet] = useState(false);

  useEffect(() => {
    fetchBets();
    fetchResults();
  }, []);

  const fetchBets = async () => {
    try {
      const response = await fetch('/api/bets');
      const data = await response.json();
      setBets(data.bets);
    } catch (error) {
      console.error('Error fetching bets:', error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results');
      const data = await response.json();
      if (data?.is_set) {
        setResultsSet(true);
        setGoOutTime(data.go_out_time);
        setComeBackTime(data.come_back_time);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const handleSetResults = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          go_out_time: goOutTime,
          come_back_time: comeBackTime,
        }),
      });

      if (response.ok) {
        setMessage('Results set successfully!');
        setResultsSet(true);
      } else {
        setMessage('Error setting results');
      }
    } catch (error) {
      setMessage('Error setting results');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetResults = async () => {
    if (!confirm('Are you sure you want to reset the results?')) return;

    try {
      const response = await fetch('/api/results', {
        method: 'PUT',
      });

      if (response.ok) {
        setMessage('Results reset successfully!');
        setResultsSet(false);
        setGoOutTime('');
        setComeBackTime('');
      } else {
        setMessage('Error resetting results');
      }
    } catch (error) {
      setMessage('Error resetting results');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="bg-red-900 bg-opacity-70 border-b border-red-700 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
          <p className="text-red-200 mt-2">Set the correct times for results</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Set Results Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">
                {resultsSet ? 'Update Results' : 'Set Results'}
              </h2>

              <form onSubmit={handleSetResults} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nadir Went Out (HH:MM)
                  </label>
                  <Input
                    type="time"
                    value={goOutTime}
                    onChange={(e) => setGoOutTime(e.target.value)}
                    required
                    className="w-full border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nadir Came Back (HH:MM)
                  </label>
                  <Input
                    type="time"
                    value={comeBackTime}
                    onChange={(e) => setComeBackTime(e.target.value)}
                    required
                    className="w-full border-slate-300"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? 'Setting...' : 'Set Results'}
                </Button>

                {resultsSet && (
                  <Button
                    type="button"
                    onClick={handleResetResults}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reset Results
                  </Button>
                )}
              </form>

              {message && (
                <div
                  className={`mt-4 p-3 rounded text-center text-sm ${
                    message.includes('successfully')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message}
                </div>
              )}

              {resultsSet && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                  <p className="font-semibold mb-2">✓ Results Active</p>
                  <p>Scoreboard is now visible to participants</p>
                </div>
              )}
            </div>
          </div>

          {/* Bets List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">
                All Bets ({bets.length})
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">
                        Go Out
                      </th>
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">
                        Come Back
                      </th>
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bets.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-400">
                          No bets submitted yet
                        </td>
                      </tr>
                    ) : (
                      bets.map((bet) => (
                        <tr key={bet.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="py-3 px-4 text-slate-900 font-medium">{bet.name}</td>
                          <td className="py-3 px-4 text-slate-700">{bet.go_out_time}</td>
                          <td className="py-3 px-4 text-slate-700">{bet.come_back_time}</td>
                          <td className="py-3 px-4 text-slate-600 text-sm">
                            {new Date(bet.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
