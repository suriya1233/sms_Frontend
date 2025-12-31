import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../api';
import './AddStudent.css';

export default function AddStudent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        studentId: '',
        name: '',
        className: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.studentId || !formData.name || !formData.className || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await studentAPI.add(formData);
            setSuccess('Student added successfully!');
            setFormData({
                studentId: '',
                name: '',
                className: '',
                email: '',
                phone: '',
                password: ''
            });
        } catch (err) {
            setError(err.response?.data || 'Failed to add student');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin-Page');
    };

    return (
        <div className="add-student-page">
            <header className="page-header">
                <div className="header-content">
                    <button className="back-btn" onClick={handleBack}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="header-info">
                        <h1>Add New Student</h1>
                        <p>Create a new student account</p>
                    </div>
                </div>
            </header>

            <main className="page-content">
                <div className="form-card">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Student ID *</label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    placeholder="e.g., S003"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Class *</label>
                                <input
                                    type="text"
                                    name="className"
                                    value={formData.className}
                                    onChange={handleChange}
                                    placeholder="e.g., 10-A"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Set initial password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="student@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Student'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={handleBack}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
