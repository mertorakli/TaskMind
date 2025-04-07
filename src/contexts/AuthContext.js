import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Register a new user without password and send email
  async function signup(email, userData) {
    try {
      setError('');
      
      // Store user data in Firestore first (without password)
      const userDocRef = doc(db, 'pending_users', email);
      await setDoc(userDocRef, {
        ...userData,
        email,
        createdAt: new Date().toISOString()
      });
      
      console.log(`[AUTH] User data stored in pending_users for ${email}`);
      
      // Generate a temporary random password
      const tempPassword = Math.random().toString(36).slice(-12);
      
      try {
        // Create a temporary account in Firebase Authentication
        console.log(`[AUTH] Creating temporary auth account for ${email}`);
        await createUserWithEmailAndPassword(auth, email, tempPassword);
        console.log(`[AUTH] Temporary account created for ${email}`);
        
        // Send password creation email (using password reset flow)
        const actionCodeSettings = {
          // URL must be exact match with the authorized domain in Firebase Console
          // Firebase will append oobCode and other parameters to this URL
          url: `${window.location.origin}/login?passwordSet=true`,
          // This should be false for password reset emails
          handleCodeInApp: false
        };
        
        console.log(`[AUTH] Sending password reset email to ${email}`);
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
        console.log(`[AUTH] Password reset email sent to ${email}`);
        
        return true;
      } catch (authError) {
        console.error(`[AUTH] Auth error for ${email}:`, authError);
        
        // If the account already exists, just send the password reset email
        if (authError.code === 'auth/email-already-in-use') {
          console.log(`[AUTH] Email already in use, sending password reset email to ${email}`);
          const actionCodeSettings = {
            url: `${window.location.origin}/login?passwordSet=true`,
            handleCodeInApp: false
          };
          
          await sendPasswordResetEmail(auth, email, actionCodeSettings);
          console.log(`[AUTH] Password reset email sent to ${email}`);
          return true;
        } else {
          const errorMessage = `Authentication error: ${authError.code} - ${authError.message}`;
          setError(errorMessage);
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error.message || "Unknown signup error";
      console.error(`[AUTH] Signup error for ${email}:`, error);
      setError(errorMessage);
      throw error;
    }
  }

  // Register a new user with direct password creation
  async function directSignup(email, password, userData) {
    try {
      setError('');
      
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...userData,
        email,
        role: 'end_user',
        createdAt: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      console.error("Direct signup error:", error);
      setError(error.message);
      throw error;
    }
  }

  // Admin login
  async function adminLogin(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user has admin role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'system_admin') {
        return user;
      } else {
        await signOut(auth);
        throw new Error('Not authorized as admin');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // End user login
  async function login(email, password) {
    try {
      // First sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Make sure the user document exists in Firestore
      try {
        await createOrUpdateUserDoc(user);
        console.log(`[AUTH] User document verified/created for ${user.email}`);
      } catch (docError) {
        console.error(`[AUTH] Error creating/updating user document:`, docError);
        // Continue with login even if document creation has issues
      }
      
      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Logout
  async function logout() {
    setError('');
    return signOut(auth);
  }

  // Get user role
  async function getUserRole(uid) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  }

  // Create/update user document after successful auth
  async function createOrUpdateUserDoc(user) {
    try {
      // Check if this user has pending data
      const pendingUserRef = doc(db, 'pending_users', user.email);
      const pendingUserSnap = await getDoc(pendingUserRef);
      
      if (pendingUserSnap.exists()) {
        // Transfer data from pending_users to users
        const userData = pendingUserSnap.data();
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          role: 'end_user',
          updatedAt: new Date().toISOString()
        });
      } else {
        // Check if user doc already exists
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          // Create minimal user document
          await setDoc(userDocRef, {
            email: user.email,
            role: 'end_user',
            createdAt: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error("Error creating/updating user document:", error);
    }
  }

  // Update user profile
  async function updateUserProfile(userData) {
    try {
      setError('');
      
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      // Update user document in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        ...userData,
        updatedAt: new Date().toISOString()
      });
      
      // If email is being updated, update it in Firebase Auth
      if (userData.email && userData.email !== currentUser.email) {
        await updateEmail(currentUser, userData.email);
      }
      
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      setError(error.message);
      throw error;
    }
  }

  // Update user password
  async function updateUserPassword(currentPassword, newPassword) {
    try {
      setError('');
      
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, newPassword);
      
      return true;
    } catch (error) {
      console.error("Update password error:", error);
      setError(error.message);
      throw error;
    }
  }

  // Delete user account
  async function deleteUserAccount(password) {
    try {
      setError('');
      
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      // Store user email for reauth
      const userEmail = currentUser.email;
      
      // First delete the user's Firestore document
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid));
        console.log("User document deleted successfully");
      } catch (firestoreError) {
        console.error("Error deleting user document:", firestoreError);
        // Continue with auth deletion even if document deletion fails
      }
      
      // Re-authenticate user before auth deletion
      const credential = EmailAuthProvider.credential(
        userEmail,
        password
      );
      
      try {
        // Reauthenticate first
        await reauthenticateWithCredential(auth.currentUser, credential);
        console.log("User reauthenticated successfully");
        
        // Now delete the user directly
        await deleteUser(auth.currentUser);
        console.log("User auth record deleted successfully");
        
        // Force sign out
        await signOut(auth);
        console.log("User signed out after deletion");
        
        return true;
      } catch (authError) {
        console.error("Authentication error during account deletion:", authError);
        throw authError;
      }
    } catch (error) {
      console.error("Delete account error:", error);
      setError(error.message);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create or update user document whenever they sign in
        await createOrUpdateUserDoc(user);
        
        const role = await getUserRole(user.uid);
        setCurrentUser({ ...user, role });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    directSignup,
    login,
    adminLogin,
    logout,
    error,
    setError,
    loading,
    sendPasswordResetEmail,
    updateUserProfile,
    updateUserPassword,
    deleteUserAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 