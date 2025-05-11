"use client"

import {useRouter} from "next/navigation"
import {useEffect, useState} from "react"
import {useAuthStore} from "../../stores/authStore"


type WrappedComponentProps = Record<string, unknown>

function WithAuth<P extends WrappedComponentProps>(
  WrappedComponent: React.ComponentType<P>
) {

  const WithAuthComponent: React.FC<P> = (props) => {
    const {isAuthenticated, hasHydrated} = useAuthStore()
    const [isClient, setIsClient] = useState(false)
    const router = useRouter()

    useEffect(() => {
      setIsClient(true)
      if (hasHydrated && !isAuthenticated) {
        router.push("/login")
      }
    }, [isAuthenticated, router,hasHydrated])

    if (!isClient) {
      return null
    }

    if (isAuthenticated) {
      return <WrappedComponent {...props} />
    }

    return null
  }


  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`

  return WithAuthComponent
}

export default WithAuth
