// ============================================
// TREATMENT STEP COMPONENT
// Step 6: Treatment & Follow-up
// ============================================

import { DURATION_LIMITS, EYE_EXAM_FIELD_OPTIONS } from "../visits.constants";

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
  let clamped = Math.max(Number(limits.min ?? 0), num);
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
            <strong>Intraocular Pressure (IOP):</strong> OD:{" "}
            {formData.eyeExam.iop?.OD ? `${formData.eyeExam.iop.OD} mmHg` : "—"} | OS:{" "}
            {formData.eyeExam.iop?.OS ? `${formData.eyeExam.iop.OS} mmHg` : "—"}
          </div>

          <div className="summary-item">
            <strong>Refraction (New Prescription):</strong>
            <br />
            OD: {formData.eyeExam.refraction?.OD?.sphere || "—"} /{" "}
            {formData.eyeExam.refraction?.OD?.cylinder || "—"} ×{" "}
            {formData.eyeExam.refraction?.OD?.axis || "—"}
            {formData.eyeExam.refraction?.OD?.add && (
              <> Add: {formData.eyeExam.refraction.OD.add}</>
            )}
            <br />
            OS: {formData.eyeExam.refraction?.OS?.sphere || "—"} /{" "}
            {formData.eyeExam.refraction?.OS?.cylinder || "—"} ×{" "}
            {formData.eyeExam.refraction?.OS?.axis || "—"}
            {formData.eyeExam.refraction?.OS?.add && (
              <> Add: {formData.eyeExam.refraction.OS.add}</>
            )}
          </div>

          <div className="summary-item">
            <strong>Old Glasses:</strong>
            <br />
            OD: {formData.eyeExam.oldGlasses?.OD?.sphere || "—"} /{" "}
            {formData.eyeExam.oldGlasses?.OD?.cylinder || "—"} ×{" "}
            {formData.eyeExam.oldGlasses?.OD?.axis || "—"}
            {formData.eyeExam.oldGlasses?.OD?.add && (
              <> Add: {formData.eyeExam.oldGlasses.OD.add}</>
            )}
            <br />
            OS: {formData.eyeExam.oldGlasses?.OS?.sphere || "—"} /{" "}
            {formData.eyeExam.oldGlasses?.OS?.cylinder || "—"} ×{" "}
            {formData.eyeExam.oldGlasses?.OS?.axis || "—"}
            {formData.eyeExam.oldGlasses?.OS?.add && (
              <> Add: {formData.eyeExam.oldGlasses.OS.add}</>
            )}
          </div>

          <div className="summary-item">
            <strong>Eye Examination Findings:</strong>
            <div style={{ marginLeft: "1rem", fontSize: "0.95rem" }}>
              {["OD", "OS"].map((eye) => (
                <div key={eye}>
                  <strong>{eye === "OD" ? "Right Eye" : "Left Eye"}:</strong>
                  <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
                    {Object.keys(EYE_EXAM_FIELD_OPTIONS).map((field) => {
                      const values = formData.eyeExam[field]?.[eye]?.values || [];
                      const other = formData.eyeExam[field]?.[eye]?.other || "";
                      const fieldLabel = field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())
                        .trim();
                      return (
                        (values.length > 0 || other) && (
                          <li key={`${field}-${eye}`}>
                            <strong>{fieldLabel}:</strong>{" "}
                            {values.join(", ")}
                            {values.length > 0 && other && " | "}
                            {other}
                          </li>
                        )
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-item">
            <strong>Recommendations & Treatment:</strong>
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem",
                
                borderRadius: "4px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {formData.recommendations || "No recommendations provided"}
            </div>
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
