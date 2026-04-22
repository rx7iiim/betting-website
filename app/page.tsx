'use client';

import { useState, useEffect } from 'react';
import BettingForm from '@/components/BettingForm';
import Scoreboard from '@/components/Scoreboard';

export default function Home() {
  const [resultsSet, setResultsSet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkResults();
    const interval = setInterval(checkResults, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkResults = async () => {
    try {
      const response = await fetch('/api/results');
      const data = await response.json();
      setResultsSet(data?.is_set || false);
      setLoading(false);
    } catch (error) {
      console.error('Error checking results:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="bg-black bg-opacity-50 border-b border-slate-700 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">Nadir Betting</h1>
          <p className="text-slate-300 mt-2">Bet on when Nadir goes out and comes back</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {!resultsSet ? (
          <div className="mb-8">
            <BettingForm onBetSubmitted={checkResults} />
          </div>
        ) : (
          <div className="mb-8">
            <Scoreboard />
          </div>
        )}
      </main>
    </div>
  );
}
