import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Something went wrong</h1>
              <p className="text-gray-500 font-medium">The application encountered an unexpected error and could not continue.</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              <RefreshCw className="w-5 h-5" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
