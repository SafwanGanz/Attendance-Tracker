# Attendance Tracker

A standalone web-based attendance tracking system for students. Track attendance, calculate attendance requirements, and manage student records with a clean, modern interface.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Git

### Setup

Clone the repository:
```bash
git clone https://github.com/SafwanGanz/Attendance-Tracker
cd Attendance-Tracker
```

Install dependencies:
```bash
npm install
cd server
npm install
cd ..
```

## Usage

### Local Development

Start the backend server:
```bash
cd server
node server.js
```

The server will start on port 3001 and display network URLs for access from other devices.

In a new terminal, start the frontend:
```bash
npm run dev
```

Access the app at `http://localhost:5173`

### Network Access

Other students on your network can access the app using the network URL displayed when the server starts:
```
http://<your-ip>:5173
```

### Production Deployment

Deploy frontend to Vercel:
```bash
npm run build
vercel
```

Deploy backend to Railway:
```bash
cd server
railway up
```

Set environment variable:
```bash
VITE_API_URL=<your-backend-url>/api
```

## Features

- **Dashboard**: View profile and attendance overview
- **Check-In**: Record daily attendance with timestamps
- **Calculator**: Calculate classes needed to reach target percentage
- **Statistics**: Visual charts and attendance trends
- **Records**: View complete attendance history
- **Offline Mode**: Works with localStorage when server unavailable

## Dependencies

### Frontend
- React 18.3.1
- TypeScript
- Vite
- Recharts (data visualization)
- Material-UI icons

### Backend
- Node.js
- Express.js
- SQLite3
- CORS

## Database

The SQLite database is automatically created on first run at `server/attendance.db`. It includes:
- Students table (profile information)
- Attendance records table (check-in history)

## License

This software is licensed under the MIT license.
