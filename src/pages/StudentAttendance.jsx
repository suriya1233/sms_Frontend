import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceAPI } from '../api';
import './StudentAttendance.css';

export default function StudentAttendance() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [attendanceData, setAttendanceData] = useState({
        attendance: [],
        presentDays: 0,
        totalDays: 0,
        percentage: 0
    });

    useEffect(() => {
        fetchMyAttendance();
    }, []);

    const fetchMyAttendance = async () => {
        try {
            const response = await attendanceAPI.getMyAttendance();
            setAttendanceData(response.data);
        } catch (err) {
            console.error('Failed to fetch attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/student-Page');
    };

    const getStatusColor = (present) => {
        return present ? '#22c55e' : '#ef4444';
    };

    const getPercentageColor = (percentage) => {
        if (percentage >= 90) return '#22c55e';
        if (percentage >= 75) return '#eab308';
        return '#ef4444';
    };

    if (loading) {
        return (
            <div className="student-attendance-page">
                <p className="loading">Loading attendance...</p>
            </div>
        );
    }

    return (
        <div className="student-attendance-page">
            <header className="page-header">
                <div className="header-content">
                    <button className="back-btn" onClick={handleBack}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="header-info">
                        <h1>My Attendance</h1>
                        <p>View your attendance records</p>
                    </div>
                </div>
            </header>

            <main className="page-content">
                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="card-icon present">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <div className="card-info">
                            <h3>{attendanceData.presentDays}</h3>
                            <p>Days Present</p>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="card-icon total">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <div className="card-info">
                            <h3>{attendanceData.totalDays}</h3>
                            <p>Total Days</p>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div
                            className="card-icon percentage"
                            style={{ background: `${getPercentageColor(attendanceData.percentage)}20` }}
                        >
                            <span style={{ color: getPercentageColor(attendanceData.percentage), fontWeight: 'bold' }}>
                                %
                            </span>
                        </div>
                        <div className="card-info">
                            <h3 style={{ color: getPercentageColor(attendanceData.percentage) }}>
                                {attendanceData.percentage}%
                            </h3>
                            <p>Attendance Rate</p>
                        </div>
                    </div>
                </div>

                {/* Attendance History */}
                <div className="attendance-history">
                    <h2>Attendance History</h2>
                    <div className="history-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="empty-message">No attendance records found</td>
                                    </tr>
                                ) : (
                                    attendanceData.attendance.map((record, index) => (
                                        <tr key={index}>
                                            <td>{new Date(record.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}</td>
                                            <td>
                                                <span
                                                    className={`status-badge ${record.present ? 'present' : 'absent'}`}
                                                >
                                                    {record.present ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                            <td>{record.remarks || '-'}</td>
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
