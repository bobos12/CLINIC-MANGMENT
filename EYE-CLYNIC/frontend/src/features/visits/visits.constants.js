// ============================================
// VISIT FORM CONSTANTS
// All options and values for visit forms
// ============================================

// Validation limits (must match backend Visit model)
export const DURATION_LIMITS = {
  years: { min: 0 },
  months: { min: 0, max: 12 },
  days: { min: 0, max: 31 },
};

export const IOP_LIMITS = { min: 0, max: 9000000000 }; // mmHg


/** Validate a duration object (years, months, days). Returns first error message or null. */
export function validateDuration(obj, label = "Duration") {
  if (!obj) return null;
  const { years, months, days } = obj;
  if (years !== "" && years != null) {
    const n = Number(years);
    if (Number.isNaN(n) || n < DURATION_LIMITS.years.min) return `${label}: years must be ≥ ${DURATION_LIMITS.years.min}.`;
  }
  if (months !== "" && months != null) {
    const n = Number(months);
    if (Number.isNaN(n) || n < DURATION_LIMITS.months.min || n > DURATION_LIMITS.months.max) {
      return `${label}: months must be ${DURATION_LIMITS.months.min}–${DURATION_LIMITS.months.max}.`;
    }
  }
  if (days !== "" && days != null) {
    const n = Number(days);
    if (Number.isNaN(n) || n < DURATION_LIMITS.days.min || n > DURATION_LIMITS.days.max) {
      return `${label}: days must be ${DURATION_LIMITS.days.min}–${DURATION_LIMITS.days.max}.`;
    }
  }
  return null;
}

/** Validate IOP value. Returns error message or null. */
export function validateIOP(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  if (Number.isNaN(n)) return "IOP must be a number.";
  if (n < IOP_LIMITS.min || n > IOP_LIMITS.max) return `IOP must be ${IOP_LIMITS.min}–${IOP_LIMITS.max} mmHg.`;
  return null;
}

export const COMPLAINT_OPTIONS = [
  "Decreased vision near",
  "Decreased vision far ",
  "Seeking glasses",
  "Redness",
  "Discomfort",
  "Floaters",
  "Flashes",
  "Squint",
  "Diplopia",
  "MASS",
  "Epiphora",
  "Others"
];

export const MEDICAL_HISTORY_OPTIONS = [
  "DM",
  "HTN",
  "Hypotension",
  "Neurological",
  "Thyroid disease",
  "Allergy",
  "Prostate",
  "Cardiac",
  "Liver",
  "Renal",
  "Others"
];

export const SURGICAL_HISTORY_OPTIONS = [
  "Cataract",
  "Refractive",
  "PPV",
  "IVI",
  "Laser",
  "Squint",
  "Plasty",
  "Others"
];

export const VISUAL_ACUITY_OPTIONS = [
  "0.1",
  "0.2",
  "0.3",
  "0.4",
  "0.5",
  "0.6",
  "0.7",
  "0.8",
  "0.9",
  "1.0",
  "1M",
  "2M",
  "3M",
  "4M",
  "5M",
  "CF",
  "HM",
  "PL",
  "NPL",
  "No Target"
];

export const OCULAR_MOTILITY_OPTIONS = [
  "Normal",
  "Limited up",
  "Limited down",
  "Limited Nasal",
  "Limited temporal"
];

export const EYELID_OPTIONS = [
  "Normal",
  "Ptosis",
  "Retraction",
  "Mass",
  "Anterior blephritis",
  "Posterior blephritis",
  "Others"
];

export const CONJUNCTIVA_OPTIONS = [
  "injected",
  "Pterygium",
  "phlyctenule",
  "Follicles",
  "Papillae",
  "Dryness",
  "Mucoid discharge",
  "Purulent discharge",
  "Others"
];

export const CORNEAL_OPTIONS = [
  "Clear",
  "Opacified",
  "Edema",
  "Hypothesia",
  "Ulcer",
  "PED",
  "Keratoconus",
  "FB",
  "Vascularization",
  "Abnormal sensation",
  "Others"
];

