import React, {useState, useEffect} from "react"
import {useWorkspaceStore} from "../../../stores/workspaceStore"
import { createAxiosInstance } from "@/app/utils/axiosInstance "
const WorkspaceTitle = () => {
  const api = createAxiosInstance()

  const {workspaces, setTitle, currentlyWorking} = useWorkspaceStore()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitleInput] = useState("")

  useEffect(() => {
    const workspace = workspaces.find((ws) => ws._id === currentlyWorking)
    setTitleInput(workspace?.title || "")
  }, [currentlyWorking, workspaces])

  const handleBlurOrSubmit =async () => {
    if (title.trim().length < 2 || title.trim().length > 15) return null
    // const response = await axios.patch(
    //     `${BASE_URL}/workspace/update/:id`,
    //     {title},
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       withCredentials: true,
    //     }
    //   )
    setTitle(currentlyWorking as string, title)
    setIsEditing(false)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlurOrSubmit()
    }
  }

  return (
    <div className="">
      <p className="text-xs opacity-75 my-2">Name</p>
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlurOrSubmit}
          onKeyDown={handleKeyPress}
          className="mb-2 p-1 rounded-md bg-[#2b2b2b] text-white max-w-44 cursor-pointer text-sm border border-gray-500/50"
          autoFocus
        />
      ) : (
        <div
          className="mb-2 p-1 rounded-md bg-[#2b2b2b] text-white min-w-44 cursor-pointer text-sm border border-gray-500/50"
          onClick={() => setIsEditing(true)}
        >
          {title || "No title"}
        </div>
      )}
    </div>
  )
}

export default WorkspaceTitle
