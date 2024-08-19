"use client"
import Link from "next/link"
import React, {useEffect, useState} from "react"
import Image from "next/image"
import plus_icon from "../../../public/add.png"
import menu_icon from "../../../public/menu.png"
import WorkspaceForm from "@/components/ui/WorkspaceForm"

const List = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  return (
    <div className="border-b border-gray-100 border-opacity-25 w-[85%] min-h-64 pb-14  flex flex-wrap gap-10 pt-7">
      <section
        onClick={() => setIsFormOpen(true)}
        className="w-[18rem] h-48 z-10  rounded-md ring-[.5px] ring-black bg-[#0F0B40] flex items-center justify-center cursor-pointer select-none"
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
      {/* map the data  */}
      <section className="w-[18rem] h-48 z-10 rounded-md ring-[.5px] ring-black bg-[#0F0B40] cursor-pointer select-none flex flex-col justify-between">
        <p className="text-xl mt-8 ml-7">Node js</p>
        <Image
          width={18}
          alt="add_icon"
          src={menu_icon}
          className="mb-8 ml-7 opacity-30"
        />
      </section>
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
