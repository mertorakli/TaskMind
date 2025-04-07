import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navigation from './components/Navigation';
import Home from './components/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import AdminLogin from './components/auth/AdminLogin';
import Logout from './components/auth/Logout';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import CreatePassword from './components/auth/CreatePassword';
import Profile from './components/Profile';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navigation />
          
          <main className="main-content">
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/create-password" element={<CreatePassword />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </main>
          
          <footer className="footer">
            <div className="container">
              <p className="footer-text">&copy; {new Date().getFullYear()} TaskMind. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 