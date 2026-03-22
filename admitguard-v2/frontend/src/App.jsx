import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import StepIndicator from './components/StepIndicator';
import Step1_PersonalInfo from './pages/Step1_PersonalInfo';
import Step2_Education from './pages/Step2_Education';
import Step3_WorkExperience from './pages/Step3_WorkExperience';
import Step4_DocumentsTest from './pages/Step4_DocumentsTest';
import Step5_ReviewSubmit from './pages/Step5_ReviewSubmit';
import SuccessScreen from './components/SuccessScreen';
import { AlertCircle, X } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    exception_rationale: '',
    aadhaar_number: '',
    education: [],
    work_experience: [],
    no_experience: false,
    screening_test_score: 0,
    interview_status: null,
    exceptions: {}
  });

  const steps = [
    "Personal Info",
    "Education",
    "Work Experience",
    "Documents & Test",
    "Review & Submit"
  ];

  const handleReset = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      exception_rationale: '',
      aadhaar_number: '',
      education: [],
      work_experience: [],
      no_experience: false,
      screening_test_score: 0,
      interview_status: null,
      exceptions: {}
    });
    setCurrentStep(0);
    setIsSuccess(false);
    setSubmissionResult(null);
  };

  const renderStep = () => {
    if (isSuccess) {
      return <SuccessScreen 
        result={submissionResult} 
        applicantName={formData.full_name} 
        onReset={handleReset} 
      />;
    }

    switch (currentStep) {
      case 0:
        return <Step1_PersonalInfo 
          formData={formData} 
          setFormData={setFormData} 
          onNext={() => setCurrentStep(1)} 
        />;
      case 1:
        return <Step2_Education 
          formData={formData} 
          setFormData={setFormData} 
          onNext={() => setCurrentStep(2)} 
          onBack={() => setCurrentStep(0)} 
        />;
      case 2:
        return <Step3_WorkExperience 
          formData={formData}
          setFormData={setFormData}
          onNext={() => setCurrentStep(3)} 
          onBack={() => setCurrentStep(1)} 
        />;
      case 3:
        return <Step4_DocumentsTest 
          formData={formData}
          setFormData={setFormData}
          onNext={() => setCurrentStep(4)} 
          onBack={() => setCurrentStep(2)} 
        />;
      case 4:
        return <Step5_ReviewSubmit 
          formData={formData}
          onBack={() => setCurrentStep(3)} 
          onSuccess={(res) => {
            setSubmissionResult(res);
            setIsSuccess(true);
          }}
          onError={(err) => setErrorModal(err)}
        />;
      default:
        return null;
    }
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: User, label: "My Application", active: true },
    { icon: Settings, label: "Settings", active: false },
    { icon: HelpCircle, label: "Help & Support", active: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl">A</div>
            <h1 className="text-xl font-black tracking-tighter">ADMITGUARD <span className="text-indigo-500">v2</span></h1>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item, i) => (
              <button 
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-12 py-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Application Portal</h2>
            <p className="text-lg font-bold text-gray-900">{steps[currentStep]}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">IIT Gandhinagar</p>
              <p className="text-xs text-gray-500">PG Diploma AI-ML</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">AA</div>
          </div>
        </header>

        <div className="px-12 py-12">
          <StepIndicator currentStep={currentStep} steps={steps} />
          <div className="mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSuccess ? 'success' : currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Error Modal */}
      {errorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-red-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-xl font-black tracking-tight">Submission Failed</h3>
              </div>
              <button onClick={() => setErrorModal(null)} className="hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">System Message</p>
                <p className="text-gray-700 font-medium leading-relaxed">
                  {errorModal.tier === 'HARD_REJECT' 
                    ? "Your application was rejected by the automated validation engine due to the following critical issues:"
                    : errorModal.message || "An unexpected error occurred during validation."}
                </p>
              </div>

              {errorModal.errors && (
                <div className="space-y-3">
                  {errorModal.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-red-800 font-bold">{err}</p>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setErrorModal(null)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
              >
                Close and Fix Issues
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
