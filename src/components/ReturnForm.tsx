import React, { useEffect, useState } from 'react';
import { getBorrowedBooks, returnBook } from '../services/libraryService';
import { Book } from '../types/models';

const ReturnForm: React.FC = () => {
  const [borrowed, setBorrowed] = useState<Book[]>([]);
  const [message, setMessage] = useState('');
  const userId = 'user123'; // mock user

  useEffect(() => {
    getBorrowedBooks(userId).then(setBorrowed);
  }, []);

  const handleReturn = async (bookId: string) => {
    try {
      const response = await returnBook(bookId, userId);
      setMessage(response);
      const updated = await getBorrowedBooks(userId);
      setBorrowed(updated);
    } catch (err) {
      setMessage(String(err));
    }
  };

  return (
    <div>
      <h3>Return Borrowed Books</h3>
      {borrowed.length === 0 ? (
        <p>No books to return.</p>
      ) : (
        <ul>
          {borrowed.map((book) => (
            <li key={book.id}>
              {book.title} by {book.author}
              <button onClick={() => handleReturn(book.id)}>Return</button>
            </li>
          ))}
        </ul>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ReturnForm;