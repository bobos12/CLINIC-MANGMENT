import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "../../services/apiClient";

const DashboardPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    patients: 0,
    visits: 0,
    doctors: 0,
  });

  const [recentVisits, setRecentVisits] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [patientsRes, visitsRes, usersRes] = await Promise.all([
          apiClient.get("/patients"),
          apiClient.get("/visits"),
          apiClient.get("/users"),
        ]);

        const patients = Array.isArray(patientsRes.data) ? patientsRes.data : [];
        const visits = Array.isArray(visitsRes.data) ? visitsRes.data : [];
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];

        setStats({
          patients: patients.length,
          visits: visits.length,
          doctors: users.filter((u) => u.role === "doctor").length,
        });

        setRecentVisits(
          visits
            .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
            .slice(0, 5)
        );

        setRecentPatients(
          patients
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back, <strong>{user.name}</strong>
            </p>
          </div>
          
          {/* Quick Action Buttons - Prominent */}
          <div className="quick-actions">
            <button 
              className="action-btn primary"
              onClick={() => navigate("/visits/create")}
            >
              <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Visit
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => navigate("/patients/create")}
            >
              <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Add Patient
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="dashboard-alert">
          <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card patients">
          <div className="stat-header">
            <div className="stat-icon-wrapper">
              <svg className="stat-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <p className="stat-label">Total Patients</p>
          </div>
          <h2 className="stat-value">{stats.patients}</h2>
          <button 
            className="stat-action"
            onClick={() => navigate("/patients")}
          >
            View All
            <svg className="action-arrow" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="stat-card visits">
          <div className="stat-header">
            <div className="stat-icon-wrapper">
              <svg className="stat-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="stat-label">Total Visits</p>
          </div>
          <h2 className="stat-value">{stats.visits}</h2>
          <button 
            className="stat-action"
            onClick={() => navigate("/visits")}
          >
            View All
            <svg className="action-arrow" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

      
          
      </div>

      {/* Tables Section */}
      <div className="tables-grid">
        {/* Recent Visits */}
        <div className="table-card">
          <div className="card-header">
            <h3 className="card-title">
              <svg className="title-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Recent Visits
            </h3>
            <button 
              className="view-all-btn"
              onClick={() => navigate("/visits")}
            >
              View All
            </button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header">Patient</th>
                  <th className="table-header">Doctor</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentVisits.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty-cell">
                      <svg className="empty-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                      <p>No visits recorded yet</p>
                    </td>
                  </tr>
                ) : (
                  recentVisits.map((visit) => (
                    <tr key={visit._id} className="table-row">
                      <td className="table-cell">
                        {visit.patientId?.name || "Unknown"}
                      </td>
                      <td className="table-cell">
                        {visit.doctorId?.name || "Unknown"}
                      </td>
                      <td className="table-cell">
                        {formatDate(visit.visitDate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="table-card">
          <div className="card-header">
            <h3 className="card-title">
              <svg className="title-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              New Patients
            </h3>
            <button 
              className="view-all-btn"
              onClick={() => navigate("/patients")}
            >
              View All
            </button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header">Name</th>
                  <th className="table-header">Phone</th>
                  <th className="table-header">Registered</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty-cell">
                      <svg className="empty-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                      </svg>
                      <p>No patients registered yet</p>
                    </td>
                  </tr>
                ) : (
                  recentPatients.map((patient) => (
                    <tr key={patient._id} className="table-row">
                      <td className="table-cell">{patient.name}</td>
                      <td className="table-cell">{patient.phone}</td>
                      <td className="table-cell">
                        {formatDate(patient.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;