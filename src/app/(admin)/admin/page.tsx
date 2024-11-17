'use client'

import { createAxiosInstance } from "@/app/utils/axiosInstance"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Toaster, toast } from "sonner"

interface Subscription {
  _id: string;
  plan: string;
  price: number;
  available_workspace: number;
}

export default function AdminDashboard() {
  const router = useRouter()
  const api = createAxiosInstance()
  const [isVerifying, setIsVerifying] = useState(true)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await api.get("/admin/verify")
        if (res.data.verified) {
          setIsVerifying(false)
          fetchSubscriptions()
        } else {
          router.push("/admin-login")
        }
      } catch (error) {
        console.error("Verification error:", error)
        toast.error("Failed to verify admin status. Redirecting to login.")
        router.push("/admin-login")
      }
    }

    verifyAdmin()
  }, [])

  const fetchSubscriptions = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/admin/subscriptions')
      setSubscriptions(res.data)
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      toast.error("Failed to fetch subscriptions.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription({ ...subscription })
  }

  const handleUpdate = async () => {
    if (!editingSubscription) return

    setIsLoading(true)
    try {
      await api.patch(`/admin/subscription/update/${editingSubscription._id}`, {
        plan: editingSubscription.plan,
        price: editingSubscription.price,
        available_workspace: editingSubscription.available_workspace
      })
      toast.success("Subscription updated successfully.")
      fetchSubscriptions()
      setEditingSubscription(null)
    } catch (error) {
      console.error("Error updating subscription:", error)
      toast.error("Failed to update subscription.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#191919] bg-opacity-75">
        <div className="flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{animationDelay: `${index * 0.1}s`}}
            ></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  p-8">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>

      {isLoading ? (
        <div className="text-center">Loading subscriptions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <div key={subscription._id} className="bg-[#3e3fb0] bg-opacity-10 backdrop-filter backdrop-blur-sm shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{subscription.plan}</h2>
              <p className="text-gray-600 mb-2">Price: ${subscription.price}</p>
              <p className="text-gray-600 mb-4">Workspaces: {subscription.available_workspace}</p>
              <button
                onClick={() => handleEdit(subscription)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {editingSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="bg-[#3e3fb0] bg-opacity-10 backdrop-filter backdrop-blur-sm p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Subscription</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Plan</label>
                <input
                  type="text"
                  value={editingSubscription.plan}
                  disabled
                  onChange={(e) => setEditingSubscription({ ...editingSubscription, plan: e.target.value })}
                  className="mt-1 cursor-not-allowed block w-full rounded-md bg-transparent border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Price</label>
                <input
                  type="number"
                  value={editingSubscription.price}
                  onChange={(e) => setEditingSubscription({ ...editingSubscription, price: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md bg-transparent border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Available Workspaces</label>
                <input
                  type="number"
                  value={editingSubscription.available_workspace}
                  onChange={(e) => setEditingSubscription({ ...editingSubscription, available_workspace: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md bg-transparent border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setEditingSubscription(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  )
}