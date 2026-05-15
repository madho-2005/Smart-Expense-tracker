import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Failed to delete transaction', err);
      alert('Failed to delete transaction');
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) return alert('No data to export');

    const rows = [
      ['Date', 'Type', 'Category', 'Amount', 'Description'],
      ...transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.category,
        t.amount,
        t.description || ''
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const formatMoney = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1">
        <header className="page-header animate-fade-in-up flex items-end justify-between">
          <div>
            <h1>Transaction History</h1>
            <p>View and manage your records</p>
          </div>
          <button onClick={handleExport} className="btn btn-indigo">
            Export CSV
          </button>
        </header>

        {loading ? (
          <div className="text-gray animate-pulse">Loading history...</div>
        ) : (
          <>
            <div className="grid grid-3 mb-8 animate-fade-in-up">
              <div className="card glass text-center">
                <div className="stat-value text-white">{transactions.length}</div>
                <div className="stat-label mt-1">Total Count</div>
              </div>
              <div className="card glass text-center">
                <div className="stat-value green">{formatMoney(totalIncome)}</div>
                <div className="stat-label mt-1">Total Income</div>
              </div>
              <div className="card glass text-center">
                <div className="stat-value red">{formatMoney(totalExpense)}</div>
                <div className="stat-label mt-1">Total Expenses</div>
              </div>
            </div>

            <div className="glass rounded-xl overflow-hidden animate-fade-in-up delay-100">
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-gray">
                  No transactions found. <Link to="/add-expense" style={{ color: '#818cf8', textDecoration: 'none' }}>Add one?</Link>
                </div>
              ) : (
                <div className="divide-y divide-white/10" style={{ borderTop: '0' }}>
                  {transactions.map(t => {
                    const isIncome = t.type === 'income';
                    return (
                      <div key={t._id} className="tx-item-full">
                        <div>
                          <div className="text-lg font-semibold">{t.category || 'Transaction'}</div>
                          <div className="text-sm text-gray">{new Date(t.date).toLocaleDateString()} • {t.description || 'No description'}</div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className={`text-xl font-bold ${isIncome ? 'green' : 'red'}`}>
                            {isIncome ? '+' : '-'}{formatMoney(t.amount)}
                          </div>
                          <button onClick={() => handleDelete(t._id)} className="delete-btn">
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
