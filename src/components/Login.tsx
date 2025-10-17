import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

interface LoginProps {
  onToggleMode: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleMode }) => {
  const { login, logout, user, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await login(email, password);
      setMessage(result.message);
    } catch (error) {
      setMessage('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDemo = () => {
    setEmail('admin@library.com');
    setPassword('jagadishmec18');
  };

  const handleUserDemo = () => {
    setEmail('user@example.com');
    setPassword('password123');
  };

  if (user) {
    return (
      <div className="login-container">
        <div className="login-header">
          <h2>🔐 Welcome to Library System</h2>
          <p className="login-subtitle">You are successfully logged in</p>
        </div>

        <div className="user-info">
          <div className="user-details">
            <div className="user-avatar">
              {role === 'admin' ? '👨‍💼' : '👤'}
            </div>
            <div className="user-text">
              <p className="welcome-message">Welcome back!</p>
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
              <p className="user-role-badge" data-role={role}>
                {role === 'admin' ? 'Administrator' : 'Library User'}
              </p>
            </div>
          </div>
          <button 
            className="logout-button"
            onClick={logout}
            disabled={loading}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>🔐 Login to Library System</h2>
        <p className="login-subtitle">Enter your credentials to access the library</p>
      </div>

      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button 
          type="submit"
          disabled={loading || !email || !password}
          className="login-button"
        >
          {loading ? (
            <span className="button-loading">
              <span className="spinner"></span>
              Logging in...
            </span>
          ) : (
            '🔑 Login'
          )}
        </button>
      </form>

      <div className="demo-accounts">
        <h4>Quick Demo Access:</h4>
        <div className="demo-buttons">
          <button 
            type="button"
            onClick={handleAdminDemo}
            className="demo-button admin-demo"
          >
            👨‍💼 Admin Demo
          </button>
          <button 
            type="button"
            onClick={handleUserDemo}
            className="demo-button user-demo"
          >
            👤 User Demo
          </button>
        </div>
        <p className="demo-notes">
          Admin: jagadishmec18 | User: password123
        </p>
      </div>

      {message && (
        <div className={`message ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
          <div className="message-icon">
            {message.includes('successful') ? '✓' : '⚠'}
          </div>
          <p>{message}</p>
        </div>
      )}

      <div className="auth-switch">
        <p>Don't have an account? 
          <button 
            type="button"
            onClick={onToggleMode}
            className="switch-button"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;