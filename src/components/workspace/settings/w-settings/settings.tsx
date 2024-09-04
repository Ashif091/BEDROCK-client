import React, {useState, useEffect, useRef} from "react"
import WorkspaceTitle from "@/components/ui/workspace/workspace-title"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import {createAxiosInstance} from "@/app/utils/axiosInstance "
import {useEdgeStore} from "@/lib/edgestore"

const WorkSpaceSettings = () => {
  const {currentlyWorking, setTitle, setIcon} = useWorkspaceStore()
  const {edgestore} = useEdgeStore()
  const [title, setTitleInput] = useState(currentlyWorking?.title || "")
  const [originalTitle, setOriginalTitle] = useState(
    currentlyWorking?.title || ""
  )
  const [icon, setIconFile] = useState<File | null>(null)
  const [originalIconUrl, setOriginalIconUrl] = useState(
    currentlyWorking?.icon || ""
  )
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentlyWorking?.icon || ""
  )
  const [isEditing, setIsEditing] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const api = createAxiosInstance()

  useEffect(() => {
    if (icon) {
      const objectUrl = URL.createObjectURL(icon)
      setPreviewUrl(objectUrl)

      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [icon])

  const handleTitleChange = (newTitle: string) => {
    setTitleInput(newTitle)
    checkIfEditing(newTitle, icon)
  }

  const handleIconChange = (newIcon: File) => {
    setIconFile(newIcon)
    checkIfEditing(title, newIcon)
  }

  const checkIfEditing = (newTitle: string, newIcon: File | null) => {
    if (newTitle.trim() !== originalTitle || newIcon) {
      setIsEditing(true)
    } else {
      setIsEditing(false)
    }
  }
  const handleSave = async () => {
    try {
      if (!currentlyWorking) return
      setIsEditing(false)

      const data: {title?: string; icon?: string} = {}

      if (title.trim()!== originalTitle) {
        data.title = title
      }

      if (icon) {
        const res = await edgestore.publicFiles.upload({
          file: icon,
          options: {
            replaceTargetUrl: originalIconUrl,
          },
          onProgressChange:(progressData) => {
            setProgress(progressData)
          },
        })

        data.icon = res.url
        setIcon(currentlyWorking._id as string, res.url)
      }

      await api.patch(`/workspace/update/${currentlyWorking._id}`, data)
      if (data.title) {
        setTitle(currentlyWorking._id as string, title)
        setOriginalTitle(title)
      }

      if (data.icon) {
        setOriginalIconUrl(data.icon)
      }
      setProgress(null)
    } catch (error) {
      console.error("Failed to update the workspace settings", error)
    }
  }

  const handleCancel = () => {
    setTitleInput(originalTitle)
    setIconFile(null)
    setPreviewUrl(originalIconUrl)
    setIsEditing(false)
  }
  

  const handleImageClick = () => {
    document.getElementById("workspace-icon-input")?.click()
  }

  return (
    <div className="w-full relative h-full select-none flex flex-col justify-between">
      <div className="">
        <p className="text-sm font-extralight opacity-65">Settings</p>
        <div className="flex items-center my-3 border-t-[.1rem] border-[#383838]">
          <WorkspaceTitle title={title} onTitleChange={handleTitleChange} />
        </div>

        <div className="my-3 border-y-[.1rem] border-[#383838]">
          <p className="text-xs my-2">Icon</p>

          <div
            onClick={handleImageClick}
            className="cursor-pointer border rounded-sm w-16 h-16 border-gray-300/35 p-1 flex items-center justify-center overflow-hidden"
          >
            <input
              id="workspace-icon-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleIconChange(e.target.files[0])
                }
              }}
            />

            {previewUrl ? (
              
              <>
                <div className={`w-full h-full bg-gray-400 z-10 bg-image-animated ${imageLoading ? 'block' : 'hidden'}`}></div>
                <img
                  src={previewUrl}
                  alt="Workspace Icon Preview"
                  className={`object-cover w-full h-full rounded-sm ${imageLoading ? 'hidden' : 'block'} transition-opacity duration-300`}
                  onLoad={()=>setImageLoading(false)}
                />
              </>
            ) : (
              <div className=" flex items-center text-center justify-center w-full h-full">
                <span className="text-xxs">Upload Icon</span>
              </div>
            )}
          </div>
          <p className="text-xxs text-gray-100/50 my-3">Upload an image or pick an emoji. It will show up in your sidebar and notifications.</p>
        </div>

        {progress !== null && (
          <div className="absolute bottom-14 w-full h-1 bg-white bg-opacity-30 mt-6">
            <div
              className="h-full bg-white transition-all duration-300 ease-in-out"
              style={{width: `${progress?progress:5}%`}}
            ></div>
          </div>
        )}
      </div>
      
        <div className="space-x-4 mt-4 pt-4 border-t border-white border-opacity-30">
          <button
            onClick={handleSave}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md ${!isEditing?"disabled cursor-not-allowed opacity-35":""}`}
            
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-white text-white rounded-md"
          >
            Cancel
          </button>
        </div>
     
    </div>
  )
}

export default WorkSpaceSettings
