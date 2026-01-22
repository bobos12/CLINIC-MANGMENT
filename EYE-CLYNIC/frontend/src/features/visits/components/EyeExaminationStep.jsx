import { useState } from "react";
import { EYE_EXAM_FIELD_OPTIONS } from "../visits.constants";

const EyeExaminationStep = ({ formData, setFormData, currentStep }) => {
  const [activeEye, setActiveEye] = useState("OD");

  // ===============================
  // Toggle option (multi-select)
  // ===============================
  const toggleEyeExamOption = (field, eye, option) => {
    setFormData((prev) => {
      const current =
        prev.eyeExam[field]?.[eye]?.values || [];

      const updatedValues = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];

      return {
        ...prev,
        eyeExam: {
          ...prev.eyeExam,
          [field]: {
            ...prev.eyeExam[field],
            [eye]: {
              ...prev.eyeExam[field]?.[eye],
              values: updatedValues,
            },
          },
        },
      };
    });
  };

  // ===============================
  // Update "Other" text
  // ===============================
  const updateOtherText = (field, eye, value) => {
    setFormData((prev) => ({
      ...prev,
      eyeExam: {
        ...prev.eyeExam,
        [field]: {
          ...prev.eyeExam[field],
          [eye]: {
            ...prev.eyeExam[field]?.[eye],
            other: value,
          },
        },
      },
    }));
  };

  return (
    <div className={`step-content ${currentStep === 5 ? "active" : ""}`}>
      <h2 className="step-title">🔬 Detailed Eye Examination</h2>

      {/* Eye Toggle */}
      <div className="eye-toggle-container">
        {["OD", "OS"].map((eye) => (
          <button
            key={eye}
            type="button"
            className={`eye-toggle-btn ${
              activeEye === eye ? "active" : ""
            }`}
            onClick={() => setActiveEye(eye)}
          >
            👁️ {eye} ({eye === "OD" ? "Right" : "Left"} Eye)
          </button>
        ))}
      </div>

      {/* OPTION FIELDS */}
      <div className="eye-exam-grid">
        {[
          { field: "ocularMotility", label: "Ocular Motility" },
          { field: "eyelid", label: "Eyelid" },
          { field: "conjunctiva", label: "Conjunctiva" },
          { field: "cornea", label: "Cornea" },
          { field: "anteriorChamber", label: "Anterior Chamber" },
          { field: "pupil", label: "Pupil" },
          { field: "lens", label: "Lens" },
        ].map(({ field, label }) => {
          const selected =
            formData.eyeExam[field]?.[activeEye]?.values || [];

          return (
            <div key={field} className="exam-field-card">
              <label className="exam-field-title">{label}</label>

              <div className="exam-options-grid">
                {EYE_EXAM_FIELD_OPTIONS[field].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`exam-option-btn ${
                      selected.includes(option) ? "selected" : ""
                    }`}
                    onClick={() =>
                      toggleEyeExamOption(field, activeEye, option)
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* OTHER FIELD */}
              <textarea
                className="exam-textarea"
                rows={2}
                placeholder="Other notes..."
                value={
                  formData.eyeExam[field]?.[activeEye]?.other || ""
                }
                onChange={(e) =>
                  updateOtherText(field, activeEye, e.target.value)
                }
              />
            </div>
          );
        })}

        {/* PURE TEXT FIELDS */}
        {[
          { field: "externalAppearance", label: "External Appearance" },
          { field: "sclera", label: "Sclera" },
          { field: "iris", label: "Iris" },
          { field: "posteriorSegment", label: "Posterior Segment" },
          { field: "others", label: "Others" },
        ].map(({ field, label }) => (
          <div key={field} className="exam-field-card">
            <label className="exam-field-title">{label}</label>
            <textarea
              className="exam-textarea"
              rows={3}
              value={
                formData.eyeExam[field]?.[activeEye] || ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  eyeExam: {
                    ...prev.eyeExam,
                    [field]: {
                      ...prev.eyeExam[field],
                      [activeEye]: e.target.value,
                    },
                  },
                }))
              }
              placeholder={`Notes for ${
                activeEye === "OD" ? "right" : "left"
              } eye...`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EyeExaminationStep;
