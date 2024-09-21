import React from "react";
import './Stepper.css';

const statuses = {
    ORDERED: 'ORDERED',
    COOK_READY: 'COOK_READY',
    ACCEPT: 'ACCEPT',
    PICKED_UP: 'PICKED_UP',
    DELIVERED: 'DELIVERED',
};

const Stepper = ({ currentStatus }) => {
    const steps = Object.keys(statuses);
    const currentStepIndex = steps.indexOf(currentStatus);

    const getStatusClass = (stepStatus, index) => {
        if (index < currentStepIndex) return 'completed';
        if (index === currentStepIndex) return 'completed';
        if (index === currentStepIndex + 1) return 'active';
        return '';
    };

    return (
        <div className="stepper-wrapper">
            {steps.map((stepStatus, index) => (
                <div key={stepStatus} className={`stepper-item ${getStatusClass(stepStatus, index)}`}>
                    <div className="step-counter">{index + 1}</div>
                    <div className="step-name">{stepStatus.replaceAll("_", " ")}</div>
                </div>
            ))}
        </div>
    );
};

export default Stepper;
