'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BettingFormProps {
  onBetSubmitted: () => void;
}

export default function BettingForm({ onBetSubmitted }: BettingFormProps) {
  const [name, setName] = useState('');
  const [goOutTime, setGoOutTime] = useState('');
  const [comeBackTime, setComeBackTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          go_out_time: goOutTime,
          come_back_time: comeBackTime,
        }),
      });

      if (response.ok) {
        setMessage('Bet submitted successfully!');
        setName('');
        setGoOutTime('');
        setComeBackTime('');
        onBetSubmitted();
      } else {
        setMessage('Error submitting bet');
      }
    } catch (error) {
      setMessage('Error submitting bet');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Place Your Bet</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="w-full border-slate-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            When will Nadir go out? (HH:MM)
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
            When will Nadir come back? (HH:MM)
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Submitting...' : 'Submit Bet'}
        </Button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded text-center ${
            message.includes('successfully')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
