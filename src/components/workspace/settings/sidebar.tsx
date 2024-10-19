import Image from "next/image"
import React from "react"

import accountIcon from "../../../../public/settings/account.png"
import settingsIcon from "../../../../public/settings/equalizer.png"
import notificationsIcon from "../../../../public/settings/notification.png"
import settings from "../../../../public/settings/setting.png"
import people from "../../../../public/settings/group.png"
import {useAuthStore} from "@/stores/authStore"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({activeSection, setActiveSection}) => {
  const {user} = useAuthStore()
  const sections = [
    {name: "Account", icon: accountIcon},
    {name: "My Settings", icon: settingsIcon},
    {name: "Notifications", icon: notificationsIcon},
  ]
  const workspaceSections = [
    {name: "Settings", icon: settings},
    {name: "People", icon: people},
  ]

  return (
    <div className="w-1/5 py-6 px-2 rounded-l-xl bg-[#272727] select-none">
      <p className="opacity-35 text-xs mb-3 ml-1">Account</p>
      <div className="flex gap-2 ml-2">
        <div className="rounded-full overflow-hidden w-7 h-7 object-cover ">
        <Image
            src={user?.profile || "/settings/user.png"}
            alt="User Profile"
            width={40}
            height={40}
            className="object-fill"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-normal text-white text-xs">{user?.fullname}</p>
          <p className=" text-white opacity-50 text-xs font-thin ">
            {user?.email}
          </p>
        </div>
      </div>
      <div className="">
        {sections.map((section) => (
          <div
            key={section.name}
            className={`flex items-center mt-2 gap-3 px-2 mb-1 py-1 cursor-pointer rounded-sm text-xs ${
              activeSection === section.name ? "bg-[#323232]" : ""
            }`}
            onClick={() => setActiveSection(section.name)}
          >
            <Image
              className="opacity-50"
              src={section.icon}
              alt={`${section.name} Icon`}
              width={20}
              height={20}
            />
            <span className="text-white">{section.name}</span>
          </div>
        ))}
      </div>
      <p className="opacity-35 text-xs mb-3 ml-1">Workspace</p>

      {workspaceSections.map((section) => (
          <div
            key={section.name}
            className={`flex items-center mt-2 gap-3 px-2 mb-1 py-1 cursor-pointer rounded-sm text-xs ${
              activeSection === section.name ? "bg-[#323232]" : ""
            }`}
            onClick={() => setActiveSection(section.name)}
          >
            <Image
              className="opacity-50"
              src={section.icon}
              alt={`${section.name} Icon`}
              width={20}
              height={20}
            />
            <span className="text-white">{section.name}</span>
          </div>
        ))}

    </div>
  )
}

export default Sidebar
