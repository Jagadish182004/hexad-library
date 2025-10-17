import React, { useEffect, useState } from 'react';
import { getBooks } from '../services/libraryService';
import { Book } from '../types/models';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading books...</p>;
  if (books.length === 0) return <p>The library is empty.</p>;

  return (
    <div>
      <h2>Library Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author} — Copies: {book.copies > 0 ? book.copies : 'Not Available'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;