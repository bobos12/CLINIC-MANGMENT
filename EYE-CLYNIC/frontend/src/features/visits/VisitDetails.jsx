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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-container">
        <div className="details-card">
          {error && <div className="form-alert alert-error">{error}</div>}

          {visit && (
            <>
              <div className="details-header">
                <h1 className="details-title">👁️ {visit.patientId?.name || "Visit"}</h1>
                <div className="details-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/visits/edit/${visit._id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-cancel"
                    onClick={() => navigate("/visits")}
                  >
                    ← Back
                  </button>
                </div>
              </div>

              {/* Visit Information */}
              <div className="details-section">
                <h3 className="section-title">📋 Visit Information</h3>
                <div className="detail-row">
                  <div className="detail-label">Patient</div>
                  <div className="detail-value">{visit.patientId?.name || "-"}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Doctor</div>
                  <div className="detail-value">{visit.doctorId?.name || "-"}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Visit Date</div>
                  <div className="detail-value">{formatDate(visit.visitDate)}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Follow-up Date</div>
                  <div className="detail-value">
                    {visit.followUpDate ? formatDate(visit.followUpDate) : "N/A"}
                  </div>
                </div>
              </div>

              {/* Patient History */}
              <div className="details-section">
                <h3 className="section-title">📝 Patient History</h3>
                
                {/* Chief Complaint */}
                <div className="detail-row">
                  <div className="detail-label">Chief Complaint</div>
                  <div className="detail-value">
                    {visit.complaint && Object.keys(visit.complaint).length > 0 ? (
                      <ul className="detail-list">
                        {Object.entries(visit.complaint).map(([complaint, years]) => (
                          <li key={complaint}>
                            {complaint}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>

                {/* Medical History */}
                <div className="detail-row">
                  <div className="detail-label">Medical History</div>
                  <div className="detail-value">
                    {visit.medicalHistory && Object.keys(visit.medicalHistory).length > 0 ? (
                      <ul className="detail-list">
                        {Object.entries(visit.medicalHistory).map(([condition, years]) => (
                          <li key={condition}>
                            {condition} {years > 0 && `(${years} years)`}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>

                {/* Surgical History */}
                <div className="detail-row">
                  <div className="detail-label">Surgical History</div>
                  <div className="detail-value">
                    {visit.surgicalHistory && Object.keys(visit.surgicalHistory).length > 0 ? (
                      <ul className="detail-list">
                        {Object.entries(visit.surgicalHistory).map(([procedure, years]) => (
                          <li key={procedure}>
                            {procedure} {years > 0 && `(${years} years)`}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>

              {/* Eye Examination */}
              <div className="details-section">
                <h3 className="section-title">👁️ Eye Examination</h3>
                {visit.eyeExam ? (
                  <div className="exam-grid">
                    {Object.entries(visit.eyeExam).map(([key, value]) => {
                      // Handle nested structures (refraction, oldGlasses)
                      if (
                        (key === "refraction" || key === "oldGlasses") &&
                        value &&
                        typeof value === "object" &&
                        value.OD &&
                        typeof value.OD === "object"
                      ) {
                        return (
                          <div key={key} className="exam-card nested-exam-card">
                            <div className="exam-field-label">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </div>
                            <div className="nested-exam-values">
                              <div className="nested-eye">
                                <div className="exam-value-label">OD (Right)</div>
                                <div className="nested-values">
                                  {value.OD.sphere && (
                                    <div>Sphere: {value.OD.sphere}</div>
                                  )}
                                  {value.OD.cylinder && (
                                    <div>Cylinder: {value.OD.cylinder}</div>
                                  )}
                                  {value.OD.axis && (
                                    <div>Axis: {value.OD.axis}</div>
                                  )}
                                  {!value.OD.sphere && !value.OD.cylinder && !value.OD.axis && <div>-</div>}
                                </div>
                              </div>
                              <div className="nested-eye">
                                <div className="exam-value-label">OS (Left)</div>
                                <div className="nested-values">
                                  {value.OS && value.OS.sphere && (
                                    <div>Sphere: {value.OS.sphere}</div>
                                  )}
                                  {value.OS && value.OS.cylinder && (
                                    <div>Cylinder: {value.OS.cylinder}</div>
                                  )}
                                  {value.OS && value.OS.axis && (
                                    <div>Axis: {value.OS.axis}</div>
                                  )}
                                  {!value.OS || (!value.OS.sphere && !value.OS.cylinder && !value.OS.axis) && <div>-</div>}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Handle fields with values array and other text (new structure)
                      if (value && typeof value === "object" && (value.OD || value.OS)) {
                        const renderEyeValue = (eyeValue) => {
                          // If it's an object with values and other properties
                          if (eyeValue && typeof eyeValue === "object" && 
                              (eyeValue.values || eyeValue.other)) {
                            const hasValues = eyeValue.values && eyeValue.values.length > 0;
                            const hasOther = eyeValue.other && eyeValue.other.trim() !== "";
                            
                            if (!hasValues && !hasOther) return "-";
                            
                            return (
                              <>
                                {hasValues && (
                                  <div className="exam-values-list">
                                    {eyeValue.values.join(", ")}
                                  </div>
                                )}
                                {hasOther && (
                                  <div className="exam-other-text">
                                    {hasValues && "• "}
                                    {eyeValue.other}
                                  </div>
                                )}
                              </>
                            );
                          }
                          // Simple string value
                          return eyeValue || "-";
                        };

                        return (
                          <div key={key} className="exam-card">
                            <div className="exam-field-label">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </div>
                            <div className="exam-values">
                              {value.OD && (
                                <div>
                                  <div className="exam-value-label">OD (Right)</div>
                                  <div className="exam-value">{renderEyeValue(value.OD)}</div>
                                </div>
                              )}
                              {value.OS && (
                                <div>
                                  <div className="exam-value-label">OS (Left)</div>
                                  <div className="exam-value">{renderEyeValue(value.OS)}</div>
                                </div>
                              )}
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
