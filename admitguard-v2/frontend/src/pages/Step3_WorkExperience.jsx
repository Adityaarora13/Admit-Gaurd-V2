import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Briefcase, AlertCircle, Sparkles, X, Check } from 'lucide-react';
import { DOMAIN_OPTIONS, EMPLOYMENT_TYPES, ADMISSION_RULES } from '../config/formConfig';

const Step3_WorkExperience = ({ formData, setFormData, onNext, onBack }) => {
  const [workList, setWorkList] = useState(formData.work_experience || []);
  const [noExperience, setNoExperience] = useState(formData.no_experience || false);
  const [suggestions, setSuggestions] = useState({});
  const [loadingSuggestion, setLoadingSuggestion] = useState({});

  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      work_experience: noExperience ? [] : workList,
      no_experience: noExperience
    }));
  }, [workList, noExperience]);

  const addWork = () => {
    const newWork = {
      id: Date.now(),
      company_name: '',
      designation: '',
      domain: 'IT',
      employment_type: 'Full-time',
      start_date: '', // YYYY-MM
      end_date: '',   // YYYY-MM
      currently_working: false,
      skills: []
    };
    setWorkList([...workList, newWork]);
  };

  const removeWork = (id) => {
    setWorkList(workList.filter(w => w.id !== id));
  };

  const handleWorkChange = (id, field, value) => {
    setWorkList(workList.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const addSkill = (id, skill) => {
    if (!skill.trim()) return;
    setWorkList(workList.map(w => {
      if (w.id === id && !w.skills.includes(skill.trim())) {
        return { ...w, skills: [...w.skills, skill.trim()] };
      }
      return w;
    }));
  };

  const removeSkill = (id, skillToRemove) => {
    setWorkList(workList.map(w => {
      if (w.id === id) {
        return { ...w, skills: w.skills.filter(s => s !== skillToRemove) };
      }
      return w;
    }));
  };

  const calculateDuration = (start, end, current) => {
    if (!start) return null;
    const startDate = new Date(start);
    const endDate = current ? new Date() : (end ? new Date(end) : new Date());
    
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += endDate.getMonth() - startDate.getMonth();
    
    if (months < 0) return "Invalid dates";
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = "";
    if (years > 0) result += `${years} year${years > 1 ? 's' : ''} `;
    if (remainingMonths > 0) result += `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    return result || "0 months";
  };

  const getTotalExperience = () => {
    let totalMonths = 0;
    let itMonths = 0;
    
    workList.forEach(w => {
      if (!w.start_date) return;
      const start = new Date(w.start_date);
      const end = w.currently_working ? new Date() : (w.end_date ? new Date(w.end_date) : new Date());
      const diff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      if (diff > 0) {
        totalMonths += diff;
        if (w.domain === 'IT') itMonths += diff;
      }
    });

    const format = (m) => {
      const y = Math.floor(m / 12);
      const rem = m % 12;
      return `${y}y ${rem}m`;
    };

    return { total: format(totalMonths), it: format(itMonths), rawTotal: totalMonths };
  };

  const getGaps = () => {
    if (workList.length < 2) return [];
    const sorted = [...workList]
      .filter(w => w.start_date)
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    
    const gaps = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentEnd = sorted[i].currently_working ? new Date() : new Date(sorted[i].end_date);
      const nextStart = new Date(sorted[i+1].start_date);
      
      const gapMonths = (nextStart.getFullYear() - currentEnd.getFullYear()) * 12 + (nextStart.getMonth() - currentEnd.getMonth());
      if (gapMonths > 2) {
        gaps.push({ from: sorted[i].company_name, to: sorted[i+1].company_name, months: gapMonths });
      }
    }
    return gaps;
  };

  const handleSuggest = async (id, field, value) => {
    if (!value || value.length < 3) return;
    setLoadingSuggestion(prev => ({ ...prev, [`${id}_${field}`]: true }));
    try {
      const response = await fetch(`/api/suggest?field=${field}&value=${encodeURIComponent(value)}`);
      const data = await response.json();
      if (data.suggestion) {
        setSuggestions(prev => ({ ...prev, [`${id}_${field}`]: data.suggestion }));
      }
    } catch (error) {
      console.error("Suggestion error:", error);
    } finally {
      setLoadingSuggestion(prev => ({ ...prev, [`${id}_${field}`]: false }));
    }
  };

  const applySuggestion = (id, field, value) => {
    handleWorkChange(id, field, value);
    setSuggestions(prev => {
      const next = { ...prev };
      delete next[`${id}_${field}`];
      return next;
    });
  };

  const isStepValid = () => {
    if (noExperience) return true;
    if (workList.length === 0) return false;
    return workList.every(w => 
      w.company_name && 
      w.designation && 
      w.start_date && 
      (w.currently_working || w.end_date)
    );
  };

  const stats = getTotalExperience();
  const gaps = getGaps();

  const getLatestGraduationYear = () => {
    if (!formData.education || formData.education.length === 0) return null;
    return Math.max(...formData.education.map(e => parseInt(e.year_of_passing) || 0));
  };

  const latestGradYear = getLatestGraduationYear();
  const currentYear = new Date().getFullYear();
  const showGradWarning = noExperience && latestGradYear && (currentYear - latestGradYear > 3);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Professional Experience</h2>
        <p className="text-gray-500 mt-2">Tell us about your career journey.</p>
      </div>

      <div className="flex items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={noExperience}
            onChange={(e) => setNoExperience(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all"
          />
          <span className="font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">I have no work experience</span>
        </label>
      </div>

      {noExperience ? (
        <div className={`p-8 rounded-2xl border flex flex-col items-center text-center space-y-4 animate-in zoom-in duration-300 ${
          showGradWarning ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
        }`}>
          {showGradWarning ? (
            <AlertCircle className="w-12 h-12 text-red-500" />
          ) : (
            <AlertCircle className="w-12 h-12 text-amber-500" />
          )}
          <div className="space-y-2">
            <h3 className={`text-lg font-bold ${showGradWarning ? 'text-red-900' : 'text-amber-900'}`}>
              {showGradWarning ? 'Critical Career Gap' : 'Fresh Graduate Path'}
            </h3>
            <p className={`${showGradWarning ? 'text-red-700' : 'text-amber-700'} max-w-md`}>
              {showGradWarning 
                ? `Your last education was in ${latestGradYear}. A gap of ${currentYear - latestGradYear} years without work experience is a critical flag for the admissions committee.`
                : "You've indicated no professional experience. This is common for recent graduates. Note: If your graduation was more than 3 years ago, this may be flagged for review."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {workList.map((work, index) => (
            <div key={work.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group animate-in zoom-in duration-300">
              <button 
                onClick={() => removeWork(work.id)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={work.company_name}
                      onChange={(e) => handleWorkChange(work.id, 'company_name', e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Google, TCS"
                    />
                    <button 
                      onClick={() => handleSuggest(work.id, 'company_name', work.company_name)}
                      disabled={loadingSuggestion[`${work.id}_company_name`]}
                      className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                      title="Smart Suggest"
                    >
                      <Sparkles className={`w-5 h-5 ${loadingSuggestion[`${work.id}_company_name`] ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>
                  {suggestions[`${work.id}_company_name`] && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-indigo-100 rounded-xl shadow-xl p-3 animate-in fade-in slide-in-from-top-2">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Smart Suggestion</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-700">{suggestions[`${work.id}_company_name`]}</span>
                        <button 
                          onClick={() => applySuggestion(work.id, 'company_name', suggestions[`${work.id}_company_name`])}
                          className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-700"
                        >
                          Use
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={work.designation}
                    onChange={(e) => handleWorkChange(work.id, 'designation', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                {/* Domain & Employment Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                    <select
                      value={work.domain}
                      onChange={(e) => handleWorkChange(work.id, 'domain', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {DOMAIN_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={work.employment_type}
                      onChange={(e) => handleWorkChange(work.id, 'employment_type', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="month"
                      value={work.start_date}
                      onChange={(e) => handleWorkChange(work.id, 'start_date', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={work.currently_working}
                          onChange={(e) => handleWorkChange(work.id, 'currently_working', e.target.checked)}
                          className="w-3 h-3 rounded text-indigo-600"
                        />
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Current</span>
                      </label>
                    </div>
                    <input
                      type="month"
                      value={work.end_date}
                      disabled={work.currently_working}
                      onChange={(e) => handleWorkChange(work.id, 'end_date', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none ${
                        work.currently_working ? 'bg-gray-50 border-gray-200 text-gray-400' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {work.skills.map(skill => (
                      <span key={skill} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-indigo-100">
                        {skill}
                        <button onClick={() => removeSkill(work.id, skill)} className="hover:text-indigo-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Type skill and press Enter..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(work.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Duration Badge */}
                <div className="md:col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tenure Duration</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">
                    {calculateDuration(work.start_date, work.end_date, work.currently_working) || "Enter dates"}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addWork}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Add Work Experience</span>
          </button>
        </div>
      )}

      {/* Summary Section */}
      {!noExperience && workList.length > 0 && (
        <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Experience</p>
              <p className="text-2xl font-black text-white">{stats.total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Relevant (IT) Exp</p>
              <p className="text-2xl font-black text-indigo-400">{stats.it}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Current Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${workList.some(w => w.currently_working) ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <p className="text-lg font-bold">{workList.some(w => w.currently_working) ? 'Employed' : 'Unemployed'}</p>
              </div>
            </div>
          </div>

          {gaps.length > 0 && (
            <div className="pt-6 border-t border-gray-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Career Gaps Detected</span>
              </div>
              <div className="space-y-2">
                {gaps.map((gap, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-gray-400 bg-gray-800/50 p-2 rounded-lg">
                    <span>Gap between <span className="text-white font-bold">{gap.from}</span> and <span className="text-white font-bold">{gap.to}</span></span>
                    <span className="text-amber-400 font-black">{gap.months} months</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          Continue to Documents
        </button>
      </div>
    </div>
  );
};

export default Step3_WorkExperience;
