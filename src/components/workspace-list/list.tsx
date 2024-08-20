"use client"
import React, {useEffect, useState} from "react"
import Image from "next/image"
import plus_icon from "../../../public/add.png"
import menu_icon from "../../../public/menu.png"
import WorkspaceForm from "@/components/ui/WorkspaceForm"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import { useRouter } from "next/navigation"

const List = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const {workspaces, isLoading, error, fetchWorkspaces} = useWorkspaceStore()
  const router = useRouter()
  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])
  const handleWorkspaceClick = (workspaceId: string) => {
    router .push(`/workspace/${workspaceId}`)
  }
  const renderWorkspaces = () => {
    if (isLoading) {
      return Array(2)
        .fill(0)
        .map((_, index) => (
          <section
            key={index}
            className="w-[18rem] h-48 z-10 rounded-md ring-[.5px] ring-black bg-[#0F0B40] bg-animated"
          ></section>
        ))
    }

    if (error) {
      return <p className="text-red-500">{error}</p>
    }

    return workspaces.map((workspace) => (
      <section
        key={workspace._id}
        onClick={() => handleWorkspaceClick(workspace._id)}
        className="w-[18rem] h-48 z-10 rounded-md ring-[.5px] ring-black bg-[#0F0B40] cursor-pointer select-none flex flex-col justify-between"
      >
        <p className="text-xl mt-8 ml-7">{workspace.title}</p>
        <Image
          width={18}
          alt="menu_icon"
          src={menu_icon}
          className="mb-8 ml-7 opacity-30"
        />
      </section>
    ))
  }

  return (
    <div className="border-b border-gray-100 border-opacity-25 w-[85%] min-h-64 pb-14 flex flex-wrap gap-10 pt-7">
      <section
        onClick={() => setIsFormOpen(true)}
        className="w-[18rem] h-48 z-10 rounded-md ring-[.5px] ring-black bg-[#0F0B40] flex items-center justify-center cursor-pointer select-none"
      >
        <div>
          <Image
            width={50}
            alt="add_icon"
            src={plus_icon}
            className="flex m-auto"
          />
          <p className="text-[#6a4bf0] text-xl">Create a workspace</p>
        </div>
      </section>

      {renderWorkspaces()}

      {isFormOpen && (
        <WorkspaceForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}

export default List
