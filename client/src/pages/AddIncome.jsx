import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

export default function AddIncome() {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const SOURCES = ['Salary', 'Freelance', 'Investment'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amtNum = Number(amount);
    if (!amount || !Number.isFinite(amtNum) || amtNum < 1 || amtNum > 10000000) {
      setError('Amount must be a whole number between 1 and 1,00,00,000 (1 Cr).');
      return;
    }

    try {
      setLoading(true);
      await API.post('/transactions', {
        type: 'income',
        amount: amtNum,
        category: source,
        date,
        description
      });
      alert('Income added successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add income.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1">
        <header className="page-header animate-fade-in-up">
          <div className="flex items-center gap-4 mb-2">
            <div style={{ width: '4rem', height: '4rem', borderRadius: '1rem', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              🟢
            </div>
            <div>
              <h1>Add Income</h1>
              <p>Record your earnings</p>
            </div>
          </div>
        </header>

        <div className="max-w-2xl animate-fade-in-up delay-100">
          <div className="card-3xl glass">
            {error && <div className="msg-error">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label mb-3">Amount</label>
                <div className="relative">
                  <span className="absolute text-gray" style={{ left: '1rem', top: '1rem', fontSize: '1.5rem' }}>₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                    min="1"
                    max="10000000"
                    step="1"
                    className="form-input green-focus text-2xl font-bold"
                    style={{ paddingLeft: '3rem' }}
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-gray mt-2">Max allowed: 1,00,00,000 (1 Cr)</p>
              </div>

              <div className="form-group">
                <label className="form-label mb-3">Source</label>
                <div className="radio-grid radio-grid-3">
                  {SOURCES.map(src => (
                    <label key={src} className="radio-pill">
                      <input
                        type="radio"
                        name="source"
                        value={src}
                        checked={source === src}
                        onChange={(e) => setSource(e.target.value)}
                      />
                      <div className="pill-label green">{src}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label mb-3">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    className="form-input green-focus"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label mb-3">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="form-input green-focus"
                    placeholder="Optional note"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="btn btn-green" style={{ flex: 1, borderRadius: '1rem' }}>
                  {loading ? 'Adding...' : 'Add Income'}
                </button>
                <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '1rem 2rem', borderRadius: '1rem' }}>
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
