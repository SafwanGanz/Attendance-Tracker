import { StudentProfile, AttendanceRecord } from '../App';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // First, check for environment variable (production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if there's a custom API URL in localStorage
  const customUrl = localStorage.getItem('apiBaseUrl');
  if (customUrl) {
    return customUrl;
  }
  
  // Default to localhost for development
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

// Student API
export const studentApi = {
  create: async (student: StudentProfile): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create student');
      }
      throw new Error(`Server error: ${response.status}`);
    }
  },

  getById: async (id: string): Promise<StudentProfile> => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch student');
    }
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Server returned invalid response (HTML instead of JSON)');
    }
    return response.json();
  },

  update: async (id: string, student: StudentProfile): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!response.ok) {
      throw new Error('Failed to update student');
    }
  },

  getAll: async (): Promise<StudentProfile[]> => {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Server returned invalid response (HTML instead of JSON)');
    }
    return response.json();
  }
};

// Attendance API
export const attendanceApi = {
  create: async (record: AttendanceRecord, studentId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...record, studentId }),
    });
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to record attendance');
      }
      throw new Error(`Server error: ${response.status}`);
    }
  },

  getByStudentId: async (studentId: string): Promise<AttendanceRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/attendance/${studentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch attendance records');
    }
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Server returned invalid response (HTML instead of JSON)');
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete attendance record');
    }
  },

  getStats: async (studentId: string): Promise<{ total: number; present: number; late: number }> => {
    const response = await fetch(`${API_BASE_URL}/attendance/${studentId}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  }
};
