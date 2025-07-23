import { render, screen } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

test('renders home page by default', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const homeElement = screen.getByText(/Welcome to the Home Page/i);
  expect(homeElement).toBeInTheDocument();
});

test('renders analysis page when route is /analysis', () => {
  render(
    <MemoryRouter initialEntries={['/analysis']}>
      <App />
    </MemoryRouter>
  );
  const analysisElement = screen.getByText(/Welcome to the Analysis Page/i);
  expect(analysisElement).toBeInTheDocument();
});

test('renders backstage page when route is /backstage', () => {
  render(
    <MemoryRouter initialEntries={['/backstage']}>
      <App />
    </MemoryRouter>
  );
  const backstageElement = screen.getByText(/Welcome to the BackStage Page/i);
  expect(backstageElement).toBeInTheDocument();
});