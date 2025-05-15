import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { login, error, setError, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordSetSuccess, setPasswordSetSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [debug, setDebug] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const passwordSet = queryParams.get('passwordSet');
    if (passwordSet === 'true') {
      setPasswordSetSuccess(true);
    }
    
    // Log current auth state
    setDebug(`Auth state on load: ${currentUser ? 'Logged in as ' + currentUser.email : 'Not logged in'}`);
  }, [location, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebug(prevDebug => prevDebug + `\nAttempting login for ${email}...`);

    try {
      // Attempt to log in
      const result = await login(email, password);
      setDebug(prevDebug => prevDebug + `\nLogin successful, auth state: ${result?.user?.email || 'unknown'}`);
      console.log(`[LOGIN] Login successful for ${email}`);
      
      // Set a small delay to ensure Firebase auth state is updated
      setTimeout(() => {
        console.log('[LOGIN] Navigating to dashboard');
        setDebug(prevDebug => prevDebug + `\nNavigating to dashboard...`);
        setLoading(false); // Reset loading state before navigating
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error('[LOGIN] Login error:', error);
      setDebug(prevDebug => prevDebug + `\nLogin error: ${error.message}`);
      
      // On error, increment retry count - for debugging
      setRetryCount(prevCount => prevCount + 1);
      setError(`Failed to log in (attempt ${retryCount + 1}). Please check your email and password.`);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Log in to access your TaskMind</p>
        </div>
        
        {passwordSetSuccess && (
          <div className="success-message">
            Your password has been set successfully! You can now log in.
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              className="form-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className="form-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="forgot-password-container">
            <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
        
        <div className="auth-footer">
          <Link to="/admin-login" className="admin-login-link">Admin Login</Link>
        </div>
        
        {/* Add debug info at the bottom */}
        {debug && (
          <details className="debug-info">
            <summary>Debug Information</summary>
            <pre>{debug}</pre>
          </details>
        )}
      </div>
    </div>
  );
} 