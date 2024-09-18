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

interface SideBarProps {
  setActiveComponent: (component: string) => void
  setActiveDocument: (document: any) => void
  activeComponent: string
  activeDocument: any
}

const SideBar: React.FC<SideBarProps> = ({
  setActiveComponent,
  setActiveDocument,
  activeComponent,
  activeDocument,
}) => {
  const {fetchDocuments, documents} = useDocumentStore()
  const {currentlyWorking} = useWorkspaceStore()
  useEffect(() => {
    fetchDocuments(currentlyWorking?._id as string)
    setActiveDocument(null)
  }, [currentlyWorking])

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen)
  const handleDocumentClick = (doc: any) => {
    setActiveComponent("Document")
    setActiveDocument(doc)
  }
  return (
    <div className="w-[18%] h-full bg-[#202020] p-3 flex flex-col select-none space-y-1 border-r border-gray-200/20">
      <InfoBar />
      <ActionBar
        activeComponent={activeComponent}
        setActiveDocument={setActiveDocument}
        setActiveComponent={setActiveComponent}
      />
      <SettingsAction
        isSettingsOpen={isSettingsOpen}
        toggleSettings={toggleSettings}
      />
      <DocumentList
        onDocumentClick={handleDocumentClick}
        activeDocument={activeDocument}
      />
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
