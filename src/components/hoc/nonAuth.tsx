"use client"
import {useRouter} from "next/navigation"
import {useEffect, useState} from "react"
import {useAuthStore} from "../../stores/authStore"

const nonAuth = <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
  return (props: any) => {
    const [isClient, setIsClient] = useState(false)
    const {isAuthenticated} = useAuthStore()
    const router = useRouter()

    useEffect(() => {
      setIsClient(true)
      if (isAuthenticated) {
        router.push("/workspace")
      }
    }, [isAuthenticated, router])
    
    if (!isClient) {
      return null 
    }
    if (!isAuthenticated) {
      return <WrappedComponent {...props} />
    }

    return null
  }
}

export default nonAuth
