"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuthStore } from "../../stores/authStore"

// Define the props type for the wrapped component
type WrappedComponentProps = Record<string, unknown>

function WithAuth<P extends WrappedComponentProps>(
  WrappedComponent: React.ComponentType<P>
) {
  // Create a new component
  const WithAuthComponent: React.FC<P> = (props) => {
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

  // Set display name for the new component
  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithAuthComponent
}

export default WithAuth