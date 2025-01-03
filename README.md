# Communication Calendar Application

A React-based calendar application for tracking and managing company communications, featuring admin controls, user dashboard, and calendar views.

## Project Overview

This application serves as a centralized platform for maintaining professional relationships by tracking communications with other organizations. It enables efficient logging of past interactions, planning of future communications, and management of engagement frequencies based on predefined schedules.

## Core Modules

### 1. Admin Module

#### Company Management
- **Company Details:**
  - Name
  - Location
  - LinkedIn Profile
  - Emails
  - Phone Numbers
  - Comments
  - Communication Periodicity

#### Communication Method Management
- **Method Configuration:**
  - Name
  - Description
  - Sequence
  - Mandatory Flag
- **Default Methods (in order):**
  1. LinkedIn Post
  2. LinkedIn Message
  3. Email
  4. Phone Call
  5. Other

### 2. User Module

#### Dashboard Features
- Grid view of companies
- Last five communications display
- Next scheduled communication tracking
- Color-coded highlights:
  - Red: Overdue communications
  - Yellow: Communications due today
- Hover tooltips for communication details

#### Communication Actions
- Single/multi-company selection
- Communication logging with:
  - Type selection
  - Date recording
  - Notes addition
- Status reset upon logging

#### Notification System
- Overdue communications grid
- Today's communications grid
- Notification badge with count

#### Calendar View
- Past communications display
- Upcoming communications management
- Interactive date selection

### 3. Reporting and Analytics Module (Optional)
- Communication frequency reports
- Engagement effectiveness dashboard
- Overdue communication trends
- Downloadable reports (PDF/CSV)
- Real-time activity log

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `yarn test`

Launches the test runner in interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.

## Technical Stack

json
{
"dependencies": {
"react": "^19.0.0",
"react-dom": "^19.0.0",
"react-router-dom": "^7.1.1",
"chart.js": "^4.4.7",
"react-chartjs-2": "^5.3.0",
"@heroicons/react": "^2.2.0",
"@mui/icons-material": "^6.3.0",
"react-icons": "^5.4.0"
}
}


## Project Structure

src/

components/                # Contains React components grouped by feature or functionality

components/admin/          # Admin-specific components

components/admin/AdminDashboard.jsx   # Main dashboard for admin users

components/admin/CompanyManagement/   # Submodule for managing company-related features

components/admin/CommunicationMethods/ # Submodule for admin communication features

components/user/           # User-specific components

components/user/UserDashboard.jsx     # Main dashboard for regular users

components/user/CalendarView.jsx      # Component for displaying a calendar view

components/user/CompanyGrid.jsx       # Component for displaying company data in a grid

components/shared/         # Shared components used across the application

contexts/                  # Context API implementations for state management

App.js                     # Entry point of the React application





## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the development server:
   ```bash
   yarn start
   ```

## Testing & Validation

- Application runs smoothly without errors
- Comprehensive testing for performance and usability
- Sample data provided for demonstration

## Evaluation Criteria

### Code Quality
- Clean, maintainable code
- Proper React patterns
- Component design
- State management

### Functionality
- Complete feature implementation
- Proper communication handling

### User Experience
- Intuitive navigation
- Effective visual indicators

### Performance
- Efficient data handling
- Smooth operation

### Innovation
- Enhanced features
- Modern UI/UX design

## Browser Support

json
{
"browserslist": {
"production": [
">0.2%",
"not dead",
"not op_mini all"
],
"development": [
"last 1 chrome version",
"last 1 firefox version",
"last 1 safari version"
]
}
}



## Development Dependencies
json
{
"devDependencies": {
"autoprefixer": "^10.4.20",
"postcss": "^8.4.49",
"tailwindcss": "^3.4.17"
}
}

## Prerequisites
- Node.js (version 16 or higher)
- Yarn package manager
- Modern web browser

## Development Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd communication-calendar
   ```
2. Create a .env file:
   ```bash
   REACT_APP_API_URL=your_api_url_here
   ```

   ## Deployment

This application can be deployed on:
- Netlify = https://satyam0236.netlify.app/admin
