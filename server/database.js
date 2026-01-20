const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'attendance.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Use serialize to ensure tables are created in order
  db.serialize(() => {
    // Create students table
    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        rollNumber TEXT UNIQUE NOT NULL,
        course TEXT NOT NULL,
        semester TEXT NOT NULL,
        email TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating students table:', err.message);
      } else {
        console.log('Students table ready');
      }
    });

    // Create attendance_records table
    db.run(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        date TEXT NOT NULL,
        checkInTime TEXT NOT NULL,
        status TEXT NOT NULL,
        subject TEXT,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) {
        console.error('Error creating attendance_records table:', err.message);
      } else {
        console.log('Attendance records table ready');
      }
    });

    // Create index for faster queries
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_attendance_date 
      ON attendance_records(studentId, date)
    `, (err) => {
      if (err) {
        console.error('Error creating index:', err.message);
      } else {
        console.log('Database initialization complete');
      }
    });
  });
}

// Student operations
const studentDb = {
  create: (student, callback) => {
    const { id, name, rollNumber, course, semester, email } = student;
    db.run(
      `INSERT INTO students (id, name, rollNumber, course, semester, email) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, rollNumber, course, semester, email],
      callback
    );
  },

  findById: (id, callback) => {
    db.get('SELECT * FROM students WHERE id = ?', [id], callback);
  },

  findByRollNumber: (rollNumber, callback) => {
    db.get('SELECT * FROM students WHERE rollNumber = ?', [rollNumber], callback);
  },

  update: (id, student, callback) => {
    const { name, rollNumber, course, semester, email } = student;
    db.run(
      `UPDATE students 
       SET name = ?, rollNumber = ?, course = ?, semester = ?, email = ?
       WHERE id = ?`,
      [name, rollNumber, course, semester, email, id],
      callback
    );
  },

  getAll: (callback) => {
    db.all('SELECT * FROM students ORDER BY rollNumber', callback);
  }
};

// Attendance operations
const attendanceDb = {
  create: (record, callback) => {
    const { id, studentId, date, checkInTime, status, subject, notes } = record;
    db.run(
      `INSERT INTO attendance_records 
       (id, studentId, date, checkInTime, status, subject, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, studentId, date, checkInTime, status, subject || null, notes || null],
      callback
    );
  },

  findByStudentId: (studentId, callback) => {
    db.all(
      `SELECT * FROM attendance_records 
       WHERE studentId = ? 
       ORDER BY date DESC`,
      [studentId],
      callback
    );
  },

  findByDate: (studentId, date, callback) => {
    db.get(
      `SELECT * FROM attendance_records 
       WHERE studentId = ? AND date = ?`,
      [studentId, date],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM attendance_records WHERE id = ?', [id], callback);
  },

  getStats: (studentId, callback) => {
    db.get(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late
       FROM attendance_records 
       WHERE studentId = ?`,
      [studentId],
      callback
    );
  }
};

module.exports = {
  db,
  studentDb,
  attendanceDb
};
