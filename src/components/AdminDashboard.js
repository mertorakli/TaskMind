import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  // Redirect if not logged in or not an admin
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (currentUser.role !== 'system_admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin. This dashboard allows you to manage the system.</p>
      
      <div className="admin-dashboard-content">
        <div className="admin-section">
          <h2>System Management</h2>
          <p>This is a placeholder for future admin dashboard content.</p>
        </div>
      </div>
    </div>
  );
} 