export const ANTERIOR_CHAMBER_OPTIONS = [
  "Normal",
  "Shallow",
  "Deep",
  "Cells",
  "Flare",
  "Hypopyon",
  "Hyphema",
  "Others"
];

export const PUPIL_OPTIONS = [
  "RRR",
  "RAPD",
  "Others"
];

export const LENS_OPTIONS = [
  "Clear",
  "Cataract",
  "Pseudophakia",
  "aphakia",
  "anterior capsular opacity",
  "PCO",
  "subluxated",
  "iol decentered",
  "hypermature cataract",
  "intumescent cataract",
  "microshopric cataract",
  "Others"
];

// Prescription options
export const SPHERE_OPTIONS = [
  "-30.00", "-29.75", "-29.50", "-29.25", "-29.00", "-28.75", "-28.50", "-28.25", "-28.00",
  "-27.75", "-27.50", "-27.25", "-27.00", "-26.75", "-26.50", "-26.25", "-26.00", "-25.75",
  "-25.50", "-25.25", "-25.00", "-24.75", "-24.50", "-24.25", "-24.00", "-23.75", "-23.50",
  "-23.25", "-23.00", "-22.75", "-22.50", "-22.25", "-22.00", "-21.75", "-21.50", "-21.25",
  "-21.00", "-20.75", "-20.50", "-20.25", "-20.00", "-19.75", "-19.50", "-19.25", "-19.00",
  "-18.75", "-18.50", "-18.25", "-18.00", "-17.75", "-17.50", "-17.25", "-17.00", "-16.75",
  "-16.50", "-16.25", "-16.00", "-15.75", "-15.50", "-15.25", "-15.00", "-14.75", "-14.50",
  "-14.25", "-14.00", "-13.75", "-13.50", "-13.25", "-13.00", "-12.75", "-12.50", "-12.25",
  "-12.00", "-11.75", "-11.50", "-11.25", "-11.00", "-10.75", "-10.50", "-10.25", "-10.00",
  "-9.75", "-9.50", "-9.25", "-9.00", "-8.75", "-8.50", "-8.25", "-8.00", "-7.75", "-7.50",
  "-7.25", "-7.00", "-6.75", "-6.50", "-6.25", "-6.00", "-5.75", "-5.50", "-5.25", "-5.00",
  "-4.75", "-4.50", "-4.25", "-4.00", "-3.75", "-3.50", "-3.25", "-3.00", "-2.75", "-2.50",
  "-2.25", "-2.00", "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25",
  "0.00",
  "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50",
  "+2.75", "+3.00", "+3.25", "+3.50", "+3.75", "+4.00", "+4.25", "+4.50", "+4.75", "+5.00",
  "+5.25", "+5.50", "+5.75", "+6.00", "+6.25", "+6.50", "+6.75", "+7.00", "+7.25", "+7.50",
  "+7.75", "+8.00", "+8.25", "+8.50", "+8.75", "+9.00", "+9.25", "+9.50", "+9.75", "+10.00",
  "+10.25", "+10.50", "+10.75", "+11.00", "+11.25", "+11.50", "+11.75", "+12.00", "+12.25",
  "+12.50", "+12.75", "+13.00", "+13.25", "+13.50", "+13.75", "+14.00", "+14.25", "+14.50",
  "+14.75", "+15.00"
];

export const CYLINDER_OPTIONS = [
  "+6.00", "+5.75", "+5.50", "+5.25", "+5.00", "+4.75", "+4.50", "+4.25", "+4.00",
  "+3.75", "+3.50", "+3.25", "+3.00", "+2.75", "+2.50", "+2.25", "+2.00", "+1.75",
  "+1.50", "+1.25", "+1.00", "+0.75", "+0.50", "+0.25",
  "0.00",
  "-0.25", "-0.50", "-0.75", "-1.00", "-1.25", "-1.50", "-1.75", "-2.00", "-2.25",
  "-2.50", "-2.75", "-3.00", "-3.25", "-3.50", "-3.75", "-4.00", "-4.25", "-4.50",
  "-4.75", "-5.00", "-5.25", "-5.50", "-5.75", "-6.00"
];


