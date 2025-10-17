import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

interface SignupProps {
  onToggleMode: () => void;
}

const Signup: React.FC<SignupProps> = ({ onToggleMode }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Fix: Pass all 4 required arguments - name, email, password, role
      const result = await signup(name, email, password, 'user');
      setMessage(result.message);
    } catch (error) {
      setMessage('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h2>🌟 Join Library System</h2>
        <p className="signup-subtitle">Create your account to start borrowing books</p>
      </div>

      <form onSubmit={handleSignup} className="signup-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
        </div>

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
            placeholder="Create a password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button 
          type="submit"
          disabled={loading || !name || !email || !password || !confirmPassword}
          className="signup-button"
        >
          {loading ? (
            <span className="button-loading">
              <span className="spinner"></span>
              Creating Account...
            </span>
          ) : (
            '🚀 Create Account'
          )}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success-message' : 'error-message'}`}>
          <div className="message-icon">
            {message.includes('successfully') ? '✓' : '⚠'}
          </div>
          <p>{message}</p>
        </div>
      )}

      <div className="auth-switch">
        <p>Already have an account? 
          <button 
            type="button"
            onClick={onToggleMode}
            className="switch-button"
          >
            Login here
          </button>
        </p>
      </div>

      <div className="signup-benefits">
        <h4>🎉 Benefits of Joining:</h4>
        <ul>
          <li>📚 Access to thousands of books</li>
          <li>🔄 Easy book borrowing and returning</li>
          <li>🔔 Due date reminders</li>
          <li>📱 User-friendly interface</li>
          <li>🎯 Personalized recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default Signup;