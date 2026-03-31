import { useState } from 'react';
import { Shield } from 'lucide-react';
import UploadSection from './components/UploadSection';
import ReportSection from './components/ReportSection';

function App() {
  const [report, setReport] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      <nav className="bg-white shadow-sm border-b border-gray-100 py-4 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Urban<span className="text-blue-600">Roof</span>
          </h1>
        </div>
        <div className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          DDR Generator API
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {!report ? (
          <div>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
                Detailed Diagnostic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reports</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium">
                Upload your inspection and thermal reports. Our AI will automatically merge, process, and generate a professional DDR.
              </p>
            </div>
            <UploadSection onAnalyze={setReport} />
          </div>
        ) : (
          <div>
            <button 
              onClick={() => setReport(null)}
              className="mb-8 font-semibold text-blue-600 hover:text-blue-800 transition flex items-center bg-blue-50 px-4 py-2 rounded-lg"
            >
              &larr; Start New Analysis
            </button>
            <ReportSection report={report} />
          </div>
        )}
      </main>

      <footer className="mt-20 py-8 bg-white border-t border-gray-200 text-center text-gray-500">
        <p className="font-medium">&copy; {new Date().getFullYear()} UrbanRoof AI Assignment. All rights reserved.</p>
        <p className="text-sm mt-2">Powered by Vite, Express, and Groq/OpenRouter.</p>
      </footer>
    </div>
  );
}

export default App;
