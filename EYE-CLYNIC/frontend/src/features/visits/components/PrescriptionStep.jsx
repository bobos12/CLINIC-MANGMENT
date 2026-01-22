// ============================================
// PRESCRIPTION STEP COMPONENT
// Step 3: Prescription Details
// ============================================

import { useState } from "react";
import {
  SPHERE_OPTIONS,
  CYLINDER_OPTIONS,
  AXIS_OPTIONS,
} from "../visits.constants";

const PrescriptionStep = ({ formData, setFormData, currentStep }) => {
  const [activeEye, setActiveEye] = useState("OD");

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

  const copyToOtherEye = (field) => {
    const sourceEye = activeEye;
    const targetEye = activeEye === "OD" ? "OS" : "OD";
    
    setFormData((prev) => ({
      ...prev,
      eyeExam: {
        ...prev.eyeExam,
        [field]: {
          ...prev.eyeExam[field],
          [targetEye]: prev.eyeExam[field][sourceEye],
        },
      },
    }));
  };

  return (
    <div className={`step-content ${currentStep === 4 ? 'active' : ''}`}>
      <h2 className="step-title">
        👓 Prescription Details
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

      {/* Old Glasses */}
      <div className="prescription-section prescription-old">
        <div className="prescription-section-header">
          <h3 className="prescription-section-title">
            📝 Old Glasses - {activeEye === "OD" ? "Right Eye" : "Left Eye"}
          </h3>
          <button
            type="button"
            className="copy-eye-btn"
            onClick={() => copyToOtherEye("oldGlasses")}
          >
            Copy to {activeEye === "OD" ? "Left" : "Right"} →
          </button>
        </div>
        <div className="prescription-fields">
          <div className="prescription-field">
            <label className="prescription-field-label">Sphere</label>
            <select
              value={formData.eyeExam.oldGlasses[activeEye]?.sphere || ""}
              onChange={(e) =>
                handlePrescriptionChange("oldGlasses", activeEye, "sphere", e.target.value)
              }
              className="prescription-select"
            >
              <option value="">Select...</option>
              {SPHERE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="prescription-field">
            <label className="prescription-field-label">Cylinder</label>
            <select
              value={formData.eyeExam.oldGlasses[activeEye]?.cylinder || ""}
              onChange={(e) =>
                handlePrescriptionChange("oldGlasses", activeEye, "cylinder", e.target.value)
              }
              className="prescription-select"
            >
              <option value="">Select...</option>
              {CYLINDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="prescription-field">
            <label className="prescription-field-label">Axis</label>
            <select
              value={formData.eyeExam.oldGlasses[activeEye]?.axis || ""}
              onChange={(e) =>
                handlePrescriptionChange("oldGlasses", activeEye, "axis", e.target.value)
              }
              className="prescription-select"
            >
              <option value="">Select...</option>
              {AXIS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* New Refraction */}
      <div className="prescription-section prescription-new">
        <div className="prescription-section-header">
          <h3 className="prescription-section-title">
            ✨ New Refraction - {activeEye === "OD" ? "Right Eye" : "Left Eye"}
          </h3>
          <button
            type="button"
            className="copy-eye-btn"
            onClick={() => copyToOtherEye("refraction")}
          >
            Copy to {activeEye === "OD" ? "Left" : "Right"} →
          </button>
        </div>
        <div className="prescription-fields">
          <div className="prescription-field">
            <label className="prescription-field-label">Sphere</label>
            <select
              value={formData.eyeExam.refraction[activeEye]?.sphere || ""}
              onChange={(e) =>
                handlePrescriptionChange("refraction", activeEye, "sphere", e.target.value)
              }
              className="prescription-select"
            >
              <option value="">Select...</option>
              {SPHERE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="prescription-field">
            <label className="prescription-field-label">Cylinder</label>
            <select
              value={formData.eyeExam.refraction[activeEye]?.cylinder || ""}
              onChange={(e) =>
                handlePrescriptionChange("refraction", activeEye, "cylinder", e.target.value)
              }
              className="prescription-select"
            >
              <option value="">Select...</option>
              {CYLINDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="prescription-field">
            <label className="prescription-field-label">Axis</label>
            <select
              value={formData.eyeExam.refraction[activeEye]?.axis || ""}
              onChange={(e) =>
                handlePrescriptionChange("refraction", activeEye, "axis", e.target.value)
              }
              className="prescription-select"
            >
              <option value="">Select...</option>
              {AXIS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary View */}
      <div className="prescription-summary">
        <h4 className="prescription-summary-title">📊 Prescription Summary</h4>
        <div className="prescription-summary-grid">
          <div className="prescription-summary-eye">
            <div className="prescription-summary-label">OD (Right Eye)</div>
            <div className="prescription-summary-old">
              Old: {formData.eyeExam.oldGlasses.OD?.sphere || "—"} /{" "}
              {formData.eyeExam.oldGlasses.OD?.cylinder || "—"} ×{" "}
              {formData.eyeExam.oldGlasses.OD?.axis || "—"}
            </div>
            <div className="prescription-summary-new">
              New: {formData.eyeExam.refraction.OD?.sphere || "—"} /{" "}
              {formData.eyeExam.refraction.OD?.cylinder || "—"} ×{" "}
              {formData.eyeExam.refraction.OD?.axis || "—"}
            </div>
          </div>
          <div className="prescription-summary-eye">
            <div className="prescription-summary-label">OS (Left Eye)</div>
            <div className="prescription-summary-old">
              Old: {formData.eyeExam.oldGlasses.OS?.sphere || "—"} /{" "}
              {formData.eyeExam.oldGlasses.OS?.cylinder || "—"} ×{" "}
              {formData.eyeExam.oldGlasses.OS?.axis || "—"}
            </div>
            <div className="prescription-summary-new">
              New: {formData.eyeExam.refraction.OS?.sphere || "—"} /{" "}
              {formData.eyeExam.refraction.OS?.cylinder || "—"} ×{" "}
              {formData.eyeExam.refraction.OS?.axis || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionStep;
