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

// Placeholder components for remaining steps
const Step3_WorkExperience = ({ onNext, onBack }) => (
  <div className="text-center py-20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <Briefcase className="w-16 h-16 text-indigo-600 mx-auto" />
    <h2 className="text-2xl font-bold">Work Experience</h2>
    <p className="text-gray-500">This section will capture your professional history.</p>
    <div className="flex gap-4 max-w-xs mx-auto pt-8">
      <button onClick={onBack} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">Back</button>
      <button onClick={onNext} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700">Next</button>
    </div>
  </div>
);

const Step4_Documents = ({ onNext, onBack }) => (
  <div className="text-center py-20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <FileText className="w-16 h-16 text-indigo-600 mx-auto" />
    <h2 className="text-2xl font-bold">Documents & Test</h2>
    <p className="text-gray-500">Upload your transcripts and enter test scores.</p>
    <div className="flex gap-4 max-w-xs mx-auto pt-8">
      <button onClick={onBack} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">Back</button>
      <button onClick={onNext} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700">Next</button>
    </div>
  </div>
);

const Step5_Review = ({ onBack }) => (
  <div className="text-center py-20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
    <h2 className="text-2xl font-bold">Review & Submit</h2>
    <p className="text-gray-500">Double check all information before final submission.</p>
    <div className="flex gap-4 max-w-xs mx-auto pt-8">
      <button onClick={onBack} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">Back</button>
      <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700">Submit</button>
    </div>
  </div>
);

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    exception_rationale: '',
    education: [],
    work_experience: [],
    screening_test_score: null,
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

  const renderStep = () => {
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
          onNext={() => setCurrentStep(3)} 
          onBack={() => setCurrentStep(1)} 
        />;
      case 3:
        return <Step4_Documents 
          onNext={() => setCurrentStep(4)} 
          onBack={() => setCurrentStep(2)} 
        />;
      case 4:
        return <Step5_Review 
          onBack={() => setCurrentStep(3)} 
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
                key={currentStep}
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
    </div>
  );
};

export default App;
