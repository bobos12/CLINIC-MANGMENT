// ============================================
// VISUAL ACUITY STEP COMPONENT
// Step 2: Visual Acuity Test
// ============================================

import { useState } from "react";
import { VISUAL_ACUITY_OPTIONS } from "../visits.constants";

const VisualAcuityStep = ({ formData, setFormData, currentStep }) => {
  const [activeEye, setActiveEye] = useState("OD");

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

  return (
    <div className={`step-content ${currentStep === 3 ? 'active' : ''}`}>
      <h2 className="step-title">
        👁️ Visual Acuity Test
      </h2>

      {/* Eye Toggle */}
      <div className="eye-toggle-container">
        <button
          type="button"
          className={`eye-toggle-btn ${activeEye === "OD" ? "active" : ""}`}
          onClick={() => setActiveEye("OD")}
        >
          👁️ OD (Right Eye)
        </button>
        <button
          type="button"
          className={`eye-toggle-btn ${activeEye === "OS" ? "active" : ""}`}
          onClick={() => setActiveEye("OS")}
        >
          👁️ OS (Left Eye)
        </button>
      </div>

      {/* Visual Acuity Selection */}
      <div className="visual-acuity-container">
        <label className="visual-acuity-label">
          Select Visual Acuity for {activeEye === "OD" ? "Right" : "Left"} Eye
        </label>
        <div className="visual-acuity-grid">
          {VISUAL_ACUITY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`visual-acuity-option ${
                formData.eyeExam.visualAcuity[activeEye] === option ? "selected" : ""
              }`}
              onClick={() => handleEyeExamChange("visualAcuity", activeEye, option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Current Selection Display */}
        <div className="visual-acuity-summary">
          <div className="acuity-display">
            <div className="acuity-label">OD (Right)</div>
            <div className="acuity-value">
              {formData.eyeExam.visualAcuity.OD || "—"}
            </div>
          </div>
          <div className="acuity-separator">•</div>
          <div className="acuity-display">
            <div className="acuity-label">OS (Left)</div>
            <div className="acuity-value">
              {formData.eyeExam.visualAcuity.OS || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualAcuityStep;
