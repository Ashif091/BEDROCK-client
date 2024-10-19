"use client"
import React, {useCallback, useState} from "react"
import {motion} from "framer-motion"
import { Toaster, toast } from 'sonner';
import Image from "next/image"
import close from "../../../public/close-button.png"
import throttle from "lodash.throttle"
import {mcn} from "../lib/utils"
import {  useRouter } from 'next/navigation'
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { createAxiosInstance } from "@/app/utils/axiosInstance";
const MAX_NAME_LENGTH = 15

interface WorkspaceFormProps {
  isOpen: boolean
  onClose: () => void
}


const WorkspaceForm: React.FC<WorkspaceFormProps> = ({isOpen, onClose}) => {
  const api = createAxiosInstance()
  const {workspaces,addWorkspace} = useWorkspaceStore()

  const [name, setName] = useState("")
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const router = useRouter()

  const checkAvailability = useCallback(
    throttle(async (name: string) => {
      if (name.trim().length === 0 || name.length > MAX_NAME_LENGTH) {
        setIsAvailable(false)
        return
      }

      try {
        const response = await api.post(
          "/workspace/check-name",
          {name},
          {
            headers: {"Content-Type": "application/json"},
          }
        )
        setIsAvailable(!response.data.available)
      } catch (error) {
        console.error("Error checking workspace name availability:", error)
        setIsAvailable(false)
      }
    }, 500),
    []
  )

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)

    if (newName.trim()) {
      checkAvailability(newName)
    } else {
      setIsAvailable(null)
    }
    if (newName.trim().length === 0) setIsAvailable(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAvailable) return

    try {
      const response = await api.post(
        "/workspace/create",
        {name},
      )
      addWorkspace(response.data)
      router.push(`/workspace/${response.data._id}`)
      onClose()
    } catch (error:any) {
        if (error.response?.data?.error) {
           setIsAvailable(false)
            toast.error(error.response.data.error, {
              position: "bottom-left",
            })
            console.log("error in post ", error.response.data.error)
          } else {
            console.log("An unexpected error occurred:", error)
          }
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      initial={{x: "100%"}}
      animate={{x: isOpen ? "0%" : "100%"}}
      exit={{x: "100%"}}
      transition={{type: "spring", stiffness: 300, damping: 30}}
    >
      <div className="absolute bg-[#4b4a7a] w-screen h-full flex gap-6 p-24">
      <Toaster/>
        <div className="relative top-0 left-0 mt-1 ml-4">
          <Image
            alt="close"
            onClick={onClose}
            src={close}
            width={20}
            className="object-contain cursor-pointer"
          />
        </div>

        <div className="w-full">
          <div className="border-b border-gray-100 border-opacity-25 w-[80%] h-[12vh] mb-6">
            <h2 className="text-3xl mb-6">Create a Workspace</h2>
          </div>
          <h1 className="text-4xl font-alata font-light">
            Let's start with a name for <br />
            your project
          </h1>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <div className="relative w-[80%]">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your workspace name"
                className="w-full h-16 mt-10 text-4xl border-0 border-b border-gray-200 bg-transparent border-opacity-50 focus:outline-none focus:ring-0 focus:border-opacity-50 placeholder-opacity-70"
              />
            </div>
            <div className="w-[80%] pt-8 flex items-end justify-between">
              {isAvailable === null ? (
                <div className="rounded-xl bg-gray-300/20 px-3 py-1">
                  example-name
                </div>
              ) : isAvailable ? (
                <div className="rounded-xl bg-green-500/20 px-3 py-1 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-green-500">Available</span>
                </div>
              ) : (
                <div className="rounded-xl bg-red-500/20 px-3 py-1 flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  <span className="text-red-500">Not available</span>
                </div>
              )}
              <button
                type="submit"
                className={mcn(
                  "bg-gray-200/45 text-white p-2 rounded-md hover:bg-gray-200/65 transition w-44 py-4",
                  {
                    "bg-gray-200/15 hover:bg-gray-200/15 cursor-not-allowed":
                      !isAvailable,
                  }
                )}
                disabled={!isAvailable}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

export default WorkspaceForm
