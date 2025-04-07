import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const { signup, directSignup, error, setError } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [directPasswordMode, setDirectPasswordMode] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [debug, setDebug] = useState('');
  
  // Form fields as required in the backlog
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    birthCity: '',
    gender: '',
    address: '',
    phone: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fillWithTestData = () => {
    // Generate a random number for the email to avoid conflicts
    const randomNum = Math.floor(Math.random() * 10000);
    
    setFormData({
      firstName: 'Test',
      lastName: 'User',
      birthDate: '1990-01-01',
      birthPlace: 'United States',
      birthCity: 'New York',
      gender: 'prefer-not-to-say',
      address: '123 Test Street, Test City',
      phone: '555-123-4567',
      email: `testuser${randomNum}@example.com`
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setDebug('');

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'birthDate', 'birthPlace', 'birthCity', 'gender', 'email'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        setLoading(false);
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Register user and send password creation email
      setDebug('Attempting to register user...');
      await signup(formData.email, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace,
        birthCity: formData.birthCity,
        gender: formData.gender,
        address: formData.address || null,
        phone: formData.phone || null
      });

      setDebug(prevDebug => prevDebug + '\nRegistration successful. Email should be sent.');
      setRegisteredEmail(formData.email);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setDebug(prevDebug => prevDebug + `\nError: ${err.message}`);
      setError(err.message || 'An error occurred during registration');
      setLoading(false);
    }
  };

  // Handle direct password creation (for testing when email is not received)
  const handleDirectPasswordCreation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await directSignup(registeredEmail, password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace,
        birthCity: formData.birthCity,
        gender: formData.gender,
        address: formData.address || null,
        phone: formData.phone || null
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Direct password creation error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Join TaskMind</h1>
          <p className="auth-subtitle">Create your account to get started</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {success ? (
          <div className="success-message">
            <h3>Registration Successful!</h3>
            <p>A password creation link has been sent to your email. Please check your inbox and follow the instructions to set your password.</p>
            <p><strong>Important:</strong> You must click the link in the email to create your password. The link will expire after 1 hour.</p>
            <p>If you don't see the email, please check your spam/junk folder.</p>
            
            <div className="form-section">
              <p className="text-secondary">Didn't receive the email? You can create your password directly:</p>
              <button 
                className="btn btn-secondary" 
                onClick={() => setDirectPasswordMode(true)}
                disabled={directPasswordMode}
              >
                Create Password Directly
              </button>
              
              {directPasswordMode && (
                <form className="auth-form" onSubmit={handleDirectPasswordCreation}>
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
                  <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      className="form-input"
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <span className="password-requirements">
                      Password must be at least 6 characters long
                    </span>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Processing..." : "Create Account"}
                  </button>
                </form>
              )}
            </div>
            
            <div className="auth-footer">
              <Link to="/login">Go to Login</Link>
            </div>
            
            {debug && (
              <details className="debug-info">
                <summary>Debug Information</summary>
                <pre>{debug}</pre>
              </details>
            )}
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <button type="button" onClick={fillWithTestData} className="btn btn-tertiary btn-sm">
              Fill with Test Data
            </button>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name<span className="required">*</span></label>
                <input
                  className="form-input"
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name<span className="required">*</span></label>
                <input
                  className="form-input"
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="birthDate">Birth Date<span className="required">*</span></label>
              <input
                className="form-input"
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="birthPlace">Birth Country<span className="required">*</span></label>
                <input
                  className="form-input"
                  type="text"
                  id="birthPlace"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="birthCity">Birth City<span className="required">*</span></label>
                <input
                  className="form-input"
                  type="text"
                  id="birthCity"
                  name="birthCity"
                  value={formData.birthCity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="gender">Gender<span className="required">*</span></label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="address">Address (Optional)</label>
              <textarea
                className="form-textarea"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number (Optional)</label>
              <input
                className="form-input"
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address<span className="required">*</span></label>
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="form-hint">After registration, you'll receive an email with a link to create your password.</span>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Processing..." : "Register Account"}
            </button>
            
            <div className="auth-footer">
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 