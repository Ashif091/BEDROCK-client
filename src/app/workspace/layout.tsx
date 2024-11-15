'use client'

import { io } from "socket.io-client"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/stores/authStore"
import { AnimatePresence } from 'framer-motion'
import { WorkspaceNotification } from "@/components/global/WorkspaceNotification "
import { useNetworkStore } from "@/stores/networkStore"


const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore()
  const [notification, setNotification] = useState<any>(null)
  // const {socket} = useNetworkStore()
  const socket = io(process.env.NEXT_PUBLIC_SERVER_URL)
  
  useEffect(() => {
    if (user?.email) {
      socket.emit("notify", user.email)
      socket.on("user-added", (data) => {
        setNotification(data)
      })
    }
    console.log("socket layout from network ;",socket)
    return () => {
      socket.off("user-added")
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