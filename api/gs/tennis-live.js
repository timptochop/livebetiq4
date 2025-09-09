// api/gs/tennis-live.js
import { fetchGoalServeTennisLive } from '../_lib/goalServeLiveAPI';

export default async function handler(req, res) {
  try {
    const rawMatches = await fetchGoalServeTennisLive();

    const normalizedMatches = [];

    for (const category of [].concat(rawMatches || [])) {
      const events = [].concat(category?.match || []);
      for (const match of events) {
        const players = match.player || [];
        const odds = match.odds?.bookmaker?.odds || [];

        normalizedMatches.push({
          id: match.id,
          tournament: category.name,
          matchTime: match.time,
          status: match.status,
          player1: players[0]?.name || '',
          player2: players[1]?.name || '',
          score1: players[0]?.score || '',
          score2: players[1]?.score || '',
          odds,
          raw: match,
        });
      }
    }

    res.status(200).json({ matches: normalizedMatches });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to load tennis data.' });
  }
}