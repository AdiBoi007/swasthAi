import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RiskIndicatorProps {
  icon: ReactNode;
  disease: string;
  level: 'low' | 'moderate' | 'high';
  score: number;
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ icon, disease, level, score }) => {
  const getColorsByLevel = (level: 'low' | 'moderate' | 'high') => {
    switch (level) {
      case 'low':
        return {
          bg: 'bg-success-50',
          text: 'text-success-700',
          stroke: 'text-success-500',
          border: 'border-success-200',
          progress: 'bg-success-500',
        };
      case 'moderate':
        return {
          bg: 'bg-warning-50',
          text: 'text-warning-700',
          stroke: 'text-warning-500',
          border: 'border-warning-200',
          progress: 'bg-warning-500',
        };
      case 'high':
        return {
          bg: 'bg-error-50',
          text: 'text-error-700',
          stroke: 'text-error-500',
          border: 'border-error-200',
          progress: 'bg-error-500',
        };
    }
  };
  
  const colors = getColorsByLevel(level);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "p-3 rounded-xl border",
        colors.border,
        colors.bg
      )}
    >
      <div className="flex items-center space-x-3">
        <div className={cn("p-2 rounded-full", colors.bg, colors.stroke)}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <p className="text-sm font-medium text-gray-900">{disease}</p>
            <button className="text-gray-400 hover:text-gray-600">
              <Info size={14} />
            </button>
          </div>
          
          <div className="mt-1">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={cn("h-1.5 rounded-full", colors.progress)}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className={cn("text-sm font-medium", colors.text)}>
          {level === 'low' ? 'Low' : level === 'moderate' ? 'Medium' : 'High'}
        </div>
      </div>
    </motion.div>
  );
};

export default RiskIndicator;