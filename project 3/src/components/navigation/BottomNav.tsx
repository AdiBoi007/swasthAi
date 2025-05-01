import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Pill, Stethoscope, FileText, 
  Activity, Brain, Upload 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'medicine', icon: Pill, label: 'Medicine' },
    { id: 'vitals', icon: Activity, label: 'Vitals' },
    { id: 'diagnosis', icon: Stethoscope, label: 'Diagnosis' },
    { id: 'reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <nav className="flex items-center px-2 py-2 space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center px-4 py-2 rounded-xl",
                "transition-colors duration-200 relative group",
                activeTab === tab.id
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              <tab.icon size={20} />
              <span className="text-xs mt-1">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary-100 dark:bg-primary-900/50 rounded-xl -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </nav>
      </motion.div>
    </div>
  );
};

export default BottomNav;