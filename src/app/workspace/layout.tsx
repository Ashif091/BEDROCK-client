'use client'

import { io } from "socket.io-client"
import { useEffect, useRef, useState } from "react"
import { useAuthStore } from "@/stores/authStore"
import { AnimatePresence } from 'framer-motion'
import { WorkspaceNotification } from "@/components/global/WorkspaceNotification "
import { useNetworkStore } from "@/stores/networkStore"


const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore()
  const [notification, setNotification] = useState<any>(null)
  // const {socket} = useNetworkStore()
  console.log("server url ,:",process.env.NEXT_PUBLIC_SERVER_URL);
  
  // const socket = io(process.env.NEXT_PUBLIC_SERVER_URL)
  const socketRef = useRef<any>(null)
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
        path: '/app/socket.io',
        transports: ['websocket', 'polling'],
        secure:true,
        // rejectUnauthorized: false,
        // reconnection: true,
        // reconnectionAttempts: 5,
        // reconnectionDelay: 1000,
      })
    }
    if (user?.email) {
      socketRef.current.emit("notify", user.email)
      socketRef.current.on("user-added", (data:any) => {
        setNotification(data)
      })
    }
    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id)
    })
    console.log("socket layout from network ;",socketRef.current)
    return () => {
      socketRef.current.off("user-added")
      socketRef.current.off("connect")
    }
  }, [user])

  const closeNotification = () => {
    setNotification(null)
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {notification && (
          <WorkspaceNotification
            data={notification}
            onClose={closeNotification}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default WorkspaceLayout