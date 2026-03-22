import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const Step5_ReviewSubmit = ({ formData, onBack, onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onSuccess(data);
      } else {
        onError(data.detail || { message: "Validation failed" });
      }
    } catch (error) {
      console.error("Submission error:", error);
      onError({ message: "Network error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const exceptionCount = Object.keys(formData.exceptions || {}).length + (formData.exception_rationale ? 1 : 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
        <p className="text-gray-500 mt-2">Double check all information before final submission.</p>
        {exceptionCount > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4" />
            {exceptionCount} Exception{exceptionCount > 1 ? 's' : ''} Flagged
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Personal Details</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Full Name</span>
              <span className="font-semibold">{formData.full_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="font-semibold">{formData.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phone</span>
              <span className="font-semibold">+91 {formData.phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">DOB</span>
              <span className="font-semibold">{formData.date_of_birth}</span>
            </div>
          </div>
        </div>

        {/* Documents & Test Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Verification & Test</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Aadhaar</span>
              <span className="font-mono font-bold">████ ████ {formData.aadhaar_number?.slice(8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Screening Score</span>
              <span className={`font-black ${formData.screening_test_score >= 60 ? 'text-green-600' : 'text-amber-600'}`}>
                {formData.screening_test_score}/100
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Interview Status</span>
              <span className="font-bold text-indigo-600 uppercase tracking-widest text-xs">{formData.interview_status}</span>
            </div>
          </div>
        </div>

        {/* Education Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Academic Timeline</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-50">
                  <th className="pb-2">Level</th>
                  <th className="pb-2">Institution</th>
                  <th className="pb-2">Year</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Backlogs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {formData.education?.map((edu, i) => (
                  <tr key={i} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-bold text-indigo-600">{edu.level}</td>
                    <td className="py-3 font-medium text-gray-700">{edu.board_or_university}</td>
                    <td className="py-3 text-gray-500">{edu.year_of_passing}</td>
                    <td className="py-3 font-mono font-bold text-gray-900">{edu.score} ({edu.score_scale})</td>
                    <td className="py-3 text-gray-500">{edu.backlog_count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Work Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Professional History</h3>
          </div>
          {formData.no_experience ? (
            <p className="text-sm text-gray-500 italic py-4">No work experience provided.</p>
          ) : (
            <div className="space-y-4">
              {formData.work_experience?.map((work, i) => (
                <div key={i} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">{work.company_name}</p>
                    <p className="text-xs text-indigo-600 font-semibold">{work.designation}</p>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {work.skills?.map(s => (
                        <span key={s} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500 font-bold uppercase">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{work.start_date} - {work.currently_working ? 'Present' : work.end_date}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase pt-1">{work.domain}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-8">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Application...
            </>
          ) : (
            <>
              Submit Application
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step5_ReviewSubmit;
