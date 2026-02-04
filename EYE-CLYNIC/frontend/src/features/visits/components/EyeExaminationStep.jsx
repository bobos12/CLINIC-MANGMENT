import { useState } from "react";
import { EYE_EXAM_FIELD_OPTIONS, IOP_LIMITS } from "../visits.constants";

const EYE_EXAM_FIELDS = [
  "externalAppearance",
  "ocularMotility",
  "eyelid",
  "conjunctiva",
  "cornea",
  "sclera",
  "anteriorChamber",
  "iris",
  "pupil",
  "lens",
  "posteriorSegment",
];

const formatFieldLabel = (field) =>
  field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();

const EyePanel = ({ eye, label, formData, setFormData, EYE_EXAM_FIELDS, renderOptionField }) => (
  <div className={`eye-side eye-side-${eye.toLowerCase()}`}>
    <h3 className="eye-side-header">👁️ {eye} ({label})</h3>

    <div className="exam-field-card">
      <label className="exam-field-title">
        IOP (mmHg)
      </label>
      <input
        type="number"
        min={IOP_LIMITS.min}
        max={IOP_LIMITS.max}
        step="1"
        className="exam-input"
        placeholder="mmHg"
        value={formData.eyeExam.iop?.[eye] ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "") {
            setFormData((prev) => ({
              ...prev,
              eyeExam: {
                ...prev.eyeExam,
                iop: { ...prev.eyeExam.iop, [eye]: "" },
              },
            }));
            return;
          }
          const num = Number(value);
          if (Number.isNaN(num)) return;
          const clamped = Math.max(IOP_LIMITS.min, Math.min(IOP_LIMITS.max, num));
          setFormData((prev) => ({
            ...prev,
            eyeExam: {
              ...prev.eyeExam,
              iop: { ...prev.eyeExam.iop, [eye]: clamped },
            },
          }));
        }}
      />
    </div>

    <div className="eye-exam-grid">
      {EYE_EXAM_FIELDS.map((field) =>
        renderOptionField(field, formatFieldLabel(field), eye)
      )}
    </div>
  </div>
);

const EyeExaminationStep = ({ formData, setFormData, currentStep }) => {
  const [expandedFields, setExpandedFields] = useState({}); // key: `${field}-${eye}`

  const toggleField = (field, eye) => {
    const key = `${field}-${eye}`;
    setExpandedFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleEyeExamOption = (field, eye, option) => {
    setFormData((prev) => {
      const current = prev.eyeExam[field]?.[eye]?.values || [];
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

  const renderOptionField = (field, label, eye) => {
    const selected = formData.eyeExam[field]?.[eye]?.values || [];
    const key = `${field}-${eye}`;
    const isOpen = expandedFields[key];

    return (
      <div key={key} className="exam-field-card">
        <div
          className="exam-field-header"
          onClick={() => toggleField(field, eye)}
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          {label} {isOpen ? "▲" : "▼"}
        </div>
        {isOpen && (
          <div className="exam-field-content">
            <div className="exam-options-grid">
              {EYE_EXAM_FIELD_OPTIONS[field].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`exam-option-btn ${selected.includes(option) ? "selected" : ""}`}
                  onClick={() => toggleEyeExamOption(field, eye, option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <textarea
              className="exam-textarea"
              rows={2}
              placeholder="Other notes..."
              value={formData.eyeExam[field]?.[eye]?.other || ""}
              onChange={(e) => updateOtherText(field, eye, e.target.value)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`step-content ${currentStep === 5 ? "active" : ""}`}>
      <h2 className="step-title">🔬 Detailed Eye Examination</h2>

      <div className="eye-panels">
        <EyePanel eye="OD" label="Right Eye" formData={formData} setFormData={setFormData} EYE_EXAM_FIELDS={EYE_EXAM_FIELDS} renderOptionField={renderOptionField} />
        <EyePanel eye="OS" label="Left Eye" formData={formData} setFormData={setFormData} EYE_EXAM_FIELDS={EYE_EXAM_FIELDS} renderOptionField={renderOptionField} />
      </div>
    </div>
  );
};

export default EyeExaminationStep;
