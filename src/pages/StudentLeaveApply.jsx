import React, { useState, useEffect } from 'react';
import './StudentLeaveApply.css';
import { useNavigate } from 'react-router-dom';
import { leaveAPI } from '../api';

export default function StudentLeaveApply() {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch leave requests on mount
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await leaveAPI.getMyLeaves();
      setLeaveRequests(response.data || []);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await leaveAPI.apply({
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });

      setSuccess('Leave application submitted successfully!');
      setFormData({ startDate: '', endDate: '', reason: '' });
      fetchLeaveRequests(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      startDate: '',
      endDate: '',
      reason: ''
    });
    setError('');
    setSuccess('');
  };

  const handleBack = () => {
    navigate('/student-Page');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <div className="leave-page">
      {/* Header */}
      <header className="leave-header">
        <div className="header-container">
          <button className="back-btn" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div className="header-text">
            <h1>Leave Application</h1>
            <p>Submit your leave request</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="leave-content">
        <div className="content-container">
          {/* New Leave Application Form */}
          <div className="form-card">
            <h2>New Leave Application</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Reason for Leave
                </label>
                <textarea
                  name="reason"
                  rows="6"
                  placeholder="Please provide a detailed reason for your leave request..."
                  value={formData.reason}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button type="button" className="clear-btn" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* My Leave Requests */}
          <div className="requests-card">
            <h2>My Leave Requests</h2>

            <div className="requests-list">
              {leaveRequests.length === 0 ? (
                <p className="no-requests">No leave requests found</p>
              ) : (
                leaveRequests.map((request) => (
                  <div key={request.id} className="request-item">
                    <div className="request-header">
                      <span className="request-id">Leave #{request.id}</span>
                      <span className={`request-status ${getStatusClass(request.status)}`}>
                        {formatStatus(request.status)}
                      </span>
                    </div>
                    <div className="request-details">
                      <p><strong>From:</strong> {request.startDate}</p>
                      <p><strong>To:</strong> {request.endDate}</p>
                      <p className="request-reason">{request.reason}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}