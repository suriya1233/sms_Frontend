import React, { useState, useEffect } from 'react';
import './StudentPage.css';
import { useNavigate } from 'react-router-dom';
import { studentAPI, gradeAPI, attendanceAPI } from '../api';

export default function StudentPage() {
  const [studentData, setStudentData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendanceData, setAttendanceData] = useState({ percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const name = localStorage.getItem('name') || 'Student';
  const studentId = localStorage.getItem('studentId') || '';
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      // Fetch student profile, grades, and attendance in parallel
      const [profileRes, gradesRes, attendanceRes] = await Promise.all([
        studentAPI.getMe().catch(() => ({ data: null })),
        gradeAPI.getMyGrades().catch(() => ({ data: { grades: [], overallGrade: 'N/A', averageMarks: 0 } })),
        attendanceAPI.getMyAttendance().catch(() => ({ data: { percentage: 0 } }))
      ]);

      setStudentData(profileRes.data);
      setGrades(gradesRes.data?.grades || []);
      setAttendanceData(gradesRes.data || { overallGrade: 'N/A', averageMarks: 0 });

      if (attendanceRes.data) {
        setAttendanceData(prev => ({
          ...prev,
          percentage: attendanceRes.data.percentage || 0
        }));
      }

      setError('');
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError('Failed to load student data');
    } finally {
      setLoading(false);
    }
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
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div className="header-info">
              <h1>Student Dashboard</h1>
              <p>Welcome back, {name} {studentId ? `(${studentId})` : ''}</p>
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
      <main className="main-content">
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
              <span>Overall Grade</span>
            </div>
            <div className="stat-value">{attendanceData.overallGrade || 'N/A'}</div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Attendance</span>
            </div>
            <div className="stat-value">{attendanceData.percentage || 0}%</div>
          </div>

          <div className="stat-card stat-purple">
            <div className="stat-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span>Average Marks</span>
            </div>
            <div className="stat-value">{attendanceData.averageMarks || 0}%</div>
          </div>
        </div>

        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Quick Actions */}
            <div className="card">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <button className="action-btn action-primary" onClick={() => { navigate('/leave-apply') }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <div className="action-text">
                    <div className="action-title">Apply for Leave</div>
                    <div className="action-subtitle">Submit leave request</div>
                  </div>
                </button>
                <button className="action-btn action-secondary" onClick={() => { navigate('/my-attendance') }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <div className="action-text">
                    <div className="action-title">View Attendance</div>
                    <div className="action-subtitle">Check your attendance</div>
                  </div>
                </button>
                <button className="action-btn action-secondary" onClick={() => { navigate('/my-grades') }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                  <div className="action-text">
                    <div className="action-title">View Grades</div>
                    <div className="action-subtitle">Check your grades</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Subject Performance */}
            <div className="card">
              <h2>Subject Performance</h2>
              <div className="subjects-list">
                {grades.length === 0 ? (
                  <p className="empty-message" style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>No grades recorded yet</p>
                ) : (
                  grades.slice(0, 4).map((grade, index) => (
                    <div key={index} className="subject-item">
                      <div className="subject-info">
                        <h3>{grade.subject}</h3>
                        <p>{grade.semester || 'Current Semester'}</p>
                      </div>
                      <div className="subject-stats">
                        <div className="attendance-info">
                          <div className="attendance-label">Marks</div>
                          <div className="attendance-value">{grade.marks}/{grade.maxMarks}</div>
                        </div>
                        <div className={`grade-badge grade-${grade.grade?.charAt(0).toLowerCase() || 'n'}`}>
                          {grade.grade || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="right-column">
            <div className="card">
              <h2>Student Info</h2>
              <div className="schedule-list">
                {studentData ? (
                  <>
                    <div className="schedule-item">
                      <h3>Student ID</h3>
                      <div className="schedule-details">
                        <span>{studentData.studentId}</span>
                      </div>
                    </div>
                    <div className="schedule-item">
                      <h3>Class</h3>
                      <div className="schedule-details">
                        <span>{studentData.className}</span>
                      </div>
                    </div>
                    {studentData.email && (
                      <div className="schedule-item">
                        <h3>Email</h3>
                        <div className="schedule-details">
                          <span>{studentData.email}</span>
                        </div>
                      </div>
                    )}
                    {studentData.phone && (
                      <div className="schedule-item">
                        <h3>Phone</h3>
                        <div className="schedule-details">
                          <span>{studentData.phone}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ textAlign: 'center', color: '#666' }}>Profile data not available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


