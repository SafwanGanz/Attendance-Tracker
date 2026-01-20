import { StudentProfile, AttendanceRecord } from '../App';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

type DashboardProps = {
  profile: StudentProfile;
  attendanceRecords: AttendanceRecord[];
  onUpdateProfile: (profile: StudentProfile) => void;
};

export default function Dashboard({ profile, attendanceRecords, onUpdateProfile }: DashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  
  // Calculate today's attendance
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceRecords.find(r => r.date === today);
  const checkedInToday = !!todayRecord;

  // Calculate stats
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
  const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
  const attendancePercentage = totalDays > 0 ? (((presentDays + lateDays) / totalDays) * 100).toFixed(1) : '0';

  const handleSaveProfile = () => {
    onUpdateProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Dashboard</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1 px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm"
        >
          <EditIcon fontSize="small" />
          <span className="text-sm">Edit</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="rounded-lg shadow-lg p-6" style={{ background: 'linear-gradient(to right, #3b82f6, #2563eb)' }}>
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full p-2 rounded text-gray-800"
              placeholder="Name"
            />
            <input
              type="text"
              value={editForm.rollNumber}
              onChange={(e) => setEditForm({ ...editForm, rollNumber: e.target.value })}
              className="w-full p-2 rounded text-gray-800"
              placeholder="Roll Number"
            />
            <input
              type="text"
              value={editForm.course}
              onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
              className="w-full p-2 rounded text-gray-800"
              placeholder="Course"
            />
            <input
              type="text"
              value={editForm.semester}
              onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
              className="w-full p-2 rounded text-gray-800"
              placeholder="Semester"
            />
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full p-2 rounded text-gray-800"
              placeholder="Email"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-semibold transition-colors shadow-sm"
              >
                Save Profile
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm(profile);
                }}
                className="px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                <PersonIcon fontSize="large" style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{profile.name}</h3>
                <p className="font-semibold text-lg" style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>{profile.rollNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg border-2 border-white/60" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#1e40af' }}>Course</p>
                <p className="font-bold text-base" style={{ color: '#1e3a8a' }}>{profile.course}</p>
              </div>
              <div className="p-3 rounded-lg border-2 border-white/60" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#1e40af' }}>Semester</p>
                <p className="font-bold text-base" style={{ color: '#1e3a8a' }}>{profile.semester}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Today's Status */}
      <div className={`rounded-lg shadow p-4 ${checkedInToday ? 'bg-green-50' : 'bg-yellow-50'}`}>
        <h3 className="font-semibold text-gray-800 mb-2">Today's Status</h3>
        {checkedInToday && todayRecord ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Checked in at {todayRecord.checkInTime}</p>
              {todayRecord.subject && <p className="text-sm text-gray-500">Subject: {todayRecord.subject}</p>}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                todayRecord.status === 'present'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {todayRecord.status}
            </span>
          </div>
        ) : (
          <p className="text-gray-600">You haven't checked in today yet!</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUpIcon className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Attendance</p>
              <p className="text-2xl font-bold text-gray-800">{attendancePercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <EventAvailableIcon className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Present</p>
              <p className="text-2xl font-bold text-gray-800">{presentDays}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <AccessTimeIcon className="text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Late</p>
              <p className="text-2xl font-bold text-gray-800">{lateDays}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <EventAvailableIcon className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Days</p>
              <p className="text-2xl font-bold text-gray-800">{totalDays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Check-ins */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Recent Check-ins</h3>
        {attendanceRecords.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No check-ins yet. Start by checking in today!</p>
        ) : (
          <div className="space-y-2">
            {attendanceRecords
              .slice(0, 5)
              .map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-800">{record.date}</p>
                    <p className="text-xs text-gray-500">{record.checkInTime}</p>
                    {record.subject && <p className="text-xs text-gray-600">{record.subject}</p>}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
