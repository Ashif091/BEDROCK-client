import React, {useState, useEffect} from "react"
import {useAuthStore} from "../../../stores/authStore"
import {createAxiosInstance} from "@/app/utils/axiosInstance"


const EditableFullname: React.FC = () => {
  const api = createAxiosInstance()
  const {user, setFullname} = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [fullname, setFullnameState] = useState(user?.fullname || "")

  useEffect(() => {
    setFullnameState(user?.fullname || "")
  }, [user])

  const handleFullnameClick = () => {
    setIsEditing(true)
  }

  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullnameState(e.target.value)
  }

  const handleFullnameSubmit = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      try {
        if (fullname.trim().length > 15 || fullname.trim().length < 2)
          return null
        const response = await api.patch(
          "/auth/user",
          {fullname},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        setFullname(response.data.fullname)

        setIsEditing(false)
      } catch (error) {
        console.error("Failed to update fullname:", error)
      }
    }
  }

  return (
    <>
      {isEditing ? (
        <input
          type="text"
          value={fullname}
          onChange={handleFullnameChange}
          onKeyDown={handleFullnameSubmit}
          className=" mb-2 p-1 rounded-md  bg-[#2b2b2b] text-white w-full select-text text-sm"
          autoFocus
        />
      ) : (
        <div
          onClick={handleFullnameClick}
          className="mb-2 p-1 rounded-md bg-[#2b2b2b] text-white w-full cursor-pointer text-sm"
        >
          {fullname || "Username"}
        </div>
      )}
    </>
  )
}

export default EditableFullname
