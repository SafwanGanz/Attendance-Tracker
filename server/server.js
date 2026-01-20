const express = require('express');
const cors = require('cors');
const { studentDb, attendanceDb } = require('./database');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL, // Add your production frontend URL as environment variable
].filter(Boolean);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app') || origin.includes('netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Student routes
app.post('/api/students', (req, res) => {
  studentDb.create(req.body, (err) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Roll number already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Student created successfully' });
  });
});

app.get('/api/students/:id', (req, res) => {
  studentDb.findById(req.params.id, (err, student) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  });
});

app.put('/api/students/:id', (req, res) => {
  studentDb.update(req.params.id, req.body, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Student updated successfully' });
  });
});

app.get('/api/students', (req, res) => {
  studentDb.getAll((err, students) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(students);
  });
});

// Attendance routes
app.post('/api/attendance', (req, res) => {
  // Check if already checked in today
  attendanceDb.findByDate(req.body.studentId, req.body.date, (err, existing) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (existing) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    attendanceDb.create(req.body, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Attendance recorded successfully' });
    });
  });
});

app.get('/api/attendance/:studentId', (req, res) => {
  attendanceDb.findByStudentId(req.params.studentId, (err, records) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(records);
  });
});

app.delete('/api/attendance/:id', (req, res) => {
  attendanceDb.delete(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Attendance record deleted successfully' });
  });
});

app.get('/api/attendance/:studentId/stats', (req, res) => {
  attendanceDb.getStats(req.params.studentId, (err, stats) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(stats);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get network IP addresses
function getNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  
  return ips;
}

app.listen(PORT, HOST, () => {
  const ips = getNetworkIPs();
  console.log(`\n===========================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`===========================================`);
  console.log(`\nLocal access:`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  http://127.0.0.1:${PORT}`);
  
  if (ips.length > 0) {
    console.log(`\nNetwork access (other devices):`);
    ips.forEach(ip => {
      console.log(`  http://${ip}:${PORT}`);
    });
  }
  
  console.log(`\n===========================================\n`);
});
