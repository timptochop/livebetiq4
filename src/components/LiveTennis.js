// src/components/LiveTennis.js
import React, { useEffect, useState } from 'react';
import fetchTennisLive from '../utils/fetchTennisLive';

const isUpcoming = (s) => String(s || '').toLowerCase() === 'not started';
const isFinishedLike = (s) => {
  const x = String(s || '').toLowerCase();
  return ['finished', 'cancelled', 'retired', 'abandoned', 'postponed', 'walk over'].includes(x);
};

export default function LiveTennis() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchTennisLive();
      const filtered = data.filter(
        (m) => !isFinishedLike(m.status)
      );
      setMatches(filtered);
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h2>🎾 Live & Upcoming Tennis Matches</h2>
      {matches.length === 0 && <p>No matches available.</p>}
      {matches.map((match) => (
        <div key={match.id} style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          backgroundColor: '#f9f9f9'
        }}>
          <div style={{ fontWeight: 'bold' }}>
            {match.player1} vs {match.player2}
          </div>
          <div>Status: {match.status}</div>
          <div>Start Time: {match.time || 'N/A'}</div>
        </div>
      ))}
    </main>
  );
}