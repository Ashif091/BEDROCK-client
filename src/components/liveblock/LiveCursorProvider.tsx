"use client"

import {useMyPresence, useOthers} from "@liveblocks/react/suspense"
import {PointerEvent} from "react"
import FollowPointer from "./FollowPointer"

const LiveCursorProvider = ({children}: {children: React.ReactNode}) => {
  const [myPresence, updateMyPresence] = useMyPresence()
  console.log("🚀 ~ LiveCursorProvider ~ myPresence:", myPresence)
  const others = useOthers()

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const cursor = {x: Math.floor(e.clientX), y: Math.floor(e.clientY)}
    updateMyPresence({cursor})
  }

  function handlePointerLeave() {
    updateMyPresence({cursor: null})
  }
  
  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} className="w-full h-full">
      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({connectionId, presence, info}) => (
          <FollowPointer
            key={connectionId}
            info={info}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
          />
        ))}
        {children}
    </div>
  )
}

export default LiveCursorProvider
