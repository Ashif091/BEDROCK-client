"use client"

import {useState, useEffect, useCallback} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import {createAxiosInstance} from "@/app/utils/axiosInstance"
import Image from "next/image"
import Doc_icon from "../../../../public/sidebar/file.png"
import Trash_icon from "../../../../public/sidebar/Trash_img.png"
import Restore_img from "../../../../public/Features/undo.png"
import {useDocumentStore} from "@/stores/documentStore"
import {throttle} from "lodash"

interface TrashPanelProps {
  isOpen: boolean
  onClose: () => void
}

const TrashPanel: React.FC<TrashPanelProps> = ({isOpen, onClose}) => {
  const {currentlyWorking, isOwner} = useWorkspaceStore()
  const {fetchDocuments, documents} = useDocumentStore()
  const [mounted, setMounted] = useState(false)
  const [trashDocuments, setTrashDocuments] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const api = createAxiosInstance()

  useEffect(() => {
    const fetchDocuments = async () => {
      const res = await api.get(`/doc/${currentlyWorking?._id}/trash`)
      setTrashDocuments(res.data.trashedDocuments)
      setMounted(true)
    }
    fetchDocuments()
  }, [documents])
  const searchDocuments = useCallback(
    throttle(async (query: string) => {
      const res = await api.post(`/doc/trash/search`, {
        workspaceId: currentlyWorking?._id,
        searchQuery: query,
      })
      setTrashDocuments(res.data) 
    }, 300),
    [currentlyWorking]
  )

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    searchDocuments(value)
  }
  const OnRestoreDoc = async (id: any) => {
    const res = await api.get(`/doc/trash/${id}`)
    if (res) fetchDocuments(currentlyWorking?._id as string)
  }
  const OnDeleteDoc = async (id: any) => {
    const res = await api.delete(`/doc/trash/delete/${id}`)
    if (res) fetchDocuments(currentlyWorking?._id as string)
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{x: "-100%"}}
          animate={{x: 50}}
          exit={{x: "-100%"}}
          transition={{type: "spring", stiffness: 300, damping: 30}}
          className="fixed left-[15%]  bottom-12 w-96 h-64  bg-[#252525] text-white shadow-lg overflow-y-auto rounded-xl"
        >
          <div className="flex justify-between items-center ">
            <div className="w-full h-14 rounded-t-xl mt-0 border-b border-gray-700/25 bg-[#272727] flex justify-between items-center">
              <input
                value={searchQuery}
                onChange={handleSearchChange}
                type="text"
                className="w-3/4 ml-5 h-7 text-sm rounded-lg bg-[#474747]"
                placeholder="Search page"
              />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white mt-0 mr-4 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <ul className="space-y-1 overflow-y-scroll overflow-hidden h-48 side-scrollbar ml-2">
            {trashDocuments.map((doc: any) => (
              <li
                key={doc._id}
                className="w-full p-1 h-7 items-center text-center rounded-md flex justify-between cursor-pointer hover:bg-[#2b2b2b]"
              >
                <div
                  className="flex items-center gap-2 flex-grow"
                  //   onClick={() => onClickNavigation(doc._id as string)}
                >
                  <Image
                    src={Doc_icon}
                    className="w-4 h-4 opacity-70"
                    alt="Document icon"
                  />
                  <h3 className="text-sm font-light">{doc.title}</h3>
                </div>
                <div className="mr-2 flex gap-2">
                  {/* actions */}
                  <Image
                    src={Restore_img}
                    className="w-4 h-4 opacity-55"
                    alt="Document icon"
                    onClick={() => OnRestoreDoc(doc._id)}
                  />
                  {isOwner && (
                    <Image
                      src={Trash_icon}
                      className="w-4 h-4 opacity-55"
                      alt="Document icon"
                      onClick={() => OnDeleteDoc(doc._id)}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TrashPanel
