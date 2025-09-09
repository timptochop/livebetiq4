// api/tennis-live.js
import { fetchGoalServeTennisLive } from './_lib/goalServeLiveAPI';

export default async function handler(req, res) {
  try {
    const matches = await fetchGoalServeTennisLive();
    res.status(200).json({ matches });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch live tennis data' });
  }
}