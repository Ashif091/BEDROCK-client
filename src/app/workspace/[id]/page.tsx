"use client"
import React, {useEffect, useState} from "react"
import {useParams, useRouter} from "next/navigation"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import withAuth from "@/components/hoc/withAuth"
import LoadingEffect from "@/components/effects/screen-loading"
import SideBar from "@/components/workspace/sidebar/main-bar"
import Home from "@/components/workspace/sidebar/components/home"
import Graph from "@/components/workspace/sidebar/components/graph"

const WorkspaceDetail = () => {
  const {id} = useParams()
  const router = useRouter()
  const {fetchWorkspaces, currentlyWorking} = useWorkspaceStore()
  const [loading, setLoading] = useState(true)
  const [activeComponent, setActiveComponent] = useState<string>("Home")
  useEffect(() => {
    document.body.classList.add("bg-[#191919]")
    const loadWorkspace = async () => {
      if (currentlyWorking?._id !== id) router.push("/not-found")
      setLoading(false)
    }
    loadWorkspace()
  }, [id, currentlyWorking, fetchWorkspaces, router])

  if (loading) {
    return <LoadingEffect />
  }

  const renderContent = () => {
    switch (activeComponent) {
      case "Home":
        return <Home />
      case "Graph":
        return <Graph />
      default:
        return <Home />
    }
  }
  return (
    <div className="flex bg-[#191919] w-screen h-screen ">
      <SideBar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <div className="flex-1 p-4">
        {renderContent()}
      </div>
    </div>
  )
}

export default withAuth(WorkspaceDetail)
