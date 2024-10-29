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
  const {socket} = useNetworkStore()
  
  useEffect(() => {
    if (user?.email) {
      socket.emit("notify", user.email)
      socket.on("user-added", (data) => {
        setNotification(data)
      })
    }
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