import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {/* Desktop View */}
      <div className="hidden sm:flex items-center justify-between">
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

      {/* Mobile View - Mini dot progress bar */}
      <div className="sm:hidden flex items-center justify-center gap-2">
        {steps.map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentStep ? 'w-8 bg-indigo-600' : 
              index < currentStep ? 'w-4 bg-indigo-400' : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
