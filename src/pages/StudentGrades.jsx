import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gradeAPI } from '../api';
import './StudentGrades.css';

export default function StudentGrades() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [gradesData, setGradesData] = useState({
        grades: [],
        averageMarks: 0,
        overallGrade: 'N/A'
    });

    useEffect(() => {
        fetchMyGrades();
    }, []);

    const fetchMyGrades = async () => {
        try {
            const response = await gradeAPI.getMyGrades();
            setGradesData(response.data);
        } catch (err) {
            console.error('Failed to fetch grades:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/student-Page');
    };

    const getGradeColor = (grade) => {
        const colors = {
            'A+': '#22c55e',
            'A': '#22c55e',
            'B+': '#84cc16',
            'B': '#eab308',
            'C': '#f97316',
            'D': '#ef4444',
            'F': '#dc2626',
            'N/A': '#6b7280'
        };
        return colors[grade] || '#6b7280';
    };

    const getProgressWidth = (marks, maxMarks) => {
        return Math.min((marks / maxMarks) * 100, 100);
    };

    if (loading) {
        return (
            <div className="student-grades-page">
                <p className="loading">Loading grades...</p>
            </div>
        );
    }

    return (
        <div className="student-grades-page">
            <header className="page-header">
                <div className="header-content">
                    <button className="back-btn" onClick={handleBack}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="header-info">
                        <h1>My Grades</h1>
                        <p>View your academic performance</p>
                    </div>
                </div>
            </header>

            <main className="page-content">
                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card overall-grade">
                        <div
                            className="grade-circle"
                            style={{
                                background: `linear-gradient(135deg, ${getGradeColor(gradesData.overallGrade)} 0%, ${getGradeColor(gradesData.overallGrade)}80 100%)`
                            }}
                        >
                            <span>{gradesData.overallGrade}</span>
                        </div>
                        <div className="grade-info">
                            <h3>Overall Grade</h3>
                            <p>Based on all subjects</p>
                        </div>
                    </div>

                    <div className="summary-card average-marks">
                        <div className="average-value">
                            <h3>{gradesData.averageMarks}%</h3>
                            <p>Average Score</p>
                        </div>
                        <div className="subjects-count">
                            <span>{gradesData.grades.length}</span>
                            <p>Subjects</p>
                        </div>
                    </div>
                </div>

                {/* Grades List */}
                <div className="grades-list">
                    <h2>Subject-wise Performance</h2>

                    {gradesData.grades.length === 0 ? (
                        <div className="empty-state">
                            <p>No grades recorded yet</p>
                        </div>
                    ) : (
                        <div className="grades-grid">
                            {gradesData.grades.map((grade, index) => (
                                <div key={index} className="grade-card">
                                    <div className="grade-header">
                                        <h4>{grade.subject}</h4>
                                        <span
                                            className="grade-badge"
                                            style={{ backgroundColor: getGradeColor(grade.grade) }}
                                        >
                                            {grade.grade}
                                        </span>
                                    </div>

                                    <div className="grade-details">
                                        <div className="marks-info">
                                            <span className="marks">{grade.marks}</span>
                                            <span className="separator">/</span>
                                            <span className="max-marks">{grade.maxMarks}</span>
                                        </div>
                                        <span className="percentage">
                                            {((grade.marks / grade.maxMarks) * 100).toFixed(1)}%
                                        </span>
                                    </div>

                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${getProgressWidth(grade.marks, grade.maxMarks)}%`,
                                                backgroundColor: getGradeColor(grade.grade)
                                            }}
                                        />
                                    </div>

                                    {grade.semester && (
                                        <div className="semester-info">
                                            {grade.semester}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
