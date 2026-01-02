import axios from 'axios';

// Base URL for API calls - Uses VITE_API_URL from environment (.env files)
// Production: Railway backend (public URL)
// Development: Set VITE_API_URL in .env.local or uses deployed Railway URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smsbackend-production-d09a.up.railway.app';

// Debug: Log the API endpoint being used
console.log('🔌 API Endpoint:', API_BASE_URL);

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear storage and redirect
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            localStorage.removeItem('studentId');
            localStorage.removeItem('name');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (username, password) => api.post('/api/auth/login', { username, password })
};

// Student API
export const studentAPI = {
    // Get current student profile
    getMe: () => api.get('/api/students/me'),

    // Admin: Get all students
    getAll: () => api.get('/api/students'),

    // Admin: Get recent students
    getRecent: () => api.get('/api/students/recent'),

    // Admin: Get student by ID
    getById: (studentId) => api.get(`/api/students/${studentId}`),

    // Admin: Add new student
    add: (studentData) => api.post('/api/students', studentData),

    // Admin: Update student
    update: (studentId, updates) => api.put(`/api/students/${studentId}`, updates),

    // Admin: Delete student
    delete: (studentId) => api.delete(`/api/students/${studentId}`)
};

// Leave API
export const leaveAPI = {
    // Apply for leave (POST /api/leaves)
    apply: (leaveData) => api.post('/api/leaves', leaveData),

    // Get my leaves (GET /api/leaves/me)
    getMyLeaves: () => api.get('/api/leaves/me'),

    // Get all leaves - admin only (GET /api/leaves)
    getAll: () => api.get('/api/leaves'),

    // Update leave status - admin only (PATCH /api/leaves/{id}/status)
    updateStatus: (id, status) => api.patch(`/api/leaves/${id}/status`, { status })
};

// Attendance API
export const attendanceAPI = {
    // Student: Get my attendance
    getMyAttendance: () => api.get('/api/attendance/me'),

    // Admin: Get attendance by date
    getByDate: (date) => api.get(`/api/attendance/date/${date}`),

    // Admin: Get student attendance
    getStudentAttendance: (studentId) => api.get(`/api/attendance/student/${studentId}`),

    // Admin: Record single attendance
    record: (attendanceData) => api.post('/api/attendance', attendanceData),

    // Admin: Record bulk attendance
    recordBulk: (bulkData) => api.post('/api/attendance/bulk', bulkData),

    // Admin: Update attendance
    update: (id, updates) => api.put(`/api/attendance/${id}`, updates),

    // Admin: Delete attendance
    delete: (id) => api.delete(`/api/attendance/${id}`),

    // Admin: Get attendance summary
    getSummary: () => api.get('/api/attendance/summary')
};

// Grade API
export const gradeAPI = {
    // Student: Get my grades
    getMyGrades: () => api.get('/api/grades/me'),

    // Admin: Get all grades
    getAll: () => api.get('/api/grades'),

    // Admin: Get student grades
    getStudentGrades: (studentId) => api.get(`/api/grades/student/${studentId}`),

    // Admin: Assign grade
    assign: (gradeData) => api.post('/api/grades', gradeData),

    // Admin: Update grade
    update: (id, updates) => api.put(`/api/grades/${id}`, updates),

    // Admin: Delete grade
    delete: (id) => api.delete(`/api/grades/${id}`),

    // Admin: Get grade summary by subject
    getSummary: () => api.get('/api/grades/summary'),

    // Admin: Get students grade summary
    getStudentsSummary: () => api.get('/api/grades/students-summary')
};

// Dashboard API
export const dashboardAPI = {
    // Admin: Get dashboard summary
    getSummary: () => api.get('/api/dashboard/summary'),

    // Admin: Get quick stats
    getStats: () => api.get('/api/dashboard/stats'),

    // Admin: Get class stats
    getClassStats: (className) => api.get(`/api/dashboard/class/${className}`)
};

export default api;
