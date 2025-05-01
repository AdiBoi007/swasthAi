import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, X, User, LogOut, Moon, Sun, Globe, 
  Stethoscope, UserCog, Wifi, WifiOff 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore, useSettingsStore } from '../../stores';
import TopNav from '../navigation/TopNav';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen, activeTab, onTabChange }) => {
  const { user, logout } = useAuthStore();
  const { 
    language, setLanguage, 
    userMode, setUserMode,
    theme, toggleTheme,
    isOfflineMode, toggleOfflineMode 
  } = useSettingsStore();
  
  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिन्दी' },
    { value: 'punjabi', label: 'ਪੰਜਾਬੀ' },
    { value: 'tamil', label: 'தமிழ்' },
  ];
  
  return (
    <header className={cn(
      "sticky top-0 z-50 py-2 px-4 flex items-center border-b gap-4",
      theme === 'dark' 
        ? "bg-gray-900 border-gray-700 text-white" 
        : "bg-white border-gray-200"
    )}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        className={cn(
          "p-2 rounded-lg hover:bg-opacity-80",
          theme === 'dark' ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
        )}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>
      
      <div className="flex items-center">
        <motion.div
          initial={{ rotate: -20 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="text-primary-500 mr-2"
        >
          <Stethoscope size={24} />
        </motion.div>
        <h1 className={cn(
          "text-xl font-semibold",
          theme === 'dark' ? "text-white" : "text-gray-900"
        )}>
          Swasth AI
        </h1>
      </div>

      <div className="flex-1 flex justify-center">
        <TopNav activeTab={activeTab} onTabChange={onTabChange} />
      </div>
      
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-lg",
            theme === 'dark'
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleOfflineMode}
          className={cn(
            "p-2 rounded-lg",
            theme === 'dark' ? (
              isOfflineMode
                ? "bg-yellow-900/50 text-yellow-400"
                : "bg-green-900/50 text-green-400"
            ) : (
              isOfflineMode
                ? "bg-warning-50 text-warning-600"
                : "bg-success-50 text-success-600"
            )
          )}
        >
          {isOfflineMode ? <WifiOff size={18} /> : <Wifi size={18} />}
        </motion.button>
        
        <div className="relative group">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={cn(
              "p-2 rounded-lg",
              theme === 'dark'
                ? "bg-gray-800 text-blue-400 hover:bg-gray-700"
                : "bg-secondary-50 text-secondary-600 hover:bg-secondary-100"
            )}
          >
            <Globe size={18} />
          </motion.button>
          
          <div className={cn(
            "absolute right-0 top-full mt-1 w-40 rounded-xl shadow-lg border py-1 hidden group-hover:block z-10",
            theme === 'dark'
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          )}>
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value as any)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm",
                  theme === 'dark' ? (
                    language === lang.value
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  ) : (
                    language === lang.value
                      ? "bg-secondary-50 text-secondary-700"
                      : "text-gray-700 hover:bg-gray-50"
                  )
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setUserMode(userMode === 'patient' ? 'doctor' : 'patient')}
          className={cn(
            "p-2 rounded-lg",
            theme === 'dark' ? (
              userMode === 'doctor'
                ? "bg-primary-900/50 text-primary-400"
                : "bg-gray-800 text-gray-400"
            ) : (
              userMode === 'doctor'
                ? "bg-primary-50 text-primary-600"
                : "bg-gray-50 text-gray-600"
            )
          )}
        >
          {userMode === 'doctor' ? <Stethoscope size={18} /> : <User size={18} />}
        </motion.button>
        
        <div className="relative group">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className={cn(
              "p-1 rounded-lg border",
              theme === 'dark' 
                ? "border-gray-700 hover:bg-gray-800" 
                : "border-gray-200 hover:bg-gray-50"
            )}
          >
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="h-8 w-8 rounded-lg object-cover" 
              />
            ) : (
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center",
                theme === 'dark'
                  ? "bg-gray-800 text-gray-400"
                  : "bg-primary-50 text-primary-600"
              )}>
                <UserCog size={16} />
              </div>
            )}
          </motion.button>
          
          <div className={cn(
            "absolute right-0 top-full mt-1 w-48 rounded-xl shadow-lg border py-1 hidden group-hover:block z-10",
            theme === 'dark'
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          )}>
            <div className={cn(
              "px-4 py-2 border-b",
              theme === 'dark' ? "border-gray-700" : "border-gray-100"
            )}>
              <p className={cn(
                "text-sm font-medium",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">ABHA ID: {user?.abhaId}</p>
            </div>
            <button 
              onClick={logout}
              className={cn(
                "w-full flex items-center space-x-2 px-4 py-2 text-sm",
                theme === 'dark'
                  ? "text-red-400 hover:bg-gray-700"
                  : "text-red-600 hover:bg-red-50"
              )}
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;