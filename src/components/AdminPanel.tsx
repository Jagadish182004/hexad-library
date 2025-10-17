import React, { useEffect, useState } from 'react';
import { addBook, updateStock, getInventory } from '../services/libraryService';
import { Book } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

const AdminPanel: React.FC = () => {
  const [inventory, setInventory] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [copies, setCopies] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getInventory().then(setInventory);
  }, []);

  const handleAddBook = async () => {
    const newBook: Book = {
      id: uuidv4(),
      title,
      author,
      copies,
    };
    const response = await addBook(newBook);
    setMessage(response);
    const updated = await getInventory();
    setInventory(updated);
    setTitle('');
    setAuthor('');
    setCopies(1);
  };

  const handleUpdateStock = async (bookId: string, newCopies: number) => {
    const response = await updateStock(bookId, newCopies);
    setMessage(response);
    const updated = await getInventory();
    setInventory(updated);
  };

  return (
    <div>
      <h3>📦 Admin Panel</h3>

      <div style={{ marginBottom: '1rem' }}>
        <h4>Add New Book</h4>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input type="number" min="1" value={copies} onChange={(e) => setCopies(Number(e.target.value))} />
        <button onClick={handleAddBook}>Add Book</button>
      </div>

      <div>
        <h4>Inventory</h4>
        <ul>
          {inventory.map((book) => (
            <li key={book.id}>
              {book.title} by {book.author} — Copies: {book.copies}
              <input
                type="number"
                min="0"
                defaultValue={book.copies}
                onBlur={(e) => handleUpdateStock(book.id, Number(e.target.value))}
              />
            </li>
          ))}
        </ul>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminPanel;