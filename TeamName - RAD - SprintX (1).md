

TaskMind



Requirements Specification and Analysis

Sprint 1

08\.04.2025



Clarity Team






Prepared for

SOFT3102 Software Engineering Practice

![](Aspose.Words.2098fb5a-d4f7-4af0-919c-38026cab716e.001.png)





<Project Name>
# **Table of Contents**
[1.	Introduction	1](#_toc65941015)

[1.1.	Purpose of the System	1](#_toc65941016)

[1.2.	Scope of the System	1](#_toc65941017)

[1.3.	Objectives and Success Criteria of the Project	1](#_toc65941018)

[1.4.	Definitions, Acronyms, and Abbreviations	1](#_toc65941019)

[1.5.	Overview	1](#_toc65941020)

[2.	Current System	1](#_toc65941021)

[3.	Proposed System	1](#_toc65941022)

[3.1.	Overview	1](#_toc65941023)

[3.2.	Functional Requirements	2](#_toc65941024)

[3.3.	Nonfunctional Requirements	2](#_toc65941025)

[Usability	2](#_toc65941026)

[Reliability	2](#_toc65941027)

[Performance	2](#_toc65941028)

[Supportability	2](#_toc65941029)

[Implementation	2](#_toc65941030)

[Interface	2](#_toc65941031)

[Packaging	2](#_toc65941032)

[Legal	2](#_toc65941033)

[3.4.	System Models	2](#_toc65941034)

[Scenarios	2](#_toc65941035)

[Use case model	2](#_toc65941036)

[Dynamic model	2](#_toc65941037)

[User interface—navigational paths and screen mock-ups	3](#_toc65941038)

[3.5.	Project Schedule	3](#_toc65941039)

[4.	Glossary	3](#_toc65941040)

[5.	References	3](#_toc65941041)





i

**REQUIREMENTS ANALYSIS DOCUMENT[[1](#_ref431126989)]**
1. # <a name="_toc65941015"></a>**Introduction**
` `The purpose of TaskMind is to provide a task management and focus-enhancement platform TaskMind is a web-based platform designed to support individuals with Attention Deficit Hyperactivity Disorder (ADHD) by helping them organize their tasks, manage focus, and reduce distractions. In the first sprint of the project, the core security and account management functionalities have been implemented, providing the foundation for future ADHD-focused productivity tools.

This Requirements Analysis Document (RAD) focuses solely on the functional and non-functional requirements realized in **Sprint 1**, specifically the authentication, role-based access control, and user account management capabilities.

1. ## <a name="_toc65941016"></a>**Purpose of the System**
` `The purpose of the TaskMind system is to provide a secure, scalable, and user-friendly web- The purpose of the TaskMind system is to offer a secure, user-friendly, and scalable authentication and account management infrastructure for both **end users** and **system administrators**. Built with **React** on the frontend and **Firebase Authentication & Firestore** on the backend, the system provides:

- Secure user registration and login
- Role-based access (end\_user vs. system\_admin)
- Session management (login/logout)
- Account editing and deletion features

This foundational functionality is crucial for establishing a secure user base and serves as the groundwork for future task management modules tailored for ADHD users. The system aims to ensure software quality attributes like **usability**, **security**, **maintainability**, and **data integrity** from the outset


1. ## <a name="_toc65941017"></a>**Scope of the System**
` `In Sprint 1, the scope of the TaskMind system is limited to user authentication and account lifecycle management. The platform is strictly **web-based**, accessible via modern browsers, and does not include native mobile or desktop app support at this stage.

The features implemented in this sprint include:

- **User Registration** with mandatory (first name, last name, birth details, gender, email) and optional (phone, address) fields.
- **Email-based Password Setup** via secure verification link.
- **Login/Logout Functionality** using Firebase Authentication.
- **Role-Based Access Control** ensuring correct dashboard routing for users and admins.
- **Admin Login** via a dedicated interface.
- **Account Editing**, allowing users to update personal data like name, email, password, and phone number.
- **Account Deletion**, enabling users to permanently remove their accounts.

These features were planned and tracked via the sprint backlog in Trello, with corresponding acceptance criteria defining their implementation.

1. ## <a name="_toc65941018"></a>**Objectives and Success Criteria of the Project**
The primary objective of the TaskMind project is to design and implement a secure and functional user management system that enables both end users and administrators to perform authentication and account-related operations efficiently. This foundational system will serve as the base for future enhancements, including ADHD-focused task planning tools and productivity aids.

**Objectives:**

- Implement secure registration and email verification workflows.
- Enable login/logout using Firebase Authentication.
- Provide separate login and dashboard views for system administrators.
- Allow users to edit or delete their own account data securely.
- Enforce role-based access control across the system.
- Validate form inputs and deliver meaningful error messages.

  **Success Criteria:**

- End users can register and verify their accounts via email.
- Users can securely log in and out.
- Admin users can log in via a separate interface.
- Users are redirected based on their role after login.
- User profiles can be updated or deleted through the dashboard.
- Firestore contains consistent, validated user data.
- Unauthorized access is prevented via protected routing.
  1. ## <a name="_toc65941019"></a>**Definitions, Acronyms, and Abbreviations**
` `This section defines the technical terms, acronyms, and abbreviations used throughout this Requirements Analysis Document (RAD) to ensure consistency and clarity:

- Requirements Analysis Document (RAD): A document that outlines the system's functional and non-functional requirements during the early stages of software development.
- User Interface / User Experience (UI / UX): The design and layout of the system's interface, as well as the overall user journey and interaction with the platform.
- Create, Read, Update, Delete (CRUD): The four basic operations performed on data in a database or application, essential for managing resources such as user accounts.
- Authentication (Auth): The process of verifying the identity of users before granting access to the system.
- Firebase: A Backend-as-a-Service (BaaS) platform by Google used for providing authentication, hosting, real-time database, and other backend services.
- Firestore: A NoSQL cloud database provided by Firebase that supports real-time data storage and retrieval.
- Firebase Authentication (Firebase Auth): A secure authentication service offered by Firebase that supports features such as email/password login, email verification, and password reset.
- AuthContext: A React Context used to manage and distribute authentication state (e.g., current user, login status, role) across the entire application.
- Role-Based Access Control (RBAC): A security model that restricts system access based on user roles. In TaskMind, there are two roles: end\_user and system\_admin.
- Admin: A system administrator with elevated permissions who can manage users and access restricted parts of the application.
- End User: A regular system user with standard permissions, primarily using the platform for task management and personal account features.
- Attention Deficit Hyperactivity Disorder (ADHD): A neurodevelopmental disorder that affects attention, focus, and impulse control. Future versions of TaskMind aim to support users with ADHD by incorporating productivity and focus-enhancing features.

1. ## <a name="_toc65941020"></a>**Overview**
` `This Requirements Analysis Document (RAD) provides a detailed specification of the functional and non-functional requirements identified during Sprint 1 of the TaskMind project. The system aims to deliver a secure, role-based authentication and account management platform for web users, built with modern technologies such as React and Firebase (Authentication + Firestore). The RAD focuses on features such as user registration, login/logout flows, role-based access control (RBAC), and account settings management.

The purpose of this document is to communicate the project scope and requirements clearly to both the development team and key stakeholders. This document will also serve as a reference during design, implementation, and testing stages.

The remainder of this document is organized as follows:

- Section 2: Current System – Describes the existing approach (if any) to user authentication and account management, and highlights current limitations.
- Section 3: Proposed System – Explains the intended functionality, architecture, and design considerations of the new system.
- Section 4: Subsystem Services – Details the responsibilities and interactions of each module within the system.
- Section 5: References – Provides the list of external resources and documents referenced throughout this RAD.

This RAD will evolve in future iterations as more features are added to the TaskMind system, such as planning tools, real-time notifications, and cognitive aids supporting ADHD-specific needs.

1. # <a name="_toc65941021"></a>**Current System**
` `TaskMind is a newly developed web-based platform that introduces secure authentication, user management, and role-based access control to support both system administrators and end users. The system does not replace any existing centralized software; rather, it has been developed to address the absence of a secure, scalable, and structured environment for user account and session management.

Prior to TaskMind, users did not have access to a centralized system where they could securely register, log in, or manage their account information. The following core functionalities were either unavailable or handled manually:

- Users could not register into a verified and centralized database.  
- There was no secure method for setting and managing passwords with email-based validation.  
- No mechanism existed for differentiating user access based on roles (e.g., admin vs. standard user).  
- Essential account management operations like login, logout, password reset, or profile editing were not supported.  
- Users lacked post-registration routing or secure password recovery options.  
- Users could not delete their account from the system or manage their account lifecycle securely.  
- There was no interface to update existing user information (e.g., name, email, password, phone) in a consistent and validated manner.

Instead, users engaged in temporary and insecure solutions such as manually sending information via email, using spreadsheets (e.g., Excel or Google Sheets) to track user data, or setting passwords through informal communication channels. These makeshift approaches introduced significant risks regarding data integrity, authorization, and privacy—particularly in the context of compliance with data protection regulations like GDPR.

The key issues identified in the pre-TaskMind environment included:

Lack of authentication: No secure login system existed to verify user identities.  

Absence of role-based access: All users had equal access, regardless of authorization level, leading to security vulnerabilities.  

Unverified data: Manually entered user information often contained errors or outdated records.  

Insecure session management: Passwords were sometimes stored in plaintext with no support for recovery or resets.  

Poor user experience: No user interface existed to facilitate account management or interaction with system features.  

No access control: There were no boundaries between different user types or resources, jeopardizing information confidentiality and integrity.  

No account deletion: Users had no ability to delete their data or exit the system securely.  

No profile edit functionality: There was no mechanism to update previously submitted account information.

Due to these critical shortcomings, TaskMind was proposed as a modern solution that delivers the following improvements:

- A centralized, secure, and verifiable platform for managing user accounts.  
- Firebase Authentication for robust identity and session control.  
- Role-based redirection and access filtering to enforce secure authorization practices.  
- Storage of user data in Firestore, ensuring reliability, consistency, and real-time updates.  
- Ability for users to delete their own accounts through a confirmation-based workflow.  
- Ability for users to edit their name, email, password, and phone number through a profile interface.

TaskMind not only replaces the inefficient manual methods previously used but also lays the foundation for an intelligent task management environment, particularly beneficial for users with ADHD. By addressing both functional gaps and security flaws, it paves the way for scalable and compliant user operations in future sprints.
1. # <a name="_toc65941022"></a>**Proposed System**
` `TaskMind is a modern, web-based platform developed to provide a secure, scalable, and structured environment for user management and task organization. Unlike traditional systems that rely on fragmented or manual processes, TaskMind was designed from the ground up to replace insecure workflows by offering robust identity management, role-based access control, and real-time data handling through an intuitive user interface.

Built using React and integrated with Firebase Authentication and Firestore, TaskMind introduces structured user registration, secure login/logout functionality, and personalized dashboards based on user roles. The system supports both system administrators and standard users, offering customized access and functionality depending on the user's authorization level.

Firebase Authentication serves as the backbone for user identity and session management. It ensures that all user interactions—such as registration, email-verified login, password management, and logout—are securely handled. Firestore, used as the main database, organizes user records in "pending\_users" and "users" collections, based on registration status. This architecture allows administrators to verify and activate users systematically, while also ensuring data consistency and real-time updates.

A key component of TaskMind is its role-based access model. Each user is tagged either as a system\_admin or end\_user, and routing across the application is managed accordingly. This mechanism guarantees that only authorized users can access administrative features, while standard users are directed to their respective dashboards.

The user interface, developed entirely in React, is designed to be responsive, accessible, and extendable. Form inputs are validated for accuracy, email format, and required fields, while navigation components adjust dynamically based on user session status.

By combining strong authentication protocols with a modern front-end and structured data handling, TaskMind effectively addresses the critical shortcomings of previous systems. It eliminates the need for insecure manual registration methods, protects sensitive user data, and ensures a seamless and personalized user experience. Furthermore, TaskMind sets the stage for future enhancements such as task planning, ADHD-friendly focus tools, calendar integration, and productivity analytics.

1. ## <a name="_toc65941023"></a>**Overview**
` `TaskMind is fundamentally a web-based user authentication and task management platform, designed to provide a modern, secure, and role-aware user experience. The system prioritizes scalability, identity verification, and access control while laying the foundation for future feature development. During Sprint 1, the team focused on implementing the core security and account management features essential for system reliability and usability.

` `User Registration
Users can register by providing mandatory personal details such as first name, last name, date of birth, place of birth (country and city), and gender. Optional fields include address and phone number. The registration process involves:

- Form validation for required fields and email format
- Submission of user data to the Firestore "pending\_users" collection
- Sending a verification email to the registered address
- Password creation on the verification page
- Upon successful verification, transferring the user to the "users" collection with a default role of "end\_user"

` `User Login
Users log in using their registered email and password. Credentials are verified through Firebase Authentication. Once authenticated:

- The user's role is retrieved from Firestore
- Users with role "end\_user" are directed to the standard dashboard
- Users with role "system\_admin" are redirected to the admin panel
- Role-based navigation ensures users only access the views permitted to them

` `Session Management
TaskMind provides secure login and logout capabilities using Firebase's signOut() method. This method ensures:

- Authentication tokens are invalidated
- User sessions are safely terminated
- Users are redirected to the login page upon logout

` `Personalized Dashboards
After successful login, users are presented with dashboards tailored to their roles. The interface is structured to support future features such as:

- Task planning and scheduling tools
- User profile management
- System notifications
- ADHD-friendly focus tools and analytics

Routing for dashboard access is protected—only authenticated users can view dashboard content. Unauthorized access attempts are redirected accordingly.

` `Account Management Features
In addition to login, registration, and session handling, TaskMind enables users to manage their accounts securely:

- ` `Edit Account:
  End users can update their personal information, including:
  - Name
  - Email address
  - Password
  - Phone number (optional)
    After updating, users are redirected to their profile page upon success. Validation ensures only correctly formatted inputs are accepted. Any issues are communicated through clear error messages.
- ` `Delete Account:
  Users may delete their account via a dedicated option in their profile section. The process involves:
  - A delete button trigger
  - A confirmation modal for action approval
  - Error messages if the deletion process fails
    Deleted accounts are removed from the Firestore database, and users are logged out immediately.

` `Role-Based Navigation and Access Control
The system enforces role-based access using React Router and React Context API:

-  routes are accessible only to users marked as "system\_admin" in Firestore
- Standard users attempting to access restricted pages are redirected or denied
- Navigation bar components adjust dynamically based on user session state and role

` `Technical Infrastructure

- Firebase Authentication
  → Manages user login, registration, logout, email verification, and password reset securely
- Firestore
  → Real-time database for storing pending and verified user profiles
- React Context API
  → Maintains global authentication state (AuthContext)
- React Router
  → Handles protected routes and redirects based on role
- Form Validation
  → Ensures proper input formatting, password confirmation, and required field control

` `User Interface
The front-end is developed using React with responsive and accessible design principles:

- Navigation adjusts based on session status
- Forms feature inline validation and dynamic error reporting
- The layout is designed to be extensible for additional modules in future sprints


In summary, Sprint 1 of TaskMind successfully delivered a solid foundation for secure and scalable user management. Through structured registration, role-aware dashboards, and essential account management features, TaskMind resolves the fragmented issues of earlier systems and prepares the way for future integrations such as calendar-based task tracking, productivity analytics, and personalized focus tools.

1. ## <a name="_toc65941024"></a>**Functional Requirements**
`  `TaskMind is a secure, role-aware web application designed to handle user authentication and session control in a structured and scalable manner. This section outlines the functional requirements that were successfully implemented in Sprint 1.

` `FR1 – User Registration

- The system shall provide a registration form that allows new users to submit their personal information.
- Required fields:
  - First Name
  - Last Name
  - Date of Birth
  - Place of Birth (City & Province)
  - Gender
  - Email
- Optional fields:
  - Address
  - Phone Number
- Submitted data shall be stored in the Firestore "pending\_users" collection.
- The system shall perform front-end validation, including:
  - Proper email formatting
  - Password confirmation (during the password setup stage)

` `FR2 – Email Verification & Password Setup

- After registration, the system shall send an email verification link using Firebase Authentication.
- The link shall redirect users to a secure password creation page.
- Upon successful verification and password setup, the user's data shall be moved from the "pending\_users" collection to the verified "users" collection in Firestore.

` `FR3 – Login Functionality

- The system shall allow registered users to log in using their email and password credentials.
- Firebase Authentication shall be used to validate credentials.
- Upon successful login, the system shall fetch the user's role (e.g., end\_user or system\_admin) from Firestore to determine access rights.

` `FR4 – Role-Based Access Control (RBAC)

- The system shall redirect users to role-specific dashboards:
  - "system\_" → Admin Dashboard
  - "end\_user" → Standard User Dashboard
- Unauthorized access attempts (e.g., a standard user trying to access admin pages) shall result in an automatic redirection or access denial.

` `FR5 – User Dashboard Access

- Successfully authenticated users shall be presented with a dashboard containing:
  - A personalized welcome message including their email address
  - Placeholder sections for upcoming features such as task tracking and notifications
- Dashboard components shall vary based on user role.

` `FR6 – Logout Functionality

- Users shall be able to log out securely from any page using a visible Logout button.
- Firebase's signOut() method shall be used to terminate the session and clear authentication tokens.
- Upon logout, the system shall redirect the user to the login screen.

` `FR7 – Input Validation & Error Handling

- The system shall validate all form inputs before submission:
  - Required fields must not be left empty
  - Email must follow standard formatting
  - Password fields must match (if applicable)
- If an input is invalid, the system shall display appropriate error messages (e.g., "Invalid email or password").

` `FR8 – User Data Management

- User registration data shall be saved in two stages:
  - Initially stored in the "pending\_users" collection
  - Moved to the "users" collection upon successful email verification and password creation
- Each user document in Firestore shall include the following fields:
  - Email
  - First Name, Last Name
  - Date of Birth, Place of Birth (City & Province)
  - Gender
  - (Optional) Address, Phone Number
  - Role: "end\_user" or "system\_admin"
  - Timestamps: createdAt and updatedAt

FR9 – Edit Account

- The system shall allow authenticated users to edit their profile information.
- Editable fields may include:
  - First Name
  - Last Name
  - Address
  - Phone Number
  - (In future sprints: password update)
- Upon submission, the updated data shall overwrite the corresponding document in the "users" collection.
- Timestamp field updatedAt shall be refreshed accordingly.

FR10 – Delete Account

- The system shall allow users to permanently delete their account.
- Account deletion shall:
  - Remove the user's authentication credentials from Firebase Authentication.
  - Delete the associated document from the "users" collection in Firestore.
- Users shall be shown a confirmation prompt before proceeding with account deletion.
- Upon successful deletion, the user shall be logged out and redirected to the login or landing page.


1. ## <a name="_toc65941025"></a>**Nonfunctional Requirements**
` `This section outlines the non-functional requirements of the TaskMind system, focusing on usability, reliability, performance, maintainability, legal compliance, and future extensibility. These requirements define how the system should behave to meet user expectations and deliver a seamless experience.

Usability
• The system shall provide a clean, modern, and intuitive user interface using React and responsive CSS design.
• Both admin and end users shall be able to register, log in, and interact with the platform with minimal guidance.
• Form fields shall include user-friendly validation messages and tooltips for ease of input.
• The layout shall support responsive design for compatibility with desktop, tablet, and mobile devices.
• A visual distinction shall exist between admin panels and standard user dashboards to avoid confusion.

Reliability
• The application shall run on Firebase infrastructure, leveraging Google Cloud's high availability guarantees.
• Authentication and database operations shall implement error handling to ensure system resiliency.
• System behavior under edge cases such as lost internet connection or token expiry shall result in informative user feedback (e.g., "Session expired, please log in again").

Performance
• Core operations including registration, login, role-based redirection, and data fetching shall complete within 3 seconds under normal network conditions.
• Low-latency interaction shall be achieved by leveraging Firebase's real-time Firestore database.
• Client-side rendering shall be optimized to prevent unnecessary re-renders using React's component lifecycle and Context API.

Supportability
• The codebase shall use modular structure (e.g., /auth, /admin, /user, /context) to support scalability and code clarity.
• Component-based development using React and React Router shall be adopted for routing and rendering.
• Firebase configuration shall be stored in a centralized and reusable module (e.g., firebase/config.js).
• All core functionalities such as edit profile and delete account shall be implemented as separate, reusable components.
• Naming conventions and inline documentation shall support future development and collaboration.

Implementation
• TaskMind shall be implemented as a single-page application (SPA) using ReactJS.
• Authentication, session handling, and role management shall be handled via Firebase Authentication.
• User data shall be stored in Firestore under two distinct collections: pending\_users (pre-verification) and users (verified and active).
• User context shall be maintained via React Context API for seamless session control and protected routes.

Interface
• Two separate login interfaces shall be defined: one for administrators (AdminLogin.js) and one for standard users (Login.js).
• The navigation bar shall dynamically display role-based routes and options according to the active user.
• Dashboard.js shall present a personalized welcome message and user information upon successful login.
• Form components (e.g., registration, profile update) shall be organized logically and include built-in validation for email, password match, and required fields using Formik or native validation.

Packaging
• The application shall be bootstrapped using Create React App (CRA) and follow a clean folder structure.
• Environment variables including Firebase credentials shall be stored securely in a .env file.
• Source code shall be version-controlled via Git and publicly accessible on GitHub: <https://github.com/mertorakli/TaskMind>.
• Each sprint deliverable shall be traceable via a linked Trello workspace: <https://trello.com/w/team4clarity>.

Legal  
• All user data shall be securely stored on Firestore with read/write rules enforced by Firebase security policies.
• Email verification shall be mandatory to prevent unauthorized access.
• Optional user fields (e.g., phone, address) shall be collected only with user consent.
• The system shall be developed in alignment with international privacy standards, including GDPR and KVKK.

Future Enhancements (Based on Sprint Goals)
• The system shall include account deletion and profile editing functionality as outlined in the Sprint 1 backlog:
`  `– Edit Account: Users can update their name, email, password, and phone number.
`  `– Delete Account: Users can remove their account permanently after confirmation via pop-up modal.
• These features shall be accessible via the profile page and follow appropriate validation and security checks.

1. ## <a name="_toc65941034"></a>**System Models**
`   `Scenarios

A scenario represents a specific instance of a use case. The following are typical user flow scenarios within the TaskMind system:

Scenario 1: End User Registration with Email Verification

- The user navigates to the registration page.
- The user enters the required personal information, including first name, last name, date and place of birth, email address, and gender.
- The user optionally provides additional information such as address and phone number.
- The user clicks the "Register" button.
- The system sends a verification email with a password setup link.
- The user accesses the link, sets a secure password, and completes email verification.
- Upon successful verification, the user is redirected to the login page.

Scenario 2: System Administrator Login

- The system administrator opens the Admin Login page.
- The administrator enters valid login credentials (email and password).
- Upon successful authentication, the administrator is redirected to the admin dashboard.
- If the credentials are invalid, an appropriate error message is displayed.

Scenario 3: Edit Profile

- The user logs into the system.
- The user navigates to the profile page.
- The user updates editable fields such as email address and phone number.
- The user clicks the "Update" button.
- The system confirms the update with a success message.
- The updated information is saved in Firestore.

Scenario 4: Delete Account

- The user logs into the system.
- The user accesses the account settings section.
- The user clicks the "Delete Account" button.
- A confirmation modal appears; the user confirms the deletion.
- The user account is removed from Firebase Authentication and Firestore.
- The user is automatically logged out and redirected from the system.


1. ## <a name="_toc65941039"></a>**Project Schedule**
` `Sprint 1 started on March 25, 2024, and ended on April 8, 2024. The goal of this sprint was to implement the core user authentication and account management functionalities. During this sprint, the following Product Backlog Items (PBIs) were committed:

Sprint Number: Sprint 1
Sprint Start Date: 25.03.2024
Sprint End Date: 08.04.2024
Sprint Goal: Implement core authentication and account management functionalities.
Scope (PBIs Committed):

- Security | Administrator Login
- Security | End User Login
- Security | Logout
- Security | Create Account
- Security | Edit Account
- Security | Delete Account

In this sprint, functionalities such as user registration, login, logout, account editing, and account deletion were successfully implemented using Firebase Authentication and Firestore. Additionally, a role-based authentication and redirection mechanism for administrator login was developed and integrated into the system.

1. # <a name="_toc65941040"></a>**Glossary**
This glossary defines key terms, roles, and concepts used throughout the TaskMind system, particularly those implemented during Sprint 1. It ensures a shared understanding among developers, stakeholders, and testers involved in the project.

TaskMind refers to the web-based platform designed to support individuals with Attention Deficit Hyperactivity Disorder (ADHD) by providing a structured and secure environment for task planning and focus enhancement. In Sprint 1, the primary modules implemented were user authentication and account management.

An End User is any individual who registers and logs into the system using the standard registration form. These users are automatically assigned the role of "end\_user" and have access to their personal dashboard, where they can view and manage their profile.

A System Admin is a privileged user manually added to the Firestore database with the role "system\_admin." These users can log in through a separate admin interface and access restricted features such as the admin dashboard.

Firebase Authentication is a backend service provided by Google that enables secure user registration, login, password reset, and email verification. It forms the backbone of TaskMind's authentication system.

Firestore is the NoSQL cloud database used to store all user-related data. It includes two key collections: pending\_users (for temporarily storing unverified user data) and users (for active, verified user accounts).

AuthContext refers to the centralized authentication state manager in the frontend, implemented using React Context API. It handles login, logout, role checks, and provides authentication data across the application.

The Registration Form is the UI component that allows users to create an account. It collects required data (such as first name, last name, birth date, birth city and country, gender, and email) and optional data (like address and phone number).

The pending\_users collection stores user data temporarily after form submission but before password setup and email verification. Once verification is complete, the data is moved to the user's collection.

The user's collection stores verified user records. Each document includes email, full name, birth details, gender, optional contact info, role ("end\_user" or "system\_admin"), and timestamps such as createdAt and updatedAt.

Role-Based Access Control (RBAC) is the method used to restrict access to system features based on the user's assigned role. Only system\_admin users can access admin interfaces, while end\_users are routed to their personal dashboards.

Login is the process where a user enters their credentials (email and password) and gains access to the system. This is handled through Firebase Authentication.

Logout refers to securely ending a user's session using Firebase's signOut() method, which clears the authentication state and redirects the user to the login screen.

Edit Account is a feature that allows end users to update their personal information such as name, email, password, and phone number through a dedicated profile interface.

Delete Account is a feature that enables users to permanently remove their account from the system. This deletes both their authentication record in Firebase and their user document in Firestore.

The Admin Panel is a protected interface accessible only to system administrators. It includes features that are hidden from end users and supports administrative controls.

Dashboard refers to the main page presented to users after logging in. Its content and navigation vary depending on whether the user is an end\_user or a system\_admin.

Password Reset is a secure process where users can request an email to reset their forgotten passwords via Firebase Authentication.

A Modal is a user interface element (usually a popup window) that asks for confirmation before performing sensitive actions, such as account deletion.

Session refers to the active period during which a user remains logged into the system. Session management is handled automatically via Firebase.

Validation ensures that user inputs are checked before submission—for example, verifying that required fields are not empty, that emails are properly formatted, and that password fields match.

Trello is the project management tool used by the development team (G4 - Clarity) to track the Sprint 1 backlog, user stories, and acceptance criteria.

GitHub Repository refers to the source code repository hosted on GitHub where the TaskMind project is maintained: <https://github.com/mertorakli/TaskMind>


1. # <a name="_toc65941041"></a>**References**
This section lists the external resources, documentation, and platforms referenced during the development and documentation of the TaskMind system in Sprint 1.

1\. Firebase Documentation.  

`   `URL: https://firebase.google.com/docs  

`   `Description: Official documentation for Firebase Authentication and Firestore, used for implementing secure login, registration, role management, and database operations.

2\. React Official Documentation.  

`   `URL: https://reactjs.org/docs/getting-started.html  

`   `Description: Official documentation for the React JavaScript library, used to build the frontend interface of the TaskMind application.

3\. Trello – G4 Clarity Sprint 1 Planning Board.  

`   `URL: https://trello.com/w/team4clarity  

`   `Description: Agile project management board used by the development team to define sprint goals, user stories, and acceptance criteria.

4\. GitHub – TaskMind Source Code Repository.  

`   `URL: https://github.com/mertorakli/TaskMind  

`   `Description: Git repository containing the source code and commit history for the TaskMind application.

5\. Google Cloud Security and Compliance.  

`   `URL: https://cloud.google.com/security  

`   `Description: Information on security practices and compliance policies relevant to Firebase and Firestore (used to ensure GDPR/KVKK alignment).

6\. WCAG 2.1 – Web Content Accessibility Guidelines.  

`   `URL: https://www.w3.org/TR/WCAG21/  

`   `Description: Guidelines followed to ensure the accessibility and usability of the TaskMind interface for users with cognitive differences such as ADHD.

7\. IEEE Std 830-1998 – IEEE Recommended Practice for Software Requirements Specifications.  

`   `Description: Industry standard for structuring and formatting requirements analysis documentation.
3
