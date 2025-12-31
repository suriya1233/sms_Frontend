import React, { useState, useEffect } from "react";
import "./AdminLeaveApproval.css";
import { useNavigate } from "react-router-dom";
import { leaveAPI } from "../api";

const AdminLeaveApproval = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all leaves on mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await leaveAPI.getAll();
      setLeaves(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setError("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await leaveAPI.updateStatus(id, status);
      // Update local state
      setLeaves(
        leaves.map((l) =>
          l.id === id ? { ...l, status } : l
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update leave status");
    }
  };

  const handleBack = () => {
    navigate("/admin-Page");
  };

  const formatStatus = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const filteredLeaves = leaves.filter((l) => {
    const statusStr = formatStatus(l.status);
    const matchStatus =
      statusFilter === "All" || statusStr === statusFilter;
    const studentName = l.student?.name || '';
    const studentId = l.student?.studentId || '';
    const matchSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      studentId.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const total = leaves.length;
  const pending = leaves.filter(l => l.status === "PENDING").length;
  const approved = leaves.filter(l => l.status === "APPROVED").length;
  const rejected = leaves.filter(l => l.status === "REJECTED").length;

  if (loading) {
    return (
      <div className="admin-container">
        <p>Loading leave requests...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Back Button */}
      <button className="back-btn" onClick={handleBack} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        ← Back to Dashboard
      </button>

      {/* Header */}
      <h2 className="page-title">Leave Management</h2>
      <p className="subtitle">Review and manage leave requests</p>

      {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {/* Summary */}
      <div className="summary">
        <div className="box">
          <p>Total Requests</p>
          <h3>{total}</h3>
        </div>
        <div className="box pending">
          <p>Pending</p>
          <h3>{pending}</h3>
        </div>
        <div className="box approved">
          <p>Approved</p>
          <h3>{approved}</h3>
        </div>
        <div className="box rejected">
          <p>Rejected</p>
          <h3>{rejected}</h3>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by student name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <h3>Leave Requests ({filteredLeaves.length})</h3>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>STUDENT</th>
              <th>DURATION</th>
              <th>REASON</th>
              <th>STATUS</th>
              <th>SUBMITTED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No leave requests found
                </td>
              </tr>
            ) : (
              filteredLeaves.map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>
                    <b>{l.student?.name || 'Unknown'}</b>
                    <div className="muted">{l.student?.studentId || ''}</div>
                  </td>
                  <td>
                    {l.startDate}
                    <br />
                    to {l.endDate}
                  </td>
                  <td>{l.reason}</td>
                  <td>
                    <span className={`status ${l.status?.toLowerCase() || 'pending'}`}>
                      {formatStatus(l.status)}
                    </span>
                  </td>
                  <td>{l.submittedAt ? new Date(l.submittedAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    {l.status === "PENDING" ? (
                      <>
                        <button
                          className="action approve"
                          onClick={() => updateStatus(l.id, "APPROVED")}
                        >
                          ✓
                        </button>
                        <button
                          className="action reject"
                          onClick={() => updateStatus(l.id, "REJECTED")}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <span className="muted">Processed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaveApproval;
