import React, { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, Wind, Droplet, Settings as Lungs } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const VitalsMonitor: React.FC = () => {
  const [heartRate, setHeartRate] = useState(72);
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [temperature, setTemperature] = useState(98.6);
  const [oxygenLevel, setOxygenLevel] = useState(98);
  const [respirationRate, setRespirationRate] = useState(16);

  // Simulate real-time vitals updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => prev + Math.floor(Math.random() * 3) - 1);
      setSystolic(prev => prev + Math.floor(Math.random() * 3) - 1);
      setDiastolic(prev => prev + Math.floor(Math.random() * 3) - 1);
      setOxygenLevel(prev => Math.min(100, Math.max(95, prev + Math.floor(Math.random() * 3) - 1)));
      setRespirationRate(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getVitalStatus = (value: number, type: string) => {
    switch (type) {
      case 'heart':
        return value < 60 ? 'warning' : value > 100 ? 'danger' : 'normal';
      case 'bp':
        return value > 140 ? 'danger' : value < 90 ? 'warning' : 'normal';
      case 'oxygen':
        return value < 95 ? 'danger' : value < 97 ? 'warning' : 'normal';
      case 'temp':
        return value > 99.5 ? 'danger' : value < 97.5 ? 'warning' : 'normal';
      default:
        return 'normal';
    }
  };

  const VitalCard = ({ 
    title, 
    value, 
    unit, 
    icon: Icon, 
    type,
    color = "primary",
    children 
  }: {
    title: string;
    value: number | string;
    unit: string;
    icon: any;
    type: string;
    color?: "primary" | "secondary" | "accent";
    children?: React.ReactNode;
  }) => {
    const status = typeof value === 'number' ? getVitalStatus(value, type) : 'normal';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              color === "primary" ? "bg-primary-50 text-primary-500" :
              color === "secondary" ? "bg-secondary-50 text-secondary-500" :
              "bg-accent-50 text-accent-500"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          <span className={cn(
            "text-2xl font-bold",
            status === 'danger' ? "text-error-600 dark:text-error-400" :
            status === 'warning' ? "text-warning-600 dark:text-warning-400" :
            "text-gray-900 dark:text-gray-100"
          )}>
            {value} <span className="text-sm text-gray-500">{unit}</span>
          </span>
        </div>

        <div className="space-y-3">
          {children}
          
          <div className="h-24 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
            <div className="h-full w-full relative">
              {/* Simulated vital sign waveform */}
              <svg className="h-full w-full" preserveAspectRatio="none">
                <path
                  d={`M 0 50 
                      ${Array.from({ length: 20 }, (_, i) => {
                        const x = (i * 20);
                        const y = 50 + Math.sin(i) * 20 + Math.random() * 10;
                        return `L ${x} ${y}`;
                      }).join(' ')}`}
                  fill="none"
                  stroke={status === 'danger' ? '#ef4444' : 
                          status === 'warning' ? '#f97316' : 
                          '#0d8df2'}
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Last 5 minutes</span>
            <span className="text-gray-500">Updated just now</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vitals Monitor</h2>
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
          </span>
          <span className="text-sm text-gray-500">Live Monitoring</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VitalCard
          title="Heart Rate"
          value={heartRate}
          unit="bpm"
          icon={Heart}
          type="heart"
          color="primary"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Min: {heartRate - 5}</span>
            <span className="text-gray-500">Max: {heartRate + 7}</span>
          </div>
        </VitalCard>

        <VitalCard
          title="Blood Pressure"
          value={`${systolic}/${diastolic}`}
          unit="mmHg"
          icon={Activity}
          type="bp"
          color="secondary"
        >
          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
            <div>
              <span className="text-gray-500">Systolic</span>
              <div className="font-medium">{systolic} mmHg</div>
            </div>
            <div>
              <span className="text-gray-500">Diastolic</span>
              <div className="font-medium">{diastolic} mmHg</div>
            </div>
          </div>
        </VitalCard>

        <VitalCard
          title="Body Temperature"
          value={temperature}
          unit="°F"
          icon={Thermometer}
          type="temp"
          color="accent"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Trend: Stable</span>
            <span className={temperature > 99 ? "text-error-500" : "text-success-500"}>
              {temperature > 99 ? "Above Normal" : "Normal"}
            </span>
          </div>
        </VitalCard>

        <VitalCard
          title="Oxygen Saturation"
          value={oxygenLevel}
          unit="%"
          icon={Wind}
          type="oxygen"
          color="primary"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Status</span>
            <span className={cn(
              oxygenLevel >= 97 ? "text-success-500" :
              oxygenLevel >= 95 ? "text-warning-500" :
              "text-error-500"
            )}>
              {oxygenLevel >= 97 ? "Optimal" :
               oxygenLevel >= 95 ? "Acceptable" :
               "Low"}
            </span>
          </div>
        </VitalCard>

        <VitalCard
          title="Respiration Rate"
          value={respirationRate}
          unit="bpm"
          icon={Lungs}
          type="respiration"
          color="secondary"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Normal Range</span>
            <span className="text-gray-500">12-20 bpm</span>
          </div>
        </VitalCard>

        <VitalCard
          title="Hydration"
          value="92"
          unit="%"
          icon={Droplet}
          type="hydration"
          color="accent"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Daily Goal</span>
            <span className="text-success-500">On Track</span>
          </div>
        </VitalCard>
      </div>
    </div>
  );
};

export default VitalsMonitor;