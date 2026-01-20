import { useState } from 'react';
import { AttendanceRecord } from '../App';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

type AttendanceRecordsProps = {
  attendanceRecords: AttendanceRecord[];
  onDeleteRecord: (id: string) => void;
};

export default function AttendanceRecords({
  attendanceRecords,
  onDeleteRecord,
}: AttendanceRecordsProps) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredRecords = attendanceRecords.filter(record => {
    if (filters.startDate && record.date < filters.startDate) return false;
    if (filters.endDate && record.date > filters.endDate) return false;
    if (filters.status && record.status !== filters.status) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const handleExport = () => {
    const csv = [
      ['Date', 'Check In Time', 'Status', 'Subject', 'Notes'].join(','),
      ...filteredRecords.map(record => [
        record.date,
        record.checkInTime,
        record.status,
        record.subject || 'N/A',
        record.notes || 'N/A',
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      onDeleteRecord(id);
    }
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
    });
  };

  const hasActiveFilters = filters.startDate || filters.endDate || filters.status;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My History</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-colors font-semibold shadow-sm flex items-center gap-1 ${
              showFilters ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FilterListIcon fontSize="small" />
            <span>Filters</span>
          </button>
          {filteredRecords.length > 0 && (
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors shadow-sm flex items-center gap-1"
              title="Export to CSV"
            >
              <DownloadIcon fontSize="small" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-5 space-y-3">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="">All</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors shadow-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-2xl font-bold text-gray-800">{filteredRecords.length}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-2xl font-bold text-green-600">
            {filteredRecords.filter(r => r.status === 'present').length}
          </p>
          <p className="text-xs text-gray-500">Present</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {filteredRecords.filter(r => r.status === 'late').length}
          </p>
          <p className="text-xs text-gray-500">Late</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center">
            <CalendarTodayIcon className="text-gray-300 mx-auto mb-2" style={{ fontSize: 48 }} />
            <p className="text-gray-500">No attendance records found</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear filters to see all records
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredRecords.map((record) => (
              <div key={record.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">{record.date}</p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'present'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      ⏰ {record.checkInTime}
                    </p>
                    {record.subject && (
                      <p className="text-sm text-gray-600">
                        📚 {record.subject}
                      </p>
                    )}
                    {record.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        📝 {record.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete record"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
