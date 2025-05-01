import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Pill, Activity, 
  Stethoscope, FileText 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface TopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TopNav: React.FC<TopNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'medicine', icon: Pill, label: 'Medicine' },
    { id: 'vitals', icon: Activity, label: 'Vitals' },
    { id: 'diagnosis', icon: Stethoscope, label: 'Diagnosis' },
    { id: 'reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <nav className="flex items-center space-x-1">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
            activeTab === tab.id
              ? "text-primary-600 dark:text-primary-400"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          )}
        >
          <tab.icon size={18} />
          <span className="text-sm font-medium">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute inset-0 bg-primary-50 dark:bg-primary-900/50 rounded-lg -z-10"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </nav>
  );
};

export default TopNav;