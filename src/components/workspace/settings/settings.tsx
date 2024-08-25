import React, {useState} from "react"
import Sidebar from "./sidebar"
import Account from "./my-settings/account"
import SettingsSection from "./my-settings/mysettings"
import Notifications from "./my-settings/notification"
import WorkSpaceSettings from "./w-settings/settings"
interface SettingsProps {
  toggleSettings: () => void
}
const Settings: React.FC<SettingsProps> = ({toggleSettings}) => {
  const [activeSection, setActiveSection] = useState("Account")

  const renderContent = () => {
    switch (activeSection) {
      case "Account":
        return <Account />
      case "My Settings":
        return <SettingsSection />
      case "Notifications":
        return <Notifications />
        case "Settings":
          return <WorkSpaceSettings/>
      default:
        return <Account />
    }
  }


  return (
    <div
      className="fixed inset-0 z-20  bg-[#202020] bg-opacity-50 flex items-center justify-center"
      onClick={toggleSettings}
    >
      <div
        className="md:w-[67rem] md:h-[30rem] sm:w-[40rem] w-[30rem] sm:h-[20rem] h-[15rem] flex bg-[#202020] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div className="flex-1 py-9 md:px-20 px-10 ">{renderContent()}</div>
      </div>
    </div>
  )
}

export default Settings
