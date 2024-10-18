"use client"

import Editor from "@/components/workspace/Editor"
import { useDocumentStore } from "@/stores/documentStore"
import { useParams } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { throttle } from "lodash"
import { createAxiosInstance } from "@/app/utils/axiosInstance "

function DocPage() {
  const { docId } = useParams()
  return (
    <div className="p-4">
      <Title docId={docId as string} />
      <Editor />
    </div>
  )
}

const Title = ({ docId }: { docId: string }) => {
  const api = createAxiosInstance()
  const { updateDocTitle } = useDocumentStore()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("Untitled")

  // Fetch the current title on component mount
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/doc/${docId}`)
      setTitle(response.data.title)
    }
    fetchData()
  }, [docId])

  // Throttled function to update the document title
  const throttledUpdateDocTitle = useCallback(
    throttle(async (docId: string, newTitle: string) => {
      await updateDocTitle(docId, newTitle)
    }, 300),
    []
  )

  const handleTitleClick = () => {
    setIsEditing(true)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    if (docId && newTitle.trim()) {
      throttledUpdateDocTitle(docId, newTitle) // Throttled function call
    }
  }

  // Handle blur or Enter key press to exit editing mode
  const handleTitleBlur = () => {
    setIsEditing(false)
  }

  // Handle pressing "Enter" to exit editing mode
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleBlur() // Exit edit mode on Enter key press
    }
  }

  const sharedStyles = 'text-3xl mb-4 bg-transparent outline-none border-none'

  return (
    <div className="relative">
      {isEditing ? (
        <input
          type="text"
          className={`${sharedStyles} p-0 focus:outline-none focus:ring-0`}
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleKeyDown} // Capture Enter key press
          autoFocus // Automatically focus input on editing
        />
      ) : (
        <h1 
          className={`${sharedStyles} cursor-text`} 
          onClick={handleTitleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleTitleClick()} // Enter to start editing
          aria-label="Click to edit title"
        >
          {title}
        </h1>
      )}
    </div>
  )
}

export default DocPage
