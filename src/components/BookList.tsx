import React, { useEffect, useState } from 'react';
import { getBooks } from '../services/libraryService';
import { Book } from '../types/models';
import './BookList.css';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(books.map(book => book.category).filter(Boolean)));

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="book-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-list-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="retry-button" onClick={loadBooks}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h2>📚 Library Collection</h2>
        <p className="book-count">
          {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="book-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search books or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {categories.length > 0 && (
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        )}
      </div>

      {filteredBooks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <p>No books found matching your criteria.</p>
          {(searchTerm || filterCategory) && (
            <button 
              className="clear-filters"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-header">
                <h3 className="book-title">{book.title}</h3>
                <div className={`availability-badge ${book.copies > 0 ? 'available' : 'unavailable'}`}>
                  {book.copies > 0 ? `${book.copies} available` : 'Out of stock'}
                </div>
              </div>
              
              <p className="book-author">by {book.author}</p>
              
              <div className="book-details">
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

              <div className="book-actions">
                <button 
                  className={`borrow-btn ${book.copies === 0 ? 'disabled' : ''}`}
                  disabled={book.copies === 0}
                >
                  {book.copies > 0 ? '📥 Borrow Book' : '❌ Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;