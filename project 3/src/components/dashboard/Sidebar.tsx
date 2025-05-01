import React from 'react';
import { motion } from 'framer-motion';
import { Settings as Lungs, Heart, Droplet, FlaskConical, Clock, Upload } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import RiskIndicator from './RiskIndicator';
import Timeline from './Timeline';
import UploadHistory from './UploadHistory';
import { useHealthStore, type HealthRisk, type HealthEvent, type UploadRecord } from '../../stores/healthStore';

const Sidebar: React.FC = () => {
  const { risks, events, uploads } = useHealthStore();
  
  return (
    <div className="p-4 h-full overflow-y-auto">
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Health Risk Assessment</h2>
        <div className="space-y-3">
          <RiskIndicator 
            icon={<Lungs className="h-5 w-5" />}
            disease="Tuberculosis"
            level={risks.find(r => r.disease === 'tuberculosis')?.level || 'low'}
            score={risks.find(r => r.disease === 'tuberculosis')?.score || 0}
          />
          <RiskIndicator 
            icon={<Heart className="h-5 w-5" />}
            disease="Cardiovascular Disease"
            level={risks.find(r => r.disease === 'cardiovascular')?.level || 'low'}
            score={risks.find(r => r.disease === 'cardiovascular')?.score || 0}
          />
          <RiskIndicator 
            icon={<Droplet className="h-5 w-5" />}
            disease="Diabetes"
            level={risks.find(r => r.disease === 'diabetes')?.level || 'low'}
            score={risks.find(r => r.disease === 'diabetes')?.score || 0}
          />
          <RiskIndicator 
            icon={<FlaskConical className="h-5 w-5" />}
            disease="Cancer"
            level={risks.find(r => r.disease === 'cancer')?.level || 'low'}
            score={risks.find(r => r.disease === 'cancer')?.score || 0}
          />
        </div>
      </section>
      
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Timeline</h2>
          <button className="text-xs text-primary-600 hover:text-primary-800">View all</button>
        </div>
        
        <Timeline events={events.slice(0, 3)} />
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Upload History</h2>
          <button className="text-xs text-primary-600 hover:text-primary-800">View all</button>
        </div>
        
        <UploadHistory uploads={uploads.slice(0, 3)} />
      </section>
    </div>
  );
};

export default Sidebar;