import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { act } from 'react';

beforeEach(() => {
  global.fetch = jest.fn(() =>
      Promise.resolve({
          json: () => Promise.resolve([{ "message": "Hello from the backend" }]),
      })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});



test('renders App component', async () => {
  await act(() => {
    render(<App />);
  });

  const messageElement = screen.getByText(/Message from Backend:/i);
  expect(messageElement).toBeInTheDocument();
});