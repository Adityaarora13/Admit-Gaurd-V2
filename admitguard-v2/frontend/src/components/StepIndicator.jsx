import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                index < currentStep
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : index === currentStep
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {index < currentStep ? (
                <Check className="w-6 h-6" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            <span
              className={`absolute -bottom-7 text-xs font-medium whitespace-nowrap ${
                index <= currentStep ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
