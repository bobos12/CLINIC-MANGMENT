# Create Visit Feature - Complete Structure & Documentation

## 📋 Overview

The Create Visit feature is a **multi-step wizard form** that allows doctors to create comprehensive patient visit records. It uses a step-by-step approach to collect patient information, medical history, eye examination data, prescriptions, and treatment plans.

---

## 🏗️ Architecture Overview

```
CreateVisit.jsx (Main Container)
    ├── WizardForm.jsx (Reusable Wizard Wrapper)
    │   ├── StepIndicator (Shows progress)
    │   └── Navigation Buttons (Next/Previous/Submit)
    │
    └── Step Components (6 Steps)
        ├── Step 1: PatientInfoStep.jsx
        ├── Step 2: PatientHistoryStep.jsx
        ├── Step 3: VisualAcuityStep.jsx
        ├── Step 4: PrescriptionStep.jsx
        ├── Step 5: EyeExaminationStep.jsx
        └── Step 6: TreatmentStep.jsx
```

---

## 📁 File Structure

### **Main Component**
- **Location**: `frontend/src/features/visits/CreateVisit.jsx`
- **SCSS**: `frontend/src/styles/features/visits/_create-visit.scss`

### **Wizard Component**
- **Location**: `frontend/src/components/ui/WizardForm/WizardForm.jsx`
- **SCSS**: `frontend/src/components/ui/WizardForm/WizardForm.scss`

### **Step Components** (All in `frontend/src/features/visits/components/`)
1. **PatientInfoStep.jsx** → `_patient-info-step.scss`
2. **PatientHistoryStep.jsx** → `_patient-history-step.scss`
3. **VisualAcuityStep.jsx** → `_visual-acuity-step.scss`
4. **PrescriptionStep.jsx** → `_prescription-step.scss`
5. **EyeExaminationStep.jsx** → `_eye-examination-step.scss`
6. **TreatmentStep.jsx** → `_treatment-step.scss`

### **Supporting Files**
- **Constants**: `frontend/src/features/visits/visits.constants.js`
- **API**: `frontend/src/features/visits/visits.api.js`

---

## 🔄 Data Flow

### **1. State Management**
The main `CreateVisit` component maintains a single `formData` state object that is passed down to all step components:

```javascript
const [formData, setFormData] = useState({
  patientId: "",
  complaint: {},
  medicalHistory: {},
  surgicalHistory: {},
  recommendations: "",
  followUpDate: "",
  eyeExam: {
    visualAcuity: { OD: "", OS: "" },
    oldGlasses: { OD: { sphere: "", cylinder: "", axis: "" }, OS: {...} },
    refraction: { OD: { sphere: "", cylinder: "", axis: "" }, OS: {...} },
    // ... other eye exam fields
  },
});
```

### **2. Props Flow**
Each step component receives:
- `formData` - Current form state
- `setFormData` - Function to update form state
- `currentStep` - Current step number (for conditional rendering)
- `token` - Auth token (only PatientInfoStep needs it for API calls)

### **3. Submission Flow**
1. User completes all 6 steps
2. Clicks "Complete Visit" on final step
3. `handleSubmit` validates `patientId` is present
4. Calls `createVisit(token, formData)` API
5. On success, redirects to `/visits` page

---

## 📝 Step-by-Step Breakdown

### **STEP 1: Patient Information** 
**Component**: `PatientInfoStep.jsx`  
**SCSS**: `_patient-info-step.scss`

**Purpose**: Select or create a patient for the visit

**Features**:
- Searchable patient dropdown (by name, code, or phone)
- Real-time filtering
- Click outside to close dropdown
- "Create New Patient" option
- Selected patient display with details
- Reset button to clear selection

**Key Functions**:
- `loadPatients()` - Fetches all patients on mount
- `handlePatientSelect()` - Updates `formData.patientId`
- `handleReset()` - Clears patient selection
- `handleCreateNew()` - Navigates to patient creation

**Data Structure**:
```javascript
formData.patientId = "patient_id_string"
```

---

