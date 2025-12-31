import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI, attendanceAPI } from '../api';
import './ManageAttendance.css';

export default function ManageAttendance() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [summary, setSummary] = useState([]);
    const [activeTab, setActiveTab] = useState('mark'); // 'mark' or 'view'

    useEffect(() => {
        fetchStudents();
        fetchSummary();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getAll();
            setStudents(response.data || []);
            // Initialize attendance object
            const initialAttendance = {};
            (response.data || []).forEach(s => {
                initialAttendance[s.studentId] = { present: true, remarks: '' };
            });
            setAttendance(initialAttendance);
        } catch (err) {
            setError('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await attendanceAPI.getSummary();
            setSummary(response.data || []);
        } catch (err) {
            console.error('Failed to fetch summary:', err);
        }
    };

    const handleAttendanceChange = (studentId, field, value) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [field]: value }
        }));
    };

    const handleMarkAll = (present) => {
        const updated = {};
        students.forEach(s => {
            updated[s.studentId] = { ...attendance[s.studentId], present };
        });
        setAttendance(updated);
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        setSubmitting(true);

        const records = students.map(s => ({
            studentId: s.studentId,
            present: attendance[s.studentId]?.present ?? true,
            remarks: attendance[s.studentId]?.remarks || ''
        }));

        try {
            const response = await attendanceAPI.recordBulk({
                date: selectedDate,
                records
            });

            if (response.data.errors?.length > 0) {
                setError(`Saved ${response.data.saved} records. Errors: ${response.data.errors.join(', ')}`);
            } else {
                setSuccess(`Successfully recorded attendance for ${response.data.saved} students`);
            }
            fetchSummary();
        } catch (err) {
            setError(err.response?.data || 'Failed to record attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate('/admin-Page');
    };

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return '#22c55e';
        if (percentage >= 75) return '#eab308';
        return '#ef4444';
    };

    return (
        <div className="attendance-page">
            <header className="page-header">
                <div className="header-content">
                    <button className="back-btn" onClick={handleBack}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="header-info">
                        <h1>Manage Attendance</h1>
                        <p>Record and view student attendance</p>
                    </div>
                </div>
            </header>

            <main className="page-content">
                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'mark' ? 'active' : ''}`}
                        onClick={() => setActiveTab('mark')}
                    >
                        Mark Attendance
                    </button>
                    <button
                        className={`tab ${activeTab === 'view' ? 'active' : ''}`}
                        onClick={() => setActiveTab('view')}
                    >
                        View Summary
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {activeTab === 'mark' && (
                    <div className="mark-section">
                        <div className="controls">
                            <div className="date-picker">
                                <label>Date:</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                            <div className="quick-actions">
                                <button onClick={() => handleMarkAll(true)} className="mark-all-btn present">
                                    Mark All Present
                                </button>
                                <button onClick={() => handleMarkAll(false)} className="mark-all-btn absent">
                                    Mark All Absent
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <p className="loading">Loading students...</p>
                        ) : (
                            <div className="attendance-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Student ID</th>
                                            <th>Name</th>
                                            <th>Class</th>
                                            <th>Status</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(student => (
                                            <tr key={student.studentId}>
                                                <td>{student.studentId}</td>
                                                <td>{student.name}</td>
                                                <td>{student.className}</td>
                                                <td>
                                                    <div className="status-toggle">
                                                        <button
                                                            className={`toggle-btn ${attendance[student.studentId]?.present ? 'present' : ''}`}
                                                            onClick={() => handleAttendanceChange(student.studentId, 'present', true)}
                                                        >
                                                            Present
                                                        </button>
                                                        <button
                                                            className={`toggle-btn ${!attendance[student.studentId]?.present ? 'absent' : ''}`}
                                                            onClick={() => handleAttendanceChange(student.studentId, 'present', false)}
                                                        >
                                                            Absent
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        placeholder="Optional remarks"
                                                        value={attendance[student.studentId]?.remarks || ''}
                                                        onChange={(e) => handleAttendanceChange(student.studentId, 'remarks', e.target.value)}
                                                        className="remarks-input"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="submit-section">
                            <button
                                onClick={handleSubmit}
                                className="submit-btn"
                                disabled={submitting || students.length === 0}
                            >
                                {submitting ? 'Saving...' : 'Save Attendance'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'view' && (
                    <div className="summary-section">
                        <div className="summary-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Class</th>
                                        <th>Present</th>
                                        <th>Total</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summary.map(item => (
                                        <tr key={item.studentId}>
                                            <td>{item.studentId}</td>
                                            <td>{item.name}</td>
                                            <td>{item.className}</td>
                                            <td>{item.presentDays}</td>
                                            <td>{item.totalDays}</td>
                                            <td>
                                                <span
                                                    className="percentage-badge"
                                                    style={{ backgroundColor: getAttendanceColor(item.percentage) }}
                                                >
                                                    {item.percentage}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
