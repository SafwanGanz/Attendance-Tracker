import { useState } from 'react';
import { AttendanceRecord } from '../App';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

type MarkAttendanceProps = {
  onCheckIn: (subject?: string, notes?: string) => void;
  attendanceRecords: AttendanceRecord[];
};

export default function MarkAttendance({ onCheckIn, attendanceRecords }: MarkAttendanceProps) {
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceRecords.find(r => r.date === today);
  const alreadyCheckedIn = !!todayRecord;

  const handleCheckIn = async () => {
    setLoading(true);
    
    setTimeout(() => {
      onCheckIn(subject || undefined, notes || undefined);
      setSubject('');
      setNotes('');
      setLoading(false);
    }, 500);
  };

  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Check In</h2>

      <div className="rounded-lg shadow-lg p-6" style={{ background: 'linear-gradient(to right, #3b82f6, #4f46e5)' }}>
        <div className="flex items-center gap-2 mb-3">
          <AccessTimeIcon fontSize="small" style={{ color: '#ffffff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
          <span className="text-sm font-semibold" style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>{currentDate}</span>
        </div>
        <div className="text-4xl font-bold tracking-tight" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{currentTime}</div>
      </div>

      {alreadyCheckedIn && todayRecord ? (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg shadow p-6 text-center">
          <CheckCircleIcon className="text-green-600 mx-auto mb-3" style={{ fontSize: 64 }} />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Already Checked In!</h3>
          <p className="text-green-700 mb-2">You checked in at {todayRecord.checkInTime}</p>
          <div className="inline-block bg-green-100 px-4 py-2 rounded-full">
            <span className="text-green-800 font-medium">Status: {todayRecord.status}</span>
          </div>
          {todayRecord.subject && (
            <p className="text-sm text-green-600 mt-3">Subject: {todayRecord.subject}</p>
          )}
          {todayRecord.notes && (
            <p className="text-sm text-green-600">Notes: {todayRecord.notes}</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject (Optional)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Physics, Computer Science"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Checking In...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon />
                <span>Check In Now</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📋 Check-In Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Check in before 9:00 AM to be marked as "Present"</li>
          <li>• Check in after 9:00 AM will be marked as "Late"</li>
          <li>• You can only check in once per day</li>
          <li>• Make sure your location services are enabled</li>
        </ul>
      </div>

      {attendanceRecords.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Check-Ins</h3>
          <div className="space-y-2">
            {attendanceRecords.slice(0, 3).map((record) => (
              <div key={record.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">{record.date}</p>
                  <p className="text-xs text-gray-500">{record.checkInTime}</p>
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
        </div>
      )}
    </div>
  );
}
