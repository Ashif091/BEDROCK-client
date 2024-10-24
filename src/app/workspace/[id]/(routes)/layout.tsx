"use client"
import {createAxiosInstance} from "@/app/utils/axiosInstance"
import LoadingEffect from "@/components/effects/screen-loading"
import withAuth from "@/components/hoc/withAuth"
import Settings from "@/components/workspace/settings/settings"
import TrashPanel from "@/components/workspace/sidebar/TrashPanel"
import SideBar from "@/components/workspace/sidebar/main-bar"
import {useAuthStore} from "@/stores/authStore"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import Link from "next/link"
import {useParams} from "next/navigation"
import {useRouter} from "next/router"
import {ReactNode, useEffect, useState} from "react"

const WorkspaceLayout = ({children}: {children: ReactNode}) => {
  const {id} = useParams()
  const {
    fetchWorkspaces,
    currentlyWorking,
    isSettingsOpen,
    toggleSettings,
    setIsOwner,
    isOwner,
    isTrashOpen,
    toggleTrash
  } = useWorkspaceStore()
  const {user, setRole, role} = useAuthStore()
  const api = createAxiosInstance()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const loadWorkspace = async () => {
      setLoading(false)
    }
    loadWorkspace()
    setIsOwner(currentlyWorking?.workspaceOwner === user?._id)
  }, [id, currentlyWorking, fetchWorkspaces, user])
  useEffect(() => {
    setRole("owner")
    const dataSetUp = async () => {
      try {
        const res = await api.post("/workspace/search-role", {
          workspaceId: currentlyWorking?._id,
          email: user?.email,
        })
        setRole(res.data)
      } catch (error) {
        // console.log(" dataSetUp ~ error:", error)
      }
    }
    if (!isOwner) {
      dataSetUp()
    }
  }, [isOwner])

  if (loading) {
    return <LoadingEffect />
  }
  return (
    <div className="flex bg-[#191919] w-screen h-screen">
      <SideBar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden side-scrollbar">
        {children}
      </main>
      {isSettingsOpen && <Settings toggleSettings={toggleSettings} />}
      {isTrashOpen &&       <TrashPanel
        isOpen={isTrashOpen}
        onClose={() => toggleTrash()}
      />}
    </div>
  )
}

export default withAuth(WorkspaceLayout)
