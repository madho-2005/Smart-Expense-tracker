import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTransactions: 0, totalVolume: 0, userGroups: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminStats();
  }, []);

  const formatMoney = (amount) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const filteredGroups = stats.userGroups.filter(u => 
    !searchTerm || 
    `${u.name} ${u.email} ${u.userId}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTxRow = (t, isIncome) => {
    const time = t.date ? new Date(t.date).toLocaleDateString() : '';
    const amtClass = isIncome ? 'text-green-400' : 'text-red-400';
    const label = t.category || 'Transaction';
    
    return (
      <div key={t._id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
        <div className="min-w-0">
          <div className="font-semibold truncate text-white">{label}</div>
          <div className="text-xs text-gray">{time}</div>
        </div>
        <div className={`font-mono font-bold whitespace-nowrap ${amtClass}`}>
          {formatMoney(t.amount)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <Sidebar type="admin" />
      <main className="main-content flex-1">
        <header className="page-header animate-fade-in-up">
          <h1>System Overview</h1>
          <p>Admin Control Center</p>
        </header>

        {loading ? (
          <div className="text-gray animate-pulse">Loading system data...</div>
        ) : (
          <>
            <div className="grid grid-3 mb-12 animate-fade-in-up">
              <div className="card glass">
                <div className="stat-label">Total Users</div>
                <div className="stat-value text-white">{stats.totalUsers.toLocaleString()}</div>
              </div>
              <div className="card glass">
                <div className="stat-label">Total System Volume</div>
                <div className="stat-value amber">{formatMoney(stats.totalVolume)}</div>
              </div>
              <div className="card glass">
                <div className="stat-label">Total Transactions</div>
                <div className="stat-value blue">{stats.totalTransactions.toLocaleString()}</div>
              </div>
            </div>

            <div className="card-3xl glass animate-fade-in-up delay-100">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <h2 className="text-xl font-bold">User-wise Activity</h2>
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="space-y-6">
                {filteredGroups.length === 0 ? (
                  <div className="text-gray">No activity found.</div>
                ) : (
                  filteredGroups.map(u => (
                    <div key={u.userId} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="min-w-0">
                          <div className="text-lg font-bold truncate">{u.name}</div>
                          <div className="text-xs text-gray">{u.email || `ID: ${u.userId}`}</div>
                        </div>

                        <div className="flex gap-2 flex-wrap text-sm">
                          <div className="px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                            Income: <span className="font-mono" style={{ color: '#86efac' }}>{formatMoney(u.totalInc)}</span>
                          </div>
                          <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                            Expense: <span className="font-mono" style={{ color: '#fca5a5' }}>{formatMoney(u.totalExp)}</span>
                          </div>
                          <div className="px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                            Net: <span className="font-mono" style={{ color: '#c7d2fe' }}>{formatMoney(u.net)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-2 mt-5 gap-4">
                        <div>
                          <div className="text-sm font-semibold mb-2" style={{ color: '#bbf7d0' }}>Recent Income</div>
                          <div className="space-y-2">
                            {u.incomeTx.length ? u.incomeTx.map(t => renderTxRow(t, true)) : <div className="text-gray text-sm">No income entries</div>}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-2" style={{ color: '#fecaca' }}>Recent Expense</div>
                          <div className="space-y-2">
                            {u.expenseTx.length ? u.expenseTx.map(t => renderTxRow(t, false)) : <div className="text-gray text-sm">No expense entries</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
