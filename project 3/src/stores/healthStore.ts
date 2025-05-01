import { create } from 'zustand';

export interface HealthRisk {
  disease: 'tuberculosis' | 'cardiovascular' | 'diabetes' | 'cancer';
  level: 'low' | 'moderate' | 'high';
  score: number;
  lastUpdated: Date;
}

export interface HealthEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'check' | 'diagnosis' | 'medication' | 'upload';
  status?: 'completed' | 'pending' | 'upcoming';
}

export interface UploadRecord {
  id: string;
  name: string;
  type: 'xray' | 'ecg' | 'fundus' | 'pdf' | 'prescription';
  uploadDate: Date;
  status: 'processed' | 'analyzing' | 'error';
  result?: string;
  confidence?: number;
}

interface HealthState {
  risks: HealthRisk[];
  events: HealthEvent[];
  uploads: UploadRecord[];
  addUpload: (upload: Omit<UploadRecord, 'id'>) => void;
  processUpload: (id: string, result: string, confidence: number) => void;
}

// Mock data
const mockRisks: HealthRisk[] = [
  { disease: 'tuberculosis', level: 'low', score: 15, lastUpdated: new Date(2023, 2, 15) },
  { disease: 'cardiovascular', level: 'moderate', score: 48, lastUpdated: new Date(2023, 4, 22) },
  { disease: 'diabetes', level: 'high', score: 72, lastUpdated: new Date(2023, 5, 3) },
  { disease: 'cancer', level: 'low', score: 12, lastUpdated: new Date(2023, 1, 28) },
];

const mockEvents: HealthEvent[] = [
  {
    id: 'evt-001',
    title: 'Annual Check-up',
    description: 'Complete health assessment at City Hospital',
    date: new Date(2023, 5, 15),
    type: 'check',
    status: 'completed',
  },
  {
    id: 'evt-002',
    title: 'Blood Sugar Test',
    description: 'Fasting glucose and HbA1c measurement',
    date: new Date(2023, 7, 22),
    type: 'check',
    status: 'completed',
  },
  {
    id: 'evt-003',
    title: 'Diabetes Management Review',
    description: 'Adjustment to insulin regimen',
    date: new Date(2023, 8, 30),
    type: 'medication',
    status: 'completed',
  },
  {
    id: 'evt-004',
    title: 'Chest X-ray Upload',
    description: 'Annual TB screening',
    date: new Date(2023, 10, 12),
    type: 'upload',
    status: 'completed',
  },
  {
    id: 'evt-005',
    title: 'Cardiology Appointment',
    description: 'With Dr. Sharma at Heart Center',
    date: new Date(2024, 0, 15),
    type: 'check',
    status: 'upcoming',
  },
];

const mockUploads: UploadRecord[] = [
  {
    id: 'upl-001',
    name: 'chest_xray_2023.jpg',
    type: 'xray',
    uploadDate: new Date(2023, 10, 12),
    status: 'processed',
    result: 'No abnormalities detected',
    confidence: 94,
  },
  {
    id: 'upl-002',
    name: 'ecg_reading_dec.pdf',
    type: 'ecg',
    uploadDate: new Date(2023, 11, 5),
    status: 'processed',
    result: 'Sinus rhythm, no acute changes',
    confidence: 87,
  },
  {
    id: 'upl-003',
    name: 'lab_results_jan2024.pdf',
    type: 'pdf',
    uploadDate: new Date(2024, 0, 8),
    status: 'processed',
    result: 'Elevated blood glucose levels',
    confidence: 92,
  },
];

export const useHealthStore = create<HealthState>((set) => ({
  risks: mockRisks,
  events: mockEvents,
  uploads: mockUploads,
  
  addUpload: (upload) => {
    const newUpload = {
      ...upload,
      id: `upl-${Date.now()}`,
    };
    
    set((state) => ({
      uploads: [newUpload, ...state.uploads],
    }));
    
    // Also add an event for this upload
    const newEvent: HealthEvent = {
      id: `evt-${Date.now()}`,
      title: `${upload.type.toUpperCase()} Upload`,
      description: `Uploaded ${upload.name} for analysis`,
      date: upload.uploadDate,
      type: 'upload',
      status: 'completed',
    };
    
    set((state) => ({
      events: [newEvent, ...state.events],
    }));
    
    return newUpload.id;
  },
  
  processUpload: (id, result, confidence) => {
    set((state) => ({
      uploads: state.uploads.map((upload) =>
        upload.id === id
          ? { ...upload, status: 'processed', result, confidence }
          : upload
      ),
    }));
  },
}));