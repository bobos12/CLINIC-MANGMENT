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

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSubmit) {
      onSubmit();
    }
    return false;
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <form onSubmit={handleSubmit} className="wizard-form">
      <StepIndicator 
        steps={steps} 
        currentStep={currentStep}
        onStepClick={allowStepNavigation ? handleStepClick : undefined}
      />
      
      <div className="wizard-content">
        {children(currentStep)}
      </div>

      <div className="wizard-navigation">
        <div className="wizard-nav-buttons">
          {!isFirstStep && (
            <button
              type="button"
              className="btn-step btn-prev"
              onClick={handlePrevious}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </button>
          )}
          
          {!isLastStep ? (
            <button
              type="button"
              className="btn-step btn-next"
              onClick={handleNext}
            >
              Next
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="btn-step btn-submit"
              onClick={handleSubmit}
            >
              {submitLabel}
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        {onCancel && (
          <button
            type="button"
            className="btn-step btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default WizardForm;
