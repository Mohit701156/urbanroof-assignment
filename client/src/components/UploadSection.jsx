import { useState } from 'react';
import { Upload, File, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadSection({ onAnalyze }) {
  const [inspectionFile, setInspectionFile] = useState(null);
  const [thermalFile, setThermalFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDrop = (e, setter) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setter(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleChange = (e, setter) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setter(file);
    }
  };

  const submit = async () => {
    if (!inspectionFile) {
      setError("Inspection Report is minimally required.");
      return;
    }
    setError('');
    setLoading(true);
    
    const formData = new FormData();
    formData.append('inspectionReport', inspectionFile);
    if (thermalFile) formData.append('thermalReport', thermalFile);

    try {
      const res = await fetch('/api/generate-ddr', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      
      onAnalyze(data.report);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const FileDropZone = ({ label, file, setter }) => (
    <div
      onDrop={(e) => handleDrop(e, setter)}
      onDragOver={handleDragOver}
      className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors 
        ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:border-blue-400'}`}
    >
      <input 
        type="file" 
        accept=".pdf" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => handleChange(e, setter)}
      />
      {file ? (
        <div className="flex flex-col items-center text-green-700">
          <CheckCircle className="w-10 h-10 mb-2" />
          <p className="font-semibold">{file.name}</p>
          <p className="text-sm text-green-600 mt-1">{(file.size/1024/1024).toFixed(2)} MB</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <Upload className="w-10 h-10 mb-2" />
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-gray-400 mt-1">Drag & drop or click to select PDF</p>
        </div>
      )}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-gray-100"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Upload Documents
        </h2>
        <p className="text-gray-500 mt-2">Upload your inspection and thermal reports for AI analysis</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" /> Inspection Report <span className="text-red-500 ml-1">*</span>
          </h3>
          <FileDropZone label="Upload Inspection PDF" file={inspectionFile} setter={setInspectionFile} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <File className="w-5 h-5 mr-2 text-orange-500" /> Thermal Report (Optional)
          </h3>
          <FileDropZone label="Upload Thermal PDF" file={thermalFile} setter={setThermalFile} />
        </div>
      </div>

      {error && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-4 mb-6 text-red-700 bg-red-50 rounded-lg flex items-center border border-red-200">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      <div className="flex justify-center">
        <button 
          onClick={submit} 
          disabled={loading || !inspectionFile}
          className={`px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-all
            ${loading || !inspectionFile 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl transform hover:-translate-y-1'}`}
        >
          {loading ? (
             <span className="flex items-center">
               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               AI Analyzing Documents...
             </span>
          ) : 'Generate Diagnostic Report'}
        </button>
      </div>
    </motion.div>
  );
}
