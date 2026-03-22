import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Info, AlertCircle, GraduationCap } from 'lucide-react';
import { 
  EDUCATION_LEVELS, 
  INDIAN_BOARDS, 
  KNOWN_UNIVERSITIES, 
  SCORE_SCALES,
  ADMISSION_RULES 
} from '../config/formConfig';

const Step2_Education = ({ formData, setFormData, onNext, onBack }) => {
  const [educationList, setEducationList] = useState(formData.education || []);
  const [errors, setErrors] = useState({});
  const [path, setPath] = useState("Unknown");

  useEffect(() => {
    detectPath(educationList);
    setFormData(prev => ({ ...prev, education: educationList }));
  }, [educationList]);

  const detectPath = (list) => {
    const levels = list.map(e => e.level);
    if (levels.includes('10th') && levels.includes('12th') && levels.includes('UG')) {
      setPath("Path A (Standard)");
    } else if (levels.includes('10th') && levels.includes('Diploma') && levels.includes('UG')) {
      setPath("Path B (Diploma)");
    } else if (levels.includes('10th') && levels.includes('ITI') && levels.includes('Diploma') && levels.includes('UG')) {
      setPath("Path C (Lateral)");
    } else {
      setPath("Incomplete Path");
    }
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      level: '',
      board_or_university: '',
      stream_specialization: '',
      year_of_passing: '',
      score: '',
      score_scale: 'PERCENTAGE',
      backlog_count: 0,
      gap_months: 0
    };
    setEducationList([...educationList, newEdu]);
  };

  const removeEducation = (id, level) => {
    if (level === '10th' && educationList.length > 1) {
      // Optional: Prevent removing 10th if it's the base, but user can still remove it if they want to restart
    }
    setEducationList(educationList.filter(e => e.id !== id));
  };

  const handleEduChange = (id, field, value) => {
    const updatedList = educationList.map(edu => {
      if (edu.id === id) {
        const updatedEdu = { ...edu, [field]: value };
        
        // Chronological check
        if (field === 'year_of_passing') {
          const index = educationList.findIndex(e => e.id === id);
          if (index > 0) {
            const prevYear = educationList[index - 1].year_of_passing;
            if (prevYear && value <= prevYear) {
              setErrors(prev => ({ ...prev, [`year_${id}`]: `Year must be after ${prevYear}` }));
            } else {
              setErrors(prev => ({ ...prev, [`year_${id}`]: '' }));
            }
          }
        }
        return updatedEdu;
      }
      return edu;
    });
    setEducationList(updatedList);
  };

  const calculateNormalized = (score, scale) => {
    const numScore = parseFloat(score);
    if (isNaN(numScore)) return 0;
    const scaleObj = SCORE_SCALES.find(s => s.value === scale);
    return (numScore * (scaleObj?.multiplier || 1)).toFixed(2);
  };

  const calculateTotalGap = () => {
    return educationList.reduce((total, edu) => total + (parseInt(edu.gap_months) || 0), 0);
  };

  const isStepValid = () => {
    if (educationList.length === 0) return false;
    const hasMandatory = educationList.some(e => e.level === '10th');
    const allFieldsFilled = educationList.every(e => 
      e.level && e.board_or_university && e.year_of_passing && e.score &&
      (EDUCATION_LEVELS.indexOf(e.level) >= 1 ? e.stream_specialization : true)
    );
    const noYearErrors = Object.values(errors).every(err => !err);
    return hasMandatory && allFieldsFilled && noYearErrors;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Education Background</h2>
        <p className="text-gray-500 mt-2">Add your academic history in chronological order.</p>
        <div className="mt-4 flex justify-center">
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm border ${
            path.includes("Standard") ? "bg-indigo-50 text-indigo-700 border-indigo-200" : 
            path.includes("Incomplete") ? "bg-amber-50 text-amber-700 border-amber-200" : 
            "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}>
            {path}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {educationList.map((edu, index) => (
          <div key={edu.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
            <button 
              onClick={() => removeEducation(edu.id, edu.level)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                <select
                  value={edu.level}
                  onChange={(e) => handleEduChange(edu.id, 'level', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select Level</option>
                  {EDUCATION_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Board / University */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Board / University</label>
                <input
                  list={edu.level === '10th' || edu.level === '12th' ? 'boards' : 'universities'}
                  value={edu.board_or_university}
                  onChange={(e) => handleEduChange(edu.id, 'board_or_university', e.target.value)}
                  placeholder="Search or type..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <datalist id="boards">
                  {INDIAN_BOARDS.map(b => <option key={b} value={b} />)}
                </datalist>
                <datalist id="universities">
                  {KNOWN_UNIVERSITIES.map(u => <option key={u} value={u} />)}
                </datalist>
              </div>

              {/* Stream - Only for 12th+ */}
              {edu.level && EDUCATION_LEVELS.indexOf(edu.level) >= 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stream / Specialization</label>
                  <input
                    type="text"
                    value={edu.stream_specialization}
                    onChange={(e) => handleEduChange(edu.id, 'stream_specialization', e.target.value)}
                    placeholder="e.g. Science, CS"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}

              {/* Year of Passing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passing</label>
                <input
                  type="number"
                  value={edu.year_of_passing}
                  onChange={(e) => handleEduChange(edu.id, 'year_of_passing', e.target.value)}
                  placeholder="YYYY"
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none ${
                    errors[`year_${edu.id}`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[`year_${edu.id}`] && <p className="text-red-500 text-xs mt-1">{errors[`year_${edu.id}`]}</p>}
              </div>

              {/* Score & Scale */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                  <input
                    type="number"
                    step="0.01"
                    value={edu.score}
                    onChange={(e) => handleEduChange(edu.id, 'score', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scale</label>
                  <select
                    value={edu.score_scale}
                    onChange={(e) => handleEduChange(edu.id, 'score_scale', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-xs"
                  >
                    {SCORE_SCALES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Backlog - Only for Diploma+ */}
              {edu.level && EDUCATION_LEVELS.indexOf(edu.level) >= 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backlog Count</label>
                  <input
                    type="number"
                    value={edu.backlog_count}
                    onChange={(e) => handleEduChange(edu.id, 'backlog_count', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}

              {/* Gap Months */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Gap (Months)</label>
                <input
                  type="number"
                  value={edu.gap_months}
                  onChange={(e) => handleEduChange(edu.id, 'gap_months', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Normalization Helper */}
              <div className="md:col-span-3 flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-indigo-700">
                    {edu.score_scale === 'CGPA_10' ? 'CGPA × 9.5 = normalized %' : 
                     edu.score_scale === 'CGPA_4' ? 'CGPA × 25 = normalized %' : 
                     'Score is already in percentage'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600 uppercase">Normalized:</span>
                  <p className="text-lg font-black text-indigo-700">{calculateNormalized(edu.score, edu.score_scale)}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addEducation}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Add Education Level</span>
        </button>
      </div>

      {/* Summary Card */}
      {educationList.length > 0 && (
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold">Academic Summary</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {educationList.map((edu, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{edu.level || 'Level'}</p>
                <p className="text-sm font-semibold truncate">{edu.board_or_university || 'N/A'}</p>
                <p className="text-xs text-indigo-400 font-mono">{calculateNormalized(edu.score, edu.score_scale)}%</p>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Total Education Gap: {calculateTotalGap()} months</span>
            </div>
            <p className="text-[10px] text-gray-500 italic">Rules allow max {ADMISSION_RULES.education_rules.max_education_gap_months} months gap</p>
          </div>
        </div>
      )}

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
          Continue to Work Experience
        </button>
      </div>
    </div>
  );
};

export default Step2_Education;
