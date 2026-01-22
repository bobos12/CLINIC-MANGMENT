// ============================================
// STEP INDICATOR COMPONENT
// Reusable wizard step indicator
// ============================================

import './StepIndicator.scss';

const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isClickable = onStepClick && (isCompleted || isActive);

        return (
          <button
            key={step.id || stepNumber}
            type="button"
            className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isClickable ? 'clickable' : ''}`}
            onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
            disabled={!isClickable}
          >
            {step.icon && <div className="step-icon">{step.icon}</div>}
            <div className="step-label">{step.title}</div>
          </button>
        );
      })}
    </div>
  );
};

export default StepIndicator;