### **STEP 2: Patient History**
**Component**: `PatientHistoryStep.jsx`  
**SCSS**: `_patient-history-step.scss`

**Purpose**: Record patient complaints, medical history, and surgical history

**Features**:
- **Chief Complaints**: Toggle buttons with "Years" input for each
- **Medical History**: Checkboxes with "Years" input or text input for "Others"
- **Surgical History**: Checkboxes with "Years" input or text input for "Others"

**Key Functions**:
- `handleComplaintChange()` - Toggles complaint selection
- `handleComplaintYearsChange()` - Updates years for complaint
- `handleMedicalHistoryChange()` - Toggles medical condition
- `handleSurgicalHistoryChange()` - Toggles surgical procedure

**Data Structure**:
```javascript
formData.complaint = {
  "Decreased vision": 5,  // years
  "Others": "Custom complaint text"
}
formData.medicalHistory = {
  "DM": 10,  // years
  "Others": "Custom condition"
}
formData.surgicalHistory = {
  "Cataract": 2,  // years
  "Others": "Custom procedure"
}
```

**Constants Used**:
- `COMPLAINT_OPTIONS`
- `MEDICAL_HISTORY_OPTIONS`
- `SURGICAL_HISTORY_OPTIONS`

---

### **STEP 3: Visual Acuity**
**Component**: `VisualAcuityStep.jsx`  
**SCSS**: `_visual-acuity-step.scss`

**Purpose**: Record visual acuity measurements for both eyes

**Features**:
- Eye toggle buttons (OD/OS - Right/Left)
- Grid of visual acuity options (0.1 to 1.0, 2M-5M, CF, HM, PL, NPL)
- Summary display showing both eyes' values

**Key Functions**:
- `handleEyeExamChange()` - Updates visual acuity for selected eye
- `setActiveEye()` - Switches between OD and OS

**Data Structure**:
```javascript
formData.eyeExam.visualAcuity = {
  OD: "0.8",  // Right eye
  OS: "0.9"   // Left eye
}
```

**Constants Used**:
- `VISUAL_ACUITY_OPTIONS`

---

### **STEP 4: Prescription**
**Component**: `PrescriptionStep.jsx`  
**SCSS**: `_prescription-step.scss`

**Purpose**: Record old glasses prescription and new refraction

**Features**:
- Eye toggle (OD/OS)
- **Old Glasses Section**: Sphere, Cylinder, Axis dropdowns
- **New Refraction Section**: Sphere, Cylinder, Axis dropdowns
- "Copy to Other Eye" button for each section
- Prescription summary showing both eyes

**Key Functions**:
- `handlePrescriptionChange()` - Updates prescription field
- `copyToOtherEye()` - Copies current eye's data to opposite eye

**Data Structure**:
```javascript
formData.eyeExam.oldGlasses = {
  OD: { sphere: "-2.00", cylinder: "-0.50", axis: "180" },
  OS: { sphere: "-2.25", cylinder: "-0.75", axis: "175" }
}
formData.eyeExam.refraction = {
  OD: { sphere: "-2.25", cylinder: "-0.50", axis: "180" },
  OS: { sphere: "-2.50", cylinder: "-0.75", axis: "175" }
}
```

**Constants Used**:
- `SPHERE_OPTIONS` (range: -30.00 to +15.00)
- `CYLINDER_OPTIONS` (range: -6.00 to +6.00)
- `AXIS_OPTIONS` (0 to 180 degrees)

---

### **STEP 5: Eye Examination**
**Component**: `EyeExaminationStep.jsx`  
**SCSS**: `_eye-examination-step.scss`

**Purpose**: Detailed eye examination findings

**Features**:
- Eye toggle (OD/OS)
- **Option-based fields** (button grids):
  - Ocular Motility
  - Eyelid
  - Conjunctiva
  - Cornea
  - Anterior Chamber
  - Pupil
  - Lens
- **Text-based fields** (textareas):
  - External Appearance
  - Sclera
  - Iris
  - Posterior Segment

