// ============================================
// CREATE VISIT COMPONENT
// Wizard form with steps for creating visits
// ============================================

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createVisit } from "./visits.api";
import { VISIT_FORM_STEPS } from "./visits.constants";
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
    followUpDate: "",
    eyeExam: {
      visualAcuity: { OD: "", OS: "" },
      oldGlasses: { 
        OD: { sphere: "", cylinder: "", axis: "" }, 
        OS: { sphere: "", cylinder: "", axis: "" } 
      },
      refraction: { 
        OD: { sphere: "", cylinder: "", axis: "" }, 
        OS: { sphere: "", cylinder: "", axis: "" } 
      },
      externalAppearance: { OD: "", OS: "" },
      ocularMotility: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      eyelid: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      conjunctiva: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      cornea: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      sclera: { OD: "", OS: "" },
      anteriorChamber: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      iris: { OD: "", OS: "" },
      pupil: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      lens: { OD: { values: [], other: "" }, OS: { values: [], other: "" } },
      posteriorSegment: { OD: "", OS: "" },
      others: { OD: "", OS: "" },
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
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!formData.patientId) {
      setError("Please select a patient");
      setSubmitting(false);
      return;
    }

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
