import React, { useState } from 'react';
import { borrowBook, getBooks } from '../services/libraryService';
import { useAuth } from '../context/AuthContext';
import './BorrowForm.css';

const BorrowForm: React.FC = () => {
  const [bookId, setBookId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleBorrow = async () => {
    if (!bookId.trim()) {
      setMessage('❌ Please enter a valid Book ID');
      return;
    }

    if (!user) {
      setMessage('❌ Please log in to borrow books');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await borrowBook(bookId, user.id);
      setMessage(`✅ ${response}`);
      setBookId('');
    } catch (err) {
      setMessage(`❌ ${err instanceof Error ? err.message : 'Failed to borrow book'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickBorrow = async (quickBookId: string) => {
    setBookId(quickBookId);
    // Simulate delay to show the ID being set
    setTimeout(() => {
      handleBorrow();
    }, 100);
  };

  return (
    <div className="borrow-form-container">
      <div className="borrow-header">
        <h3>📥 Borrow a Book</h3>
        <p className="borrow-subtitle">Enter the Book ID to borrow from the library</p>
      </div>

      <div className="borrow-input-group">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Enter Book ID (e.g., 1, 2)..."
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="borrow-input"
            onKeyPress={(e) => e.key === 'Enter' && handleBorrow()}
          />
          <button 
            onClick={handleBorrow}
            disabled={!bookId.trim() || isLoading}
            className="borrow-button"
          >
            {isLoading ? (
              <span className="button-loading">
                <span className="spinner"></span>
                Processing...
              </span>
            ) : (
              '🚀 Borrow Book'
            )}
          </button>
        </div>
      </div>

      <div className="quick-borrow-section">
        <p className="quick-borrow-title">Quick Borrow (Sample Books):</p>
        <div className="quick-borrow-buttons">
          <button 
            onClick={() => handleQuickBorrow('1')}
            className="quick-borrow-btn"
            title="The Great Gatsby"
          >
            📘 Book #1
          </button>
          <button 
            onClick={() => handleQuickBorrow('2')}
            className="quick-borrow-btn"
            title="To Kill a Mockingbird"
          >
            📗 Book #2
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success-message' : 'error-message'}`}>
          <div className="message-icon">
            {message.includes('✅') ? '✓' : '⚠'}
          </div>
          <p>{message.replace(/[✅❌]/g, '')}</p>
        </div>
      )}

      <div className="borrow-tips">
        <h4>💡 Borrowing Tips:</h4>
        <ul>
          <li>Books are due in 14 days</li>
          <li>You can borrow one copy of each book at a time</li>
          <li>Return books on time to avoid penalties</li>
        </ul>
      </div>
    </div>
  );
};

export default BorrowForm;