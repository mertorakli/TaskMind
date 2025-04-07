import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { verifyPasswordResetCode, confirmPasswordReset, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function CreatePassword() {
  const { error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [verifying, setVerifying] = useState(true);
  const [debug, setDebug] = useState('');

  useEffect(() => {
    // Clear any previous errors
    setError('');
    
    // Extract the action code from the URL
    const queryParams = new URLSearchParams(location.search);
    
    // When handleCodeInApp is true, Firebase sends these params:
    const oobCode = queryParams.get('oobCode'); // The action code
    const apiKey = queryParams.get('apiKey'); // Firebase API key
    const mode = queryParams.get('mode'); // Should be "resetPassword"
    const continueUrl = queryParams.get('continueUrl'); // Our app URL
    
    setDebug(`URL params: oobCode=${oobCode ? 'present' : 'missing'}, mode=${mode || 'missing'}, 
      apiKey=${apiKey ? 'present' : 'missing'}, continueUrl=${continueUrl || 'missing'}`);
    
    // Also check for deep link parameters
    const fullUrl = window.location.href;
    setDebug(prev => prev + `\nFull URL: ${fullUrl}`);
    
    // Check if the oobCode is embedded in the URL fragment (after #)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashOobCode = hashParams.get('oobCode');
    
    if (hashOobCode) {
      setDebug(prev => prev + `\nFound oobCode in hash: ${hashOobCode.substring(0, 5)}...`);
      handleOobCode(hashOobCode);
    } else if (oobCode) {
      setDebug(prev => prev + `\nFound oobCode in query params: ${oobCode.substring(0, 5)}...`);
      handleOobCode(oobCode);
    } else {
      // Check the path segments for the code (some apps embed it in the path)
      const pathSegments = window.location.pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      if (lastSegment && lastSegment !== 'create-password' && lastSegment.length > 20) {
        setDebug(prev => prev + `\nTrying path segment as code: ${lastSegment.substring(0, 5)}...`);
        handleOobCode(lastSegment);
      } else {
        setError('No verification code found in URL. Please use the link from your email.');
        setDebug(prev => prev + `\nNo oobCode found in URL: ${window.location.href}`);
        setVerifying(false);
      }
    }
  }, [location, setError]);

  const handleOobCode = (code) => {
    setActionCode(code);
    
    // Verify the action code and get the associated email
    verifyPasswordResetCode(auth, code)
      .then((email) => {
        setEmail(email);
        setDebug(prev => prev + `\nVerified code for email: ${email}`);
        setVerifying(false);
      })
      .catch((error) => {
        setError('This link is invalid or has expired. Please request a new one.');
        setDebug(prev => prev + `\nError verifying code: ${error.message}`);
        console.error('Error verifying code:', error);
        setVerifying(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      setDebug(prev => prev + `\nAttempting to confirm password reset with code: ${actionCode?.substr(0, 5)}...`);
      
      // Complete the password reset process
      await confirmPasswordReset(auth, actionCode, password);
      
      setDebug(prev => prev + `\nPassword reset confirmed, attempting to sign in as: ${email}`);
      
      // Automatically sign in the user
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setDebug(prev => prev + `\nSign-in successful, navigating to dashboard`);
        navigate('/dashboard');
      } catch (signInError) {
        setDebug(prev => prev + `\nAuto sign-in failed: ${signInError.message}, navigating to login`);
        // If automatic sign-in fails, redirect to login page
        navigate('/login?passwordSet=true');
      }
    } catch (err) {
      setError('Failed to set password: ' + err.message);
      setDebug(prev => prev + `\nError setting password: ${err.message}`);
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="create-password-container">
        <div className="create-password-form">
          <h2>Verifying Link...</h2>
          <p>Please wait while we verify your email link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-password-container">
      <div className="create-password-form">
        <h2>Create Your Password</h2>
        <p className="form-subtitle">Complete your account setup</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!!actionCode}
              className={actionCode ? "readonly-input" : ""}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password<span className="required">*</span></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password<span className="required">*</span></label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="password-requirements">
            <p>Password must be at least 6 characters long</p>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating Password...' : 'Create Password & Login'}
          </button>
        </form>
        
        {debug && (
          <div className="debug-info">
            <details>
              <summary>Debug Info</summary>
              <pre>{debug}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
} 