import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddIncome from './pages/AddIncome';
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Reports from './pages/Reports';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageCategories from './pages/ManageCategories';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

export default function App() {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/admin-login" element={isAdmin ? <Navigate to="/admin" /> : <AdminLogin />} />

      {/* User Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/add-income" element={<ProtectedRoute><AddIncome /></ProtectedRoute>} />
      <Route path="/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

      {/* Admin Protected */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
