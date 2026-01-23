import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchPatients, deletePatient } from "./patients.api";

const PatientsList = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchPatients(token);
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadPatients();
  }, [token, loadPatients]);

  // Filter patients by name
  useEffect(() => {
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await deletePatient(token, id);
      setPatients(patients.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete patient");
    }
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
        <h1 className="page-title"> Patients</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/patients/create")}
        >
          + New Patient
        </button>
      </div>

      {error && <div className="page-alert">{error}</div>}

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder=" Search patients by name..."
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
              <th>Name</th>
              <th>Code</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient._id} className="table-row">
                  <td className="cell-name">{patient.name}</td>
                  <td className="cell-code">{patient.code}</td>
                  <td className="cell-phone">{patient.phone}</td>
                  <td className="cell-age">{patient.age}</td>
                  <td className="cell-gender">{patient.gender}</td>
                  <td className="cell-actions">
                    <button
                      className="btn-small btn-info"
                      onClick={() => navigate(`/patients/${patient._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn-small btn-secondary"
                      onClick={() =>
                        navigate("/visits/create", { state: { patientId: patient._id } })
                      }
                    >
                      ➕ Visit
                    </button>
                    <button
                      className="btn-small btn-secondary"
                      onClick={() => navigate(`/visits?patientId=${patient._id}`)}
                    >
                      📋 Visits
                    </button>
                    <button
                      className="btn-small btn-secondary"
                      onClick={() => navigate(`/patients/edit/${patient._id}`)}
                    >
                      Edit
                    </button>
                    {user.role === "admin" && (
                      <button
                        className="btn-small btn-danger"
                        onClick={() => handleDelete(patient._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="cell-empty">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsList;
