import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Bring Order to Your Mind</h1>
          <p className="hero-description">TaskMind empowers you to capture ideas, manage tasks, and build productive routines with elegance and simplicity.</p>
          
          <div className="hero-actions">
            {!currentUser ? (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                <Link to="/login" className="btn btn-outline btn-lg">Log In</Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
            )}
          </div>
        </div>
      </section>
      
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Thoughtfully Designed Features</h2>
          
          <div className="features-grid">
            <div className="card feature-card">
              <div className="card-header">
                <h3 className="card-title">Task Management</h3>
              </div>
              <p className="card-content">Create tasks, break them down into manageable sub-tasks, set deadlines, and track completion with a clean, focused interface.</p>
            </div>
            
            <div className="card feature-card">
              <div className="card-header">
                <h3 className="card-title">Calendar Integration</h3>
              </div>
              <p className="card-content">Visualize your schedule with clarity. Our intuitive calendar helps you plan your time effectively without visual clutter.</p>
            </div>
            
            <div className="card feature-card">
              <div className="card-header">
                <h3 className="card-title">Habit Building</h3>
              </div>
              <p className="card-content">Design consistent routines and track your progress with thoughtful reminders that help you build lasting positive habits.</p>
            </div>
            
            <div className="card feature-card">
              <div className="card-header">
                <h3 className="card-title">Idea Capture</h3>
              </div>
              <p className="card-content">Quickly record thoughts and inspirations with "MyMind" — a distraction-free notepad always ready when insight strikes.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="principles-section">
        <div className="container">
          <h2 className="section-title">Our Design Principles</h2>
          
          <div className="principles-grid">
            <div className="principle-card">
              <h3 className="principle-title">Simplicity</h3>
              <p className="principle-description">Less, but better. We remove the unnecessary so the essential can speak.</p>
            </div>
            
            <div className="principle-card">
              <h3 className="principle-title">Honesty</h3>
              <p className="principle-description">Our interface communicates its purpose clearly without misleading embellishments.</p>
            </div>
            
            <div className="principle-card">
              <h3 className="principle-title">Longevity</h3>
              <p className="principle-description">TaskMind is built to last, avoiding trendy elements that quickly become dated.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 