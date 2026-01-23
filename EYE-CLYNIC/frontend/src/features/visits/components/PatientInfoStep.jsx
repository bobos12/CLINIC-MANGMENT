import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPatients, fetchPatientById } from "../../patients/patients.api";
import "../../../styles/features/visits/_patient-info-step.scss";

const PatientInfoStep = ({ formData, setFormData, token, currentStep }) => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // ===============================
  // Load all patients
  // ===============================
  useEffect(() => {
    const loadPatients = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const data = await fetchPatients(token);
        setPatients(data);
        setFilteredPatients(data);
      } catch (err) {
        console.error("Failed to load patients:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [token]);

  // ===============================
  // Load selected patient info
  // ===============================
  useEffect(() => {
    const loadSelectedPatient = async () => {
      if (!formData.patientId || !token) {
        setSelectedPatientInfo(null);
        return;
      }

      try {
        const patient = await fetchPatientById(token, formData.patientId);
        setSelectedPatientInfo(patient);
        setSearchTerm(patient.name); // Set searchTerm to display pre-selected patient's name
      } catch (err) {
        console.error("Failed to load selected patient:", err);
        // Optionally, set an error state here to inform the user
      }
    };
    loadSelectedPatient();
  }, [formData.patientId, token]);

  // ===============================
  // Filter patients
  // ===============================
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const term = searchTerm.toLowerCase();

    setFilteredPatients(
      patients.filter((p) =>
        p.name?.toLowerCase().includes(term) ||
        p.code?.toLowerCase().includes(term) ||
        p.phone?.includes(searchTerm)
      )
    );
  }, [searchTerm, patients]);

  // ===============================
  // Outside click (close dropdown)
  // ===============================
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // ===============================
  // Position dropdown (scroll + resize)
  // ===============================
  useEffect(() => {
    if (!showDropdown || !searchInputRef.current || formData.patientId) return;

    const updatePosition = () => {
      const rect = searchInputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showDropdown, formData.patientId]);

  // ===============================
  // Handlers
  // ===============================
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handlePatientSelect = (patient) => {
    setFormData((prev) => ({
      ...prev,
      patientId: patient._id,
    }));

    setSearchTerm("");
    setShowDropdown(false);
    setSelectedPatientInfo(patient);
  };

  const handleReset = () => {
    setFormData((prev) => ({
      ...prev,
      patientId: "",
    }));

    setSearchTerm("");
    setSelectedPatientInfo(null);
    setShowDropdown(false);
  };

  const handleCreateNew = () => {
    navigate("/patients/create", {
      state: { returnTo: "/visits/create" },
    });
  };

  // ===============================
  // Render
  // ===============================
  return (
    <div className={`step-content ${currentStep === 1 ? "active" : ""}`}>
      <h2 className="step-title">👤 Patient Information</h2>

      <div className="patient-section">
        <div className="form-group">
          <div className="patient-selection-header">
            <label className="form-group-label">Select Patient</label>

            {formData.patientId && (
              <button type="button" className="btn-reset" onClick={handleReset}>
                Reset
              </button>
            )}
          </div>

          <div className="patient-selection">
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="          Search patient by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(true)}
              disabled={!!formData.patientId}
            />

            {showDropdown && !formData.patientId && (
              <div
                ref={dropdownRef}
                className="patient-dropdown"
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                }}
              >
                {loading ? (
                  <div className="patient-not-found">
                    <p>Loading patients...</p>
                  </div>
                ) : filteredPatients.length ? (
                  <>
                    <button
                      type="button"
                      className="patient-option create-new"
                      onClick={handleCreateNew}
                    >
                      + Create New Patient
                    </button>

                    {filteredPatients.map((patient) => (
                      <button
                        key={patient._id}
                        type="button"
                        className="patient-option"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <div className="patient-name">{patient.name}</div>
                        <div className="patient-code">
                          Code: {patient.code || "N/A"} • Phone:{" "}
                          {patient.phone || "N/A"}
                        </div>
                      </button>
                    ))}

                    <div className="patient-dropdown-footer">
                      {filteredPatients.length} patient(s) found
                    </div>
                  </>
                ) : (
                  <div className="patient-not-found">
                    <p>No patients found</p>
                    <button
                      type="button"
                      className="btn-create-new"
                      onClick={handleCreateNew}
                    >
                      Create New Patient
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedPatientInfo && (
          <div className="selected-patient">
            <div className="selected-patient-content">
              <div>
                <strong>Selected Patient:</strong>{" "}
                {selectedPatientInfo.name}
                {selectedPatientInfo.code &&
                  ` • Code: ${selectedPatientInfo.code}`}
                {selectedPatientInfo.phone &&
                  ` • Phone: ${selectedPatientInfo.phone}`}
                {selectedPatientInfo.age &&
                  ` • Age: ${selectedPatientInfo.age}`}
                {selectedPatientInfo.gender &&
                  ` • ${selectedPatientInfo.gender}`}
              </div>

              <button
                type="button"
                className="btn-reset btn-reset-inline"
                onClick={handleReset}
              >
                ✕ Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientInfoStep;
