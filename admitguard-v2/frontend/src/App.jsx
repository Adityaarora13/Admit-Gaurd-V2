import React, { useState, useEffect } from 'react';
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
  LogOut,
  Sun,
  Moon,
  Loader2,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import StepIndicator from './components/StepIndicator';
import Step1_PersonalInfo from './pages/Step1_PersonalInfo';
import Step2_Education from './pages/Step2_Education';
import Step3_WorkExperience from './pages/Step3_WorkExperience';
import Step4_DocumentsTest from './pages/Step4_DocumentsTest';
import Step5_ReviewSubmit from './pages/Step5_ReviewSubmit';
import SuccessScreen from './components/SuccessScreen';
import Dashboard from './pages/Dashboard';
import AuditLog from './pages/AuditLog';
import RulesPanel from './components/RulesPanel';
import { saveSubmission } from './utils/localStore';
import { AlertCircle, X, FileSpreadsheet, PlusCircle } from 'lucide-react';

const LoadingOverlay = ({ message }) => (
  <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-indigo-100 dark:border-gray-800 rounded-full" />
      <div className="w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl animate-pulse" />
      </div>
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{message}</h3>
      <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">This may take a few seconds...</p>
    </div>
  </div>
);

const App = () => {
  const [activePage, setActivePage] = useState('application'); // 'application', 'dashboard', 'audit'
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ag_theme') === 'dark');
  const [globalLoading, setGlobalLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ag_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ag_theme', 'light');
    }
  }, [darkMode]);

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
          setGlobalLoading={setGlobalLoading}
          setErrorModal={setErrorModal}
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
            saveSubmission(res, formData);
            setSubmissionResult(res);
            setIsSuccess(true);
          }}
          onError={(err) => setErrorModal(err)}
          setGlobalLoading={setGlobalLoading}
        />;
      default:
        return null;
    }
  };

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: "Dashboard" },
    { id: 'application', icon: PlusCircle, label: "New Application" },
    { id: 'audit', icon: FileSpreadsheet, label: "Audit Log" },
    { id: 'settings', icon: Settings, label: "Settings" },
  ];

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300`}>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col shrink-0 z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl">A</div>
              <h1 className="text-xl font-black tracking-tighter">ADMITGUARD <span className="text-indigo-500">v2</span></h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activePage === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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
      <main className="flex-1 overflow-y-auto relative">
        {globalLoading && <LoadingOverlay message="Validating application..." />}
        
        {activePage === 'application' && !isSuccess && <RulesPanel currentStep={currentStep} />}

        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 lg:px-12 py-6 flex justify-between items-center sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AdmitGuard v2</h2>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {activePage === 'dashboard' ? 'System Dashboard' : 
                 activePage === 'audit' ? 'Audit Trail' : 
                 steps[currentStep]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-all border border-gray-100 dark:border-gray-700"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">IIT Gandhinagar</p>
                <p className="text-xs text-gray-500">PG Diploma AI-ML</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">AA</div>
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-12 py-12">
          {activePage === 'application' && !isSuccess && <StepIndicator currentStep={currentStep} steps={steps} />}
          <div className={activePage === 'application' && !isSuccess ? 'mt-12' : ''}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage === 'application' ? (isSuccess ? 'success' : currentStep) : activePage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activePage === 'dashboard' ? <Dashboard /> : 
                 activePage === 'audit' ? <AuditLog /> : 
                 renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Error Modal */}
      {errorModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-red-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-xl font-black tracking-tight">System Notification</h3>
              </div>
              <button onClick={() => setErrorModal(null)} className="hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Message</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                  {errorModal.tier === 'HARD_REJECT' 
                    ? "Your application was rejected by the automated validation engine due to the following critical issues:"
                    : errorModal.message || "An unexpected error occurred."}
                </p>
              </div>

              {errorModal.errors && (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {errorModal.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-red-800 dark:text-red-300 font-bold">{err}</p>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setErrorModal(null)}
                className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
