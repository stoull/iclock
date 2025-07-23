// 单独测试各个页面组件，不涉及路由
import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';
import Analysis from '../pages/Analysis';
import BackStage from '../pages/BackStage';

test('renders Home component', () => {
  render(<Home />);
  const homeElement = screen.getByText(/Welcome to the Home Page/i);
  expect(homeElement).toBeInTheDocument();
});

test('renders Analysis component', () => {
  render(<Analysis />);
  const analysisElement = screen.getByText(/Welcome to the Analysis Page/i);
  expect(analysisElement).toBeInTheDocument();
});

test('renders BackStage component', () => {
  render(<BackStage />);
  const backstageElement = screen.getByText(/Welcome to the BackStage Page/i);
  expect(backstageElement).toBeInTheDocument();
});
