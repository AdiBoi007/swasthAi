import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string, image_url?: string) => Promise<void>;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((message.trim() === '' && !selectedImage) || isLoading) return;
    
    let image_url = null;
    
    if (selectedImage) {
      // In a real app, upload to storage and get URL
      // For demo, we'll use a data URL
      image_url = imagePreviewUrl;
    }
    
    await onSendMessage(message, image_url);
    setMessage('');
    setSelectedImage(null);
    setImagePreviewUrl(null);
    
    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      {selectedImage && (
        <div className="mb-2 relative">
          <div className="relative inline-block">
            <img 
              src={imagePreviewUrl!} 
              alt="Selected prescription" 
              className="max-h-32 rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setImagePreviewUrl(null);
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      
      <div className="relative">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedImage ? "Describe the prescription or ask questions about it..." : "Type your health question here..."}
          rows={1}
          className={cn(
            "w-full py-3 px-4 pr-24 rounded-xl border border-gray-300",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "resize-none transition-colors duration-200",
            "shadow-sm"
          )}
          style={{
            minHeight: '60px',
            maxHeight: '150px',
          }}
        />
        
        <div className="absolute right-3 bottom-3 flex space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={cn(
              "p-2 rounded-full",
              "bg-secondary-100 text-secondary-500 hover:bg-secondary-200",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <ImageIcon size={20} />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={(message.trim() === '' && !selectedImage) || isLoading}
            className={cn(
              "p-2 rounded-full",
              (message.trim() !== '' || selectedImage) && !isLoading
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;