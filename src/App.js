import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom';
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
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Calendar from './components/calendar/Calendar';

// Styles
import './App.css';

// Layout component with Navigation and Footer
function AppLayout() {
  return (
    <div className="app">
      <Navigation />
      
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p className="footer-text">&copy; {new Date().getFullYear()} TaskMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Create a router with future flags enabled
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="admin-login" element={<AdminLogin />} />
      <Route path="logout" element={<Logout />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="admin-dashboard" element={<AdminDashboard />} />
      <Route path="create-password" element={<CreatePassword />} />
      <Route path="profile" element={<Profile />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="calendar" element={<Calendar />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App; 