import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { type HealthEvent } from '../../stores/healthStore';

interface TimelineProps {
  events: HealthEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'check':
        return <Calendar className="h-4 w-4 text-primary-500" />;
      case 'diagnosis':
        return <AlertCircle className="h-4 w-4 text-warning-500" />;
      case 'medication':
        return <Clock className="h-4 w-4 text-secondary-500" />;
      case 'upload':
        return <FileText className="h-4 w-4 text-accent-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusIndicator = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'completed':
        return <div className="h-2 w-2 bg-success-500 rounded-full" />;
      case 'pending':
        return <div className="h-2 w-2 bg-warning-500 rounded-full" />;
      case 'upcoming':
        return <div className="h-2 w-2 bg-primary-500 rounded-full" />;
      default:
        return <div className="h-2 w-2 bg-gray-300 rounded-full" />;
    }
  };
  
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No events to display</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div 
          key={event.id} 
          className="flex items-start space-x-3 bg-white rounded-xl p-3 border border-gray-200 shadow-sm"
        >
          <div className="mt-0.5">
            {getEventIcon(event.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">{event.title}</h3>
              {getStatusIndicator(event.status)}
            </div>
            <p className="text-xs text-gray-600 mt-0.5">{event.description}</p>
            <p className="text-xs text-gray-400 mt-1">{formatDate(event.date)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;