export const AXIS_OPTIONS = [
  "0", "5", "10", "15", "20", "25", "30", "35", "40", "45",
  "50", "55", "60", "65", "70", "75", "80", "85", "90", "95",
  "100", "105", "110", "115", "120", "125", "130", "135", "140", "145",
  "150", "155", "160", "165", "170", "175", "180"
];

export const ADD_OPTIONS = [
  "+0.5",
  "+0.75",
  "+1.00",
  "+1.25",
  "+1.50",
  "+1.75",
  "+2.00",
  "+2.25",
  "+2.50",
  "+2.75",
  "+3.00",
  "+3.25",
  "+3.50",
  "+3.75",
  "+4.00"
];

// ============================================
// EXTERNAL EYE EXAM OPTIONS
// ============================================

// External Appearance of the eye
export const EXTERNAL_APPEARANCE_OPTIONS = [
  "Normal",
  "Proptosis",
  "Enophthalmos",
  "Periorbital edema",
  "Periorbital ecchymosis",
  "Ptosis",
  "Eyelid retraction",
  "Mass / Lesion",
  "Congenital malformation",
  "Inflammation / Redness",
  "Wound",
  "Others"
];

// Sclera
export const SCLERA_OPTIONS = [
  "Normal",
  "Icteric (yellow)",
  "Bluish",
  "Scleral thinning",
  "Inflammation (scleritis / episcleritis)",
  "Nodules",
  "Pinguecula",
  "Staphyloma",
  "Others"
];

// Iris
export const IRIS_OPTIONS = [
  "Normal",
  "Heterochromia",
  "Atrophy",
  "Coloboma",
  "Neovascularization",
  "Inflammation (iritis / uveitis)",
  "Trauma",
  "PI",
  "Anterior synechiae",
  "Others"
];

// Posterior Segment / Fundus
export const POSTERIOR_SEGMENT_OPTIONS = [
  "Normal",
  "Optic disc edema / Papilledema",
  "Optic disc pallor",
  "Glaucomatous cupping",
  "Retinal hemorrhage",
  "Cotton wool spots",
  "Exudates",
  "Macular edema",
  "Retinal detachment / Tear",
  "NPDR",
  "NVD",
  "NVE",
  "Hypertensive retinopathy",
  "ARMD",
  "CNV",
  "Choroidal lesions",
  "Vitreous hemorrhage",
  "Others"
];


// Eye examination field options mapping
export const EYE_EXAM_FIELD_OPTIONS = {
  externalAppearance: EXTERNAL_APPEARANCE_OPTIONS,
  ocularMotility: OCULAR_MOTILITY_OPTIONS,
  eyelid: EYELID_OPTIONS,
  conjunctiva: CONJUNCTIVA_OPTIONS,
  cornea: CORNEAL_OPTIONS,
  anteriorChamber: ANTERIOR_CHAMBER_OPTIONS,
  pupil: PUPIL_OPTIONS,
  lens: LENS_OPTIONS,
  sclera: SCLERA_OPTIONS,
  iris: IRIS_OPTIONS,
  posteriorSegment: POSTERIOR_SEGMENT_OPTIONS,
};


// Wizard steps configuration
export const VISIT_FORM_STEPS = [
  {
    id: 1,
    title: "Patient Information",
    key: "patient",
    icon: "👤"
  },
  {
    id: 2,
    title: "Patient History",
    key: "history",
    icon: "📋"
  },
  {
    id: 3,
    title: "Visual Acuity",
    key: "visualAcuity",
    icon: "👁️"
  },
  {
    id: 4,
    title: "Prescription",
    key: "prescription",
    icon: "👓"
  },
  {
    id: 5,
    title: "Eye Examination",
    key: "examination",
    icon: "🔬"
  },
  {
    id: 6,
    title: "Treatment Plan",
    key: "treatment",
    icon: "💊"
  }
];
