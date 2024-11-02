"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuthStore } from "../../stores/authStore"

// Define the props type for the wrapped component
type WrappedComponentProps = Record<string, unknown>

function NonAuth<P extends WrappedComponentProps>(
  WrappedComponent: React.ComponentType<P>
) {
  // Create a new component
  const NonAuthComponent: React.FC<P> = (props) => {
    const [isClient, setIsClient] = useState(false)
    const { isAuthenticated } = useAuthStore()
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

  
  NonAuthComponent.displayName = `NonAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return NonAuthComponent
}

export default NonAuth
