import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders title app', () => {
  const { getByText } = render(<App />);
  const divElement = getByText(/Code Editor with Zip File Handling Web App/i);
  expect(divElement).toBeInTheDocument();
});
