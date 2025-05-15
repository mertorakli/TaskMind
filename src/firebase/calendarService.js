import { db } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  Timestamp,
  orderBy
} from 'firebase/firestore';

// Collection name
const COLLECTION_NAME = 'calendarItems';

/**
 * Convert a JavaScript Date to Firestore Timestamp
 */
const dateToTimestamp = (date) => {
  return date ? Timestamp.fromDate(new Date(date)) : null;
};

/**
 * Convert a Firestore Timestamp to JavaScript Date
 */
const timestampToDate = (timestamp) => {
  return timestamp ? timestamp.toDate() : null;
};

/**
 * Format calendar item for Firestore storage
 */
const formatForFirestore = (item) => {
  return {
    title: item.title,
    description: item.description || '',
    location: item.location || '',
    attendees: item.attendees || '',
    type: item.type,
    start: dateToTimestamp(item.start),
    end: dateToTimestamp(item.end),
    color: item.color,
    userId: item.userId,
    hasReminder: item.hasReminder || false,
    reminderDate: item.hasReminder ? dateToTimestamp(item.reminderDate) : null,
    reminderTime: item.hasReminder ? item.reminderTime : null,
    hasRecurrence: item.hasRecurrence || false,
    recurrenceType: item.hasRecurrence ? item.recurrenceType : null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
};

/**
 * Format calendar item from Firestore to application
 * This function is still used by other code and kept for reference.
 */
export const formatFromFirestore = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    location: data.location,
    attendees: data.attendees,
    type: data.type,
    start: timestampToDate(data.start),
    end: timestampToDate(data.end),
    color: data.color,
    userId: data.userId,
    hasReminder: data.hasReminder,
    reminderDate: timestampToDate(data.reminderDate),
    reminderTime: data.reminderTime,
    hasRecurrence: data.hasRecurrence,
    recurrenceType: data.recurrenceType,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt)
  };
};

/**
 * Add a new calendar item to Firestore
 */
export const addCalendarItem = async (calendarItem) => {
  try {
    const formatted = formatForFirestore(calendarItem);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), formatted);
    return { id: docRef.id, ...calendarItem };
  } catch (error) {
    console.error("Error adding calendar item: ", error);
    throw error;
  }
};

/**
 * Update an existing calendar item in Firestore
 */
export const updateCalendarItem = async (id, calendarItem) => {
  try {
    const formatted = {
      ...formatForFirestore(calendarItem),
      updatedAt: Timestamp.now()
    };
    
    // Remove fields that shouldn't be updated
    delete formatted.createdAt;
    delete formatted.userId;
    
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, formatted);
    return { id, ...calendarItem };
  } catch (error) {
    console.error("Error updating calendar item: ", error);
    throw error;
  }
};

/**
 * Delete a calendar item from Firestore
 */
export const deleteCalendarItem = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Error deleting calendar item: ", error);
    throw error;
  }
};

/**
 * Get all calendar items for a specific user
 * @deprecated Use onSnapshot with a query directly for real-time updates
 */
export const getUserCalendarItems = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("start", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(formatFromFirestore);
  } catch (error) {
    console.error("Error getting user calendar items: ", error);
    throw error;
  }
};

/**
 * Get calendar items in a date range for a specific user
 * @deprecated Use onSnapshot with a query directly for real-time updates,
 * then filter client-side for the date range
 */
export const getUserCalendarItemsInRange = async (userId, startDate, endDate) => {
  try {
    // First get all user items (Firestore doesn't support range queries on multiple fields)
    const items = await getUserCalendarItems(userId);
    
    // Then filter client-side for date range
    return items.filter(item => {
      return item.start >= startDate && item.start <= endDate;
    });
  } catch (error) {
    console.error("Error getting calendar items in range: ", error);
    throw error;
  }
}; 