import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  abhaId: string;
  age: number;
  gender: string;
  pastConditions: string[];
  profileImage?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (abhaId: string) => void;
  logout: () => void;
}

// Mock user data
const mockUser: User = {
  id: 'usr-123456',
  name: 'Prabhmannat Singh',
  abhaId: '1234-5678-9012',
  age: 24,
  gender: 'Male',
  pastConditions: ['Seasonal Allergies'],
  profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150'
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (abhaId: string) => {
    // In a real app, this would validate the ABHA ID with a backend
    // For demo purposes, we'll just accept any input and return the mock user
    set({ isAuthenticated: true, user: mockUser });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));