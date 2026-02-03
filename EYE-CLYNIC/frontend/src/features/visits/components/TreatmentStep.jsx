// ============================================
// TREATMENT STEP COMPONENT
// Step 6: Treatment & Follow-up
// ============================================

import { DURATION_LIMITS } from "../visits.constants";

const defaultFollowUpObject = {
  years: "",
  months: "",
  days: "",
};

const clampDuration = (field, value) => {
  const num = value === "" ? "" : Number(value);
  if (num === "") return "";
  const limits = DURATION_LIMITS[field];
  if (!limits) return num;
  let clamped = Math.max(Number(limits.min) ?? 0, num);
  if (limits.max != null) clamped = Math.min(limits.max, clamped);
  return clamped;
};

const TreatmentStep = ({ formData, setFormData, currentStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update follow-up duration (with validation to match backend)
  const handleFollowUpChange = (field, value) => {
    const finalValue = clampDuration(field, value);
    setFormData((prev) => ({
      ...prev,
      followUp: {
        ...(prev.followUp || defaultFollowUpObject),
        [field]: finalValue,
      },
    }));
  };

  // Render years/months/days inputs with backend-aligned limits
  const renderFollowUpInputs = () => (
    <div className="duration-inputs">
      {["years", "months", "days"].map((field) => {
        const limits = DURATION_LIMITS[field];
        return (
          <div key={field} className="duration-item">
            <label className="duration-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {limits?.max != null && (
                <span className="duration-hint"> (max {limits.max})</span>
              )}
            </label>
            <input
              type="number"
              min={limits?.min ?? 0}
              max={limits?.max ?? undefined}
              placeholder="0"
              value={formData.followUp?.[field] ?? ""}
              onChange={(e) => handleFollowUpChange(field, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={`step-content ${currentStep === 6 ? "active" : ""}`}>
      <h2 className="step-title">💊 Treatment Plan & Follow-up</h2>

      {/* ================= Recommendations / Treatment ================= */}
      <div className="treatment-section">
        <label className="form-group-label">Recommendations & Treatment</label>
        <textarea
          id="recommendations"
          name="recommendations"
          value={formData.recommendations}
          onChange={handleChange}
          placeholder="Enter treatment recommendations, medications, instructions..."
          rows={8}
        ></textarea>
      </div>

      {/* ================= Follow-up Duration ================= */}
      <div className="treatment-section">
        <label className="form-group-label">Follow-up Period</label>
        {renderFollowUpInputs()}
      </div>

      {/* ================= Summary of Visit ================= */}
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
              .map(
                (k) =>
                  `${k} (${formData.medicalHistory[k]?.years || 0}y ${formData.medicalHistory[k]?.months || 0}m ${formData.medicalHistory[k]?.days || 0}d)`
              )
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
          <div className="summary-item">
            <strong>Follow-up Period:</strong>{" "}
            {formData.followUp
              ? `${formData.followUp.years || 0}y ${formData.followUp.months || 0}m ${formData.followUp.days || 0}d`
              : "Not set"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentStep;
