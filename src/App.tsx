/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { Shield, CheckCircle, AlertCircle, FileText, Users, Settings } from 'lucide-react';

export default function App() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log('Validation Request:', data);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight">AdmitGuard <span className="text-indigo-600">v2</span></span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-indigo-600 transition-colors">Dashboard</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Applicants</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Rules</a>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold">New Admission Validation</h2>
              <p className="text-sm text-slate-500">IIT Gandhinagar - PG Diploma in AI-ML</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input 
                    {...register('name')} 
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input 
                    {...register('email')} 
                    type="email"
                    placeholder="rahul@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Age</label>
                  <input 
                    {...register('age')} 
                    type="number"
                    placeholder="24"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">UG Percentage / CGPA</label>
                  <input 
                    {...register('ug_score')} 
                    placeholder="e.g. 78.5 or 8.2"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Run Validation Engine
                </button>
              </div>
            </form>
          </section>

          {/* Recent Activity */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-2">Recent Validations</h3>
            <div className="space-y-3">
              {[
                { name: 'Ananya Iyer', status: 'Cleared', score: 88, time: '2 mins ago' },
                { name: 'Vikram Singh', status: 'Waitlisted', score: 42, time: '15 mins ago' },
                { name: 'Priya Das', status: 'Rejected', score: 35, time: '1 hour ago' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-indigo-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.status === 'Cleared' ? 'bg-emerald-50 text-emerald-600' : 
                      item.status === 'Waitlisted' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      item.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'Waitlisted' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {item.status}
                    </span>
                    <p className="text-xs font-mono mt-1 text-slate-400">Score: {item.score}/100</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Stats & Rules */}
        <div className="space-y-8">
          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">System Status</p>
              <h3 className="text-2xl font-bold mb-4">Intelligence Active</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-300">Validation Engine</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-300">Gemini Intelligence</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Ready</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-300">Sheets Webhook</span>
                  <span className="flex items-center gap-1.5 text-amber-400"><AlertCircle className="w-3 h-3" /> Pending Config</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-800 rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center gap-2 text-slate-800">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold">Active Ruleset</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Age Range</p>
                <p className="text-sm font-medium text-slate-700">18 - 35 Years</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Min UG Score</p>
                <p className="text-sm font-medium text-slate-700">60% or 6.0/10 CGPA</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Education Gap</p>
                <p className="text-sm font-medium text-slate-700">Max 24 Months</p>
              </div>
            </div>
            <button className="w-full py-2 text-indigo-600 text-sm font-bold border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors">
              View Full Config
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
