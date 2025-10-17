import React, { useState } from 'react';
import { borrowBook } from '../services/libraryService';

const BorrowForm: React.FC = () => {
  const [bookId, setBookId] = useState('');
  const [message, setMessage] = useState('');
  const userId = 'user123'; // mock user

  const handleBorrow = async () => {
    try {
      const response = await borrowBook(bookId, userId);
      setMessage(response);
    } catch (err) {
      setMessage(String(err));
    }
  };

  return (
    <div>
      <h3>Borrow a Book</h3>
      <input
        type="text"
        placeholder="Enter Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      <button onClick={handleBorrow}>Borrow</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BorrowForm;