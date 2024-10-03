"use client"
import Image from "next/image"
import settings_img from "../../../../public/sidebar/setting.png"
import ActionBar from "./main-actions"
import {useEffect, useState} from "react"
import Settings from "../settings/settings"
import InfoBar from "./components/info-action"
import {useDocumentStore} from "@/stores/documentStore"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import DocumentList from "./components/document-iist "

import {useRouter} from "next/navigation"
import home_img from "../../../../public/sidebar/home.png"
import graph_img from "../../../../public/sidebar/graph.png"
import Link from "next/link"

const SideBar = ({}) => {
  const {fetchDocuments, documents} = useDocumentStore()
  const {currentlyWorking} = useWorkspaceStore()
  const router = useRouter()
  const actionItems = [
    {name: "home", icon: home_img},
    {name: "graph", icon: graph_img},
  ]
  useEffect(() => {
    fetchDocuments(currentlyWorking?._id as string)
  }, [currentlyWorking])
  const onClickNavigation = (action: string) => {
    router.push(`/workspace/${currentlyWorking?._id}/${action}`)
  }

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen)
  return (
    <div className="w-[18%] h-full bg-[#202020] p-3 flex flex-col select-none space-y-1 border-r border-gray-200/20 sticky top-0">
      <InfoBar />
      {actionItems.map((item) => (
        <div
          onClick={() => {
            onClickNavigation(item.name)
          }}
          key={item.name}
          className={`action-item flex items-center text-center p-1 cursor-pointer rounded hover:bg-[#2b2b2b]`}
        >
          <Image
            src={item.icon}
            width={10}
            height={10}
            alt={item.name}
            className="w-[18px] mr-2 opacity-45"
          />
          <span className="text-white opacity-50 text-sm font-light capitalize">
            {item.name}
          </span>
        </div>
      ))}
      <SettingsAction
        isSettingsOpen={isSettingsOpen}
        toggleSettings={toggleSettings}
      />
      <DocumentList />
    </div>
  )
}

interface SettingsActionProps {
  isSettingsOpen: boolean
  toggleSettings: () => void
}

const SettingsAction: React.FC<SettingsActionProps> = ({
  isSettingsOpen,
  toggleSettings,
}) => {
  return (
    <>
      <div
        className={`flex items-center text-center p-1 cursor-pointer rounded hover:bg-[#2b2b2b]`}
        onClick={toggleSettings}
      >
        <Image
          src={settings_img}
          width={10}
          height={10}
          alt="settings"
          className="w-[18px] mr-2 opacity-45"
        />
        <span className="text-white opacity-50 text-sm font-light">
          Settings
        </span>
      </div>
      {isSettingsOpen && <Settings toggleSettings={toggleSettings} />}
    </>
  )
}

export default SideBar

// activeComponent === item.name
//   ? "bg-[#2b2b2b]"
//   : "hover:bg-[#2b2b2b]"
