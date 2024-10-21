"use client"

import {createAxiosInstance} from "@/app/utils/axiosInstance"
import { useWorkspaceStore } from "@/stores/workspaceStore"
import {LiveblocksProvider} from "@liveblocks/react/suspense"

const LiveBlocksProvider = ({children}: {children: React.ReactNode}) => {
  const api = createAxiosInstance()
  const {currentlyWorking} = useWorkspaceStore()

  if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_KEY) {
    throw new Error(
      "Missing required environment variable NEXT_PUBLIC_LIVEBLOCKS_KEY"
    )
  }

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={async (room) => {
        const response = await api.post("/workspace/liveblocks-auth", {
          room,
          workspaceId:currentlyWorking?._id
        })
        return JSON.parse(response.data)
      }}
    >
      {children}
    </LiveblocksProvider>
  )
}

export default LiveBlocksProvider
