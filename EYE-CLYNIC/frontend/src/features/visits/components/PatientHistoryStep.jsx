// ============================================
// PATIENT HISTORY STEP COMPONENT
// Step 2: Patient History
// ============================================

import {
  COMPLAINT_OPTIONS,
  MEDICAL_HISTORY_OPTIONS,
  SURGICAL_HISTORY_OPTIONS,
  DURATION_LIMITS,
} from "../visits.constants";

const defaultHistoryObject = {
  years: "",
  months: "",
  days: "",
  value: "",
  eye: "Both", // now per item
};

const PatientHistoryStep = ({ formData, setFormData, currentStep }) => {

  // Toggle selection of an item
  const toggleItem = (section, key) => {
    setFormData((prev) => {
      const updated = { ...prev[section] };
      if (updated[key]) {
        delete updated[key]; // deselect
      } else {
        updated[key] = { ...defaultHistoryObject };
      }
      return {
        ...prev,
        [section]: updated,
      };
    });
  };

  // Clamp numeric value to backend limits
  const clampDuration = (field, value) => {
    const num = value === "" ? "" : Number(value);
    if (num === "") return "";
    const limits = DURATION_LIMITS[field];
    if (!limits) return num;
    let clamped = Math.max(Number(limits.min) ?? 0, num);
    if (limits.max != null) clamped = Math.min(limits.max, clamped);
    return clamped;
  };

  // Update years/months/days/eye (with validation)
  const handleDurationChange = (section, key, field, value) => {
    const isNumberField = ["years", "months", "days"].includes(field);
    const finalValue = isNumberField ? clampDuration(field, value) : value;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: {
          ...(prev[section][key] || {}),
          [field]: finalValue,
        },
      },
    }));
  };

  // Update "Others" text
  const handleTextChange = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: {
          ...prev[section][key],
          value,
        },
      },
    }));
  };

  // Render Years/Months/Days + Eye select per item (with backend-aligned limits)
  const renderDurationInputs = (section, key) => (
    <div className="duration-inputs">
      {["years", "months", "days"].map((field) => {
        const limits = DURATION_LIMITS[field];
        return (
          <div key={field} className="duration-item">
            <label className="duration-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="number"
              min={limits?.min ?? 0}
              max={limits?.max ?? undefined}
              placeholder="0"
              value={formData[section]?.[key]?.[field] ?? ""}
              onChange={(e) =>
                handleDurationChange(section, key, field, e.target.value)
              }
              className="duration-input"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        );
      })}

      {/* Eye selector per item */}
      <div className="duration-item">
        <label className="duration-label">Eye</label>
        <select
          value={formData[section]?.[key]?.eye || "Both"}
          onChange={(e) =>
            handleDurationChange(section, key, "eye", e.target.value)
          }
          className="duration-input"
        >
          {["Right", "Left", "Both"].map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );

  // Render individual complaint/condition/procedure item
  const renderItem = (section, item) => {
    const isSelected = !!formData[section]?.[item];
    const isOthers = item === "Others";

    return (
      <div
        key={item}
        className={`complaint-item-wrapper history-item ${isSelected ? "selected" : ""}`}
        onClick={() => toggleItem(section, item)}
      >
        <div className="complaint-btn">
          {isSelected && <span className="checkmark">✓</span>}
          {item}
        </div>

        {isSelected && (
          <div className="complaint-input-wrapper" onClick={(e) => e.stopPropagation()}>
            {isOthers && (
              <input
                type="text"
                placeholder={`Specify ${section === "complaint" ? "complaint" : section === "medicalHistory" ? "condition" : "procedure"}...`}
                value={formData[section][item]?.value || ""}
                onChange={(e) => handleTextChange(section, item, e.target.value)}
                className="complaint-other-input history-other-input"
              />
            )}

            {renderDurationInputs(section, item)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`step-content ${currentStep === 2 ? "active" : ""}`}>
      <h2 className="step-title">📋 Patient History</h2>

      {/* ================= Chief Complaint ================= */}
      <div className="form-group">
        <label className="form-group-label">Chief Complaint</label>
        <div className="complaint-grid">
          {COMPLAINT_OPTIONS.map((complaint) => renderItem("complaint", complaint))}
        </div>
      </div>

      {/* ================= Medical History ================= */}
      <div className="form-group">
        <label className="form-group-label">Medical History</label>
        <div className="history-grid">
          {MEDICAL_HISTORY_OPTIONS.map((condition) => renderItem("medicalHistory", condition))}
        </div>
      </div>

      {/* ================= Surgical History ================= */}
      <div className="form-group">
        <label className="form-group-label">Surgical History</label>
        <div className="history-grid">
          {SURGICAL_HISTORY_OPTIONS.map((procedure) => renderItem("surgicalHistory", procedure))}
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryStep;
