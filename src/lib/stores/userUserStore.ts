import { create } from 'zustand';

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface UserState {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  saveUserData: (userId: string, email: string) => Promise<void>;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userData: null,
  isLoading: false,
  error: null,
  
  saveUserData: async (userId, email) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save user data');
      }
      
      set({ userData: { id: userId, email } });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setUserData: (data) => set({ userData: data }),
  
  clearUserData: () => set({ userData: null }),
}));