import {create} from "zustand"
import {persist} from "zustand/middleware"
import axios from "axios"
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
interface User {
  _id: string
  fullname: string
  email: string
  profile?: string
  verified?: boolean
}

interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  user: User | null
  uploading: boolean
  progress: number
  login: (accessToken: string) => Promise<void>
  logout: () => void
  setAccessToken: (token: string) => void
  setUser: (user: User) => void
  setFullname: (fullname: string) => void
  setProfile: (profile: string) => void
  setUploading: (uploading: boolean) => void
  setProgress: (progress: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      isAuthenticated: false,
      user: null,
      uploading: false,
      progress: 0,
      login: async (accessToken) => {
        try {
          set({accessToken, isAuthenticated: true})

          const response = await axios.get<User>(`${BASE_URL}/auth/users/me`, {
            withCredentials: true,
          })
          console.log(response)
          const userData = response.data
          set({
            user: {
              _id: userData._id,
              fullname: userData.fullname,
              email: userData.email,
              verified: userData.verified,
              profile: userData.profile || undefined,
            },
          })
        } catch (error) {
          console.error("Failed to fetch user data:", error)
          set({
            accessToken: null,
            isAuthenticated: false,
            user: null,
          })
        }
      },
      logout: () =>
        set({
          accessToken: null,
          isAuthenticated: false,
          user: null,
        }),
      setAccessToken: (accessToken) => set({accessToken}),
      setUser: (user) => set({user}),
      setFullname: (fullname) =>
        set((state) => {
          if (state.user) {
            return {
              user: {...state.user, fullname},
            }
          }
          return state
        }),
      setProfile: (profile) =>
        set((state) => {
          if (state.user) {
            return {
              user: {...state.user, profile},
            }
          }
          return state
        }),
      setUploading: (uploading) => set({uploading}),
      setProgress: (progress) => set({progress}),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
)
