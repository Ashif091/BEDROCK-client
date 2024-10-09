"use client"
import LoadingEffect from "@/components/effects/screen-loading"
import withAuth from "@/components/hoc/withAuth"
import Settings from "@/components/workspace/settings/settings"
import SideBar from "@/components/workspace/sidebar/main-bar"
import { useWorkspaceStore } from "@/stores/workspaceStore"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useRouter } from "next/router"
import {ReactNode, useEffect, useState} from "react"

const WorkspaceLayout = ({children}: {children: ReactNode})=> {
  const {id} = useParams()
  const {fetchWorkspaces, currentlyWorking,isSettingsOpen,toggleSettings} = useWorkspaceStore()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const loadWorkspace = async () => {
      setLoading(false)
    }
    loadWorkspace()
  }, [id, currentlyWorking, fetchWorkspaces])

  if (loading) {
    return <LoadingEffect />
  }
  return (
    <div className="flex bg-[#191919] w-screen h-screen">
      <SideBar/>
      <main className="flex-1 overflow-y-auto overflow-x-hidden side-scrollbar">{children}</main>
      {isSettingsOpen && <Settings toggleSettings={toggleSettings} />}
    </div>
  )
}

export default withAuth(WorkspaceLayout)