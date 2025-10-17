import React, { useEffect, useState } from 'react';
import { getBorrowedBooks, returnBook } from '../services/libraryService';
import { Book } from '../types/models';
import { useAuth } from '../context/AuthContext';
import './ReturnForm.css';

const ReturnForm: React.FC = () => {
  const [borrowed, setBorrowed] = useState<(Book & { dueDate: string })[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBorrowedBooks();
    }
  }, [user]);

  const loadBorrowedBooks = async () => {
    try {
      setLoading(true);
      const data = await getBorrowedBooks(user!.id);
      setBorrowed(data);
    } catch (err) {
      setMessage('Failed to load borrowed books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId: string) => {
    if (!user) {
      setMessage('Please log in to return books');
      return;
    }

    setReturningId(bookId);
    setMessage('');

    try {
      const response = await returnBook(bookId, user.id);
      setMessage(`✅ ${response}`);
      await loadBorrowedBooks();
    } catch (err) {
      setMessage(`❌ ${err instanceof Error ? err.message : 'Failed to return book'}`);
    } finally {
      setReturningId(null);
    }
  };

  const getDueStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', text: `Overdue by ${Math.abs(diffDays)} days` };
    if (diffDays === 0) return { status: 'due-today', text: 'Due today' };
    if (diffDays <= 3) return { status: 'due-soon', text: `Due in ${diffDays} days` };
    return { status: 'normal', text: `Due in ${diffDays} days` };
  };

  if (!user) {
    return (
      <div className="return-form-container">
        <div className="login-required">
          <div className="login-icon">🔐</div>
          <p>Please log in to view and return borrowed books</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="return-form-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your borrowed books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="return-form-container">
      <div className="return-header">
        <h3>🔄 Return Books</h3>
        <p className="return-subtitle">
          Manage your currently borrowed books ({borrowed.length} book{borrowed.length !== 1 ? 's' : ''})
        </p>
      </div>

      {borrowed.length === 0 ? (
        <div className="no-books-state">
          <div className="no-books-icon">📚</div>
          <p>You don't have any borrowed books at the moment.</p>
          <p className="no-books-subtext">Visit the library collection to find your next read!</p>
        </div>
      ) : (
        <div className="borrowed-books-list">
          {borrowed.map((book) => {
            const dueStatus = getDueStatus(book.dueDate);
            
            return (
              <div key={book.id} className="borrowed-book-card">
                <div className="book-main-info">
                  <h4 className="book-title">{book.title}</h4>
                  <p className="book-author">by {book.author}</p>
                  
                  <div className="book-meta">
                    {book.category && (
                      <span className="book-category">{book.category}</span>
                    )}
                    <span className={`due-status ${dueStatus.status}`}>
                      ⏰ {dueStatus.text}
                    </span>
                  </div>
                </div>

                <div className="return-section">
                  <button
                    onClick={() => handleReturn(book.id)}
                    disabled={returningId === book.id}
                    className="return-button"
                  >
                    {returningId === book.id ? (
                      <span className="button-loading">
                        <span className="spinner"></span>
                        Returning...
                      </span>
                    ) : (
                      '📚 Return Book'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {message && (
        <div className={`return-message ${message.includes('✅') ? 'success-message' : 'error-message'}`}>
          <div className="message-icon">
            {message.includes('✅') ? '✓' : '⚠'}
          </div>
          <p>{message.replace(/[✅❌]/g, '')}</p>
        </div>
      )}

      {borrowed.length > 0 && (
        <div className="return-guidelines">
          <h4>📋 Return Guidelines:</h4>
          <ul>
            <li>Return books on or before the due date</li>
            <li>Overdue books may incur late fees</li>
            <li>Books in good condition can be re-borrowed</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReturnForm;