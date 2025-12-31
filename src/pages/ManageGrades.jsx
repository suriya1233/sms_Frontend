import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI, gradeAPI } from '../api';
import './ManageGrades.css';

export default function ManageGrades() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('assign'); // 'assign' or 'view'
    const [summary, setSummary] = useState([]);

    const [formData, setFormData] = useState({
        studentId: '',
        subject: '',
        marks: '',
        maxMarks: '100',
        semester: ''
    });

    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Biology', 'History', 'Geography'];

    useEffect(() => {
        fetchStudents();
        fetchSummary();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getAll();
            setStudents(response.data || []);
        } catch (err) {
            setError('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await gradeAPI.getStudentsSummary();
            setSummary(response.data || []);
        } catch (err) {
            console.error('Failed to fetch summary:', err);
        }
    };

    const fetchStudentGrades = async (studentId) => {
        try {
            const response = await gradeAPI.getStudentGrades(studentId);
            setGrades(response.data.grades || []);
        } catch (err) {
            console.error('Failed to fetch grades:', err);
        }
    };

    const handleStudentSelect = (studentId) => {
        setSelectedStudent(studentId);
        setFormData(prev => ({ ...prev, studentId }));
        if (studentId) {
            fetchStudentGrades(studentId);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.studentId || !formData.subject || !formData.marks) {
            setError('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await gradeAPI.assign({
                studentId: formData.studentId,
                subject: formData.subject,
                marks: parseFloat(formData.marks),
                maxMarks: parseFloat(formData.maxMarks) || 100,
                semester: formData.semester || null
            });

            setSuccess('Grade assigned successfully!');
            setFormData(prev => ({ ...prev, subject: '', marks: '', semester: '' }));
            fetchStudentGrades(formData.studentId);
            fetchSummary();
        } catch (err) {
            setError(err.response?.data || 'Failed to assign grade');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteGrade = async (id) => {
        if (!window.confirm('Are you sure you want to delete this grade?')) return;

        try {
            await gradeAPI.delete(id);
            fetchStudentGrades(selectedStudent);
            fetchSummary();
            setSuccess('Grade deleted successfully');
        } catch (err) {
            setError('Failed to delete grade');
        }
    };

    const handleBack = () => {
        navigate('/admin-Page');
    };

    const getGradeColor = (grade) => {
        const colors = {
            'A+': '#22c55e',
            'A': '#22c55e',
            'B+': '#84cc16',
            'B': '#eab308',
            'C': '#f97316',
            'D': '#ef4444',
            'F': '#dc2626'
        };
        return colors[grade] || '#6b7280';
    };

    return (
        <div className="grades-page">
            <header className="page-header">
                <div className="header-content">
                    <button className="back-btn" onClick={handleBack}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="header-info">
                        <h1>Manage Grades</h1>
                        <p>Assign and view student grades</p>
                    </div>
                </div>
            </header>

            <main className="page-content">
                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'assign' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assign')}
                    >
                        Assign Grade
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

                {activeTab === 'assign' && (
                    <div className="assign-section">
                        <div className="form-card">
                            <h3>Assign New Grade</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Select Student *</label>
                                        <select
                                            name="studentId"
                                            value={formData.studentId}
                                            onChange={(e) => handleStudentSelect(e.target.value)}
                                            required
                                        >
                                            <option value="">Choose a student</option>
                                            {students.map(s => (
                                                <option key={s.studentId} value={s.studentId}>
                                                    {s.name} ({s.studentId}) - {s.className}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Subject *</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Choose a subject</option>
                                            {subjects.map(sub => (
                                                <option key={sub} value={sub}>{sub}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Marks Obtained *</label>
                                        <input
                                            type="number"
                                            name="marks"
                                            value={formData.marks}
                                            onChange={handleChange}
                                            placeholder="e.g., 85"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Maximum Marks</label>
                                        <input
                                            type="number"
                                            name="maxMarks"
                                            value={formData.maxMarks}
                                            onChange={handleChange}
                                            placeholder="100"
                                            min="1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Semester</label>
                                        <input
                                            type="text"
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleChange}
                                            placeholder="e.g., Fall 2024"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="submit-btn" disabled={submitting}>
                                        {submitting ? 'Assigning...' : 'Assign Grade'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Student's existing grades */}
                        {selectedStudent && grades.length > 0 && (
                            <div className="grades-card">
                                <h3>Existing Grades for {students.find(s => s.studentId === selectedStudent)?.name}</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Marks</th>
                                            <th>Grade</th>
                                            <th>Semester</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grades.map(g => (
                                            <tr key={g.id}>
                                                <td>{g.subject}</td>
                                                <td>{g.marks}/{g.maxMarks}</td>
                                                <td>
                                                    <span
                                                        className="grade-badge"
                                                        style={{ backgroundColor: getGradeColor(g.grade) }}
                                                    >
                                                        {g.grade}
                                                    </span>
                                                </td>
                                                <td>{g.semester || 'N/A'}</td>
                                                <td>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteGrade(g.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                                        <th>Average Marks</th>
                                        <th>Overall Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summary.map(item => (
                                        <tr key={item.studentId}>
                                            <td>{item.studentId}</td>
                                            <td>{item.name}</td>
                                            <td>{item.className}</td>
                                            <td>{item.averageMarks}%</td>
                                            <td>
                                                <span
                                                    className="grade-badge"
                                                    style={{ backgroundColor: getGradeColor(item.overallGrade) }}
                                                >
                                                    {item.overallGrade}
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
