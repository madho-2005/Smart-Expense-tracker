import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

export default function AddExpense() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills'];

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
        type: 'expense',
        amount: amtNum,
        category,
        date,
        description
      });
      alert('Expense added successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1">
        <header className="page-header animate-fade-in-up">
          <h1 className="text-4xl font-bold">Add Expense</h1>
          <p className="text-gray mt-2">Track your spending.</p>
        </header>

        <div className="max-w-2xl animate-fade-in-up delay-100">
          <div className="card-3xl glass">
            {error && <div className="msg-error">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label mb-2">Amount</label>
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
                    className="form-input red-focus text-2xl font-bold"
                    style={{ paddingLeft: '3rem' }}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label mb-2">Category</label>
                <div className="radio-grid radio-grid-4">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="radio-pill">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={category === cat}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                      <div className="pill-label red">{cat === 'Shopping' ? 'Shop' : cat}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    className="form-input red-focus"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label mb-2">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="form-input red-focus"
                    placeholder="Optional note"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button type="submit" disabled={loading} className="btn btn-red" style={{ flex: 1, borderRadius: '1rem' }}>
                  {loading ? 'Adding...' : 'Add Expense'}
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
