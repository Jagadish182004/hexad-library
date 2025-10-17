import React, { useEffect, useState } from 'react';
import { addBook, updateStock, getInventory } from '../services/libraryService';
import { Book } from '../types/models';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const [inventory, setInventory] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [copies, setCopies] = useState(1);
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState<number>(new Date().getFullYear());
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);
  const { user } = useAuth();

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Children', 'Fantasy', 'Mystery', 'Romance'];

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      setInventory(data);
    } catch (err) {
      setMessage('Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !author || copies < 1) {
      setMessage('❌ Please fill all required fields correctly');
      return;
    }

    if (publishedYear < 1000 || publishedYear > new Date().getFullYear()) {
      setMessage('❌ Please enter a valid publication year');
      return;
    }

    const newBook: Book = {
      id: uuidv4(),
      title: title.trim(),
      author: author.trim(),
      copies,
      isbn: isbn.trim() || undefined,
      publishedYear,
      category: category || undefined,
    };

    try {
      const response = await addBook(newBook);
      setMessage(`✅ ${response}`);
      await loadInventory();
      resetForm();
    } catch (err) {
      setMessage('❌ Error adding book. Please try again.');
    }
  };

  const handleUpdateStock = async (bookId: string, newCopies: number) => {
    if (newCopies < 0) {
      setMessage('❌ Copies cannot be negative');
      return;
    }

    setUpdatingStock(bookId);
    try {
      const response = await updateStock(bookId, newCopies);
      setMessage(`✅ ${response}`);
      await loadInventory();
    } catch (err) {
      setMessage('❌ Error updating stock. Please try again.');
    } finally {
      setUpdatingStock(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setCopies(1);
    setIsbn('');
    setPublishedYear(new Date().getFullYear());
    setCategory('');
  };

  const getStockStatus = (copies: number) => {
    if (copies === 0) return { status: 'out-of-stock', text: 'Out of Stock' };
    if (copies <= 2) return { status: 'low-stock', text: 'Low Stock' };
    return { status: 'in-stock', text: 'In Stock' };
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-panel-container">
        <div className="admin-access-denied">
          <div className="access-denied-icon">🚫</div>
          <h3>Admin Access Required</h3>
          <p>You need administrator privileges to access this panel.</p>
          <p>Please log in with an admin account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h2>📦 Library Admin Panel</h2>
        <p className="admin-subtitle">Manage books and inventory</p>
      </div>

      <div className="admin-content">
        <div className="add-book-section">
          <h3>➕ Add New Book</h3>
          <form onSubmit={handleAddBook} className="book-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Book Title *</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter book title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="author">Author *</label>
                <input
                  id="author"
                  type="text"
                  placeholder="Enter author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input
                  id="isbn"
                  type="text"
                  placeholder="Enter ISBN (optional)"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="publishedYear">Published Year</label>
                <input
                  id="publishedYear"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={publishedYear}
                  onChange={(e) => setPublishedYear(Number(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="copies">Copies *</label>
                <input
                  id="copies"
                  type="number"
                  min="1"
                  value={copies}
                  onChange={(e) => setCopies(Number(e.target.value))}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit"
                disabled={!title || !author || copies < 1}
                className="submit-button"
              >
                📚 Add Book to Library
              </button>
              <button 
                type="button"
                onClick={resetForm}
                className="reset-button"
              >
                🗑️ Clear Form
              </button>
            </div>
          </form>
        </div>

        <div className="inventory-section">
          <div className="inventory-header">
            <h3>📊 Inventory Management</h3>
            <div className="inventory-stats">
              <span className="stat-total">Total Books: {inventory.length}</span>
              <span className="stat-copies">
                Total Copies: {inventory.reduce((sum, book) => sum + book.copies, 0)}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="loading-inventory">
              <div className="spinner"></div>
              <p>Loading inventory...</p>
            </div>
          ) : inventory.length === 0 ? (
            <div className="empty-inventory">
              <div className="empty-icon">📭</div>
              <p>No books in inventory. Add your first book above!</p>
            </div>
          ) : (
            <div className="inventory-grid">
              {inventory.map((book) => {
                const stockStatus = getStockStatus(book.copies);
                
                return (
                  <div key={book.id} className="inventory-card">
                    <div className="book-info">
                      <h4 className="book-title">{book.title}</h4>
                      <p className="book-author">by {book.author}</p>
                      
                      <div className="book-meta">
                        {book.category && (
                          <span className="book-category">{book.category}</span>
                        )}
                        {book.publishedYear && (
                          <span className="book-year">{book.publishedYear}</span>
                        )}
                        {book.isbn && (
                          <span className="book-isbn">ISBN: {book.isbn}</span>
                        )}
                      </div>
                    </div>

                    <div className="stock-management">
                      <div className="stock-info">
                        <span className={`stock-status ${stockStatus.status}`}>
                          {stockStatus.text}
                        </span>
                        <span className="copies-count">{book.copies} copies</span>
                      </div>
                      
                      <div className="stock-controls">
                        <label htmlFor={`stock-${book.id}`}>Update Stock:</label>
                        <div className="stock-input-group">
                          <input
                            id={`stock-${book.id}`}
                            type="number"
                            min="0"
                            defaultValue={book.copies}
                            onBlur={(e) => handleUpdateStock(book.id, Number(e.target.value))}
                            className="stock-input"
                          />
                          {updatingStock === book.id && (
                            <div className="updating-indicator">
                              <div className="mini-spinner"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('✅') ? 'success-message' : 'error-message'}`}>
          <div className="message-icon">
            {message.includes('✅') ? '✓' : '⚠'}
          </div>
          <p>{message.replace(/[✅❌]/g, '')}</p>
          <button 
            onClick={() => setMessage('')}
            className="close-message"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;