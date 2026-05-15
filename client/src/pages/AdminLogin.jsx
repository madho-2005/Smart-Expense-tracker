import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Admin Credentials!');
      
      // Pulse effect on error
      const card = document.querySelector('.auth-card');
      if (card) {
        card.classList.add('animate-pulse');
        setTimeout(() => card.classList.remove('animate-pulse'), 500);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
        <div className="glow" style={{ background: 'rgba(245,158,11,0.05)' }}></div>

        <div className="auth-header">
          <div className="auth-icon animate-float" style={{ background: 'rgba(245,158,11,0.2)', boxShadow: '0 10px 15px -3px rgba(245,158,11,0.2)' }}>
            🔐
          </div>
          <h1>Admin Portal</h1>
          <p>Restricted access only</p>
        </div>

        {error && <div className="msg-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input amber-focus"
              placeholder="admin@company.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Security Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input amber-focus"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-amber btn-full">
            Access Dashboard
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="flex items-center justify-center gap-2" style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            <span>←</span> Back to User Login
          </Link>
        </div>
      </div>
    </div>
  );
}
