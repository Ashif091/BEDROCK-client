"use client"

import {
  RoomProvider as RoomProviderWrapper,
  ClientSideSuspense,
} from "@liveblocks/react/suspense"
import LiveCursorProvider from "./LiveCursorProvider"
const RoomProvider = ({
  roomId,
  children,
}: {
  roomId: string
  children: React.ReactNode
}) => {
    console.log("🚀 ~ roomId:", roomId)
    
  return (
    <RoomProviderWrapper
      id={roomId}
      initialPresence={{cursor: null}}
      //   initialStorage={{}} ? Add room initaial storage
    >
      <ClientSideSuspense fallback={<p>Loading room...</p>}>
        <LiveCursorProvider>
        {children}
        </LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  )
}

export default RoomProvider
