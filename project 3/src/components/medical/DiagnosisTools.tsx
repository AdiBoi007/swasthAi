import React from 'react';
import { Brain, Search, FileText } from 'lucide-react';

const DiagnosisTools: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">AI Diagnosis Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptom Checker */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="text-primary-500" />
            <h3 className="text-lg font-medium">Symptom Checker</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Describe your symptoms for an AI-powered preliminary diagnosis
          </p>
          {/* Symptom input form would go here */}
        </div>

        {/* Lab Results Analyzer */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="text-primary-500" />
            <h3 className="text-lg font-medium">Lab Results Analyzer</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Upload lab reports for automated analysis and interpretation
          </p>
          {/* Lab results upload form would go here */}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTools;