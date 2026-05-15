import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      setShowSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      console.error("Login error:", err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.message === 'Network Error') {
        setError('Network error: Unable to reach the server. Is it running on port 5000?');
      } else {
        setError('Incorrect Email or Password!');
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass">
        <div className="glow" style={{ background: 'rgba(99,102,241,0.1)' }}></div>

        <div className="auth-header">
          <div className="auth-icon animate-float" style={{ background: 'rgba(99,102,241,0.2)', boxShadow: '0 10px 15px -3px rgba(99,102,241,0.2)' }}>
            🔐
          </div>
          <h1>Welcome Back</h1>
          <p>Track your expenses intelligently</p>
        </div>

        {error && <div className="msg-error">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              id="userEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="name@company.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              id="userPass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-indigo btn-full">
            Sign In
          </button>

          <Link to="/signup" className="btn btn-emerald btn-full" style={{ display: 'block', textAlign: 'center' }}>
            Sign Up
          </Link>
        </form>

        <div className="auth-footer">
          <Link to="/admin-login" style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Switch to Admin Portal
          </Link>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-card glass animate-scale-in">
            <div className="popup-icon" style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>✅</div>
            <h3 className="text-2xl font-bold mb-2">Login Successful!</h3>
            <p className="text-gray mb-4">Redirecting to your dashboard...</p>
            <div className="popup-bar">
              <div className="popup-bar-fill"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
