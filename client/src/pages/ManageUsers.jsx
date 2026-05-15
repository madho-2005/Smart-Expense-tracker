import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBan = async (userId) => {
    try {
      await API.patch(`/admin/users/${userId}/toggle-ban`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Failed to toggle user status', err);
      alert('Failed to update user status.');
    }
  };

  const formatMoney = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  return (
    <div className="flex">
      <Sidebar type="admin" />
      <main className="main-content flex-1">
        <header className="page-header animate-fade-in-up">
          <h1>Manage Users</h1>
          <p className="text-gray mt-2">You can only ban/unban users.</p>
        </header>

        <div className="glass rounded-2xl overflow-hidden animate-fade-in-up delay-100 table-wrapper">
          {loading ? (
            <div className="p-12 text-center text-gray">Loading users...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Joined</th>
                  <th>Current Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray">No users registered yet.</td>
                  </tr>
                ) : (
                  users.map(u => {
                    const isActive = u.status === 'active';
                    const letter = (u.name || 'U').trim().slice(0, 1).toUpperCase();
                    
                    return (
                      <tr key={u._id}>
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="user-avatar">{letter}</div>
                            <div>
                              <div className="font-semibold text-white">{u.name || 'User'}</div>
                              <div className="text-xs text-gray">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-gray">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="font-mono font-bold" style={{ color: '#a5b4fc' }}>
                          {formatMoney(u.balance)}
                        </td>
                        <td>
                          <span className={`badge ${isActive ? 'badge-green' : 'badge-red'}`}>
                            {isActive ? 'Active' : 'Banned'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => toggleBan(u._id)}
                            className="btn btn-sm"
                            style={{
                              background: isActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                              color: isActive ? '#fca5a5' : '#86efac',
                              border: `1px solid ${isActive ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`
                            }}
                          >
                            {isActive ? 'Ban' : 'Unban'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
