// ============================================
// CREATE VISIT COMPONENT
// Wizard form with steps for creating visits
// ============================================

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createVisit } from "./visits.api";
import { VISIT_FORM_STEPS, validateDuration, validateIOP } from "./visits.constants";
import WizardForm from "../../components/ui/WizardForm/WizardForm";
import PatientInfoStep from "./components/PatientInfoStep";
import PatientHistoryStep from "./components/PatientHistoryStep";
import VisualAcuityStep from "./components/VisualAcuityStep";
import PrescriptionStep from "./components/PrescriptionStep";
import EyeExaminationStep from "./components/EyeExaminationStep";
import TreatmentStep from "./components/TreatmentStep";
import '../../styles/features/visits/_create-visit.scss';

const CreateVisit = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get patientId from location state if available
  const patientIdFromState = location.state?.patientId;
  const patientIdFromQuery = new URLSearchParams(location.search).get("patientId");

  const [formData, setFormData] = useState({
    patientId: patientIdFromState || patientIdFromQuery || "",
    complaint: {},
    medicalHistory: {},
    surgicalHistory: {},
    recommendations: "",
    followUp: { years: "", months: "", days: "" },
    followUpDate: "",
    eyeExam: {
      visualAcuity: { OD: "", OS: "" },
      oldGlasses: {
        OD: { sphere: "", cylinder: "", axis: "" },
        OS: { sphere: "", cylinder: "", axis: "" }
      },
      refraction: {
        OD: { sphere: "", cylinder: "", axis: "", ADD: "" },
        OS: { sphere: "", cylinder: "", axis: "", ADD: "" }
      },
      newPrescription: {
        OD: { sphere: "", cylinder: "", axis: "" },
        OS: { sphere: "", cylinder: "", axis: "" }
      },
      externalAppearance: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      ocularMotility: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      eyelid: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      conjunctiva: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      cornea: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      sclera: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      anteriorChamber: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      iris: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      pupil: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      lens: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      posteriorSegment: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      others: { OD: "", OS: "" },
      iop: { OD: "", OS: "" },
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load patient info if patientId is provided
  const [patientInfo, setPatientInfo] = useState(null);
  
  useEffect(() => {
    const loadPatientInfo = async () => {
      if (formData.patientId && token) {
        try {
          const { fetchPatientById } = await import("../patients/patients.api");
          const patient = await fetchPatientById(token, formData.patientId);
          setPatientInfo(patient);
        } catch (err) {
          console.error("Failed to load patient info:", err);
        }
      }
    };
    loadPatientInfo();
  }, [formData.patientId, token]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!formData.patientId) {
      setError("Please select a patient");
      return;
    }

    // Frontend validation (align with backend limits)
    for (const [key, item] of Object.entries(formData.complaint || {})) {
      const err = validateDuration(item, `Complaint "${key}"`);
      if (err) {
        setError(err);
        return;
      }
    }
    for (const [key, item] of Object.entries(formData.medicalHistory || {})) {
      const err = validateDuration(item, `Medical history "${key}"`);
      if (err) {
        setError(err);
        return;
      }
    }
    for (const [key, item] of Object.entries(formData.surgicalHistory || {})) {
      const err = validateDuration(item, `Surgical history "${key}"`);
      if (err) {
        setError(err);
        return;
      }
    }
    const followUpErr = validateDuration(formData.followUp, "Follow-up");
    if (followUpErr) {
      setError(followUpErr);
      return;
    }
    const iopOd = formData.eyeExam?.iop?.OD;
    const iopOs = formData.eyeExam?.iop?.OS;
    if (iopOd !== "" && iopOd != null) {
      const err = validateIOP(iopOd);
      if (err) {
        setError(`OD (right eye) IOP: ${err}`);
        return;
      }
    }
    if (iopOs !== "" && iopOs != null) {
      const err = validateIOP(iopOs);
      if (err) {
        setError(`OS (left eye) IOP: ${err}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await createVisit(token, formData);
      setSuccess("Visit created successfully!");
      setTimeout(() => navigate("/visits"), 2000);
    } catch (err) {
      setError(err.message || "Failed to create visit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/visits");
  };

  const renderStepContent = (currentStep) => {
    switch (currentStep) {
      case 1:
        return (
          <PatientInfoStep
            formData={formData}
            setFormData={setFormData}
            token={token}
            currentStep={currentStep}
          />
        );
      case 2:
        return (
          <PatientHistoryStep
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
          />
        );
      case 3:
        return (
          <VisualAcuityStep
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
          />
        );
      case 4:
        return (
          <PrescriptionStep
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
          />
        );
      case 5:
        return (
          <EyeExaminationStep
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
          />
        );
      case 6:
        return (
          <TreatmentStep
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="visit-form-page">
      <div className="visit-form-container">
        <div className="visit-form-card">
          <div className="form-header">
            <h1 className="form-title"> New Patient Visit</h1>
            {patientInfo && (
              <p className="form-subtitle">
                Patient: <strong>{patientInfo.name}</strong> • ID: {patientInfo.code || formData.patientId}
              </p>
            )}
          </div>

          {error && (
            <div className="form-alert alert-error">
              {error}
            </div>
          )}
          {success && (
            <div className="form-alert alert-success">
              {success}
            </div>
          )}

          <WizardForm
            steps={VISIT_FORM_STEPS}
            initialStep={1}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel={submitting ? "Creating..." : "Complete Visit"}
            allowStepNavigation={true}
          >
            {renderStepContent}
          </WizardForm>
        </div>
      </div>
    </div>
  );
};

export default CreateVisit;
