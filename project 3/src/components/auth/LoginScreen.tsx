import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Shield, User, KeyRound, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/utils';

const LoginScreen: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'abha' | 'aadhaar'>('abha');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const { login } = useAuthStore();
  
  const handleSendOTP = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setOtpSent(true);
    setError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'aadhaar') {
      if (!aadhaarNumber || aadhaarNumber.length !== 12) {
        setError('Please enter a valid 12-digit Aadhaar number');
        return;
      }
      if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      login(loginMethod === 'abha' ? '1234-5678-9012' : aadhaarNumber);
      setLoading(false);
    }, 1500);
  };
  
  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-center items-center p-4">
      <motion.div 
        className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <motion.div 
              variants={iconVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="h-12 w-12 bg-primary-900/50 rounded-full flex items-center justify-center text-primary-400"
            >
              <Heart className="h-6 w-6" />
            </motion.div>
            <motion.div 
              variants={iconVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 }}
              className="h-12 w-12 bg-secondary-900/50 rounded-full flex items-center justify-center text-secondary-400"
            >
              <Activity className="h-6 w-6" />
            </motion.div>
            <motion.div 
              variants={iconVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.6 }}
              className="h-12 w-12 bg-success-900/50 rounded-full flex items-center justify-center text-success-400"
            >
              <Shield className="h-6 w-6" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Login to your account</h1>
          <p className="text-gray-400">Access your health profile using your ABHA ID or Aadhaar-linked health credentials</p>
        </div>
        
        <div className="mb-6">
          <div className="flex rounded-xl bg-gray-800 p-1">
            <button
              onClick={() => setLoginMethod('abha')}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
                loginMethod === 'abha'
                  ? "bg-primary-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              )}
            >
              ABHA ID
            </button>
            <button
              onClick={() => setLoginMethod('aadhaar')}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
                loginMethod === 'aadhaar'
                  ? "bg-primary-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              )}
            >
              Aadhaar
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMethod === 'aadhaar' ? (
            <>
              <div>
                <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-300 mb-1">
                  Aadhaar Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="aadhaar"
                    type="text"
                    maxLength={12}
                    placeholder="12-digit Aadhaar Number"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    className={cn(
                      "block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl",
                      "text-white placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                      "transition-colors duration-200",
                      error ? "border-error-500 focus:border-error-500 focus:ring-error-500" : ""
                    )}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                    OTP
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="text-sm text-primary-400 hover:text-primary-300"
                  >
                    Send OTP
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className={cn(
                      "block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl",
                      "text-white placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                      "transition-colors duration-200"
                    )}
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="abhaId" className="block text-sm font-medium text-gray-300 mb-1">
                ABHA ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="abhaId"
                  type="text"
                  placeholder="xxxx-xxxx-xxxx"
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl",
                    "text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                    "transition-colors duration-200"
                  )}
                />
              </div>
            </div>
          )}
          
          {error && <p className="text-sm text-error-400">{error}</p>}
          
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={cn(
              "w-full flex items-center justify-center py-3 px-4 border border-transparent",
              "rounded-xl text-sm font-medium text-white",
              "bg-primary-600 hover:bg-primary-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
              "transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "space-x-2"
            )}
          >
            <span>{loading ? "Authenticating..." : "Continue"}</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </form>
        
        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400">
          <Shield className="h-4 w-4" />
          <span>Secured with ABHA authentication</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;