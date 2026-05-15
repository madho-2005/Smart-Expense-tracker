import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ transactions: [], income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get('/transactions');
        const txs = res.data;
        
        let income = 0;
        let expense = 0;
        
        txs.forEach(t => {
          if (t.type === 'income') income += t.amount;
          else expense += t.amount;
        });
        
        setData({
          transactions: txs,
          income,
          expense,
          balance: income - expense
        });
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const formatMoney = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1">
        <header className="page-header animate-fade-in-up">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || 'User'}</p>
        </header>

        {loading ? (
          <div className="text-gray animate-pulse">Loading dashboard data...</div>
        ) : (
          <>
            <div className="grid grid-3 mb-12 animate-fade-in-up">
              <div className="card glass">
                <div className="stat-label">Total Balance</div>
                <div className="stat-value">{formatMoney(data.balance)}</div>
              </div>

              <div className="card glass">
                <div className="stat-label">Income</div>
                <div className="stat-value green">{formatMoney(data.income)}</div>
              </div>

              <div className="card glass">
                <div className="stat-label">Expenses</div>
                <div className="stat-value red">{formatMoney(data.expense)}</div>
              </div>
            </div>

            <div className="grid grid-2 mb-12 animate-fade-in-up delay-100">
              <Link to="/add-income" className="action-card glass">
                <div className="action-icon" style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>
                  ➕
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Add Income</h3>
                  <p className="text-gray text-sm">Record incoming funds</p>
                </div>
              </Link>

              <Link to="/add-expense" className="action-card glass">
                <div className="action-icon" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>
                  ➖
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Add Expense</h3>
                  <p className="text-gray text-sm">Track daily spending</p>
                </div>
              </Link>
            </div>

            <div className="card glass animate-fade-in-up delay-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
                <Link to="/history" className="text-sm" style={{ color: '#818cf8', textDecoration: 'none' }}>
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {data.transactions.length === 0 ? (
                  <div className="text-gray text-sm">No transactions yet.</div>
                ) : (
                  data.transactions.slice(0, 3).map(t => {
                    const isIncome = t.type === 'income';
                    return (
                      <div key={t._id} className="tx-item">
                        <div>
                          <div className="tx-title">{t.category || 'Transaction'}</div>
                          <div className="tx-date">{new Date(t.date).toLocaleDateString()}</div>
                        </div>
                        <div className={`tx-amount ${isIncome ? 'green' : 'red'}`}>
                          {isIncome ? '+' : '-'}{formatMoney(t.amount)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
