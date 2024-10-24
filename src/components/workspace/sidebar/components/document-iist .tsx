"use client"

import {useDocumentStore} from "@/stores/documentStore"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import Image from "next/image"
import Doc_icon from "../../../../../public/sidebar/file.png"
import Menu_icon from "../../../../../public/sidebar/drag.png"
import {useRouter} from "next/navigation"
import {useState} from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {createAxiosInstance} from "@/app/utils/axiosInstance"
import {useAuthStore} from "@/stores/authStore"

const DocumentList = () => {
  const {documents, deleteDocument} = useDocumentStore()
  const {currentlyWorking} = useWorkspaceStore()
  const {role} = useAuthStore()
  const router = useRouter()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const api = createAxiosInstance()
  const onClickNavigation = (id: string) => {
    router.push(`/workspace/${currentlyWorking?._id}/doc/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/doc/trash/${id}`)
      deleteDocument(id)
    } catch (error) {
      console.error("Failed to delete document:", error)
    }
  }

  return (
    <div className="w-full h-64  overflow-hidden overflow-y-auto pb-3 border-y border-gray-200/30 side-scrollbar">
      <h2 className="font-light opacity-45 text-xs my-4">Documents</h2>
      <ul className="space-y-1">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <li
              key={doc._id}
              className="w-full p-1 h-7 items-center text-center rounded-md flex justify-between cursor-pointer hover:bg-[#2b2b2b]"
            >
              <div
                className="flex items-center gap-2 flex-grow"
                onClick={() => onClickNavigation(doc._id as string)}
              >
                <Image
                  src={Doc_icon}
                  className="w-4 h-4 opacity-70"
                  alt="Document icon"
                />
                <h3 className="text-sm font-light">{doc.title}</h3>
              </div>
              {/* role based buton */}
              {role !== "viewer" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="link" size="icon" className="h-7 w-7">
                      <Image
                        src={Menu_icon}
                        className="w-4 h-4 opacity-70"
                        alt="Menu icon"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="cursor-pointer ">
                    <DropdownMenuItem
                      className="p-0 px-3 cursor-pointer "
                      onClick={() => handleDelete(doc._id as string)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </li>
          ))
        ) : (
          <li className="text-center text-gray-600">No documents available</li>
        )}
      </ul>
    </div>
  )
}

export default DocumentList
