import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, BarChart3, Info } from 'lucide-react';
import { cn, getConfidenceColor, getModelIcon } from '../../lib/utils';
import { type Message, useChatStore } from '../../stores/chatStore';
import { useSettingsStore, type UserMode } from '../../stores/settingsStore';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { likeFeedback, dislikeFeedback } = useChatStore();
  const { userMode } = useSettingsStore();
  const [showDetails, setShowDetails] = useState(false);
  
  const isUser = message.role === 'user';
  
  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, height: 0 }
  };
  
  const renderMessage = (content: string, mode: UserMode) => {
    if (mode === 'patient') {
      // Simplified content for patients
      return content;
    } else {
      // Detailed content for doctors, add medical codes or technical details
      if (content.includes('headache')) {
        return (
          <>
            {content}
            <div className="mt-2 text-xs font-mono bg-gray-100 p-2 rounded">
              <p><span className="text-gray-500">ICD-10:</span> R51 (Headache)</p>
              <p><span className="text-gray-500">DDx:</span> G43.909 (Migraine), G44.209 (Tension-type headache)</p>
            </div>
          </>
        );
      } else if (content.includes('respiratory')) {
        return (
          <>
            {content}
            <div className="mt-2 text-xs font-mono bg-gray-100 p-2 rounded">
              <p><span className="text-gray-500">ICD-10:</span> J06.9 (URI)</p>
              <p><span className="text-gray-500">DDx:</span> J00 (Rhinitis), J02.9 (Pharyngitis), J40 (Bronchitis)</p>
            </div>
          </>
        );
      } else if (content.includes('diabetes')) {
        return (
          <>
            {content}
            <div className="mt-2 text-xs font-mono bg-gray-100 p-2 rounded">
              <p><span className="text-gray-500">ICD-10:</span> E11.9 (Type 2 diabetes mellitus)</p>
              <p><span className="text-gray-500">Lab:</span> HbA1c &lt; 7.0% (target), FPG &lt; 126 mg/dL</p>
            </div>
          </>
        );
      }
      return content;
    }
  };
  
  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          isUser 
            ? "bg-primary-600 text-white" 
            : "bg-white border border-gray-200"
        )}
      >
        {!isUser && message.model && (
          <div className="flex items-center mb-1 space-x-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-medium">
              {getModelIcon(message.model)} {message.model}
            </span>
            
            {message.confidence && (
              <span className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                getConfidenceColor(message.confidence)
              )}>
                {message.confidence}% sure
              </span>
            )}
          </div>
        )}
        
        <div className="prose prose-sm">
          {renderMessage(message.content, userMode)}
        </div>
        
        {!isUser && (
          <div className="mt-2 flex items-center justify-between">
            <div className="flex space-x-1">
              <button
                onClick={() => likeFeedback(message.id)}
                className={cn(
                  "p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors",
                  message.isLiked && "text-success-500 bg-success-50"
                )}
              >
                <ThumbsUp size={14} />
              </button>
              <button
                onClick={() => dislikeFeedback(message.id)}
                className={cn(
                  "p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors",
                  message.isDisliked && "text-error-500 bg-error-50"
                )}
              >
                <ThumbsDown size={14} />
              </button>
              
              {message.visualizations && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className={cn(
                    "p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors",
                    showDetails && "text-primary-500 bg-primary-50"
                  )}
                >
                  <BarChart3 size={14} />
                </button>
              )}
            </div>
            
            <div className="text-xs text-gray-400">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}
        
        {!isUser && showDetails && message.visualizations && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-gray-200"
          >
            <div className="flex items-center mb-2 text-xs text-gray-600">
              <Info size={12} className="mr-1" />
              <span>AI Analysis Details</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg text-xs">
              <p className="font-medium">Detected Keywords:</p>
              <div className="mt-1 flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">headache</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">migraine</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded">duration</span>
              </div>
              
              <p className="font-medium mt-2">Confidence Analysis:</p>
              <div className="mt-1 space-y-1">
                <div>
                  <div className="flex justify-between text-xs">
                    <span>Tension Headache</span>
                    <span>74%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span>Migraine</span>
                    <span>52%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '52%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span>Sinus Pressure</span>
                    <span>31%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '31%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;