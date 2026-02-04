import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchVisitById, updateVisit } from "./visits.api";
import { VISIT_FORM_STEPS, validateDuration, validateIOP } from "./visits.constants";
import WizardForm from "../../components/ui/WizardForm/WizardForm";
import PatientInfoStep from "./components/PatientInfoStep";
import PatientHistoryStep from "./components/PatientHistoryStep";
import VisualAcuityStep from "./components/VisualAcuityStep";
import PrescriptionStep from "./components/PrescriptionStep";
import EyeExaminationStep from "./components/EyeExaminationStep";
import TreatmentStep from "./components/TreatmentStep";
import '../../styles/features/visits/_edit-visit.scss';

const defaultHistoryItem = { years: "", months: "", days: "", value: "", eye: "Both" };

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
    followUp: { years: "", months: "", days: "" },
    followUpDate: "",
    eyeExam: {
      visualAcuity: { OD: "", OS: "" },
      oldGlasses: { OD: { sphere: "", cylinder: "", axis: "" }, OS: { sphere: "", cylinder: "", axis: "" } },
      refraction: { OD: { sphere: "", cylinder: "", axis: "", ADD: "" }, OS: { sphere: "", cylinder: "", axis: "", ADD: "" } },
      newPrescription: { OD: { sphere: "", cylinder: "", axis: "" }, OS: { sphere: "", cylinder: "", axis: "" } },
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

        const followUpDate = visit.followUpDate ? new Date(visit.followUpDate).toISOString().split("T")[0] : "";
        const followUp = visit.followUp
          ? {
              years: visit.followUp.years ?? "",
              months: visit.followUp.months ?? "",
              days: visit.followUp.days ?? "",
            }
          : { years: "", months: "", days: "" };

        // Normalize eye exam
        const normalizeEyeData = (data) => {
          if (!data) return { values: [], other: "" };
          if (typeof data === "string") return { values: [], other: data };
          if (data.values || data.other) return { values: data.values || [], other: data.other || "" };
          return { values: [], other: "" };
        };

        // Ensure each history item has { years, months, days, value, eye }
        const normalizeHistory = (historyObj) => {
          if (!historyObj) return {};
          const normalized = {};
          Object.keys(historyObj).forEach((key) => {
            normalized[key] = { ...defaultHistoryItem, ...historyObj[key] };
          });
          return normalized;
        };

        setFormData({
          patientId: visit.patientId?._id || "",
          complaint: normalizeHistory(visit.complaint),
          medicalHistory: normalizeHistory(visit.medicalHistory),
          surgicalHistory: normalizeHistory(visit.surgicalHistory),
          recommendations: visit.recommendations || "",
          followUp,
          followUpDate,
          eyeExam: {
            visualAcuity: visit.eyeExam?.visualAcuity || { OD: "", OS: "" },
            oldGlasses: visit.eyeExam?.oldGlasses || { OD: { sphere: "", cylinder: "", axis: "" }, OS: { sphere: "", cylinder: "", axis: "" } },
            refraction: {
              OD: { sphere: "", cylinder: "", axis: "", ADD: "", ...visit.eyeExam?.refraction?.OD },
              OS: { sphere: "", cylinder: "", axis: "", ADD: "", ...visit.eyeExam?.refraction?.OS },
            },
            newPrescription: visit.eyeExam?.newPrescription || { OD: { sphere: "", cylinder: "", axis: "" }, OS: { sphere: "", cylinder: "", axis: "" } },
            externalAppearance: { OD: normalizeEyeData(visit.eyeExam?.externalAppearance?.OD), OS: normalizeEyeData(visit.eyeExam?.externalAppearance?.OS) },
            ocularMotility: { OD: normalizeEyeData(visit.eyeExam?.ocularMotility?.OD), OS: normalizeEyeData(visit.eyeExam?.ocularMotility?.OS) },
            eyelid: { OD: normalizeEyeData(visit.eyeExam?.eyelid?.OD), OS: normalizeEyeData(visit.eyeExam?.eyelid?.OS) },
            conjunctiva: { OD: normalizeEyeData(visit.eyeExam?.conjunctiva?.OD), OS: normalizeEyeData(visit.eyeExam?.conjunctiva?.OS) },
            cornea: { OD: normalizeEyeData(visit.eyeExam?.cornea?.OD), OS: normalizeEyeData(visit.eyeExam?.cornea?.OS) },
            sclera: { OD: normalizeEyeData(visit.eyeExam?.sclera?.OD), OS: normalizeEyeData(visit.eyeExam?.sclera?.OS) },
            anteriorChamber: { OD: normalizeEyeData(visit.eyeExam?.anteriorChamber?.OD), OS: normalizeEyeData(visit.eyeExam?.anteriorChamber?.OS) },
            iris: { OD: normalizeEyeData(visit.eyeExam?.iris?.OD), OS: normalizeEyeData(visit.eyeExam?.iris?.OS) },
            pupil: { OD: normalizeEyeData(visit.eyeExam?.pupil?.OD), OS: normalizeEyeData(visit.eyeExam?.pupil?.OS) },
            lens: { OD: normalizeEyeData(visit.eyeExam?.lens?.OD), OS: normalizeEyeData(visit.eyeExam?.lens?.OS) },
            posteriorSegment: { OD: normalizeEyeData(visit.eyeExam?.posteriorSegment?.OD), OS: normalizeEyeData(visit.eyeExam?.posteriorSegment?.OS) },
            others: visit.eyeExam?.others || { OD: "", OS: "" },
            iop: visit.eyeExam?.iop || { OD: "", OS: "" },
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
      await updateVisit(token, id, formData);
      setSuccess("Visit updated successfully!");
      setTimeout(() => navigate("/visits"), 2000);
    } catch (err) {
      setError(err.message || "Failed to update visit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/visits");

  const renderStepContent = (currentStep) => {
    switch (currentStep) {
      case 1:
        return <PatientInfoStep formData={formData} setFormData={setFormData} token={token} currentStep={currentStep} />;
      case 2:
        return <PatientHistoryStep formData={formData} setFormData={setFormData} currentStep={currentStep} />;
      case 3:
        return <VisualAcuityStep formData={formData} setFormData={setFormData} currentStep={currentStep} />;
      case 4:
        return <PrescriptionStep formData={formData} setFormData={setFormData} currentStep={currentStep} />;
      case 5:
        return <EyeExaminationStep formData={formData} setFormData={setFormData} currentStep={currentStep} />;
      case 6:
        return <TreatmentStep formData={formData} setFormData={setFormData} currentStep={currentStep} />;
      default:
        return null;
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="visit-form-page">
      <div className="visit-form-container">
        <div className="visit-form-card">
          <div className="form-header">
            <h1 className="form-title">✏️ Edit Patient Visit</h1>
            {patientInfo && <p className="form-subtitle">Patient: <strong>{patientInfo.name}</strong> • ID: {patientInfo.code || formData.patientId}</p>}
          </div>

          {error && <div className="form-alert alert-error">{error}</div>}
          {success && <div className="form-alert alert-success">{success}</div>}

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
