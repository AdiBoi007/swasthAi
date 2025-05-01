import React from 'react';
import { FileText, Image, Activity, File, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { type UploadRecord } from '../../stores/healthStore';

interface UploadHistoryProps {
  uploads: UploadRecord[];
}

const UploadHistory: React.FC<UploadHistoryProps> = ({ uploads }) => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'xray':
        return <Image className="h-4 w-4 text-primary-500" />;
      case 'ecg':
        return <Activity className="h-4 w-4 text-error-500" />;
      case 'fundus':
        return <Image className="h-4 w-4 text-secondary-500" />;
      case 'pdf':
      case 'prescription':
        return <FileText className="h-4 w-4 text-warning-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="h-4 w-4 text-success-500" />;
      case 'analyzing':
        return <Loader2 className="h-4 w-4 text-primary-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-error-500" />;
      default:
        return null;
    }
  };
  
  if (uploads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No uploads to display</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {uploads.map((upload) => (
        <div 
          key={upload.id} 
          className="flex items-start space-x-3 bg-white rounded-xl p-3 border border-gray-200 shadow-sm"
        >
          <div className="mt-0.5">
            {getFileIcon(upload.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 truncate">{upload.name}</h3>
              {getStatusIcon(upload.status)}
            </div>
            {upload.result && (
              <p className="text-xs text-gray-600 mt-0.5 truncate">{upload.result}</p>
            )}
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-400">{formatDate(upload.uploadDate)}</p>
              {upload.confidence && (
                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                  {upload.confidence}% confidence
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UploadHistory;