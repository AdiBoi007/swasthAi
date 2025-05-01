import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from 'react-speech-recognition';
import { cn } from '../../lib/utils';

interface VoiceControlProps {
  onCommand: (command: string) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      const command = transcript.toLowerCase();
      
      // Process voice commands
      if (command.includes('search for') || command.includes('find')) {
        const query = command.replace(/search for|find/i, '').trim();
        onCommand(query);
        resetTranscript();
      }
      else if (command.includes('analyze') || command.includes('identify')) {
        setFeedback('Please upload an image to analyze');
        resetTranscript();
      }
    }
  }, [transcript]);

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      resetTranscript();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="fixed bottom-48 right-6">
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center shadow-lg",
            isListening
              ? "bg-red-500 text-white"
              : "bg-primary-500 text-white hover:bg-primary-600"
          )}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </motion.button>

        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-4 right-0 w-64 bg-white rounded-xl shadow-lg p-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Listening...</span>
              </div>
              
              {transcript && (
                <p className="text-sm text-gray-600 break-words">
                  "{transcript}"
                </p>
              )}
              
              {feedback && (
                <p className="text-xs text-gray-500 mt-2">{feedback}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VoiceControl;