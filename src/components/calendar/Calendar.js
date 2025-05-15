import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, Views } from 'react-big-calendar';
import { format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, addMonths, addDays, isSameDay } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../../contexts/AuthContext';
import { 
  addCalendarItem, 
  deleteCalendarItem, 
  updateCalendarItem 
} from '../../firebase/calendarService';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Create a proper localizer with date-fns
const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek,
  getDay: (date) => date.getDay(),
  locales,
});

// Item types with their colors
const itemTypes = [
  { value: 'New Event', color: '#F44336' },
  { value: 'New Task', color: '#4CAF50' },
  { value: 'New Appointment', color: '#2196F3' },
  { value: 'New Meeting', color: '#9C27B0' }
];

// Custom event component to include color
const EventComponent = ({ event }) => (
  <div className="custom-event" style={{ backgroundColor: event.color || '#3174ad' }}>
    <span className="event-title">{event.title}</span>
  </div>
);

export default function Calendar() {
  const { currentUser } = useAuth();
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Form state
  const initialFormState = {
    title: '',
    description: '',
    location: '',
    attendees: '',
    hasReminder: false,
    reminderDate: format(new Date(), 'yyyy-MM-dd'),
    reminderTime: '09:00',
    hasRecurrence: false,
    recurrenceType: 'Daily',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    type: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // New state for day popup
  const [showDayPopup, setShowDayPopup] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [selectedDayItem, setSelectedDayItem] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'
  
  // Fetch calendar items when component mounts or user changes
  useEffect(() => {
    if (!currentUser) return;
    
    setLoading(true);
    
    // Create the query for this user's calendar items
    const calendarQuery = query(
      collection(db, 'calendarItems'),
      where("userId", "==", currentUser.uid),
      orderBy("start", "asc")
    );
    
    // Set up a real-time listener
    const unsubscribe = onSnapshot(calendarQuery, 
      (snapshot) => {
        try {
          // Process the snapshot data
          const items = snapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Firestore timestamps to JS Dates
            return {
              id: doc.id,
              title: data.title,
              description: data.description,
              location: data.location,
              attendees: data.attendees,
              type: data.type,
              start: data.start ? data.start.toDate() : null,
              end: data.end ? data.end.toDate() : null,
              color: data.color,
              userId: data.userId,
              hasReminder: data.hasReminder,
              reminderDate: data.reminderDate ? data.reminderDate.toDate() : null,
              reminderTime: data.reminderTime,
              hasRecurrence: data.hasRecurrence,
              recurrenceType: data.recurrenceType,
              createdAt: data.createdAt ? data.createdAt.toDate() : null,
              updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
            };
          });
          
          setEvents(items);
          setError(null);
          setLoading(false);
        } catch (err) {
          console.error("Error processing calendar items:", err);
          setError("Failed to process calendar items. Please try again later.");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching calendar items:", err);
        setError("Failed to load calendar items. Please try again later.");
        setLoading(false);
      }
    );
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [currentUser]);
  
  // Custom navigation handler
  const onNavigate = (newDate) => {
    setDate(newDate);
  };

  // Handler for view changes
  const onView = (newView) => {
    setView(newView);
  };

  // Navigation buttons for next/prev period
  const navigateToPrev = () => {
    let newDate;
    switch (view) {
      case Views.MONTH:
        newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        break;
      case Views.WEEK:
        newDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case Views.WORK_WEEK:
        newDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case Views.DAY:
        newDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
        break;
      default:
        newDate = date;
    }
    setDate(newDate);
  };

  const navigateToNext = () => {
    let newDate;
    switch (view) {
      case Views.MONTH:
        newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        break;
      case Views.WEEK:
        newDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case Views.WORK_WEEK:
        newDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case Views.DAY:
        newDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        break;
      default:
        newDate = date;
    }
    setDate(newDate);
  };

  const navigateToToday = () => {
    setDate(new Date());
  };
  
  // Handle clicking on a day slot - modified to show day popup
  const handleSelectSlot = ({ start }) => {
    const eventsOnDay = allEvents.filter(event => isSameDay(event.start, start));
    
    if (eventsOnDay.length > 0) {
      // If there are events on this day, show the day popup
      setSelectedDayDate(start);
      setSelectedDayEvents(eventsOnDay);
      setSelectedDayItem(null);
      setViewMode('list');
      setShowDayPopup(true);
    } else {
      // If no events, show the create item dropdown
      setSelectedDate(start);
      setSelectedEvent(null);
      setFormData({
        ...initialFormState,
        date: format(start, 'yyyy-MM-dd')
      });
      setShowDropdownMenu(true);
    }
  };
  
  // Handle clicking on an event - modified to show details directly
  const handleSelectEvent = (event) => {
    // If this is a recurring instance, we'll handle it differently
    if (event.isRecurringInstance) {
      // For recurring instances, we show details but don't allow editing
      setSelectedDayDate(event.start);
      setSelectedDayEvents([event]);
      setSelectedDayItem(event);
      setViewMode('details');
      setShowDayPopup(true);
      return;
    }
    
    setSelectedEvent(event);
    
    // Extract time parts from Date objects
    const startTime = event.start ? 
      `${String(event.start.getHours()).padStart(2, '0')}:${String(event.start.getMinutes()).padStart(2, '0')}` : 
      '';
      
    const endTime = event.end ? 
      `${String(event.end.getHours()).padStart(2, '0')}:${String(event.end.getMinutes()).padStart(2, '0')}` : 
      '';
    
    // Format reminder date if exists
    const reminderDate = event.reminderDate ? format(event.reminderDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    
    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      attendees: event.attendees || '',
      hasReminder: event.hasReminder || false,
      reminderDate: reminderDate,
      reminderTime: event.reminderTime || '09:00',
      hasRecurrence: event.hasRecurrence || false,
      recurrenceType: event.recurrenceType || 'Daily',
      date: format(event.start, 'yyyy-MM-dd'),
      startTime: startTime,
      endTime: endTime,
      type: event.type
    });
    
    setShowModal(true);
  };
  
  // Open edit modal from the day popup
  const handleEditFromDayPopup = (event) => {
    if (event.isRecurringInstance) {
      // For recurring instances, show a message that they can't be edited directly
      setError("Recurring instances cannot be edited directly. Please edit the original event.");
      return;
    }
    
    setSelectedEvent(event);
    
    // Extract time parts from Date objects
    const startTime = event.start ? 
      `${String(event.start.getHours()).padStart(2, '0')}:${String(event.start.getMinutes()).padStart(2, '0')}` : 
      '';
      
    const endTime = event.end ? 
      `${String(event.end.getHours()).padStart(2, '0')}:${String(event.end.getMinutes()).padStart(2, '0')}` : 
      '';
    
    // Format reminder date if exists
    const reminderDate = event.reminderDate ? format(event.reminderDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    
    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      attendees: event.attendees || '',
      hasReminder: event.hasReminder || false,
      reminderDate: reminderDate,
      reminderTime: event.reminderTime || '09:00',
      hasRecurrence: event.hasRecurrence || false,
      recurrenceType: event.recurrenceType || 'Daily',
      date: format(event.start, 'yyyy-MM-dd'),
      startTime: startTime,
      endTime: endTime,
      type: event.type
    });
    
    setShowDayPopup(false);
    setShowModal(true);
  };
  
  // Delete an event from the day popup
  const handleDeleteFromDayPopup = async (event) => {
    if (event.isRecurringInstance) {
      // For recurring instances, show a message that they can't be deleted directly
      setError("Recurring instances cannot be deleted directly. Please edit the original event.");
      return;
    }
    
    if (!event || !event.id) return;
    
    try {
      await deleteCalendarItem(event.id);
      setEvents(events.filter(e => e.id !== event.id));
      setSelectedDayEvents(selectedDayEvents.filter(e => e.id !== event.id));
      
      // If there are no more events for this day, close the popup
      if (selectedDayEvents.length <= 1) {
        setShowDayPopup(false);
      } else {
        // Go back to list view
        setViewMode('list');
        setSelectedDayItem(null);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete the item. Please try again.");
    }
  };
  
  // View details of an event from the day popup
  const handleViewDetails = (event) => {
    setSelectedDayItem(event);
    setViewMode('details');
  };
  
  // Go back to the list view from details view
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDayItem(null);
  };
  
  // Handle deleting an event
  const handleDeleteEvent = async () => {
    if (!selectedEvent || !selectedEvent.id) return;
    
    try {
      await deleteCalendarItem(selectedEvent.id);
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setShowModal(false);
      setSelectedEvent(null);
      setFormData(initialFormState);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete the item. Please try again.");
    }
  };
  
  // Handle plus button click
  const handleCreateButtonClick = () => {
    setSelectedDate(new Date());
    setSelectedEvent(null);
    setFormData({
      ...initialFormState,
      date: format(new Date(), 'yyyy-MM-dd')
    });
    setShowDropdownMenu(true);
  };
  
  // Handle item type selection
  const handleItemTypeSelect = (type) => {
    setFormData({
      ...formData,
      type: type.value
    });
    setShowDropdownMenu(false);
    setShowModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear validation error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (formData.hasReminder) {
      if (!formData.reminderDate) {
        errors.reminderDate = 'Reminder date is required';
      }
      if (!formData.reminderTime) {
        errors.reminderTime = 'Reminder time is required';
      }
    }
    
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      
      if (end <= start) {
        errors.endTime = 'End time must be after start time';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create start and end date objects
    const dateStr = formData.date;
    let startDateTime = new Date(dateStr);
    let endDateTime = new Date(dateStr);
    
    if (formData.startTime) {
      const [startHours, startMinutes] = formData.startTime.split(':');
      startDateTime.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10));
    }
    
    if (formData.endTime) {
      const [endHours, endMinutes] = formData.endTime.split(':');
      endDateTime.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10));
    } else if (formData.startTime) {
      // Default to 1 hour duration if only start time is provided
      endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    } else {
      // If no times provided, set an all-day event
      startDateTime.setHours(0, 0, 0);
      endDateTime.setHours(23, 59, 59);
    }
    
    // Get color for the item type
    const itemTypeObj = itemTypes.find(item => item.value === formData.type);
    const color = itemTypeObj ? itemTypeObj.color : '#3174ad';
    
    // Prepare data for reminder date
    let reminderDate = null;
    if (formData.hasReminder && formData.reminderDate) {
      reminderDate = new Date(formData.reminderDate);
      if (formData.reminderTime) {
        const [reminderHours, reminderMinutes] = formData.reminderTime.split(':');
        reminderDate.setHours(parseInt(reminderHours, 10), parseInt(reminderMinutes, 10));
      }
    }
    
    // Create the new event object
    const calendarItem = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      attendees: formData.attendees,
      start: startDateTime,
      end: endDateTime,
      color,
      type: formData.type,
      userId: currentUser.uid,
      hasReminder: formData.hasReminder,
      reminderDate: formData.hasReminder ? reminderDate : null,
      reminderTime: formData.hasReminder ? formData.reminderTime : null,
      hasRecurrence: formData.hasRecurrence,
      recurrenceType: formData.hasRecurrence ? formData.recurrenceType : null
    };
    
    try {
      let updatedEvent;
      
      if (selectedEvent && selectedEvent.id) {
        // Update existing event
        updatedEvent = await updateCalendarItem(selectedEvent.id, {
          ...calendarItem,
          id: selectedEvent.id
        });
        
        // Replace the updated event in the events array
        setEvents(events.map(event => 
          event.id === selectedEvent.id ? updatedEvent : event
        ));
      } else {
        // Add new event
        const newEvent = await addCalendarItem(calendarItem);
        setEvents([...events, newEvent]);
      }
      
      // Close the modal and reset form
      setShowModal(false);
      setFormData(initialFormState);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Error saving calendar item:", err);
      setError("Failed to save the item. Please try again.");
    }
  };

  // Function to generate recurring events (for client-side display)
  const generateRecurringEvents = (events) => {
    let allEvents = [...events];
    
    // Handle recurring events - create display instances for the visible range
    // Note: This doesn't create actual DB entries, just visual representations
    events.forEach(event => {
      if (event.hasRecurrence) {
        const recurrenceType = event.recurrenceType;
        let recurrenceEnd;
        
        // For display purposes, show recurring instances for next 6 months max
        if (recurrenceType === 'Daily') {
          recurrenceEnd = addDays(new Date(), 60); // 60 days ahead
        } else if (recurrenceType === 'Weekly') {
          recurrenceEnd = addDays(new Date(), 90); // 90 days ahead (about 3 months)
        } else if (recurrenceType === 'Monthly') {
          recurrenceEnd = addMonths(new Date(), 6); // 6 months ahead
        }
        
        let currentDate = new Date(event.start);
        
        // Generate up to 50 instances to avoid performance issues
        let count = 0;
        const maxInstances = 50;
        
        while (currentDate < recurrenceEnd && count < maxInstances) {
          // Skip the original event date
          if (count > 0) {
            const durationMs = event.end.getTime() - event.start.getTime();
            
            let nextStart;
            let nextEnd;
            
            if (recurrenceType === 'Daily') {
              nextStart = addDays(event.start, count);
              nextEnd = new Date(nextStart.getTime() + durationMs);
            } else if (recurrenceType === 'Weekly') {
              nextStart = addDays(event.start, count * 7);
              nextEnd = new Date(nextStart.getTime() + durationMs);
            } else if (recurrenceType === 'Monthly') {
              // Get the day of the month from the original event
              const day = event.start.getDate();
              
              // Create a new date for the same day in a future month
              nextStart = new Date(event.start);
              nextStart.setMonth(nextStart.getMonth() + count);
              
              // Adjust day if necessary (e.g., for months with fewer days)
              const lastDayOfMonth = new Date(nextStart.getFullYear(), nextStart.getMonth() + 1, 0).getDate();
              if (day > lastDayOfMonth) {
                nextStart.setDate(lastDayOfMonth);
              }
              
              nextEnd = new Date(nextStart.getTime() + durationMs);
            }
            
            // Add recurring instance
            allEvents.push({
              ...event,
              id: `${event.id}_recurring_${count}`,
              start: nextStart,
              end: nextEnd,
              title: `${event.title} (Recurring)`,
              isRecurringInstance: true, // Flag to identify recurring instances
              originalEventId: event.id
            });
          }
          
          // Move to next recurrence
          if (recurrenceType === 'Daily') {
            currentDate = addDays(currentDate, 1);
          } else if (recurrenceType === 'Weekly') {
            currentDate = addDays(currentDate, 7);
          } else if (recurrenceType === 'Monthly') {
            currentDate = addMonths(currentDate, 1);
          }
          
          count++;
        }
      }
    });
    
    return allEvents;
  };

  // All events including recurring instances
  const allEvents = generateRecurringEvents(events);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1 className="calendar-title">Your Calendar</h1>
        <p className="calendar-subtitle">Organize your schedule with clarity and focus</p>
        
        <div className="calendar-controls">
          <div className="view-controls">
            <button 
              className={`view-btn ${view === Views.MONTH ? 'active' : ''}`} 
              onClick={() => onView(Views.MONTH)}
            >
              Month
            </button>
            <button 
              className={`view-btn ${view === Views.WEEK ? 'active' : ''}`} 
              onClick={() => onView(Views.WEEK)}
            >
              Week
            </button>
            <button 
              className={`view-btn ${view === Views.WORK_WEEK ? 'active' : ''}`} 
              onClick={() => onView(Views.WORK_WEEK)}
            >
              Weekday
            </button>
            <button 
              className={`view-btn ${view === Views.DAY ? 'active' : ''}`} 
              onClick={() => onView(Views.DAY)}
            >
              Day
            </button>
          </div>
          
          <div className="navigation-controls">
            <button className="nav-btn" onClick={navigateToPrev}>
              &lt; Previous
            </button>
            <button className="nav-btn today" onClick={navigateToToday}>
              Today
            </button>
            <button className="nav-btn" onClick={navigateToNext}>
              Next &gt;
            </button>
            <button className="create-btn" onClick={handleCreateButtonClick} aria-label="Create new item">
              +
            </button>
          </div>
        </div>
        
        <div className="current-date">
          {view === Views.MONTH && format(date, 'MMMM yyyy')}
          {view === Views.WEEK && `Week of ${format(date, 'MMM d, yyyy')}`}
          {view === Views.WORK_WEEK && `Work Week of ${format(date, 'MMM d, yyyy')}`}
          {view === Views.DAY && format(date, 'EEEE, MMMM d, yyyy')}
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-indicator">Loading calendar data...</div>}
      </div>
      
      <div className="calendar-wrapper">
        <BigCalendar
          localizer={localizer}
          events={allEvents}
          views={{
            month: true,
            week: true,
            work_week: true,
            day: true
          }}
          view={view}
          date={date}
          onNavigate={onNavigate}
          onView={onView}
          components={{
            event: EventComponent
          }}
          popup
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          tooltipAccessor={null}
          dayPropGetter={(date) => ({
            className: 'calendar-day',
            style: {
              backgroundColor: new Date().toDateString() === date.toDateString() ? '#f0f8ff' : 'inherit',
            },
          })}
          eventPropGetter={(event) => ({
            className: 'calendar-event',
            style: {
              backgroundColor: event.color || '#3174ad',
              borderRadius: '4px',
              opacity: 0.9,
              color: 'white',
              border: 'none',
            },
          })}
        />
      </div>
      
      <div className="calendar-legend">
        <h3 className="legend-title">Color Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="color-dot" style={{backgroundColor: '#4CAF50'}}></span>
            <span>Tasks</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{backgroundColor: '#2196F3'}}></span>
            <span>Appointments</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{backgroundColor: '#F44336'}}></span>
            <span>Events</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{backgroundColor: '#9C27B0'}}></span>
            <span>Meetings</span>
          </div>
        </div>
      </div>
      
      {/* Item Type Dropdown Menu */}
      {showDropdownMenu && (
        <div className="dropdown-menu">
          <div className="dropdown-backdrop" onClick={() => setShowDropdownMenu(false)}></div>
          <div className="dropdown-content">
            <h3>Create New Item</h3>
            <ul className="type-list">
              {itemTypes.map((type) => (
                <li key={type.value} onClick={() => handleItemTypeSelect(type)}>
                  <span className="type-color" style={{ backgroundColor: type.color }}></span>
                  <span>{type.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Modal Form */}
      {showModal && (
        <div className="calendar-modal">
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedEvent ? `Edit ${formData.type}` : formData.type}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="item-form">
              <div className="form-group">
                <label htmlFor="title">Title <span className="required">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={formErrors.title ? 'error' : ''}
                  placeholder="Add a title"
                />
                {formErrors.title && <span className="error-text">{formErrors.title}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add more details"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Add location"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="attendees">Attendees</label>
                  <input
                    type="text"
                    id="attendees"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleInputChange}
                    placeholder="Comma separated emails"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date <span className="required">*</span></label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={formErrors.date ? 'error' : ''}
                  />
                  {formErrors.date && <span className="error-text">{formErrors.date}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={formErrors.endTime ? 'error' : ''}
                  />
                  {formErrors.endTime && <span className="error-text">{formErrors.endTime}</span>}
                </div>
              </div>
              
              <div className="checkbox-row">
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="hasReminder"
                    name="hasReminder"
                    checked={formData.hasReminder}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="hasReminder">Set Reminder</label>
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="hasRecurrence"
                    name="hasRecurrence"
                    checked={formData.hasRecurrence}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="hasRecurrence">Repeat</label>
                </div>
              </div>
              
              {/* Conditional Reminder Fields */}
              {formData.hasReminder && (
                <div className="reminder-section">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reminderDate">Reminder Date <span className="required">*</span></label>
                      <input
                        type="date"
                        id="reminderDate"
                        name="reminderDate"
                        value={formData.reminderDate}
                        onChange={handleInputChange}
                        className={formErrors.reminderDate ? 'error' : ''}
                      />
                      {formErrors.reminderDate && <span className="error-text">{formErrors.reminderDate}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="reminderTime">Reminder Time <span className="required">*</span></label>
                      <input
                        type="time"
                        id="reminderTime"
                        name="reminderTime"
                        value={formData.reminderTime}
                        onChange={handleInputChange}
                        className={formErrors.reminderTime ? 'error' : ''}
                      />
                      {formErrors.reminderTime && <span className="error-text">{formErrors.reminderTime}</span>}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Conditional Recurrence Fields */}
              {formData.hasRecurrence && (
                <div className="recurrence-section">
                  <h4>Recurrence Pattern</h4>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="Daily"
                        name="recurrenceType"
                        value="Daily"
                        checked={formData.recurrenceType === 'Daily'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Daily">Daily</label>
                    </div>
                    
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="Weekly"
                        name="recurrenceType"
                        value="Weekly"
                        checked={formData.recurrenceType === 'Weekly'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Weekly">Weekly</label>
                    </div>
                    
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="Monthly"
                        name="recurrenceType"
                        value="Monthly"
                        checked={formData.recurrenceType === 'Monthly'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Monthly">Monthly</label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="form-actions">
                {selectedEvent && (
                  <button type="button" className="btn btn-danger" onClick={handleDeleteEvent}>
                    Delete
                  </button>
                )}
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedEvent ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Day Popup */}
      {showDayPopup && (
        <div className="calendar-modal day-popup">
          <div className="modal-backdrop" onClick={() => setShowDayPopup(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {viewMode === 'list' 
                  ? `Events on ${format(selectedDayDate, 'MMMM d, yyyy')}` 
                  : selectedDayItem?.title}
              </h2>
              {viewMode === 'details' && (
                <button 
                  className="back-btn" 
                  onClick={handleBackToList}
                  title="Back to list"
                >
                  &larr;
                </button>
              )}
              <button className="close-btn" onClick={() => setShowDayPopup(false)}>&times;</button>
            </div>
            
            <div className="modal-body">
              {viewMode === 'list' ? (
                <div className="event-list">
                  {selectedDayEvents.length === 0 ? (
                    <p className="no-events">No events for this day.</p>
                  ) : (
                    <ul>
                      {selectedDayEvents.map(event => (
                        <li key={event.id || event.originalEventId + event.start.toISOString()}>
                          <div 
                            className="event-list-item" 
                            onClick={() => handleViewDetails(event)}
                          >
                            <span 
                              className="event-color" 
                              style={{ backgroundColor: event.color }}
                            ></span>
                            <div className="event-info">
                              <h3>{event.title}</h3>
                              <p>
                                {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="event-details">
                  <div className="detail-actions">
                    {!selectedDayItem.isRecurringInstance && (
                      <>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleEditFromDayPopup(selectedDayItem)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDeleteFromDayPopup(selectedDayItem)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {selectedDayItem.isRecurringInstance && (
                      <div className="recurring-note">
                        This is a recurring event instance.
                      </div>
                    )}
                  </div>
                  
                  <div className="detail-section">
                    <div className="detail-type">
                      <span 
                        className="type-indicator" 
                        style={{ backgroundColor: selectedDayItem.color }}
                      ></span>
                      <span>{selectedDayItem.type}</span>
                    </div>
                    
                    <div className="detail-time">
                      <strong>Time:</strong> {format(selectedDayItem.start, 'h:mm a')} - {format(selectedDayItem.end, 'h:mm a')}
                    </div>
                    
                    {selectedDayItem.description && (
                      <div className="detail-description">
                        <strong>Description:</strong>
                        <p>{selectedDayItem.description}</p>
                      </div>
                    )}
                    
                    {selectedDayItem.location && (
                      <div className="detail-location">
                        <strong>Location:</strong>
                        <p>{selectedDayItem.location}</p>
                      </div>
                    )}
                    
                    {selectedDayItem.attendees && (
                      <div className="detail-attendees">
                        <strong>Attendees:</strong>
                        <p>{selectedDayItem.attendees}</p>
                      </div>
                    )}
                    
                    {selectedDayItem.hasReminder && (
                      <div className="detail-reminder">
                        <strong>Reminder:</strong>
                        <p>
                          {selectedDayItem.reminderDate && format(selectedDayItem.reminderDate, 'MMM d, yyyy')} at {selectedDayItem.reminderTime}
                        </p>
                      </div>
                    )}
                    
                    {selectedDayItem.hasRecurrence && (
                      <div className="detail-recurrence">
                        <strong>Repeats:</strong>
                        <p>{selectedDayItem.recurrenceType}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 