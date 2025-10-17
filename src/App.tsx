import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import BookList from './components/BookList';
import BorrowForm from './components/BorrowForm';
import ReturnForm from './components/ReturnForm';
import AdminPanel from './components/AdminPanel';
import './app.css';

const App: React.FC = () => {
  const { role } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🏛️ Community Library System</h1>
          <p className="app-subtitle">
            Your gateway to knowledge and imagination
          </p>
        </div>
      </header>

      {!role ? (
        isLoginMode ? (
          <Login onToggleMode={toggleAuthMode} />
        ) : (
          <Signup onToggleMode={toggleAuthMode} />
        )
      ) : (
        <main className="app-main">
          {role === 'admin' ? (
            <div className="admin-layout">
              <AdminPanel />
            </div>
          ) : (
            <div className="user-layout">
              <div className="user-main-section">
                <BookList />
              </div>
              
              <div className="user-sidebar">
                <div className="sidebar-section">
                  <BorrowForm />
                </div>
                
                <div className="sidebar-section">
                  <ReturnForm />
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      <footer className="app-footer">
        <p>&copy; 2024 Community Library System. All rights reserved.</p>
        <p className="footer-links">
          <span>📞 Contact: (555) 123-LIBRARY</span>
          <span>📧 Email: info@communitylibrary.org</span>
          <span>📍 Address: 123 Knowledge Street, Learning City</span>
        </p>
      </footer>
    </div>
  );
};

export default App;