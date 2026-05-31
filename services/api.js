const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const submitWatchlist = async (data) => {
  const response = await fetch(`${API_BASE_URL}/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit watchlist');
  }

  return response.json();
};

export const submitPortfolio = async (data) => {
  const response = await fetch(`${API_BASE_URL}/portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit portfolio');
  }

  return response.json();
};
