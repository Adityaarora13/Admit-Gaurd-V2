import React, { useState, useEffect } from 'react';
import { ADMISSION_RULES } from '../config/formConfig';

const Step1_PersonalInfo = ({ formData, setFormData, onNext }) => {
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);
  const [showException, setShowException] = useState(false);

  useEffect(() => {
    if (formData.date_of_birth) {
      const dob = new Date(formData.date_of_birth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
      
      const isAgeOutOfRange = calculatedAge < ADMISSION_RULES.age_rules.min || calculatedAge > ADMISSION_RULES.age_rules.max;
      setShowException(isAgeOutOfRange);
    }
  }, [formData.date_of_birth]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'full_name':
        if (!value.trim()) error = 'Full Name is required';
        else if (value.length < 2) error = 'Full Name must be at least 2 characters';
        else if (/\d/.test(value)) error = 'Full Name cannot contain numbers';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = 'Email is required';
        else if (!emailRegex.test(value)) error = 'Invalid email format';
        break;
      case 'phone':
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!value.trim()) error = 'Phone is required';
        else if (!phoneRegex.test(value)) error = 'Invalid 10-digit Indian phone number';
        break;
      case 'exception_rationale':
        if (showException) {
          if (!value.trim()) error = 'Rationale is required for age exception';
          else if (value.length < ADMISSION_RULES.soft_rule_exception.min_rationale_length)
            error = `Rationale must be at least ${ADMISSION_RULES.soft_rule_exception.min_rationale_length} characters`;
          else {
            const hasKeyword = ADMISSION_RULES.soft_rule_exception.required_keywords.some(keyword =>
              value.toLowerCase().includes(keyword.toLowerCase())
            );
            if (!hasKeyword) error = 'Rationale must include a valid keyword (e.g., "approved by", "waiver granted")';
          }
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const isFormValid = () => {
    const requiredFields = ['full_name', 'email', 'phone', 'date_of_birth'];
    const hasRequired = requiredFields.every(field => formData[field]);
    const noErrors = Object.values(errors).every(err => !err);
    const exceptionValid = !showException || (formData.exception_rationale && !errors.exception_rationale);
    return hasRequired && noErrors && exceptionValid;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-500 mt-2">Please provide your basic contact details.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
              errors.full_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative">
            <span className="absolute left-4 top-2 text-gray-400">+91</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="9876543210"
              className={`w-full pl-12 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Date of Birth */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          <div className="flex items-end pb-2">
            {age !== null && (
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                showException ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
              }`}>
                Age: {age} years
              </span>
            )}
          </div>
        </div>

        {/* Exception Rationale */}
        {showException && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-amber-800">Age Exception Rationale</label>
              <span className="text-xs text-amber-600">
                {formData.exception_rationale?.length || 0} / {ADMISSION_RULES.soft_rule_exception.min_rationale_length} min chars
              </span>
            </div>
            <p className="text-xs text-amber-700">
              Age is outside the preferred range ({ADMISSION_RULES.age_rules.min}-{ADMISSION_RULES.age_rules.max}). 
              Please provide a rationale including keywords like "approved by" or "waiver granted".
            </p>
            <textarea
              name="exception_rationale"
              value={formData.exception_rationale || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              placeholder="Provide justification for age exception..."
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                errors.exception_rationale ? 'border-red-500' : 'border-amber-300'
              }`}
            />
            {errors.exception_rationale && <p className="text-red-500 text-xs">{errors.exception_rationale}</p>}
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={onNext}
            disabled={!isFormValid()}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
          >
            Continue to Education
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1_PersonalInfo;
