import { AttendanceRecord } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

type StatisticsProps = {
  attendanceRecords: AttendanceRecord[];
};

export default function Statistics({ attendanceRecords }: StatisticsProps) {
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
  const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
  const attendedDays = presentDays + lateDays;
  const attendancePercentage = totalDays > 0 ? ((attendedDays / totalDays) * 100).toFixed(1) : '0';

  const monthlyStats = attendanceRecords.reduce((acc, record) => {
    const month = record.date.substring(0, 7);
    if (!acc[month]) {
      acc[month] = { month, present: 0, late: 0, total: 0 };
    }
    acc[month].total++;
    if (record.status === 'present') acc[month].present++;
    if (record.status === 'late') acc[month].late++;
    return acc;
  }, {} as Record<string, { month: string; present: number; late: number; total: number }>);

  const monthlyData = Object.values(monthlyStats)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => ({
      month: new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      present: m.present,
      late: m.late,
      percentage: m.total > 0 ? parseFloat((((m.present + m.late) / m.total) * 100).toFixed(1)) : 0,
    }));

  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const weeklyData = last7Days.map(date => {
    const record = attendanceRecords.find(r => r.date === date);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      status: record ? (record.status === 'present' ? 1 : 0.5) : 0,
      label: record ? record.status : 'absent',
    };
  });

  const pieData = [
    { name: 'Present', value: presentDays, color: '#10b981' },
    { name: 'Late', value: lateDays, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  const subjectStats = attendanceRecords.reduce((acc, record) => {
    if (record.subject) {
      if (!acc[record.subject]) {
        acc[record.subject] = { subject: record.subject, present: 0, late: 0, total: 0 };
      }
      acc[record.subject].total++;
      if (record.status === 'present') acc[record.subject].present++;
      if (record.status === 'late') acc[record.subject].late++;
    }
    return acc;
  }, {} as Record<string, { subject: string; present: number; late: number; total: number }>);

  const subjectData = Object.values(subjectStats).map(s => ({
    subject: s.subject,
    attendance: s.total > 0 ? parseFloat((((s.present + s.late) / s.total) * 100).toFixed(1)) : 0,
  }));

  const isGoodAttendance = parseFloat(attendancePercentage) >= 75;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">My Statistics</h2>

      <div className={`rounded-lg shadow-lg p-6 border-2 ${isGoodAttendance ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Attendance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-5xl font-bold ${isGoodAttendance ? 'text-green-600' : 'text-red-600'}`}>
              {attendancePercentage}%
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-2">
              {attendedDays} / {totalDays} days attended
            </p>
            <div className="flex gap-4 mt-3 text-sm font-medium">
              <div>
                <span className="text-green-700 font-bold">{presentDays}</span> <span className="text-gray-800">Present</span>
              </div>
              <div>
                <span className="text-yellow-700 font-bold">{lateDays}</span> <span className="text-gray-800">Late</span>
              </div>
            </div>
          </div>
          <div className={`text-6xl ${isGoodAttendance ? 'text-green-500' : 'text-red-500'}`}>
            {isGoodAttendance ? <TrendingUpIcon fontSize="inherit" /> : <TrendingDownIcon fontSize="inherit" />}
          </div>
        </div>
        {!isGoodAttendance && totalDays > 0 && (
          <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-lg">
            <p className="text-sm font-semibold text-red-900">
              ⚠️ Your attendance is below 75%. You need to attend more classes to improve your percentage.
            </p>
          </div>
        )}
      </div>

      {pieData.length > 0 && totalDays > 0 && (
        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {weeklyData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" style={{ fontSize: 12 }} />
              <YAxis hide />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border border-gray-200 rounded shadow">
                      <p className="text-sm font-semibold">{data.date}</p>
                      <p className="text-sm capitalize">{data.label}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="status" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {monthlyData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Monthly Attendance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" style={{ fontSize: 12 }} />
              <YAxis style={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" stackId="a" fill="#10b981" name="Present" />
              <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {subjectData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Subject-wise Attendance</h3>
          <div className="space-y-3">
            {subjectData.map((subject) => (
              <div key={subject.subject}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{subject.subject}</span>
                  <span className={`text-sm font-semibold ${
                    subject.attendance >= 75 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {subject.attendance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      subject.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.attendance}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalDays === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <CalendarMonthIcon className="text-gray-300 mx-auto mb-2" style={{ fontSize: 64 }} />
          <p className="text-gray-500">No attendance data yet</p>
          <p className="text-sm text-gray-400 mt-1">Start checking in to see your statistics</p>
        </div>
      )}
    </div>
  );
}
