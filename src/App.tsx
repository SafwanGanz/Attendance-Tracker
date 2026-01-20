import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MarkAttendance from './components/MarkAttendance';
import AttendanceRecords from './components/AttendanceRecords';
import Statistics from './components/Statistics';
import AttendanceCalculator from './components/AttendanceCalculator';
import BottomNav from './components/BottomNav';
import { studentApi, attendanceApi } from './services/api';

export type StudentProfile = {
  id: string;
  name: string;
  rollNumber: string;
  course: string;
  semester: string;
  email: string;
};

export type AttendanceRecord = {
  id: string;
  date: string;
  checkInTime: string;
  status: 'present' | 'absent' | 'late';
  subject?: string;
  notes?: string;
};

function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'checkin' | 'records' | 'stats' | 'calculator'>('dashboard');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from database on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test server connectivity first with timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const healthCheck = await fetch('http://localhost:3001/api/health', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!healthCheck.ok) {
          throw new Error('Server not responding');
        }
        
        console.log('Server connected successfully');
      } catch (fetchError) {
        console.error('Server connection failed:', fetchError);
        throw new Error('Cannot connect to backend server');
      }
      
      // Check localStorage first for student ID
      let savedProfileId = localStorage.getItem('studentId');
      
      if (!savedProfileId) {
        // Create default student profile
        const defaultProfile: StudentProfile = {
          id: Date.now().toString(),
          name: 'Student',
          rollNumber: 'STU001',
          course: 'Computer Science',
          semester: '5th',
          email: 'student@example.com'
        };
        
        await studentApi.create(defaultProfile);
        localStorage.setItem('studentId', defaultProfile.id);
        localStorage.setItem('studentProfile', JSON.stringify(defaultProfile));
        setStudentProfile(defaultProfile);
        savedProfileId = defaultProfile.id;
      } else {
        // Load existing profile
        const profile = await studentApi.getById(savedProfileId);
        setStudentProfile(profile);
        localStorage.setItem('studentProfile', JSON.stringify(profile));
      }
      
      // Load attendance records
      if (savedProfileId) {
        const records = await attendanceApi.getByStudentId(savedProfileId);
        setAttendanceRecords(records);
        localStorage.setItem('attendanceRecords', JSON.stringify(records));
      }
      
      console.log('Data loaded from database successfully');
      setLoading(false);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Backend server not available. Using offline mode.');
      
      // Fallback to localStorage
      const savedProfile = localStorage.getItem('studentProfile');
      const savedRecords = localStorage.getItem('attendanceRecords');
      
      if (savedProfile) {
        setStudentProfile(JSON.parse(savedProfile));
      } else {
        const defaultProfile: StudentProfile = {
          id: Date.now().toString(),
          name: 'Student',
          rollNumber: 'STU001',
          course: 'Computer Science',
          semester: '5th',
          email: 'student@example.com'
        };
        setStudentProfile(defaultProfile);
        localStorage.setItem('studentProfile', JSON.stringify(defaultProfile));
        localStorage.setItem('studentId', defaultProfile.id);
      }
      
      if (savedRecords) {
        setAttendanceRecords(JSON.parse(savedRecords));
      }
      
      console.log('Using offline mode with localStorage');
      setLoading(false);
    }
  };

  const updateProfile = async (profile: StudentProfile) => {
    try {
      if (!error) {
        await studentApi.update(profile.id, profile);
      }
      setStudentProfile(profile);
      localStorage.setItem('studentProfile', JSON.stringify(profile));
    } catch (err) {
      console.error('Error updating profile:', err);
      // Still save locally even if API fails
      setStudentProfile(profile);
      localStorage.setItem('studentProfile', JSON.stringify(profile));
      setError('Database connection lost. Changes saved locally only.');
    }
  };

  const checkIn = async (subject?: string, notes?: string) => {
    if (!studentProfile) return;
    
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString();
    const hour = now.getHours();
    
    // Determine status based on time (assuming class starts at 9 AM)
    let status: 'present' | 'late' = 'present';
    if (hour >= 9 && hour < 10) {
      status = 'present';
    } else if (hour >= 10) {
      status = 'late';
    }
    
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date,
      checkInTime: time,
      status,
      subject,
      notes,
    };
    
    try {
      if (!error) {
        await attendanceApi.create(newRecord, studentProfile.id);
      }
      const updatedRecords = [newRecord, ...attendanceRecords];
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
    } catch (err) {
      console.error('Error recording attendance:', err);
      // Still save locally even if API fails
      const updatedRecords = [newRecord, ...attendanceRecords];
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
      setError('Database connection lost. Attendance saved locally only.');
    }
  };

  const deleteAttendanceRecord = async (id: string) => {
    try {
      if (!error) {
        await attendanceApi.delete(id);
      }
      const updatedRecords = attendanceRecords.filter(r => r.id !== id);
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
    } catch (err) {
      console.error('Error deleting record:', err);
      // Still delete locally even if API fails
      const updatedRecords = attendanceRecords.filter(r => r.id !== id);
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
      setError('Database connection lost. Changes saved locally only.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!studentProfile) return <div>Error loading profile</div>;
    
    return (
      <>
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 mx-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-800 text-sm font-medium">{error}</p>
                <p className="text-yellow-700 text-xs mt-1">Data is being stored locally instead.</p>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  loadData();
                }}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {(() => {
          switch (currentTab) {
            case 'dashboard':
              return <Dashboard profile={studentProfile} attendanceRecords={attendanceRecords} onUpdateProfile={updateProfile} />;
            case 'checkin':
              return <MarkAttendance onCheckIn={checkIn} attendanceRecords={attendanceRecords} />;
            case 'records':
              return (
                <AttendanceRecords
                  attendanceRecords={attendanceRecords}
                  onDeleteRecord={deleteAttendanceRecord}
                />
              );
            case 'stats':
              return <Statistics attendanceRecords={attendanceRecords} />;
            case 'calculator':
              return <AttendanceCalculator />;
            default:
              return <Dashboard profile={studentProfile} attendanceRecords={attendanceRecords} onUpdateProfile={updateProfile} />;
          }
        })()}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">My Attendance</h1>
          {studentProfile && (
            <div className="text-sm">
              <p>{studentProfile.name}</p>
              <p className="text-xs text-blue-100">{studentProfile.rollNumber}</p>
            </div>
          )}
        </div>
      </header>
      
      <main className="p-4">
        {renderContent()}
      </main>

      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default App;
