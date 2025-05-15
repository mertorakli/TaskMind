import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-backdrop"></div>
      <div className="container">
        <div className="nav-content">
          <div className="nav-logo">
            <Link to="/">
              <img 
                src="/assets/TaskMind_Icon.png" 
                alt="TaskMind Logo" 
                className="nav-icon" 
              />
              <span className="logo-text">TaskMind</span>
            </Link>
          </div>
          
          <div className="nav-links">
            {currentUser ? (
              <>
                <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                  Dashboard
                </Link>
                <Link to="/calendar" className={isActive('/calendar') ? 'active' : ''}>
                  Calendar
                </Link>
                <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
                  Profile
                </Link>
                {currentUser.role === 'system_admin' && (
                  <Link to="/admin-dashboard" className={isActive('/admin-dashboard') ? 'active' : ''}>
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="logout-button">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                  Log in
                </Link>
                <Link to="/register" className={`register-nav-button ${isActive('/register') ? 'active' : ''}`}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 