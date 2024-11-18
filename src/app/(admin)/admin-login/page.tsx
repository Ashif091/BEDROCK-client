"use client"

import {createAxiosInstance} from "@/app/utils/axiosInstance"
import React, {useEffect, useRef, useState} from "react"
import {Toaster, toast} from "sonner"
import {useRouter} from "next/navigation"

const AdminLogin: React.FC = () => {
  const api = createAxiosInstance()
  const router = useRouter()
  const adminIdRef = useRef<HTMLInputElement>(null)
  const adminKeyRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get("/admin/verify")
        if (res.data.verified) {
          router.push('/admin')
        }
      } catch (error) {
        setIsVerifying(false)
        console.error("Verification error:", error)
      }
    }
    verify()
  }, [isLoading])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const adminId = adminIdRef.current?.value
    const adminKey = adminKeyRef.current?.value

    if (!adminId || !adminKey) {
      toast.error("Both Admin ID and Entry Key are required!")
      setIsLoading(false)
      return
    }

    try {
      const res = await api.post("/admin/login", {adminId, adminKey})

      if (res.status === 200) {
        toast.success("Login successful!")
        router.push("/admin")
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Login failed. Please try again."
        )
      } else if (error.request) {
        toast.error("No response from server. Please try again later.")
      } else {
        toast.error("An error occurred. Please try again.")
      }
      console.error("Login error:", error)
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
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="w-full max-w-sm p-8 space-y-8 rounded-lg bg-[#3e3fb0] bg-opacity-10 backdrop-filter backdrop-blur-sm">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-white">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="adminId" className="sr-only">
                Admin ID
              </label>
              <input
                id="adminId"
                name="adminId"
                type="text"
                className="bg-transparent appearance-none rounded-md mb-5 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Admin ID"
                ref={adminIdRef}
                required
              />
            </div>
            <div>
              <label htmlFor="entryKey" className="sr-only">
                Entry Key
              </label>
              <input
                id="entryKey"
                name="entryKey"
                type="password"
                className="bg-transparent appearance-none rounded-md mb-5 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Entry Key"
                ref={adminKeyRef}
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  )
}

export default AdminLogin
