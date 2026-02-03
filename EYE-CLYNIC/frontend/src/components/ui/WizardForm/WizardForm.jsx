// ============================================
// WIZARD FORM COMPONENT
// Reusable multi-step form wrapper
// ============================================

import { useState } from "react";
import StepIndicator from "../StepIndicator/StepIndicator";
import './WizardForm.scss';

const WizardForm = ({ 
  steps, 
  initialStep = 1,
  onSubmit,
  onCancel,
  children,
  submitLabel = "Submit",
  allowStepNavigation = false
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    if (allowStepNavigation) {
      setCurrentStep(stepNumber);
    }
  };

  // Prevent form submit on Enter key – submit only when "Complete Visit" is clicked
  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleCompleteClick = () => {
    if (onSubmit) onSubmit();
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <form onSubmit={handleFormSubmit} className="wizard-form">
      <StepIndicator 
        steps={steps} 
        currentStep={currentStep}
        onStepClick={allowStepNavigation ? handleStepClick : undefined}
      />
      
      <div className="wizard-content">
        {children(currentStep)}
      </div>

      <div className="wizard-navigation">
        {onCancel && (
          <button
            type="button"
            className="btn-step btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}

        <div className="wizard-nav-buttons">
          {!isFirstStep && (
            <button
              type="button"
              className="btn-step btn-prev"
              onClick={handlePrevious}
            >
              ← Previous
            </button>
          )}

          {!isLastStep ? (
            <button
              type="button"
              className="btn-step btn-next"
              onClick={handleNext}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="btn-step btn-submit"
              onClick={handleCompleteClick}
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default WizardForm;
