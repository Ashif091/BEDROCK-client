"use client"
import React, {useEffect, useState} from "react"
import Image from "next/image"
import plus_icon from "../../../public/add.png"
import menu_icon from "../../../public/menu.png"
import empty_png from "../../../public/sticky-note.png"
import WorkspaceForm from "@/components/ui/WorkspaceForm"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import {useRouter} from "next/navigation"
import {useAuthStore} from "@/stores/authStore"
import {createAxiosInstance} from "@/app/utils/axiosInstance"
interface Workspace {
  _id: string
  title: string
  icon?: string
  workspaceOwner: string
  ownerInfo: any
}
const List = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [sharedWorkspaceIds, setSharedWorkspaceIds] = useState<string[] | []>(
    []
  )
  const [sharedWorkspaces, setSharedWorkspaces] = useState<Workspace[]>([])
  const {workspaces, isLoading, error, fetchWorkspaces, setCurrentlyWorking} =
    useWorkspaceStore()
  const api = createAxiosInstance()
  const {logout, user} = useAuthStore()
  const router = useRouter()
  useEffect(() => {
    const fetchingSharedWorkspacesId = async () => {
      const res = await api.get(`/workspace/user-attachment/${user?.email}`)
      setSharedWorkspaceIds(res.data.sharedWorkspaces)
    }
    fetchingSharedWorkspacesId()
  }, [])
  // Fetch shared workspace details when IDs are updated
  useEffect(() => {
    const fetchingSharedWorkspaces = async () => {
      const fetchedWorkspaces: Workspace[] = []
      for (const id of sharedWorkspaceIds) {
        const res = await api.get(`/workspace/${id}`)
        const workspace = res.data
        if (workspace) {
          const workspaceData = {
            _id: workspace._id.toString(),
            title: workspace.title,
            icon: workspace.icon?.toString(),
            workspaceOwner: workspace.workspaceOwner?.toString(),
          }
          const ownerInfo = await api.get(
            `/workspace/owner/${workspaceData.workspaceOwner}`
          )
          fetchedWorkspaces.push({...workspaceData, ownerInfo: ownerInfo.data})
        }
      }
      setSharedWorkspaces(fetchedWorkspaces)
    }

    if (sharedWorkspaceIds&&sharedWorkspaceIds.length > 0) {
      fetchingSharedWorkspaces()
    }
  }, [sharedWorkspaceIds])

  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])
  const handleWorkspaceClick = (workspaceId: string) => {
    setCurrentlyWorking(workspaceId)
    router.push(`/workspace/${workspaceId}/home`)
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
        onClick={() => handleWorkspaceClick(workspace._id as string)}
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
  const renderSharedWorkspaces = () => {
    if (sharedWorkspaces.length === 0) {
      return (
        <section className=" w-[18rem] h-48 z-10    rounded-md border border-gray-100 border-opacity-35  flex items-center justify-center cursor-pointer select-none">
          <div>
            <Image
              width={35}
              alt="add_icon"
              src={empty_png}
              className="flex m-auto opacity-50"
            />
            <p className=" mt-5 text-center text-lg px-2 opacity-50">
              No shared workspace is currently accessible.
            </p>
          </div>
        </section>
      )
    }

    return sharedWorkspaces.map((workspace) => (
      <section
        key={workspace._id}
        onClick={() => handleWorkspaceClick(workspace._id)}
        className="w-[18rem] h-48 z-10 rounded-md ring-[.5px] ring-black bg-[#0f0b4095] cursor-pointer select-none flex flex-col justify-between"
      >
        <p className="text-xl mt-8 ml-7">{workspace.title}</p>
        <div className="mb-8 ml-7">
          <p className="opacity-75 mb-1 text-sm">Shared by:</p>
        <div className="flex gap-2  ">
          <div className="rounded-full overflow-hidden w-7 h-7 object-cover ">
            <Image
              src={workspace.ownerInfo?.profile || "/settings/user.png"}
              alt="User Profile"
              width={40}
              height={40}
              className="object-fill"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-normal text-white text-xs">
              {workspace.ownerInfo?.fullname}
            </p>
            <p className=" text-white opacity-50 text-xs font-thin ">
              {workspace.ownerInfo?.email}
            </p>
          </div>
        </div>
        </div>
      </section>
    ))
  }

  return (
    <>
      <p className="text-xl font-alata opacity-75">Your workspace</p>
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
      <p className="text-xl font-alata my-2 opacity-75">Shared workspace</p>

      <div className="border-b border-gray-100 border-opacity-25 w-[85%] min-h-64 pb-14 flex flex-wrap gap-10 pt-7">
        {renderSharedWorkspaces()}
      </div>
    </>
  )
}

export default List
