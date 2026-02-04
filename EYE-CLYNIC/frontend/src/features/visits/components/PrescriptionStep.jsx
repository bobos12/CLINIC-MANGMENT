// ============================================
// PRESCRIPTION STEP COMPONENT
// Step 3: Prescription Details – OD and OS shown side by side
// ============================================

import { useEffect } from "react";
import {
  SPHERE_OPTIONS,
  CYLINDER_OPTIONS,
  AXIS_OPTIONS,
  ADD_OPTIONS
} from "../visits.constants";

const PrescriptionStep = ({ formData, setFormData, currentStep }) => {
  // Initialize newPrescription if undefined
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      eyeExam: {
        ...prev.eyeExam,
        oldGlasses: prev.eyeExam.oldGlasses || { OD: {}, OS: {} },
        refraction: prev.eyeExam.refraction || { OD: {}, OS: {} },
        newPrescription: prev.eyeExam.newPrescription || { OD: {}, OS: {} },
      },
    }));
  }, []);

  const handlePrescriptionChange = (field, eye, subfield, value) => {
    setFormData((prev) => ({
      ...prev,
      eyeExam: {
        ...prev.eyeExam,
        [field]: {
          ...prev.eyeExam[field],
          [eye]: {
            ...prev.eyeExam[field][eye],
            [subfield]: value,
          },
        },
      },
    }));
  };

  const copyFromOtherEye = (field, targetEye) => {
    const sourceEye = targetEye === "OD" ? "OS" : "OD";
    setFormData((prev) => ({
      ...prev,
      eyeExam: {
        ...prev.eyeExam,
        [field]: {
          ...prev.eyeExam[field],
          [targetEye]: { ...prev.eyeExam[field][sourceEye] },
        },
      },
    }));
  };

  const renderPrescriptionFields = (fieldName, label, eye, options = { sphere: SPHERE_OPTIONS, cylinder: CYLINDER_OPTIONS, axis: AXIS_OPTIONS }) => (
    <div className="prescription-section prescription" key={`${fieldName}-${eye}`}>
      <div className="prescription-section-header">
        <h4 className="prescription-section-title">{label}</h4>
        <button
          type="button"
          className="copy-eye-btn"
          onClick={() => copyFromOtherEye(fieldName, eye)}
          title={`Copy from ${eye === "OD" ? "Left" : "Right"} eye`}
        >
          Copy from {eye === "OD" ? "OS" : "OD"} →
        </button>
      </div>
      <div className="prescription-fields">
        {Object.keys(options).map((subfield) => (
          <div className="prescription-field" key={subfield}>
            <label className="prescription-field-label">{subfield.charAt(0).toUpperCase() + subfield.slice(1)}</label>
            <select
              value={formData.eyeExam[fieldName]?.[eye]?.[subfield] || ""}
              onChange={(e) =>
                handlePrescriptionChange(fieldName, eye, subfield, e.target.value)
              }
              className="prescription-select"
            >
              <option value="">Select...</option>
              {options[subfield].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  const EyePanel = ({ eye, label }) => (
    <div className={`eye-side eye-side-${eye.toLowerCase()}`}>
      <h3 className="eye-side-header">👁️ {eye} — {label}</h3>
  
      {renderPrescriptionFields("oldGlasses", "📝 Old Glasses", eye)}
      {renderPrescriptionFields("refraction", "✨ Refraction", eye)}
      {renderPrescriptionFields("newPrescription", "🆕 New Prescription", eye)}
  
      {/* ADD */}
      <div className="prescription-section prescription-new">
        <div className="prescription-section-header">
          <h4 className="prescription-section-title">Reading Addition (ADD)</h4>
          <button
            type="button"
            className="copy-eye-btn"
            onClick={() => copyFromOtherEye("refraction", eye)}
          >
            Copy ADD from {eye === "OD" ? "OS" : "OD"}
          </button>
        </div>
  
        <div className="prescription-fields add-only">
          <div className="prescription-field">
            <label className="prescription-field-label">Addition</label>
            <select
              value={formData.eyeExam.refraction?.[eye]?.ADD || ""}
              onChange={(e) =>
                handlePrescriptionChange("refraction", eye, "ADD", e.target.value)
              }
              className="prescription-select"
            >
              <option value="">Select…</option>
              {ADD_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
  

  return (
    <div className={`step-content ${currentStep === 4 ? "active" : ""}`}>
      <h2 className="step-title">👓 Prescription Details</h2>

      <div className="eye-panels">
        <EyePanel eye="OD" label="Right Eye" />
        <EyePanel eye="OS" label="Left Eye" />
      </div>

      {/* Prescription Summary – both eyes */}
      <div className="prescription-summary">
        <h4 className="prescription-summary-title">📊 Prescription Summary</h4>
        <div className="prescription-summary-grid">
          {["OD", "OS"].map((eye) => (
            <div className="prescription-summary-eye" key={eye}>
              <div className="prescription-summary-label">{eye} ({eye === "OD" ? "Right" : "Left"} Eye)</div>
              {["oldGlasses", "refraction", "newPrescription"].map((field) => (
                <div className="prescription-summary-field" key={field}>
                  {field.replace(/([A-Z])/g, " $1").trim()}:{" "}
                  {formData.eyeExam[field]?.[eye]?.sphere || "—"} /{" "}
                  {formData.eyeExam[field]?.[eye]?.cylinder || "—"} ×{" "}
                  {formData.eyeExam[field]?.[eye]?.axis || "—"}
                </div>
              ))}
              {formData.eyeExam.refraction?.[eye]?.ADD && (
                <div className="prescription-summary-field">
                  Addition: {formData.eyeExam.refraction[eye]?.ADD}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionStep;
