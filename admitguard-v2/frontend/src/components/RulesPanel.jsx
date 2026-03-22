import React, { useState } from 'react';
import { Info, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import { STEP_RULES } from '../config/formConfig';

const RulesPanel = ({ currentStep }) => {
  const [isOpen, setIsOpen] = useState(true);
  const rules = STEP_RULES[currentStep] || [];

  if (rules.length === 0) return null;

  return (
    <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'}`}>
      <div className="flex items-stretch shadow-2xl rounded-l-3xl overflow-hidden border border-gray-100 bg-white">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 bg-indigo-600 text-white flex flex-col items-center justify-center gap-4 py-6 hover:bg-indigo-700 transition-colors"
        >
          {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          <BookOpen className="w-5 h-5 -rotate-90" />
        </button>
        
        <div className="w-72 p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Info className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Eligibility Rules</h3>
          </div>
          
          <ul className="space-y-4">
            {rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{rule}</p>
              </li>
            ))}
          </ul>
          
          <div className="pt-4 border-t border-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
              Note: Exceptions can be requested in the final step with valid rationale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPanel;
