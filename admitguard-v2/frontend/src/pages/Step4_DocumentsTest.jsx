import React, { useState, useEffect } from 'react';
import { AlertCircle, ShieldCheck, FileText, Ban, CheckCircle2 } from 'lucide-react';
import { ADMISSION_RULES } from '../config/formConfig';

const Step4_DocumentsTest = ({ formData, setFormData, onNext, onBack }) => {
  const [errors, setErrors] = useState({});
  const [isRejected, setIsRejected] = useState(false);
  const [showScoreException, setShowScoreException] = useState(false);

  useEffect(() => {
    setIsRejected(formData.interview_status === 'Rejected');
    setShowScoreException(formData.screening_test_score !== null && formData.screening_test_score < ADMISSION_RULES.screening.min_test_score);
  }, [formData.interview_status, formData.screening_test_score]);

  const validateAadhaar = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 12) return 'Aadhaar must be 12 digits';
    return '';
  };

  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
    setFormData(prev => ({ ...prev, aadhaar_number: value }));
    setErrors(prev => ({ ...prev, aadhaar: validateAadhaar(value) }));
  };

  const formatAadhaar = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    if (digits.length < 12) return digits;
    return `████ ████ ${digits.slice(8)}`;
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'bg-gray-200';
    if (score < 40) return 'bg-red-500';
    if (score < 60) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const isStepValid = () => {
    const hasAadhaar = formData.aadhaar_number?.length === 12;
    const hasScore = formData.screening_test_score !== null;
    const hasStatus = formData.interview_status !== null;
    const notRejected = formData.interview_status !== 'Rejected';
    const exceptionValid = !showScoreException || (formData.exceptions?.screening_score && formData.exceptions.screening_score.length >= ADMISSION_RULES.soft_rule_exception.min_rationale_length);
    
    return hasAadhaar && hasScore && hasStatus && notRejected && exceptionValid;
  };

  const handleExceptionChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      exceptions: {
        ...prev.exceptions,
        screening_score: value
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Documents & Test Scores</h2>
        <p className="text-gray-500 mt-2">Final verification and screening details.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
        {/* Aadhaar Number */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <label className="block text-sm font-bold text-gray-700">Aadhaar Verification</label>
          </div>
          <div className="relative">
            <input
              type="text"
              value={formData.aadhaar_number || ''}
              onChange={handleAadhaarChange}
              placeholder="12-digit Aadhaar Number"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono tracking-widest ${
                errors.aadhaar ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formData.aadhaar_number?.length === 12 && (
              <div className="absolute right-4 top-3 flex items-center gap-2 text-green-600 animate-in fade-in zoom-in">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Verified</span>
              </div>
            )}
          </div>
          {formData.aadhaar_number?.length === 12 && (
            <p className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded-lg border border-gray-100">
              Masked for privacy: <span className="text-gray-600 font-bold">{formatAadhaar(formData.aadhaar_number)}</span>
            </p>
          )}
          {errors.aadhaar && <p className="text-red-500 text-xs">{errors.aadhaar}</p>}
        </div>

        {/* Screening Test Score */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <label className="block text-sm font-bold text-gray-700">Screening Test Score</label>
            </div>
            <span className="text-2xl font-black text-gray-900">{formData.screening_test_score || 0}<span className="text-gray-400 text-sm">/100</span></span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={formData.screening_test_score || 0}
            onChange={(e) => setFormData(prev => ({ ...prev, screening_test_score: parseInt(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div 
              className={`h-full transition-all duration-500 ${getScoreColor(formData.screening_test_score)}`}
              style={{ width: `${formData.screening_test_score || 0}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Critical (&lt;40)</span>
            <span>Average (40-60)</span>
            <span>Strong (&gt;60)</span>
          </div>

          {showScoreException && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-amber-800">Score Exception Rationale</label>
                <span className="text-xs text-amber-600">
                  {formData.exceptions?.screening_score?.length || 0} / {ADMISSION_RULES.soft_rule_exception.min_rationale_length} min chars
                </span>
              </div>
              <p className="text-xs text-amber-700">
                Score is below the mandatory cutoff ({ADMISSION_RULES.screening.min_test_score}). 
                Please provide a rationale including keywords like "special case" or "documentation pending".
              </p>
              <textarea
                value={formData.exceptions?.screening_score || ''}
                onChange={handleExceptionChange}
                rows={3}
                placeholder="Provide justification for low score..."
                className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Interview Status */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700">Interview Status</label>
          <div className="grid grid-cols-3 gap-3">
            {['Cleared', 'Waitlisted', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFormData(prev => ({ ...prev, interview_status: status }))}
                className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                  formData.interview_status === status
                    ? (status === 'Rejected' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-indigo-50 border-indigo-500 text-indigo-700')
                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {isRejected && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
              <div className="p-3 bg-red-100 rounded-full">
                <Ban className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-black text-red-900 uppercase tracking-tight">Hard Block: Rejected</h4>
                <p className="text-xs text-red-700">Rejected candidates cannot be submitted to the system. Please contact the admissions office for further clarification.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-8">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isStepValid()}
          className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
        >
          Review Application
        </button>
      </div>
    </div>
  );
};

export default Step4_DocumentsTest;
