import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { io, Socket } from "socket.io-client"

interface NetworkStore {
  socket: Socket
  setSocket: (socket: Socket) => void
}

export const useNetworkStore = create<NetworkStore>()(
  persist(
    (set) => ({
      socket: io(process.env.NEXT_PUBLIC_SERVER_URL),
      setSocket: (socket) => set({ socket }),
    }),
    {
      name: "network-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
