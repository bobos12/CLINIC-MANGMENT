// ============================================
// EDIT VISIT COMPONENT
// Wizard form with steps for editing visits
// ============================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchVisitById, updateVisit } from "./visits.api";
import { VISIT_FORM_STEPS } from "./visits.constants";
import WizardForm from "../../components/ui/WizardForm/WizardForm";
import PatientInfoStep from "./components/PatientInfoStep";
import PatientHistoryStep from "./components/PatientHistoryStep";
import VisualAcuityStep from "./components/VisualAcuityStep";
import PrescriptionStep from "./components/PrescriptionStep";
import EyeExaminationStep from "./components/EyeExaminationStep";
import TreatmentStep from "./components/TreatmentStep";
import '../../styles/features/visits/_edit-visit.scss';

const EditVisit = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: "",
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);

  useEffect(() => {
    const loadVisit = async () => {
      try {
        const visit = await fetchVisitById(token, id);
        
        // Load patient info
        if (visit.patientId?._id) {
          try {
            const { fetchPatientById } = await import("../patients/patients.api");
            const patient = await fetchPatientById(token, visit.patientId._id);
            setPatientInfo(patient);
          } catch (err) {
            console.error("Failed to load patient info:", err);
          }
        }

        // Format follow-up date for input
        const followUpDate = visit.followUpDate
          ? new Date(visit.followUpDate).toISOString().split("T")[0]
          : "";

        // Normalize eye exam data to ensure correct structure
        const normalizeEyeData = (data) => {
          if (!data) return { values: [], other: "" };
          if (typeof data === "string") return { values: [], other: data };
          if (data.values || data.other) return { values: data.values || [], other: data.other || "" };
          return { values: [], other: "" };
        };

        const eyeExam = visit.eyeExam || {};
        
        setFormData({
          patientId: visit.patientId?._id || "",
          complaint: visit.complaint || {},
          medicalHistory: visit.medicalHistory || {},
          surgicalHistory: visit.surgicalHistory || {},
          recommendations: visit.recommendations || "",
          followUpDate: followUpDate,
          eyeExam: {
            visualAcuity: eyeExam.visualAcuity || { OD: "", OS: "" },
            oldGlasses: eyeExam.oldGlasses || { 
              OD: { sphere: "", cylinder: "", axis: "" }, 
              OS: { sphere: "", cylinder: "", axis: "" } 
            },
            refraction: eyeExam.refraction || { 
              OD: { sphere: "", cylinder: "", axis: "" }, 
              OS: { sphere: "", cylinder: "", axis: "" } 
            },
            externalAppearance: eyeExam.externalAppearance || { OD: "", OS: "" },
            ocularMotility: {
              OD: normalizeEyeData(eyeExam.ocularMotility?.OD),
              OS: normalizeEyeData(eyeExam.ocularMotility?.OS)
            },
            eyelid: {
              OD: normalizeEyeData(eyeExam.eyelid?.OD),
              OS: normalizeEyeData(eyeExam.eyelid?.OS)
            },
            conjunctiva: {
              OD: normalizeEyeData(eyeExam.conjunctiva?.OD),
              OS: normalizeEyeData(eyeExam.conjunctiva?.OS)
            },
            cornea: {
              OD: normalizeEyeData(eyeExam.cornea?.OD),
              OS: normalizeEyeData(eyeExam.cornea?.OS)
            },
            sclera: eyeExam.sclera || { OD: "", OS: "" },
            anteriorChamber: {
              OD: normalizeEyeData(eyeExam.anteriorChamber?.OD),
              OS: normalizeEyeData(eyeExam.anteriorChamber?.OS)
            },
            iris: eyeExam.iris || { OD: "", OS: "" },
            pupil: {
              OD: normalizeEyeData(eyeExam.pupil?.OD),
              OS: normalizeEyeData(eyeExam.pupil?.OS)
            },
            lens: {
              OD: normalizeEyeData(eyeExam.lens?.OD),
              OS: normalizeEyeData(eyeExam.lens?.OS)
            },
            posteriorSegment: eyeExam.posteriorSegment || { OD: "", OS: "" },
            others: eyeExam.others || { OD: "", OS: "" },
          },
        });
      } catch (err) {
        setError(err.message || "Failed to fetch visit");
      } finally {
        setLoading(false);
      }
    };

    if (token && id) loadVisit();
  }, [id, token]);

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
      await updateVisit(token, id, formData);
      setSuccess("Visit updated successfully!");
      setTimeout(() => navigate("/visits"), 2000);
    } catch (err) {
      setError(err.message || "Failed to update visit");
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="visit-form-page">
      <div className="visit-form-container">
        <div className="visit-form-card">
          <div className="form-header">
            <h1 className="form-title">✏️ Edit Patient Visit</h1>
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
            submitLabel={submitting ? "Updating..." : "Update Visit"}
            allowStepNavigation={true}
          >
            {renderStepContent}
          </WizardForm>
        </div>
      </div>
    </div>
  );
};

export default EditVisit;
