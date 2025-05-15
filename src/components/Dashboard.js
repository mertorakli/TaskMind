import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format, isSameDay, isAfter, addDays, isWithinInterval } from 'date-fns';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calendarItems, setCalendarItems] = useState([]);
  
  // Stats counts
  const [taskCount, setTaskCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [meetingCount, setMeetingCount] = useState(0);
  const [upcomingItems, setUpcomingItems] = useState([]);

  // Fetch calendar items - moved up before conditional return
  useEffect(() => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    // Create the query for this user's calendar items
    const calendarQuery = query(
      collection(db, 'calendarItems'),
      where("userId", "==", currentUser.uid),
      orderBy("start", "asc")
    );
    
    // Set up a real-time listener instead of one-time fetch
    const unsubscribe = onSnapshot(calendarQuery, 
      (snapshot) => {
        try {
          // Process the snapshot data
          const items = snapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Firestore timestamps to JS Dates
            return {
              id: doc.id,
              ...data,
              start: data.start ? data.start.toDate() : null,
              end: data.end ? data.end.toDate() : null,
              reminderDate: data.reminderDate ? data.reminderDate.toDate() : null,
              createdAt: data.createdAt ? data.createdAt.toDate() : null,
              updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
            };
          });
          
          // Count items by type
          let tasks = 0;
          let events = 0;
          let appointments = 0;
          let meetings = 0;
          
          // Get today and next 7 days range for upcoming items
          const today = new Date();
          const nextWeek = addDays(today, 7);
          const upcoming = [];
          
          items.forEach(item => {
            // Count by type
            if (item.type === 'New Task') tasks++;
            else if (item.type === 'New Event') events++;
            else if (item.type === 'New Appointment') appointments++;
            else if (item.type === 'New Meeting') meetings++;
            
            // Check if item is upcoming (today or within next 7 days)
            if (
              isWithinInterval(item.start, { start: today, end: nextWeek }) || 
              isSameDay(item.start, today)
            ) {
              upcoming.push(item);
            }
          });
          
          // Sort upcoming items by date
          upcoming.sort((a, b) => a.start - b.start);
          
          // Update state
          setCalendarItems(items);
          setTaskCount(tasks);
          setEventCount(events);
          setAppointmentCount(appointments);
          setMeetingCount(meetings);
          setUpcomingItems(upcoming.slice(0, 5)); // Show top 5 upcoming items
          setError(null);
          setIsLoading(false);
        } catch (err) {
          console.error("Error processing calendar items:", err);
          setError("Failed to process your calendar items.");
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching calendar items:", err);
        setError("Failed to load your calendar items.");
        setIsLoading(false);
      }
    );
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [currentUser]);

  // Redirect if not logged in - moved after hooks
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Extract first name from the user data
  const firstName = currentUser.displayName 
    ? currentUser.displayName.split(' ')[0] 
    : 'there';
    
  // Function to get appropriate color for item type
  const getItemColor = (type) => {
    switch(type) {
      case 'New Task': return '#4CAF50';
      case 'New Event': return '#F44336';
      case 'New Appointment': return '#2196F3';
      case 'New Meeting': return '#9C27B0';
      default: return '#757575';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Your Dashboard</h1>
        <p className="dashboard-greeting">Hello, {firstName}! Here's your daily overview.</p>
      </div>
      
      {isLoading ? (
        <div className="loading-indicator">Loading your data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-number">{taskCount}</div>
              <div className="stat-label">Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{eventCount}</div>
              <div className="stat-label">Events</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{meetingCount}</div>
              <div className="stat-label">Meetings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{appointmentCount}</div>
              <div className="stat-label">Appointments</div>
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Quick Overview</h2>
              <p className="section-description">Your current focus areas</p>
            </div>
            
            {upcomingItems.length > 0 ? (
              <div className="upcoming-items-container">
                <h3 className="upcoming-title">Upcoming items</h3>
                
                <div className="upcoming-list">
                  {upcomingItems.map((item, index) => (
                    <div key={item.id || index} className="upcoming-card">
                      <div className="upcoming-card-header" 
                          style={{ backgroundColor: item.color || getItemColor(item.type) }}>
                        <div className="upcoming-date-badge">
                          {isSameDay(item.start, new Date()) 
                            ? 'Today' 
                            : isSameDay(item.start, addDays(new Date(), 1))
                            ? 'Tomorrow'
                            : format(item.start, 'MMM d')}
                        </div>
                      </div>
                      
                      <div className="upcoming-card-content">
                        <div className="upcoming-time-container">
                          <div className="upcoming-time">
                            {format(item.start, 'h:mm a')}
                          </div>
                        </div>
                        
                        <div className="upcoming-details">
                          <h4 className="upcoming-item-title">{item.title}</h4>
                          <div className="upcoming-type-badge" 
                              style={{ backgroundColor: item.color || getItemColor(item.type), opacity: 0.2 }}>
                            <span className="upcoming-type">{item.type.replace('New ', '')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="view-all-link">
                  <Link to="/calendar">View all in calendar</Link>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <p>You don't have any upcoming tasks or events in the next 7 days.</p>
                <p>Use the calendar to schedule your activities.</p>
                <Link to="/calendar" className="add-item-button">Add New Item</Link>
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Get Started</h2>
          <span></span>
        </div>
        
        <div className="action-cards">
          <Link to="/calendar?new=task" className="action-card">
            <h3 className="action-title">Create a Task</h3>
            <p className="action-description">Add and organize your to-dos</p>
          </Link>
          
          <Link to="/calendar" className="action-card">
            <h3 className="action-title">Schedule an Event</h3>
            <p className="action-description">Manage your calendar</p>
          </Link>
          
          <Link to="/calendar?new=meeting" className="action-card">
            <h3 className="action-title">Plan a Meeting</h3>
            <p className="action-description">Schedule team collaboration</p>
          </Link>
          
          <Link to="/calendar?new=appointment" className="action-card">
            <h3 className="action-title">Book an Appointment</h3>
            <p className="action-description">Never miss important dates</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 