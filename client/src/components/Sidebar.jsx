import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ type = 'user' }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(type === 'admin' ? '/admin-login' : '/login');
  };

  const userLinks = [
    { to: '/dashboard', icon: '📌', label: 'Dashboard' },
    { to: '/add-income', icon: '🟢', label: 'Add Income' },
    { to: '/add-expense', icon: '🔴', label: 'Add Expense' },
    { to: '/history', icon: '🧾', label: 'History' },
    { to: '/reports', icon: '📊', label: 'Reports' },
  ];

  const adminLinks = [
    { to: '/admin', icon: '📌', label: 'Dashboard' },
    { to: '/admin/users', icon: '👥', label: 'Manage Users' },
    { to: '/admin/categories', icon: '🏷️', label: 'Categories' },
  ];

  const links = type === 'admin' ? adminLinks : userLinks;
  const logo = type === 'admin' ? '🛠️' : '💰';
  const title = type === 'admin' ? 'Admin Panel' : 'Expense Tracker';

  return (
    <aside className="sidebar glass animate-fade-in-up">
      <div className="sidebar-logo">
        <span className="icon">{logo}</span>
        <span>{title}</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <button onClick={handleLogout} className="sidebar-link sidebar-logout">
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}
