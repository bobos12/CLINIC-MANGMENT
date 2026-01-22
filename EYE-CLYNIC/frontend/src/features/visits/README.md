# Visit Form Architecture

## Overview
The visit form has been refactored into a professional wizard form with reusable components.

## Structure

### Constants (`visits.constants.js`)
All form options and values are centralized:
- Complaint options
- Medical/Surgical history options
- Eye examination field options
- Prescription options (sphere, cylinder, axis)
- Wizard steps configuration

### Components

#### Reusable UI Components (`components/ui/`)
1. **StepIndicator** - Visual step progress indicator
2. **WizardForm** - Multi-step form wrapper with navigation
3. **PatientSelector** - Patient search and selection with inline creation

#### Step Components (`features/visits/components/`)
1. **PatientInfoStep** - Step 1: Patient selection
2. **PatientHistoryStep** - Step 2: Complaints, medical & surgical history
3. **EyeExaminationStep** - Step 3: Complete eye examination
4. **TreatmentStep** - Step 4: Recommendations and follow-up

### Main Component (`CreateVisit.jsx`)
- Uses WizardForm wrapper
- Manages form state
- Handles submission
- Renders appropriate step component based on current step

## Wizard Steps

1. **Patient Information** - Select or create patient
2. **Patient History** - Chief complaints, medical history, surgical history
3. **Eye Examination** - Visual acuity, refraction, all eye exam fields
4. **Treatment & Follow-up** - Recommendations and follow-up date

## Usage

The form automatically handles:
- Step navigation (Previous/Next)
- Step validation
- Form submission
- Error handling
- Success feedback

## Benefits

✅ **Reusable Components** - StepIndicator, WizardForm, PatientSelector can be used anywhere
✅ **Separation of Concerns** - Each step is a separate component
✅ **Centralized Constants** - All options in one place
✅ **Professional UX** - Smooth wizard flow with visual progress
✅ **Easy Maintenance** - Changes to one step don't affect others
