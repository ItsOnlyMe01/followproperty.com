const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

export const submitWatchlist = async (data) => {
  const response = await fetch(`${API_BASE_URL}/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
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
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit portfolio');
  }

  return response.json();
};

export const deletePortfolioItem = async (id) => {
  const response = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete portfolio item');
  }

  return response.json();
};

