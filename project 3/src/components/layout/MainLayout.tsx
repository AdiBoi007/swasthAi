import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Header from './Header';
import Sidebar from '../dashboard/Sidebar';
import ChatInterface from '../chat/ChatInterface';
import MedicineAnalyzer from '../medicine/MedicineAnalyzer';
import VitalsMonitor from '../medical/VitalsMonitor';
import DiagnosisTools from '../medical/DiagnosisTools';
import ReportsViewer from '../medical/ReportsViewer';
import VoiceControl from '../voice/VoiceControl';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  
  const handleVoiceCommand = (command: string) => {
    // Handle voice commands
    if (command.includes('medicine')) {
      setActiveTab('medicine');
    } else if (command.includes('vitals')) {
      setActiveTab('vitals');
    } else if (command.includes('diagnosis')) {
      setActiveTab('diagnosis');
    } else if (command.includes('reports')) {
      setActiveTab('reports');
    }
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'medicine':
        return <MedicineAnalyzer />;
      case 'vitals':
        return <VitalsMonitor />;
      case 'diagnosis':
        return <DiagnosisTools />;
      case 'reports':
        return <ReportsViewer />;
      default:
        return <ChatInterface />;
    }
  };
  
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header 
        toggleSidebar={() => setSidebarOpen(prev => !prev)} 
        sidebarOpen={sidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <LayoutGroup>
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <motion.div
                key="sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
              >
                <Sidebar />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="flex-1 overflow-hidden"
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
      
      <VoiceControl onCommand={handleVoiceCommand} />
    </div>
  );
}

export default MainLayout;