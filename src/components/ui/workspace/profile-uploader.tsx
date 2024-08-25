import React, {useState, useEffect} from "react"
import Image from "next/image"
import {useAuthStore} from "@/stores/authStore"
import {useEdgeStore} from "@/lib/edgestore"
import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL

const ProfileImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)

  const {edgestore} = useEdgeStore()
  const {user, setProfile, uploading, setUploading, progress, setProgress} =
    useAuthStore()

  useEffect(() => {
    if (file) {
      handleUpload()
    }
  }, [file])

  const handleUpload = async () => {
    if (file) {
      setUploading(true)
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: user?.profile,
          },
          onProgressChange: (progress) => {
            setProgress(progress)
          },
        })
        setProfile(res.url)
        await axios.patch(
          `${BASE_URL}/auth/user`,
          {profile: res.url},
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      } catch (error) {
        console.error("Upload failed:", error)
      } finally {
        setTimeout(() => {
          setUploading(false)
        }, 3000)
      }
    }
  }

  const handleImageClick = () => {
    document.getElementById("file-input")?.click()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div
      className={`relative w-14 h-14 rounded-full mr-8 overflow-hidden`}
      onClick={handleImageClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Image
        src={user?.profile || "/settings/user.png"}
        alt="Profile"
        width={128}
        height={128}
        className="rounded-full cursor-pointer"
      />

      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0])
          }
        }}
      />

      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 w-full h-full">
            <svg
              className="absolute inset-0"
              style={{
                transform: "scale(1.15)",
                width: "100%",
                height: "100%",
              }}
              viewBox="0 0 36 36"
            >
              <path
                className="text-gray-300"
                strokeDasharray="100, 100"
                d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              ></path>
              <path
                className="text-blue-500"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                style={{transition: "stroke-dasharray 0.3s ease"}}
              ></path>
            </svg>
          </div>
          <div className="text-white text-sm">{progress}%</div>
        </div>
      )}
    </div>
  )
}

export default ProfileImageUploader
