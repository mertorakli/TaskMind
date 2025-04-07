import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();

  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Extract first name from the user data
  const firstName = currentUser.displayName 
    ? currentUser.displayName.split(' ')[0] 
    : 'there';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Your Dashboard</h1>
        <p className="dashboard-greeting">Hello, {firstName}! Here's your daily overview.</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">0</div>
          <div className="stat-label">Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">0</div>
          <div className="stat-label">Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">0</div>
          <div className="stat-label">Habits</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">0</div>
          <div className="stat-label">Ideas</div>
        </div>
      </div>
      
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Quick Overview</h2>
          <p className="section-description">Your current focus areas</p>
        </div>
        
        <div className="empty-state">
          <p>Your dashboard will display your tasks, events, and activities here.</p>
          <p>You'll be able to manage everything from this central hub.</p>
        </div>
      </div>
      
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Get Started</h2>
          <span></span>
        </div>
        
        <div className="action-cards">
          <Link to="/tasks" className="action-card">
            <h3 className="action-title">Create a Task</h3>
            <p className="action-description">Add and organize your to-dos</p>
          </Link>
          
          <Link to="/calendar" className="action-card">
            <h3 className="action-title">Schedule an Event</h3>
            <p className="action-description">Manage your calendar</p>
          </Link>
          
          <Link to="/routines" className="action-card">
            <h3 className="action-title">Build a Routine</h3>
            <p className="action-description">Create consistent habits</p>
          </Link>
          
          <Link to="/mymind" className="action-card">
            <h3 className="action-title">Capture an Idea</h3>
            <p className="action-description">Store your thoughts in MyMind</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 