import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  fullname: string;
  email: string;
  profile?: string;
}

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  uploading: boolean;
  progress: number;
  login: (accessToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setFullname: (fullname: string) => void;
  setProfile: (profile: string) => void;
  setUploading: (uploading: boolean) => void;
  setProgress: (progress: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      isAuthenticated: false,
      user: null,
      uploading: false,
      progress: 0,
      login: (accessToken) => set({
        accessToken,
        isAuthenticated: true,
      }),
      logout: () => set({
        accessToken: null,
        isAuthenticated: false,
        user: null,
      }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      setFullname: (fullname) => set((state) => {
        if (state.user) {
          return {
            user: { ...state.user, fullname },
          };
        }
        return state;
      }),
      setProfile: (profile) => set((state) => {
        if (state.user) {
          return {
            user: { ...state.user, profile },
          };
        }
        return state;
      }),
      setUploading: (uploading) => set({ uploading }),
      setProgress: (progress) => set({ progress }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);
