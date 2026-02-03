// ============================================
// VISUAL ACUITY STEP COMPONENT
// Step 2: Visual Acuity Test – OD and OS shown side by side
// ============================================

import { VISUAL_ACUITY_OPTIONS } from "../visits.constants";

const VisualAcuityStep = ({ formData, setFormData, currentStep }) => {
  const handleEyeExamChange = (field, eye, value) => {
    setFormData((prev) => ({
      ...prev,
      eyeExam: {
        ...prev.eyeExam,
        [field]: {
          ...prev.eyeExam[field],
          [eye]: value,
        },
      },
    }));
  };

  const EyePanel = ({ eye, label }) => (
    <div className={`eye-side eye-side-${eye.toLowerCase()}`}>
      <h3 className="eye-side-header">👁️ {eye} ({label})</h3>
      <label className="visual-acuity-label">
        Select Visual Acuity
      </label>
      <div className="visual-acuity-grid">
        {VISUAL_ACUITY_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={`visual-acuity-option ${
              formData.eyeExam.visualAcuity[eye] === option ? "selected" : ""
            }`}
            onClick={() => handleEyeExamChange("visualAcuity", eye, option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="acuity-value acuity-value-inline">
        {formData.eyeExam.visualAcuity[eye] || "—"}
      </div>
    </div>
  );

  return (
    <div className={`step-content ${currentStep === 3 ? "active" : ""}`}>
      <h2 className="step-title">👁️ Visual Acuity Test</h2>

      <div className="eye-panels">
        <EyePanel eye="OD" label="Right Eye" />
        <EyePanel eye="OS" label="Left Eye" />
      </div>
    </div>
  );
};

export default VisualAcuityStep;
