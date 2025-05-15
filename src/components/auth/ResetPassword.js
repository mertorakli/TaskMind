import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ResetPassword() {
  const { resetPassword, error, setError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [oobCode, setOobCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the action code from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('oobCode');
    if (code) {
      setOobCode(code);
    } else {
      setError('Invalid password reset link. Please request a new one.');
    }
  }, [location, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate that passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setLoading(false);
      return;
    }

    // Validate password strength (at least 8 characters)
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Call Firebase to confirm the password reset
      await resetPassword(oobCode, password);
      setMessage('Your password has been updated successfully!');
      
      // Redirect to login page after a brief delay
      setTimeout(() => {
        navigate('/login?passwordSet=true');
      }, 2000);
    } catch (error) {
      console.error('[RESET PASSWORD] Error:', error);
      setError('Failed to reset password. The reset link may be expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Your Password</h1>
          <p className="auth-subtitle">Please enter your new password</p>
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="password">New Password</label>
            <input
              className="form-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              className="form-input"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8"
            />
          </div>
          
          <div className="password-requirements">
            Password must be at least 8 characters long.
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading || !oobCode}>
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
} 