import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, X, FileText, Image, File, FileType, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useHealthStore } from '../../stores/healthStore';

const FileUpload: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { addUpload, processUpload } = useHealthStore();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Process the first file for demo purposes
    const file = acceptedFiles[0];
    
    // Reset states
    setUploadProgress(0);
    setUploadSuccess(null);
    setErrorMessage(null);
    
    // Get file type
    const fileType = getFileType(file);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate upload completion after 3 seconds
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Add the upload to the store
      const uploadId = addUpload({
        name: file.name,
        type: fileType,
        uploadDate: new Date(),
        status: 'analyzing',
      });
      
      // Simulate analysis completion after 2 more seconds
      setTimeout(() => {
        let result = '';
        let confidence = 0;
        
        // Mock results based on file name
        if (file.name.toLowerCase().includes('xray') || file.name.toLowerCase().includes('x-ray')) {
          result = 'No significant pathology detected in lung fields. Heart size within normal limits.';
          confidence = 92;
        } else if (file.name.toLowerCase().includes('ecg') || file.name.toLowerCase().includes('ekg')) {
          result = 'Normal sinus rhythm. No acute ST-T wave changes.';
          confidence = 88;
        } else if (file.name.toLowerCase().includes('lab')) {
          result = 'Elevated blood glucose (142 mg/dL). Consider follow-up HbA1c testing.';
          confidence = 95;
        } else {
          result = 'Analysis complete. No significant findings detected.';
          confidence = 85;
        }
        
        // Update the upload record
        processUpload(uploadId, result, confidence);
        
        setUploadSuccess(true);
        
        // Add result to chat (in a real app)
        // addMessageToChat(result, confidence);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setUploadProgress(null);
          setUploadSuccess(null);
          setIsExpanded(false);
        }, 3000);
      }, 2000);
    }, 3000);
  }, [addUpload, processUpload]);
  
  const getFileType = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (file.type.startsWith('image/')) {
      if (file.name.toLowerCase().includes('xray') || file.name.toLowerCase().includes('x-ray')) {
        return 'xray';
      } else if (file.name.toLowerCase().includes('fundus')) {
        return 'fundus';
      } else if (file.name.toLowerCase().includes('ecg') || file.name.toLowerCase().includes('ekg')) {
        return 'ecg';
      }
      return 'xray'; // Default for images
    } else if (extension === 'pdf') {
      if (file.name.toLowerCase().includes('prescription')) {
        return 'prescription';
      }
      return 'pdf';
    }
    
    return 'pdf'; // Default fallback
  };
  
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-primary-500" />;
    } else if (file.name.endsWith('.pdf')) {
      return <FileText className="h-5 w-5 text-error-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };
  
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
  });
  
  return (
    <div className="mb-4">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer text-center",
                isDragActive 
                  ? "border-primary-400 bg-primary-50" 
                  : "border-gray-300 hover:border-primary-300 hover:bg-gray-50"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <div className="mb-3 p-3 bg-primary-50 rounded-full">
                  <Upload className="h-6 w-6 text-primary-500" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {isDragActive
                    ? "Drop your file here"
                    : "Drag and drop your medical file"
                }
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  or <span className="text-primary-500">browse</span> from your computer
                </p>
                <p className="text-xs text-gray-400">
                  Accepts images (X-ray, ECG, fundus) and PDFs (lab reports, prescriptions)
                </p>
              </div>
            </div>
            
            {uploadProgress !== null && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {acceptedFiles[0] && getFileIcon(acceptedFiles[0])}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {acceptedFiles[0]?.name}
                    </p>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <motion.div 
                          className={cn(
                            "h-1.5 rounded-full",
                            uploadSuccess === true ? "bg-success-500" : 
                            uploadSuccess === false ? "bg-error-500" : 
                            "bg-primary-500"
                          )}
                          initial={{ width: '0%' }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {uploadSuccess === true ? (
                    <CheckCircle className="h-5 w-5 text-success-500" />
                  ) : uploadSuccess === false ? (
                    <AlertTriangle className="h-5 w-5 text-error-500" />
                  ) : (
                    <p className="text-xs font-medium text-gray-600">
                      {uploadProgress < 100 ? 'Uploading...' : 'Analyzing...'}
                    </p>
                  )}
                </div>
                
                {errorMessage && (
                  <p className="mt-2 text-xs text-error-600">{errorMessage}</p>
                )}
              </motion.div>
            )}
            
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload size={18} className="text-primary-500" />
            <span className="text-sm text-gray-600">Upload medical files</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;