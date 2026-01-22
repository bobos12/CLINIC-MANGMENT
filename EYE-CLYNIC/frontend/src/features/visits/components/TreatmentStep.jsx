// ============================================
// TREATMENT STEP COMPONENT
// Step 4: Treatment & Follow-up
// ============================================

const TreatmentStep = ({ formData, setFormData, currentStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={`step-content ${currentStep === 6 ? 'active' : ''}`}>
      <h2 className="step-title">💊 Treatment Plan & Follow-up</h2>

      <div className="treatment-section">
        <label className="form-group-label">Recommendations & Treatment</label>
        <textarea
          id="recommendations"
          name="recommendations"
          value={formData.recommendations}
          onChange={handleChange}
          placeholder="Enter treatment recommendations, medications, instructions..."
          className="treatment-textarea"
          rows={8}
        ></textarea>
      </div>

      <div className="treatment-section">
        <label className="form-group-label">Follow-up Date</label>
        <input
          id="followUpDate"
          type="date"
          name="followUpDate"
          value={formData.followUpDate}
          onChange={handleChange}
          className="treatment-date-input"
        />
      </div>

      {/* Summary of Visit */}
      <div className="visit-summary">
        <h3 className="visit-summary-title">📋 Visit Summary</h3>
        <div className="visit-summary-content">
          <div className="summary-item">
            <strong>Chief Complaints:</strong>{" "}
            {Object.keys(formData.complaint).join(", ") || "None"}
          </div>
          <div className="summary-item">
            <strong>Medical History:</strong>{" "}
            {Object.keys(formData.medicalHistory)
              .map((k) => `${k} (${formData.medicalHistory[k]}y)`)
              .join(", ") || "None"}
          </div>
          <div className="summary-item">
            <strong>Visual Acuity:</strong> OD:{" "}
            {formData.eyeExam.visualAcuity.OD || "—"} | OS:{" "}
            {formData.eyeExam.visualAcuity.OS || "—"}
          </div>
          <div className="summary-item">
            <strong>New Prescription:</strong>
            <br />
            OD: {formData.eyeExam.refraction.OD?.sphere || "—"} /{" "}
            {formData.eyeExam.refraction.OD?.cylinder || "—"} ×{" "}
            {formData.eyeExam.refraction.OD?.axis || "—"}
            <br />
            OS: {formData.eyeExam.refraction.OS?.sphere || "—"} /{" "}
            {formData.eyeExam.refraction.OS?.cylinder || "—"} ×{" "}
            {formData.eyeExam.refraction.OS?.axis || "—"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentStep;
