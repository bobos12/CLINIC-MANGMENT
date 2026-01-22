// ============================================
// PATIENT HISTORY STEP COMPONENT
// Step 2: Patient History (Complaints, Medical, Surgical)
// ============================================

import {
  COMPLAINT_OPTIONS,
  MEDICAL_HISTORY_OPTIONS,
  SURGICAL_HISTORY_OPTIONS,
} from "../visits.constants";

const PatientHistoryStep = ({ formData, setFormData, currentStep }) => {
  const handleComplaintChange = (complaint) => {
    setFormData((prev) => {
      const newComplaints = { ...prev.complaint };
      if (newComplaints[complaint] !== undefined) {
        delete newComplaints[complaint];
      } else {
        // Don't set default value, let it be empty
        newComplaints[complaint] = complaint === "Others" ? "" : "";
      }
      return {
        ...prev,
        complaint: newComplaints,
      };
    });
  };

  const handleComplaintValueChange = (complaint, value) => {
    setFormData((prev) => ({
      ...prev,
      complaint: {
        ...prev.complaint,
        [complaint]: value,
      },
    }));
  };

  const handleComplaintYearsChange = (complaint, years) => {
    setFormData((prev) => ({
      ...prev,
      complaint: {
        ...prev.complaint,
        [complaint]: years === "" ? "" : parseInt(years) || "",
      },
    }));
  };

  const handleMedicalHistoryChange = (condition) => {
    setFormData((prev) => {
      const newHistory = { ...prev.medicalHistory };
      if (newHistory[condition] !== undefined) {
        delete newHistory[condition];
      } else {
        // Don't set default value, let it be empty
        newHistory[condition] = condition === "Others" ? "" : "";
      }
      return {
        ...prev,
        medicalHistory: newHistory,
      };
    });
  };

  const handleMedicalHistoryYearsChange = (condition, years) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [condition]: years === "" ? "" : parseInt(years) || "",
      },
    }));
  };

  const handleMedicalHistoryOtherChange = (condition, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [condition]: value,
      },
    }));
  };

  const handleSurgicalHistoryChange = (procedure) => {
    setFormData((prev) => {
      const newHistory = { ...prev.surgicalHistory };
      if (newHistory[procedure] !== undefined) {
        delete newHistory[procedure];
      } else {
        // Don't set default value, let it be empty
        newHistory[procedure] = procedure === "Others" ? "" : "";
      }
      return {
        ...prev,
        surgicalHistory: newHistory,
      };
    });
  };

  const handleSurgicalHistoryYearsChange = (procedure, years) => {
    setFormData((prev) => ({
      ...prev,
      surgicalHistory: {
        ...prev.surgicalHistory,
        [procedure]: years === "" ? "" : parseInt(years) || "",
      },
    }));
  };

  const handleSurgicalHistoryOtherChange = (procedure, value) => {
    setFormData((prev) => ({
      ...prev,
      surgicalHistory: {
        ...prev.surgicalHistory,
        [procedure]: value,
      },
    }));
  };

  return (
    <div className={`step-content ${currentStep === 2 ? 'active' : ''}`}>
      <h2 className="step-title">📋 Patient History</h2>
      
      {/* Chief Complaint */}
      <div className="form-group">
        <label className="form-group-label">Chief Complaints</label>
        <div className="complaint-grid">
          {COMPLAINT_OPTIONS.map((complaint) => (
            <div key={complaint} className="complaint-item-wrapper">
              <button
                type="button"
                className={`complaint-btn ${
                  formData.complaint[complaint] !== undefined ? "selected" : ""
                }`}
                onClick={() => handleComplaintChange(complaint)}
              >
                {formData.complaint[complaint] !== undefined ? "✓ " : ""}
                {complaint}
              </button>
              {formData.complaint[complaint] !== undefined && (
                <div className="complaint-input-wrapper">
                  {complaint === "Others" ? (
                    <input
                      type="text"
                      placeholder="Specify complaint..."
                      value={formData.complaint[complaint] || ""}
                      onChange={(e) => handleComplaintValueChange(complaint, e.target.value)}
                      className="complaint-other-input"
                    />
                  ) : (
                    <div className="years-input">
                      <span className="years-label">Years:</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.complaint[complaint] === "" ? "" : formData.complaint[complaint] || ""}
                        onChange={(e) => handleComplaintYearsChange(complaint, e.target.value)}
                        className="years-number-input"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Medical History */}
      <div className="form-group">
        <label className="form-group-label">Medical History</label>
        <div className="history-grid">
          {MEDICAL_HISTORY_OPTIONS.map((condition) => (
            <div
              key={condition}
              className={`history-item ${
                formData.medicalHistory[condition] !== undefined ? "selected" : ""
              }`}
            >
              <input
                type="checkbox"
                id={`medical-${condition}`}
                checked={formData.medicalHistory[condition] !== undefined}
                onChange={() => handleMedicalHistoryChange(condition)}
                className="history-checkbox"
              />
              <label htmlFor={`medical-${condition}`} className="history-label">
                {condition}
              </label>
              {formData.medicalHistory[condition] !== undefined && (
                condition === "Others" ? (
                  <input
                    type="text"
                    placeholder="Specify condition..."
                    value={formData.medicalHistory[condition] || ""}
                    onChange={(e) => handleMedicalHistoryOtherChange(condition, e.target.value)}
                    className="history-other-input"
                  />
                ) : (
                  <div className="years-input">
                    <span className="years-label">Years:</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.medicalHistory[condition] === "" ? "" : formData.medicalHistory[condition] || ""}
                      onChange={(e) =>
                        handleMedicalHistoryYearsChange(condition, e.target.value)
                      }
                      className="years-number-input"
                    />
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Surgical History */}
      <div className="form-group">
        <label className="form-group-label">Surgical History</label>
        <div className="history-grid">
          {SURGICAL_HISTORY_OPTIONS.map((procedure) => (
            <div
              key={procedure}
              className={`history-item ${
                formData.surgicalHistory[procedure] !== undefined ? "selected" : ""
              }`}
            >
              <input
                type="checkbox"
                id={`surgical-${procedure}`}
                checked={formData.surgicalHistory[procedure] !== undefined}
                onChange={() => handleSurgicalHistoryChange(procedure)}
                className="history-checkbox"
              />
              <label htmlFor={`surgical-${procedure}`} className="history-label">
                {procedure}
              </label>
              {formData.surgicalHistory[procedure] !== undefined && (
                procedure === "Others" ? (
                  <input
                    type="text"
                    placeholder="Specify procedure..."
                    value={formData.surgicalHistory[procedure] || ""}
                    onChange={(e) => handleSurgicalHistoryOtherChange(procedure, e.target.value)}
                    className="history-other-input"
                  />
                ) : (
                  <div className="years-input">
                    <span className="years-label">Years:</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.surgicalHistory[procedure] === "" ? "" : formData.surgicalHistory[procedure] || ""}
                      onChange={(e) =>
                        handleSurgicalHistoryYearsChange(procedure, e.target.value)
                      }
                      className="years-number-input"
                    />
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryStep;