**Key Functions**:
- `handleEyeExamChange()` - Updates examination field for selected eye

**Data Structure**:
```javascript
formData.eyeExam = {
  ocularMotility: { OD: "Normal", OS: "Limited up" },
  eyelid: { OD: "Normal", OS: "Ptosis" },
  conjunctiva: { OD: "injected", OS: "Normal" },
  cornea: { OD: "Clear", OS: "Clear" },
  anteriorChamber: { OD: "Normal", OS: "Normal" },
  pupil: { OD: "RRR", OS: "RRR" },
  lens: { OD: "Clear", OS: "Cataract" },
  externalAppearance: { OD: "Normal", OS: "Normal" },
  sclera: { OD: "White", OS: "White" },
  iris: { OD: "Brown", OS: "Brown" },
  posteriorSegment: { OD: "Normal", OS: "Notes..." }
}
```

**Constants Used**:
- `EYE_EXAM_FIELD_OPTIONS` (object mapping fields to their options)

---

### **STEP 6: Treatment Plan**
**Component**: `TreatmentStep.jsx`  
**SCSS**: `_treatment-step.scss`

**Purpose**: Final treatment recommendations and follow-up

**Features**:
- Large textarea for recommendations/treatment
- Date picker for follow-up date
- Visit summary showing key data from previous steps

**Key Functions**:
- `handleChange()` - Updates recommendations or followUpDate

**Data Structure**:
```javascript
formData.recommendations = "Prescribe new glasses. Follow up in 3 months."
formData.followUpDate = "2024-03-15"
```

---

## 🎨 SCSS File Structure

### **Main Styles**
**File**: `_create-visit.scss`
- Styles for the main container (`.visit-form-page`, `.visit-form-container`, `.visit-form-card`)
- Form header styles
- Alert styles (error/success)

### **Wizard Styles**
**File**: `WizardForm.scss` (in `components/ui/WizardForm/`)
- Wizard form layout
- Navigation button styles
- Step indicator styles

### **Step-Specific Styles**

1. **`_patient-info-step.scss`**
   - Patient search input
   - Dropdown styles (`.patient-dropdown`, `.patient-option`)
   - Selected patient display
   - Reset button

2. **`_patient-history-step.scss`**
   - Complaint grid (`.complaint-grid`, `.complaint-btn`)
   - History grid (`.history-grid`, `.history-item`)
   - Years input styling
   - "Others" text input styling

3. **`_visual-acuity-step.scss`**
   - Eye toggle buttons (`.eye-toggle-container`, `.eye-toggle-btn`)
   - Visual acuity grid (`.visual-acuity-grid`, `.visual-acuity-option`)
   - Summary display (`.visual-acuity-summary`)

4. **`_prescription-step.scss`**
   - Prescription sections (`.prescription-section`)
   - Field layouts (`.prescription-fields`, `.prescription-field`)
   - Select dropdowns (`.prescription-select`)
   - Copy button (`.copy-eye-btn`)
   - Summary grid (`.prescription-summary`)

5. **`_eye-examination-step.scss`**
   - Exam grid layout (`.eye-exam-grid`)
   - Field cards (`.exam-field-card`)
   - Option buttons (`.exam-option-btn`)
   - Textarea styling (`.exam-textarea`)

6. **`_treatment-step.scss`**
   - Treatment sections (`.treatment-section`)
   - Textarea styling (`.treatment-textarea`)
   - Date input (`.treatment-date-input`)
   - Visit summary (`.visit-summary`)

### **Shared Base Styles**
**File**: `_visit-form-base.scss`
- Common form elements
- Step content wrapper (`.step-content`)
- Form group styles (`.form-group`, `.form-group-label`)

---

## 🔧 WizardForm Component

**Location**: `frontend/src/components/ui/WizardForm/WizardForm.jsx`

**Props**:
- `steps` - Array of step configurations from `VISIT_FORM_STEPS`
- `initialStep` - Starting step (default: 1)
- `onSubmit` - Callback when form is submitted
- `onCancel` - Callback for cancel button
- `children` - Render function: `(currentStep) => JSX`
- `submitLabel` - Text for submit button
- `allowStepNavigation` - Whether users can click steps to navigate

