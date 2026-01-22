import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchPatientById, updatePatient } from "./patients.api";

const EditPatient = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const data = await fetchPatientById(token, id);
        setFormData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch patient");
      } finally {
        setLoading(false);
      }
    };

    if (token) loadPatient();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await updatePatient(token, id, formData);
      setSuccess("Patient updated successfully!");
      setTimeout(() => navigate("/patients"), 2000);
    } catch (err) {
      setError(err.message || "Failed to update patient");
    } finally {
      setSubmitting(false);
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
    <div className="form-page">
      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h1 className="form-title">✏️ Edit Patient</h1>
          </div>

          {error && <div className="form-alert alert-error">{error}</div>}
          {success && <div className="form-alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Patient full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">Code *</label>
              <input
                id="code"
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Patient code"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Patient address"
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => navigate("/patients")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={submitting}
              >
                {submitting ? "Updating..." : "Update Patient"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPatient;
