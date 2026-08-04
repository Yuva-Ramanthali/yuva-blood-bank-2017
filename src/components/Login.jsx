import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulate network delay for realistic experience
    setTimeout(() => {
      if (email === 'yuva@gmail.com' && password === 'yuva1234') {
        onLoginSuccess();
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-visual">
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <div className="visual-logo-container">
            <img src={logo} className="visual-logo-img" alt="YUVA Logo" />
          </div>
          <h1>YUVA BLOOD BANK</h1>
          <p>Every blood donor is a lifesaver. Join our community and make a difference today.</p>
          <div className="visual-stats">
            <div className="v-stat">
              <span className="v-num">10k+</span>
              <span className="v-lbl">Donors Registered</span>
            </div>
            <div className="v-stat">
              <span className="v-num">25k+</span>
              <span className="v-lbl">Lives Saved</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="login-form-side">
        <div className="login-card glass-panel animate-fade-in">
          <div className="login-header">
            <div className="brand-badge">
              <img src={logo} className="badge-logo-img" alt="Logo" />
              <span>Portal Access</span>
            </div>
            <h2>Welcome Back</h2>
            <p className="subtitle">Sign in to manage donors and donations</p>
          </div>

          {error && (
            <div className="error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  placeholder="yuva@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="loader">Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Demo Credentials: <code>yuva@gmail.com</code> / <code>yuva1234</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
