"use client"

import {useEffect, useState} from "react"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import {createAxiosInstance} from "@/app/utils/axiosInstance"
import Image from "next/image"

const WorkSpacePeople = () => {
  const api = createAxiosInstance()
  const {currentlyWorking} = useWorkspaceStore()
  const [email, setEmail] = useState("")
  const [members, setMembers] = useState([])
  const [membersMapData, setMembersMapData] = useState<any[]>([])
  const [role, setRole] = useState("viewer")

  useEffect(() => {
    const fetchMembers = async () => {
      if (currentlyWorking?._id) {
        const response = await api.get(`/workspace/${currentlyWorking._id}`)
        setMembers(response.data.collaborators)
      }
    }
    fetchMembers()
  }, [])
  useEffect(() => {
    const fetchMembersMerging = async () => {
      const mergedDataPromises = members.map(async (member: any) => {
        try {
          const res = await api.get(`/auth/user/email/${member.email}`)
          return {...member, ...res.data}
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            return member
          } else {
            console.error("Error fetching user data:", error)
          }
        }
      })
      const mergedData = await Promise.all(mergedDataPromises)
      setMembersMapData(mergedData)
    }

    if (members.length) {
      fetchMembersMerging()
    }
  }, [members])

  const handleAddMember = async () => {
    if (email.trim() && currentlyWorking?._id) {
      const response = await api.post("/workspace/update-member", {
        email,
        role,
        workspaceId: currentlyWorking?._id,
      })
      setMembers(response.data.collaborators)
      setEmail("")
    } else {
      console.error("Email or workspace ID is missing.")
    }
  }
  const handleRoleChange = async (newRole: string, memberEmail: string) => {
    if (newRole === "remove") {
      try {
        const res = await api.delete("/workspace/remove-member", {
          data: {
            email: memberEmail,
            workspaceId: currentlyWorking?._id,
          },
        })
        if (!res.data.collaborators){
          setMembers([])
          setMembersMapData([])
        } 
        else setMembers(res.data.workspace.collaborators)
      } catch (error) {
        console.error("Error removing member:", error)
      }
    } else {
      try {
        const response = await api.post("/workspace/update-member", {
          email: memberEmail,
          role: newRole,
          workspaceId: currentlyWorking?._id,
        })
        setMembers(response.data.collaborators)
      } catch (error) {
        console.error("Error updating member role:", error)
      }
    }
  }

  return (
    <div>
      <p className="text-sm font-extralight opacity-65 ">People</p>
      <div className="flex justify-between my-4 gap-2 border-y-[.1rem] border-gray-50/10 py-2 items-center">
        <p className="text-xs font-thin w-2/5">
          Invite any email; they'll receive a workspace invitation if they don’t
          have an account.{" "}
        </p>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="bg-transparent border rounded p-2 h-8 text-sm"
            placeholder="Enter member's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className="bg-transparent border  w-24  h-9    border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button
            className="bg-[#2383e2] text-xs rounded-md text-gray-50  px-1 py-0 h-8"
            onClick={handleAddMember}
          >
            Add members
          </button>
        </div>
      </div>
      <p className="text-sm font-extralight opacity-65 ">Members</p>
      <div className="my-2 border-y-[.1rem] border-gray-50/10 py-2 items-center">
        <div className="flex w-full border-b-[.1rem] border-gray-50/10">
          <p className="text-xs font-thin w-3/5">User</p>
          <p className="text-xs font-thin w-2/5">Role</p>
        </div>
        <div className="overflow-hidden h-60  overflow-y-scroll side-scrollbar">
          {membersMapData.map((member: any) => {
            return (
              <div className="flex justify-between ml-2 border-b-[.1rem] border-gray-50/10 py-2 ">
                <div className="flex gap-2">
                  <div className="rounded-full overflow-hidden w-7 h-7 object-cover">
                    <Image
                      src={member?.profile || "/settings/user.png"}
                      alt="User Profile"
                      width={40}
                      height={40}
                      className="object-fill"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-normal text-white text-xs">
                      {member?.fullname}
                    </p>
                    <p className=" text-white opacity-50 text-xs font-thin ">
                      {member?.email}
                    </p>
                  </div>
                </div>
                <select
                  className="bg-transparent border mr-6  w-20 px-2 py-0 h-7 border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block  dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={member.role}
                  onChange={(e) =>
                    handleRoleChange(e.target.value, member.email)
                  }
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="remove">Remove</option>
                </select>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WorkSpacePeople
