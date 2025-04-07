# TaskMind

TaskMind is a comprehensive productivity and organization application designed to empower users to effectively manage their daily tasks, schedules, routines, and the constant influx of ideas.

## Sprint 1: Authentication Features

This sprint implements core security features:
- Administrator Login
- End User Login
- User Registration
- Logout functionality

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd taskmind
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure Firebase

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase configuration from Project Settings
   - Update the configuration in `src/firebase/config.js`

4. Start the development server
   ```
   npm start
   ```

5. Create an admin user

   Since admin users need to be manually created with the "system_admin" role, you'll need to:
   
   - Register a regular user
   - Go to Firebase Console > Firestore Database
   - Find the user document in the "users" collection
   - Edit the document and change the "role" field to "system_admin"

## Project Structure

- `/src/components/auth`: Authentication components (Login, Register, AdminLogin, Logout)
- `/src/contexts`: Context providers (AuthContext)
- `/src/firebase`: Firebase configuration

## Features

### Administrator Login
- Admin-specific login page
- Role-based authorization
- Access to admin dashboard

### User Registration
- Comprehensive registration form with required fields
- Client-side validation
- Firestore user data storage

### End User Login
- Email and password login
- Error handling
- Redirect to dashboard

### Logout
- Secure logout functionality
- Session termination

## Technologies Used

- React.js
- Firebase Authentication
- Firestore Database
- React Router

## Next Steps

Future sprints will focus on implementing:
- Calendar functionality
- Task management
- Routine & habit tracking
- MyMind feature for idea capture and organization 