**Features**:
- Step indicator showing all steps
- Previous/Next navigation
- Submit button on last step
- Cancel button
- Step click navigation (if enabled)

**How it works**:
1. Maintains `currentStep` state
2. Renders `StepIndicator` component
3. Calls `children(currentStep)` to render current step content
4. Handles navigation between steps
5. On last step, shows submit button instead of Next

---

## 📊 Constants File

**Location**: `frontend/src/features/visits/visits.constants.js`

**Contains**:
- `COMPLAINT_OPTIONS` - Array of complaint types
- `MEDICAL_HISTORY_OPTIONS` - Medical conditions
- `SURGICAL_HISTORY_OPTIONS` - Surgical procedures
- `VISUAL_ACUITY_OPTIONS` - Visual acuity values
- `SPHERE_OPTIONS` - Prescription sphere values (-30.00 to +15.00)
- `CYLINDER_OPTIONS` - Prescription cylinder values (-6.00 to +6.00)
- `AXIS_OPTIONS` - Prescription axis values (0-180)
- `EYE_EXAM_FIELD_OPTIONS` - Object mapping exam fields to their options
- `VISIT_FORM_STEPS` - Array of step configurations for wizard

---

## 🌐 API Integration

**Location**: `frontend/src/features/visits/visits.api.js`

**Functions**:
- `createVisit(token, visitData)` - Creates new visit
- `fetchVisits(token, filters)` - Gets all visits
- `fetchVisitById(token, id)` - Gets single visit
- `updateVisit(token, id, visitData)` - Updates visit
- `deleteVisit(token, id)` - Deletes visit

**Usage in CreateVisit**:
```javascript
await createVisit(token, formData);
```

The `formData` object is sent directly to the backend API endpoint `POST /api/visits`.

---

## 🔄 Component Lifecycle

1. **Mount**: 
   - `CreateVisit` initializes `formData` state
   - If `patientId` in location state, loads patient info
   - `PatientInfoStep` loads all patients

2. **Step Navigation**:
   - User clicks Next/Previous or clicks step indicator
   - `WizardForm` updates `currentStep`
   - `renderStepContent()` returns appropriate step component
   - Step component receives updated `formData` and `currentStep`

3. **Data Updates**:
   - User interacts with step component
   - Step calls `setFormData()` with updated data
   - All steps receive updated `formData` (React re-renders)

4. **Submission**:
   - User clicks "Complete Visit" on step 6
   - Validates `patientId` exists
   - Calls `createVisit()` API
   - Shows success/error message
   - Redirects to visits list on success

---

## 🎯 Key Design Patterns

1. **Lifted State**: All form data in parent component
2. **Controlled Components**: All inputs controlled by `formData`
3. **Render Props**: `WizardForm` uses render function pattern
4. **Composition**: Step components are composed into wizard
5. **Separation of Concerns**: Each step is a separate component
6. **Reusability**: `WizardForm` can be used for other multi-step forms

---

## 📱 User Experience Flow

1. User navigates to `/visits/create`
2. **Step 1**: Searches and selects patient
3. **Step 2**: Fills in complaints and history
4. **Step 3**: Records visual acuity for both eyes
5. **Step 4**: Enters old glasses and new prescription
6. **Step 5**: Completes detailed eye examination
7. **Step 6**: Adds treatment recommendations and reviews summary
8. Clicks "Complete Visit"
9. Redirected to visits list with success message

---

## 🛠️ Customization Points

- **Add new step**: Add to `VISIT_FORM_STEPS` array and create new step component
- **Modify step order**: Reorder `VISIT_FORM_STEPS` array
- **Add form fields**: Update `formData` initial state and step component
- **Change styling**: Modify corresponding SCSS file
- **Add validation**: Add validation logic in `handleSubmit` or step components

---

This structure provides a clean, maintainable, and scalable approach to creating complex multi-step forms in React.
