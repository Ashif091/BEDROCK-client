'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createAxiosInstance } from "@/app/utils/axiosInstance"
import { useAuthStore } from "@/stores/authStore"

export default function PaymentSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(3)
  const { user } = useAuthStore()
  const api = createAxiosInstance()

  const price = searchParams.get('price')
  const plan = searchParams.get('plan')

  useEffect(() => {
    if (!user) {
      router.replace('/login')
      return
    }

    const confirmSubscription = async () => {
      try {
        await api.post('/auth/confirm-subscription', { price, plan })
      } catch (error) {
        console.error('Error confirming subscription:', error)
      }
    }

    confirmSubscription()

    // Use a countdown interval to redirect once it reaches zero
    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval)
          router.push('/workspace')
        }
        return prevCount - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [user, router, price, plan, api])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()
      router.replace('/workspace')
    }

    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-xl mb-2">Thank you for your purchase.</p>
        <p className="text-lg mb-4">
          You have successfully subscribed to the <span className="font-semibold">{plan}</span> plan for ${price}.
        </p>
        <p className="text-gray-600">
          Redirecting to workspace in {countdown} seconds...
        </p>
      </div>
    </div>
  )
}
