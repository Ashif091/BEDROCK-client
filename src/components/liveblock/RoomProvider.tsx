"use client"

import {
  RoomProvider as RoomProviderWrapper,
  ClientSideSuspense,
} from "@liveblocks/react/suspense"
import LiveCursorProvider from "./LiveCursorProvider"
import LoadingSkeleton from "../effects/LoadingSkeleton"
const RoomProvider = ({
  roomId,
  children,
}: {
  roomId: string
  children: React.ReactNode
}) => {
  return (
    <RoomProviderWrapper
      id={roomId}
      initialPresence={{cursor: null}}
      //   initialStorage={{}} ? Add room initaial storage
    >
      <ClientSideSuspense fallback={<LoadingSkeleton/>}>
        <LiveCursorProvider>
        {children}
        </LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  )
}

export default RoomProvider
