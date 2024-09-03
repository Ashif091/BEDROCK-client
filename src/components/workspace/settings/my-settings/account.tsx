import React from "react"
import EditableFullname from "@/components/ui/workspace/editable-fullname"
import {useAuthStore} from "@/stores/authStore"
import ProfileImageUploader from "@/components/ui/workspace/profile-uploader"
import { useRouter } from "next/navigation"
import { createAxiosInstance } from "@/app/utils/axiosInstance "

const Account = () => {
  const api = createAxiosInstance();
  const {user,logout} = useAuthStore()
  const router = useRouter()
  const logoutAction = async ()=>{
    let res = await api.get("/auth/logout")
    if(res)
    logout()
    router.refresh()
  }
  return (
    <div className="w-full h-full select-none">
      <p className="text-sm font-extralight opacity-65">My profile</p>
      <div className="flex items-center my-3  border-t-[.1rem] border-[#383838]">
        <ProfileImageUploader />
        <div className="w-44 text-sm">
          <span className="text-xxs opacity-45"> Preferred name</span>
          <EditableFullname />
        </div>
      </div>
      <p className="text-sm font-extralight opacity-65">Account security</p>
      <div className="items-center my-3 py-3  border-t-[.1rem] border-[#383838]">
        <p className="text-sm">Email</p>
        <p className="text-xs font-extralight opacity-55">{user?.email}</p>
        <p className="text-sm mt-3 cursor-pointer select-none" onClick={logoutAction}>Logout</p>
        <p className="text-xs font-extralight opacity-55">Log out of all other active sessions </p>
      </div>
    </div>
  )
}

export default Account
