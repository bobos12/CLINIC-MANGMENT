import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchVisitById } from "./visits.api";
import '../../styles/features/visits/_visit-details.scss';

const VisitDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVisit = async () => {
      try {
        const data = await fetchVisitById(token, id);
        setVisit(data);
      } catch (err) {
        setError(err.message || "Failed to fetch visit");
      } finally {
        setLoading(false);
      }
    };

    if (token) loadVisit();
  }, [id, token]);

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : "-";

  // Helper to render history items
  const renderHistory = (historyObj) => {
    if (!historyObj || Object.keys(historyObj).length === 0) return "-";

    return (
      <ul className="detail-list">
        {Object.entries(historyObj).map(([key, item]) => {
          const years = item?.years || 0;
          const months = item?.months || 0;
          const days = item?.days || 0;
          const durationParts = [];
          if (years) durationParts.push(`${years}y`);
          if (months) durationParts.push(`${months}m`);
          if (days) durationParts.push(`${days}d`);
          const duration = durationParts.length > 0 ? `(${durationParts.join(" ")})` : "";
          const eye = item?.eye ? ` [${item.eye}]` : "";
          return <li key={key}>{key} {duration}{eye}</li>;
        })}
      </ul>
    );
  };

  // Helper to render eye exam fields
  const renderEyeValue = (eyeValue) => {
    if (!eyeValue) return "-";

    // If object with values/other
    if (typeof eyeValue === "object") {
      const hasValues = eyeValue.values && eyeValue.values.length > 0;
      const hasOther = eyeValue.other && eyeValue.other.trim() !== "";
      if (!hasValues && !hasOther) return "-";
      return (
        <>
          {hasValues && <div className="exam-values-list">{eyeValue.values.join(", ")}</div>}
          {hasOther && <div className="exam-other-text">{hasValues && "• "} {eyeValue.other}</div>}
        </>
      );
    }

    return eyeValue || "-";
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="details-page">
      <div className="details-container">
        <div className="details-card">
          {error && <div className="form-alert alert-error">{error}</div>}

          {visit && (
            <>
              {/* Header */}
              <div className="details-header">
                <h1 className="details-title">👁️ {visit.patientId?.name || "Visit"}</h1>
                <div className="details-actions">
                  <button className="btn btn-secondary" onClick={() => navigate(`/visits/edit/${visit._id}`)}>✏️ Edit</button>
                  <button className="btn btn-cancel" onClick={() => navigate("/visits")}>← Back</button>
                </div>
              </div>

              {/* Visit Info */}
              <div className="details-section">
                <h3 className="section-title">📋 Visit Information</h3>
                <div className="detail-row"><div className="detail-label">Patient</div><div className="detail-value">{visit.patientId?.name || "-"}</div></div>
                <div className="detail-row"><div className="detail-label">Doctor</div><div className="detail-value">{visit.doctorId?.name || "-"}</div></div>
                <div className="detail-row"><div className="detail-label">Visit Date</div><div className="detail-value">{formatDate(visit.visitDate)}</div></div>
                <div className="detail-row"><div className="detail-label">Follow-up Date</div><div className="detail-value">{formatDate(visit.followUpDate)}</div></div>
                {visit.followUp && (visit.followUp.years || visit.followUp.months || visit.followUp.days) && (
                  <div className="detail-row">
                    <div className="detail-label">Follow-up Period</div>
                    <div className="detail-value">
                      {[visit.followUp.years && `${visit.followUp.years}y`, visit.followUp.months && `${visit.followUp.months}m`, visit.followUp.days && `${visit.followUp.days}d`].filter(Boolean).join(" ") || "-"}
                    </div>
                  </div>
                )}
              </div>

              {/* Patient History */}
              <div className="details-section">
                <h3 className="section-title">📝 Patient History</h3>
                <div className="detail-row">
                  <div className="detail-label">Chief Complaint</div>
                  <div className="detail-value">{renderHistory(visit.complaint)}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Medical History</div>
                  <div className="detail-value">{renderHistory(visit.medicalHistory)}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Surgical History</div>
                  <div className="detail-value">{renderHistory(visit.surgicalHistory)}</div>
                </div>
              </div>

              {/* Eye Examination */}
              <div className="details-section">
                <h3 className="section-title">👁️ Eye Examination</h3>
                {visit.eyeExam ? (
                  <div className="exam-grid">
                    {Object.entries(visit.eyeExam).map(([key, value]) => {
                      if (!value) return null;

                      // Handle prescription-style objects (oldGlasses, refraction, newPrescription)
                      const isPrescriptionCard = (key === "refraction" || key === "oldGlasses" || key === "newPrescription") && value.OD != null && value.OS != null;
                      if (isPrescriptionCard) {
                        return (
                          <div key={key} className="exam-card nested-exam-card">
                            <div className="exam-field-label">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                            <div className="nested-exam-values">
                              {["OD", "OS"].map((eye) => (
                                <div key={eye} className="nested-eye">
                                  <div className="exam-value-label">{eye === "OD" ? "OD (Right)" : "OS (Left)"}</div>
                                  <div className="nested-values">
                                    {value[eye].sphere != null && value[eye].sphere !== "" && <div>Sphere: {value[eye].sphere}</div>}
                                    {value[eye].cylinder != null && value[eye].cylinder !== "" && <div>Cylinder: {value[eye].cylinder}</div>}
                                    {value[eye].axis != null && value[eye].axis !== "" && <div>Axis: {value[eye].axis}</div>}
                                    {value[eye].ADD != null && value[eye].ADD !== "" && <div>ADD: {value[eye].ADD}</div>}
                                    {!value[eye].sphere && !value[eye].cylinder && !value[eye].axis && !value[eye].ADD && <div>-</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      // IOP: simple OD/OS values
                      if (key === "iop" && (value.OD != null || value.OS != null)) {
                        return (
                          <div key={key} className="exam-card">
                            <div className="exam-field-label">IOP (mmHg)</div>
                            <div className="exam-values">
                              {value.OD != null && value.OD !== "" && <div><div className="exam-value-label">OD (Right)</div><div className="exam-value">{value.OD}</div></div>}
                              {value.OS != null && value.OS !== "" && <div><div className="exam-value-label">OS (Left)</div><div className="exam-value">{value.OS}</div></div>}
                            </div>
                          </div>
                        );
                      }

                      // Normal eye fields with values/other
                      if (value.OD || value.OS) {
                        return (
                          <div key={key} className="exam-card">
                            <div className="exam-field-label">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                            <div className="exam-values">
                              {value.OD && <div><div className="exam-value-label">OD (Right)</div><div className="exam-value">{renderEyeValue(value.OD)}</div></div>}
                              {value.OS && <div><div className="exam-value-label">OS (Left)</div><div className="exam-value">{renderEyeValue(value.OS)}</div></div>}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                ) : (
                  <div className="detail-value">No examination data available</div>
                )}
              </div>

              {/* Recommendations */}
              {visit.recommendations && (
                <div className="details-section">
                  <h3 className="section-title">💊 Recommendations</h3>
                  <div className="detail-value">{visit.recommendations}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitDetails;
