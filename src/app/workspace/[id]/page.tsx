"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import Image from 'next/image'
import node from "../../../../public/png-transparent-js-logo-node-logos-and-brands-icon-thumbnail.png"
import settings from "../../../../public/setting.png"
import profile from "../../../../public/user.png"
import { Workspace } from '@/stores/workspaceStore'
import { useAuthStore} from '@/stores/authStore'
import withAuth from '@/components/hoc/withAuth'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL
const WorkspaceDetail = () => {
  const { id } = useParams()
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)
  const { workspaces, fetchWorkspaces } = useWorkspaceStore()
  const [workspace, setWorkspace] = useState<Workspace>()
  const [loading, setLoading] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  useEffect(() => {
    document.body.classList.add("bg-[#191919]")
    const loadWorkspace = async () => {
      if (workspaces.length === 0) {
        await fetchWorkspaces()
      }
      const foundWorkspace = workspaces.find(w => w._id === id)
      if (foundWorkspace) {
        setWorkspace(foundWorkspace)
      } else {
        router.push('/not-found')
      }
      setLoading(false)
    }

    loadWorkspace()
  }, [id, workspaces, fetchWorkspaces, router])

  const logoutAction = async ()=>{
    await axios.get(`${BASE_URL}/auth/logout`,{
      withCredentials: true,
    })
    logout()
    router.refresh()
  }

  if (loading) {
    return  <div className="fixed inset-0 flex items-center justify-center bg-[#191919] bg-opacity-75">
    <div className="flex space-x-2">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: `${index * 0.1}s` }}
        ></div>
      ))}
    </div>
  </div>
  }

  if (!workspace) {
    return null 
  }

  return (
    <>
    <div className="fixed top-0 left-0 h-full w-[16rem] bg-[#202020] border-r border-opacity-50">
      <div className="flex items-center p-4">
        <Image src={node} alt="Workspace" width={50} height={50} />
        <span className="ml-4 text-white">{workspace.title}</span>
      </div>
      
      <div  
        className="flex items-center p-4 hover:bg-[#2b2b2b] cursor-pointer z-10"
        onClick={toggleSettings}
      >
        <Image src={settings} alt="Settings" width={24} height={24} />
        <span className="ml-4 text-white">Settings</span>
      </div>
    </div>

    {isSettingsOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={toggleSettings}
      >
        <div 
          className="w-[70rem] h-[30rem] bg-[#202020] rounded-md border border-gray-500 border-opacity-50 flex"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-1/4 bg-[#202020] border-r border-gray-500 border-opacity-50">
            <div className="p-4 bg-[#2b2b2b] text-white">Profile</div>
            {/* Add other sidebar options here */}
          </div>
          <div className="w-3/4 p-8">
            <div className="flex items-center mb-8">
              <div className="w-32 h-32 bg-gray-300 rounded-full mr-8">
                <Image src={profile} alt="Profile" width={128} height={128} className="rounded-full" />
              </div>
              <div>
                <input type="file" className="mb-4" />
                <input type="text" placeholder="Username" className="block mb-2 p-2 bg-[#2b2b2b] text-white" />
                <input type="email" placeholder="Email" className="block p-2 bg-[#2b2b2b] text-white" />
              </div>
              <div onClick={logoutAction}  className='flex cursor-pointer'>
                Logout
              </div>
            </div>
            {/* Add other profile settings here */}
          </div>
        </div>
      </div>
    )}
  </>
  )
}

export default withAuth(WorkspaceDetail) 