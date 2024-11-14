import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL

export interface Document {
  _id?: string
  workspaceId: string
  title: string
  content?: string
  edges?: string[]
  createdAt?: Date
  updatedAt?: Date
}

interface DocumentState {
  documents: Document[]
  isLoading: boolean
  error: string | null
  fetchDocuments: (workspaceId: string) => Promise<void>
  addDocument: (newDoc: Document) => Promise<void>
  updateDocument: (updatedDoc: Document) => void
  updateDocTitle: (documentId: string, newTitle: string) => Promise<void>
  deleteDocument: (documentId: string) => void
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: [],
      isLoading: false,
      error: null,
      fetchDocuments: async (workspaceId: string) => {
        set({isLoading: true, error: null})
        try {
          const response = await axios.get(
            `${BASE_URL}/doc?workspaceId=${workspaceId}`,
            {
              withCredentials: true,
            }
          )
          set({documents: response.data, isLoading: false})
        } catch (error) {
          set({error: "Failed to fetch documents", isLoading: false})
        }
      },

      addDocument: async (newDoc: Document) => {
        set({isLoading: true, error: null})
        try {
          if(!newDoc._id){
            const response = await axios.post(`${BASE_URL}/doc`, newDoc, {
              withCredentials: true,
            })
            set((state) => ({
              documents: [...state.documents, response.data],
              isLoading: false,
            }))
          }else{
            set((state) => ({
              documents: [...state.documents, newDoc],
              isLoading: false,
            }))
          }

        } catch (error) {
          set({error: "Failed to add document", isLoading: false})
        }
      },

      updateDocument: (updatedDoc: Document) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc._id === updatedDoc._id ? updatedDoc : doc
          ),
        }))
      },

      updateDocTitle: async (documentId: string, newTitle: string) => {
        set({isLoading: true, error: null})
        try {
          set((state) => ({
            documents: state.documents.map((doc) =>
              doc._id === documentId ? {...doc, title: newTitle} : doc
            ),
          }))

          await axios.put(
            `${BASE_URL}/doc/${documentId}`,
            {title: newTitle},
            {withCredentials: true}
          )

          set({isLoading: false})
        } catch (error) {
          set({error: "Failed to update document title", isLoading: false})
        }
      },

      deleteDocument: (documentId: string) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc._id !== documentId),
        }))
      },
    }),
    {
      name: "document-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)