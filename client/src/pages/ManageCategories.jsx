import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const INCOME_ICONS = {
  'Salary': '💼', 'Freelance': '🧑‍💻', 'Investment': '📈'
};

const EXPENSE_ICONS = {
  'Food': '🍔', 'Transport': '🚗', 'Shopping': '🛍️', 'Bills': '📄'
};

export default function ManageCategories() {
  const [stats, setStats] = useState({ incomeStats: [], expenseStats: [] });
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/admin/categories');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePurge = async () => {
    if (!window.confirm('Are you sure you want to clean invalid transactions?')) return;
    try {
      const res = await API.delete('/admin/purge-invalid');
      alert(res.data.message);
      fetchCategories();
    } catch (err) {
      alert('Failed to purge transactions');
    }
  };

  const formatMoney = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  const renderCategoryList = (categories, icons, accentClass) => {
    return categories.map(c => (
      <div key={c.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-lg ${accentClass} flex items-center justify-center text-xl`}>
            {icons[c.name] || '📌'}
          </div>
          <div className="min-w-0">
            <div className="font-semibold truncate text-white">{c.name}</div>
            <div className="text-xs text-gray">
              Used {c.count} time{c.count === 1 ? '' : 's'} • Total {formatMoney(c.sum)}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray whitespace-nowrap">
          {c.count > 0 ? 'Active' : '—'}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex">
      <Sidebar type="admin" />
      <main className="main-content flex-1">
        <header className="page-header animate-fade-in-up flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1>Categories</h1>
            <p className="text-gray mt-2">Global transaction aggregate stats</p>
          </div>
          <button onClick={handlePurge} className="btn" style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            Clean invalid data
          </button>
        </header>

        {loading ? (
          <div className="text-gray animate-pulse">Loading categories...</div>
        ) : (
          <div className="grid grid-2 animate-fade-in-up delay-100">
            <section className="glass card">
              <h2 className="font-bold flex items-center gap-2 mb-6">
                <span>🟢</span><span>Income Sources</span>
              </h2>
              <div>
                {renderCategoryList(stats.incomeStats, INCOME_ICONS, 'bg-green-500/20 text-green-300')}
              </div>
            </section>

            <section className="glass card">
              <h2 className="font-bold flex items-center gap-2 mb-6">
                <span>🔴</span><span>Expense Categories</span>
              </h2>
              <div>
                {renderCategoryList(stats.expenseStats, EXPENSE_ICONS, 'bg-red-500/20 text-red-300')}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
