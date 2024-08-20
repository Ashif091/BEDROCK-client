import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export interface Workspace {
  _id: string;
  title: string;
  workspaceOwner: string;
  collaborators?: string[];
  documents?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface WorkspaceState {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (updatedWorkspace: Workspace) => void;
  deleteWorkspace: (workspaceId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaces: [],
      isLoading: false,
      error: null,
      fetchWorkspaces: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(`${BASE_URL}/workspace`, {
            withCredentials: true,
          });
          set({ workspaces: response.data, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch workspaces', isLoading: false });
        }
      },
      addWorkspace: (workspace) => set((state) => ({
        workspaces: [...state.workspaces, workspace],
      })),
      updateWorkspace: (updatedWorkspace) => set((state) => ({
        workspaces: state.workspaces.map((workspace) => 
          workspace._id === updatedWorkspace._id ? updatedWorkspace : workspace
        ),
      })),
      deleteWorkspace: (workspaceId) => set((state) => ({
        workspaces: state.workspaces.filter((workspace) => workspace._id !== workspaceId),
      })),
    }),
    {
      name: 'workspace-storage',
      getStorage: () => localStorage,
    }
  )
);