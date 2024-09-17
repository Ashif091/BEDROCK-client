"use client"
import Image from "next/image"
import settings_img from "../../../../public/sidebar/setting.png"
import ActionBar from "./main-actions"
import {useState} from "react"
import Settings from "../settings/settings"
import InfoBar from "./components/info-action"

interface SideBarProps {
  setActiveComponent: (component: string) => void
  activeComponent: string
}

const SideBar: React.FC<SideBarProps> = ({
  setActiveComponent,
  activeComponent,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen)
  return (
    <div className="w-[18%] h-full bg-[#202020] p-3 flex flex-col space-y-1 border-r border-gray-200/20">
      <InfoBar />
      <ActionBar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
      <SettingsAction
        isSettingsOpen={isSettingsOpen}
        toggleSettings={toggleSettings}
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
