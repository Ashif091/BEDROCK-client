import React, { useState, useEffect } from "react"

interface WorkspaceTitleProps {
  title: string
  onTitleChange: (title: string) => void
}

const WorkspaceTitle: React.FC<WorkspaceTitleProps> = ({ title, onTitleChange }) => {
  const [titleInput, setTitleInput] = useState(title)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(e.target.value)
    onTitleChange(e.target.value)
  }
  useEffect(() => {
    setTitleInput(title); 
  }, [title]);

  return (
    <div>
      <p className="text-xs opacity-75 my-2">Name</p>
      <input
        type="text"
        value={titleInput}
        onChange={handleTitleChange}
        className="mb-2 p-1 rounded-md bg-[#2b2b2b] text-white max-w-52 cursor-pointer text-sm border border-gray-500/50"
      />
      <p className="text-xxs text-gray-100/50">You can use your organization or company name. Keep it simple.</p>
    </div>
  )
}

export default WorkspaceTitle
