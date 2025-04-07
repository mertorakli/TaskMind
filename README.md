# TaskMind

TaskMind is a productivity and organization application designed to help users manage tasks, events, habits, and ideas with a clean, modern interface.

## Features

- Task Management
- Calendar Integration
- Habit Building
- Idea Capture with MyMind
- User Profile Management
- Admin Dashboard

## Environment Setup

This project uses environment variables to keep sensitive information secure. Before running the application, you need to set up the environment:

1. Create a `.env` file in the root directory (or rename the provided `.env.example`)
2. Add the following environment variables:

```
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

Replace the placeholder values with your actual Firebase project credentials.

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up the environment variables as described above
4. Run the development server with `npm start`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects the app from create-react-app

## Project Architecture

The project follows a feature-driven architecture with clean separation of concerns:

- `src/core` - Core application logic and configurations
- `src/features` - Feature modules (auth, tasks, calendar, etc.)
- `src/ui` - Shared UI components and styles
- `src/contexts` - Global context providers

## Technologies Used

- React.js
- Firebase (Authentication, Firestore, Analytics)
- React Router
- Modern CSS with custom design system

## License

This project is licensed under the MIT License.
