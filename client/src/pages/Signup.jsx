import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error("Signup error:", err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.message === 'Network Error') {
        setError('Network error: Unable to reach the server. Is it running on port 5000?');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass">
        <div className="glow" style={{ background: 'rgba(16,185,129,0.1)' }}></div>

        <div className="auth-header">
          <div className="auth-icon" style={{ background: 'rgba(16,185,129,0.2)', boxShadow: '0 10px 15px -3px rgba(16,185,129,0.2)' }}>
            📝
          </div>
          <h1>Create Account</h1>
          <p>Create a new account to start tracking.</p>
        </div>

        {error && <div className="msg-error">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input green-focus"
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input green-focus"
              placeholder="name@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="form-input green-focus"
              placeholder="Min 6 characters"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              className="form-input green-focus"
              placeholder="Re-type password"
            />
          </div>

          <button type="submit" className="btn btn-green btn-full">
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Already have an account? Sign In</Link>
        </div>
      </div>
    </div>
  );
}
