import {create} from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      login: ( accessToken) => set({
        accessToken,
        isAuthenticated: true,
      }),
      logout: () => set({
        accessToken: null,
        isAuthenticated: false,
      }),
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: 'auth-storage', 
      getStorage: () => localStorage, 
    }
  )
);