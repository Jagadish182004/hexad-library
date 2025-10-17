import { render, screen } from '@testing-library/react';
import BookList from '../components/BookList';

test('renders loading state', () => {
  render(<BookList />);
  expect(screen.getByText(/Loading books/i)).toBeInTheDocument();
});