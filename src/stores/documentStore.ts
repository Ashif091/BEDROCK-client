import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export interface Document {
  _id?: string;
  workspaceId: string;
  title: string;
  content?: string;
  edges?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: (workspaceId: string) => Promise<void>;
  addDocument: (newDoc: Document) => Promise<void>;
  updateDocument: (updatedDoc: Document) => void;
  deleteDocument: (documentId: string) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: [],
      isLoading: false,
      error: null,
      fetchDocuments: async (workspaceId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(`${BASE_URL}/doc?workspaceId=${workspaceId}`, {
            withCredentials: true,
          });
          set({ documents: response.data, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch documents', isLoading: false });
        }
      },

      addDocument: async (newDoc: Document) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${BASE_URL}/doc`, newDoc, {
            withCredentials: true,
          });
          set((state) => ({
            documents: [...state.documents, response.data],
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to add document', isLoading: false });
        }
      },

      // Update an existing document
      updateDocument: (updatedDoc: Document) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc._id === updatedDoc._id ? updatedDoc : doc
          ),
        }));
      },

      // Delete a document by its ID
      deleteDocument: (documentId: string) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc._id !== documentId),
        }));
      },
    }),
    {
      name: 'document-storage',
      getStorage: () => localStorage, // Using localStorage for persistence
    }
  )
);
