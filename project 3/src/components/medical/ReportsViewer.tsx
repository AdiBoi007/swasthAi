import React from 'react';
import { FileText, Download, Share2 } from 'lucide-react';

const ReportsViewer: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Medical Reports</h2>
      
      <div className="space-y-4">
        {/* Report Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
                <FileText className="text-primary-500" />
              </div>
              <div>
                <h3 className="font-medium">Blood Test Report</h3>
                <p className="text-sm text-gray-500">Uploaded on Feb 15, 2024</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Download size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* More report cards would go here */}
      </div>
    </div>
  );
};

export default ReportsViewer;