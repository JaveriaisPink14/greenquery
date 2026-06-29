// API service for connecting to backend
const API_BASE = 'http://localhost:8000';

export const searchPapers = async (query, mode, deadline = null) => {
  const response = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, mode, deadline })
  });
  return response.json();
};


export const getForecast = async () => {
  const response = await fetch(`${API_BASE}/forecast`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
};

export const createScoreStream = (onMessage) => {
  const eventSource = new EventSource(`${API_BASE}/stream`);
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('Failed to parse SSE data:', event.data, err);
    }
  };
  eventSource.onerror = (err) => {
    console.error('SSE connection error:', err);
  };
  return eventSource;
};

export const signup = async (fullName, email, password) => {
  const response = await fetch(`${API_BASE}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: fullName, email, password })
  });
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};