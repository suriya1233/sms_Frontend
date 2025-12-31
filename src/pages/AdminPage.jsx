import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, studentAPI } from '../api';

export default function AdminPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    averageAttendance: 0,
    pendingLeaves: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats and recent students in parallel
      const [statsResponse, studentsResponse] = await Promise.all([
        dashboardAPI.getStats(),
        studentAPI.getRecent()
      ]);

      setStats({
        totalStudents: statsResponse.data.totalStudents || 0,
        totalClasses: statsResponse.data.totalClasses || 0,
        averageAttendance: statsResponse.data.averageAttendance || 0,
        pendingLeaves: statsResponse.data.pendingLeaves || 0
      });

      setStudents(studentsResponse.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    navigate('/add-student');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('studentId');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div className="header-info">
              <h1>Admin Dashboard</h1>
              <p>Student Management System</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="stat-value">{stats.totalClasses}</div>
            <div className="stat-label">Total Classes</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="stat-value">{stats.pendingLeaves}</div>
            <div className="stat-label">Pending Leaves</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
              </svg>
            </div>
            <div className="stat-value">{stats.averageAttendance}%</div>
            <div className="stat-label">Avg Attendance</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          <div className="action-card action-card-primary" onClick={() => { navigate('/leave-approval') }}>
            <div className="action-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="action-content" >
              <div className="action-label">Leave Requests</div>
              <div className="action-value">View All</div>
            </div>
          </div>

          <div className="action-card action-card-secondary" onClick={() => { navigate('/add-student') }}>
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <div className="action-content">
              <div className="action-label">Add Student</div>
              <div className="action-subtitle">Create new student</div>
            </div>
          </div>

          <div className="action-card action-card-secondary" onClick={() => { navigate('/manage-attendance') }}>
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <polyline points="9 16 12 13 15 16" />
              </svg>
            </div>
            <div className="action-content">
              <div className="action-label">Manage Attendance</div>
              <div className="action-subtitle">Record & view attendance</div>
            </div>
          </div>

          <div className="action-card action-card-secondary" onClick={() => { navigate('/manage-grades') }}>
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <div className="action-content">
              <div className="action-label">Manage Grades</div>
              <div className="action-subtitle">Assign & view grades</div>
            </div>
          </div>
        </div>

        {/* Recent Students Table */}
        <div className="students-section">
          <div className="section-header">
            <h2>Recent Students</h2>
            <button className="add-student-btn" onClick={handleAddStudent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Student
            </button>
          </div>

          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>STUDENT ID</th>
                  <th>NAME</th>
                  <th>CLASS</th>
                  <th>ATTENDANCE</th>
                  <th>GRADE</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.studentId}</td>
                      <td>{student.name}</td>
                      <td>{student.className}</td>
                      <td>{student.attendancePercent ? `${student.attendancePercent}%` : 'N/A'}</td>
                      <td>
                        <span className={`grade-badge grade-${(student.grade || 'na').replace('+', 'plus').toLowerCase()}`}>
                          {student.grade || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}