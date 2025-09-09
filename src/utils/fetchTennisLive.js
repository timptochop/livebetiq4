// src/utils/fetchTennisLive.js
const API_URL = '/api/gs/tennis-live';

export default async function fetchTennisLive() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return Array.isArray(data.matches) ? data.matches : [];
  } catch (error) {
    console.error('fetchTennisLive error:', error);
    return [];
  }
}