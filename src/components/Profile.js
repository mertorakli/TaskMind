import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Profile() {
  const { currentUser, logout, updateUserProfile, updateUserPassword, deleteUserAccount, error, setError } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    address: ''
  });

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Account deletion states
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: currentUser.email || '',
            phone: data.phone || '',
            gender: data.gender || '',
            address: data.address || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, setError]);

  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Update profile information
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');
    setLoading(true);

    try {
      await updateUserProfile({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        address: userData.address
      });
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    // Validate password
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccessMessage('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
    } catch (error) {
      setError('Failed to update password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (deleteConfirmation !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion');
      return;
    }

    setLoading(true);
    try {
      await deleteUserAccount(deletePassword);
      await logout();
      navigate('/');
    } catch (error) {
      setError('Failed to delete account: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Account Settings</h1>
        <p className="text-secondary">Manage your profile information and account preferences</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">Personal Information</h2>
        </div>
        
        <form onSubmit={handleProfileUpdate}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">First Name</label>
              <input
                className="form-input"
                type="text"
                id="firstName"
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">Last Name</label>
              <input
                className="form-input"
                type="text"
                id="lastName"
                name="lastName"
                value={userData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              className="form-input"
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
            <span className="form-hint">We'll never share your email with anyone else.</span>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              className="form-input"
              type="tel"
              id="phone"
              name="phone"
              value={userData.phone || ''}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="gender">Gender</label>
            <select
              className="form-select"
              id="gender"
              name="gender"
              value={userData.gender || ''}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="address">Address</label>
            <textarea
              className="form-textarea"
              id="address"
              name="address"
              value={userData.address || ''}
              onChange={handleChange}
              rows="3"
              placeholder="Optional"
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
      
      <div className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">Password</h2>
        </div>
        
        {!showPasswordChange ? (
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowPasswordChange(true)}
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordUpdate}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">Current Password</label>
              <input
                className="form-input"
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <input
                className="form-input"
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <input
                className="form-input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
              <span className="password-requirements">
                Password must be at least 6 characters long
              </span>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
              <button 
                type="button" 
                className="btn btn-tertiary"
                onClick={() => setShowPasswordChange(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="profile-section danger-zone">
        <div className="profile-section-header">
          <h2 className="profile-section-title">Delete Account</h2>
        </div>
        
        <p className="warning-text">
          Warning: This action is permanent and cannot be undone. All your data will be permanently deleted.
        </p>
        
        {!showDeleteAccount ? (
          <button 
            className="btn btn-danger" 
            onClick={() => setShowDeleteAccount(true)}
          >
            Delete Account
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount}>
            <div className="form-group">
              <label className="form-label" htmlFor="deletePassword">Enter your password to confirm</label>
              <input
                className="form-input"
                type="password"
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="deleteConfirmation">Type DELETE to confirm</label>
              <input
                className="form-input"
                type="text"
                id="deleteConfirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                required
                placeholder="Type DELETE in all caps"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-danger" disabled={loading}>
                {loading ? 'Processing...' : 'Permanently Delete Account'}
              </button>
              <button 
                type="button" 
                className="btn btn-tertiary"
                onClick={() => setShowDeleteAccount(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 