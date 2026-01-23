import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchVisits, deleteVisit } from "./visits.api";
import '../../styles/features/visits/_visits-list.scss';

const VisitsList = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFilter = searchParams.get("patientId");

  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patientName, setPatientName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadVisits = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchVisits(token);
      
      let filteredVisits = data;
      
      // Filter by patient if patientId is provided
      if (patientIdFilter) {
        filteredVisits = data.filter(
          (visit) => visit.patientId?._id === patientIdFilter
        );
        // Get patient name from first visit
        if (filteredVisits.length > 0) {
          setPatientName(filteredVisits[0].patientId?.name);
        }
      }
      
      setVisits(filteredVisits);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch visits");
    } finally {
      setLoading(false);
    }
  };

  // Filter visits by search term
  useEffect(() => {
    const filtered = visits.filter((visit) => {
      const patientMatch = visit.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const doctorMatch = visit.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return patientMatch || doctorMatch;
    });
    setFilteredVisits(filtered);
  }, [searchTerm, visits]);

  useEffect(() => {
    if (token) loadVisits();
  }, [token, patientIdFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visit?")) return;

    try {
      await deleteVisit(token, id);
      setVisits(visits.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete visit");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getComplaintDisplay = (complaint) => {
    if (typeof complaint === "object" && complaint !== null) {
      const complaintKeys = Object.keys(complaint);
      return complaintKeys.length > 0 ? complaintKeys[0] : "No complaint";
    }
    return complaint || "No complaint";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="table-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-title-section">
          <h1 className="page-title">
             {patientIdFilter ? `Visits for ${patientName}` : "Visits"}
          </h1>
          {patientIdFilter && (
            <button
              className="btn-small btn-secondary"
              onClick={() => navigate("/visits")}
            >
              ✕ Clear Filter
            </button>
          )}
        </div>
        <button
          className="btn-primary"
          onClick={() =>
            navigate("/visits/create", patientIdFilter ? { state: { patientId: patientIdFilter } } : undefined)
          }
        >
          + New Visit
        </button>
      </div>

      {error && <div className="page-alert">{error}</div>}

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder=" Search by patient or doctor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Visit Date</th>
              <th>Complaint</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.length > 0 ? (
              filteredVisits.map((visit) => (
                <tr key={visit._id} className="table-row">
                  <td className="cell-name">{visit.patientId?.name || "N/A"}</td>
                  <td className="cell-name">{visit.doctorId?.name || "N/A"}</td>
                  <td className="cell-date">{formatDate(visit.visitDate)}</td>
                  <td className="cell-complaint">{getComplaintDisplay(visit.complaint).substring(0, 30)}...</td>
                  <td className="cell-actions">
                    <button
                      className="btn-small btn-info"
                      onClick={() => navigate(`/visits/${visit._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn-small btn-secondary"
                      onClick={() => navigate(`/visits/edit/${visit._id}`)}
                    >
                      Edit
                    </button>
                    {user.role === "admin" && (
                      <button
                        className="btn-small btn-danger"
                        onClick={() => handleDelete(visit._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="cell-empty">
                  No visits found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitsList;
