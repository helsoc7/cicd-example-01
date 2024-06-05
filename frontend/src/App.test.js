import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock Fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'Hello from the backend' })
  })
);

describe('App Component', () => {
  it('fetches and displays the message', async () => {
    render(<App />);
    const messageElement = await waitFor(() => screen.getByText(/Message from Backend: Hello from the backend/i));
    expect(messageElement).toBeInTheDocument();
  });

  // Stellen Sie sicher, dass fetch aufgerufen wurde
  it('calls the backend API', async () => {
    render(<App />);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api');
  });
});
