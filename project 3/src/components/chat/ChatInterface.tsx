import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import FileUpload from '../upload/FileUpload';
import { useChatStore } from '../../stores/chatStore';
import { useSettingsStore } from '../../stores/settingsStore';

const ChatInterface: React.FC = () => {
  const { messages, isLoading, sendMessage } = useChatStore();
  const { isOfflineMode } = useSettingsStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {isOfflineMode && (
        <div className="bg-warning-50 border-b border-warning-200 p-2 text-center text-sm text-warning-800">
          <span className="inline-block mr-1">⚠️</span>
          Edge AI Mode Active - Limited functionality available for offline use
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Swasth AI</h2>
              <p className="text-gray-600 mb-6">
                Your AI healthcare assistant powered by advanced models for personalized health guidance.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="text-primary-500 mb-2">💬</div>
                  <h3 className="font-medium text-gray-800 mb-1">Ask Health Questions</h3>
                  <p className="text-sm text-gray-600">Get answers about symptoms, conditions, or medications</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="text-primary-500 mb-2">📊</div>
                  <h3 className="font-medium text-gray-800 mb-1">Upload Medical Files</h3>
                  <p className="text-sm text-gray-600">Analyze X-rays, ECGs, and medical documents</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                How can I help with your health concerns today?
              </p>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-2"
              >
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 bg-white p-4">
        {!isOfflineMode && <FileUpload />}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;