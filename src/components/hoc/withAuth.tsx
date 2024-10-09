"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuthStore } from "../../stores/authStore"

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const { isAuthenticated } = useAuthStore()
    const [isClient, setIsClient] = useState(false)
    const router = useRouter()

    useEffect(() => {
      setIsClient(true)
      if (!isAuthenticated) {
        router.push("/login")
      }
    }, [isAuthenticated, router])

    if (!isClient) {
      return null 
    }

    if (isAuthenticated) {
      return <WrappedComponent {...props} />
    }

    return null
  }
}

export default withAuth