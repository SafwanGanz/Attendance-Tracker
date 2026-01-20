import { useState } from 'react';
import { Student, AttendanceRecord } from '../App';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

type StudentsProps = {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (id: string, student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
  attendanceRecords: AttendanceRecord[];
};

export default function Students({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  attendanceRecords,
}: StudentsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    course: '',
    semester: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onUpdateStudent(editingStudent.id, formData);
    } else {
      onAddStudent(formData);
    }
    setFormData({ name: '', rollNumber: '', course: '', semester: '', email: '' });
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      course: student.course,
      semester: student.semester,
      email: student.email,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', rollNumber: '', course: '', semester: '', email: '' });
    setShowForm(false);
    setEditingStudent(null);
  };

  const getAttendancePercentage = (studentId: string) => {
    const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);
    if (studentRecords.length === 0) return 0;
    const presentCount = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    return ((presentCount / studentRecords.length) * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Students</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-blue-700 transition"
        >
          <AddIcon fontSize="small" />
          Add Student
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <CloseIcon />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course *
                </label>
                <input
                  type="text"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester *
                </label>
                <input
                  type="text"
                  required
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5th Semester"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingStudent ? 'Update' : 'Add'} Student
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students List */}
      <div className="space-y-3">
        {students.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <PersonIcon className="text-gray-300 mx-auto mb-2" style={{ fontSize: 64 }} />
            <p className="text-gray-500">No students added yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Student" to get started</p>
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">Roll: {student.rollNumber}</p>
                  <p className="text-sm text-gray-600">{student.course} - {student.semester}</p>
                  <p className="text-xs text-gray-500 mt-1">{student.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${student.name}? This will also delete all attendance records.`)) {
                        onDeleteStudent(student.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Attendance</span>
                  <span className={`font-semibold ${
                    parseFloat(getAttendancePercentage(student.id)) >= 75
                      ? 'text-green-600'
                      : parseFloat(getAttendancePercentage(student.id)) >= 60
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {getAttendancePercentage(student.id)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      parseFloat(getAttendancePercentage(student.id)) >= 75
                        ? 'bg-green-600'
                        : parseFloat(getAttendancePercentage(student.id)) >= 60
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${getAttendancePercentage(student.id)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
