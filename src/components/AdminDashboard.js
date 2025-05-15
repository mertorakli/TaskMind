import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const { currentUser, updateUserRole, error, setError } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser || currentUser.role !== 'system_admin') return;
      
      setLoading(true);
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, setError]);

  const handleRoleChange = async (userId, newRole) => {
    setSuccess('');
    setError('');
    try {
      await updateUserRole(userId, newRole);
      setSuccess(`User role updated successfully to ${newRole}`);
      
      // Update the local state to reflect the change
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update user role');
    }
  };

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
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="admin-dashboard-content">
        <div className="admin-section">
          <h2>User Management</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role === 'end_user' ? (
                        <button 
                          onClick={() => handleRoleChange(user.id, 'system_admin')}
                          className="btn btn-sm btn-primary"
                        >
                          Make Admin
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleRoleChange(user.id, 'end_user')}
                          className="btn btn-sm btn-secondary"
                        >
                          Remove Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 