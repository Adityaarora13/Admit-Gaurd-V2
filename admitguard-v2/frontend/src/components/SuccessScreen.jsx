import React from 'react';
import { CheckCircle2, AlertTriangle, Info, RefreshCw, ChevronRight, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

const SuccessScreen = ({ result, applicantName, onReset }) => {
  const { risk_score, category, anomalies, flags, tier } = result;

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Strong Fit': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Needs Review': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Weak Fit': return 'text-red-600 bg-red-50 border-red-200';
      case 'Anomaly': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // SVG Gauge calculations
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (risk_score / 100) * circumference;

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100/50"
        >
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </motion.div>
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Application Submitted!</h2>
          <p className="text-gray-500 font-medium">Thank you, <span className="text-indigo-600 font-bold">{applicantName}</span>. Your profile has been processed.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Risk Score Gauge */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 opacity-20" />
          <div className="relative">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="#f3f4f6"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <motion.circle
                stroke={risk_score < 30 ? '#10b981' : (risk_score < 70 ? '#f59e0b' : '#ef4444')}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-gray-900">{risk_score}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk Score</span>
            </div>
          </div>
          
          <div className={`px-6 py-2 rounded-full border-2 font-black uppercase tracking-widest text-sm shadow-sm ${getCategoryColor(category.category)}`}>
            {category.category}
          </div>
        </div>

        {/* Status & Flags */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900">Validation Tier</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">System Decision</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
                tier === 'CLEAN' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {tier}
              </span>
            </div>
          </div>

          {flags.length > 0 && (
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 space-y-4">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold">System Flags</h3>
              </div>
              <ul className="space-y-2">
                {flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-800 font-medium">
                    <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                    {flag.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {anomalies.length > 0 && (
            <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200 space-y-4">
              <div className="flex items-center gap-2 text-purple-700">
                <Info className="w-5 h-5" />
                <h3 className="font-bold">Anomalies Detected</h3>
              </div>
              <ul className="space-y-2">
                {anomalies.map((anomaly, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-purple-800 font-medium">
                    <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                    {anomaly}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
        >
          <RefreshCw className="w-5 h-5" />
          Submit Another Application
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
