"use client"

import React, {useState, useEffect, useRef, useCallback} from "react"
import {useNetworkStore} from "@/stores/networkStore"
import {Button} from "@/components/ui/button"
import {useAuthStore} from "@/stores/authStore"
import {useWorkspaceStore} from "@/stores/workspaceStore"

interface User {
  name: string
  profile: string
  socketId: string | undefined
}

interface PeerConnection {
  peerConnection: RTCPeerConnection
  remoteStream: MediaStream
}

const ICE_SERVERS = [
  {urls: "stun:stun.l.google.com:19302"},
  {urls: "stun:stun1.l.google.com:19302"},
  {urls: "stun:stun2.l.google.com:19302"},
  {urls: "stun:stun3.l.google.com:19302"},
  {urls: "stun:stun4.l.google.com:19302"},
]

export default function VideoCallRoom() {
  const {socket} = useNetworkStore()
  const [inRoom, setInRoom] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [peerConnections, setPeerConnections] = useState<{
    [key: string]: PeerConnection
  }>({})
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  const {user} = useAuthStore()
  const {currentlyWorking} = useWorkspaceStore()

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      try {
        if (localStream) {
          return localStream
        }
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        )

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: {min: 640, ideal: 1280, max: 1920},
            height: {min: 360, ideal: 720, max: 1080},
            frameRate: {min: 16, ideal: 30, max: 30},
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
        })

        setLocalStream(stream)
        return stream
      } catch (error) {
        console.error("Error accessing media devices: " + error)
        return null
      }
    },
    [localStream]
  )

  const createPeerConnection = useCallback(
    (socketId: string) => {
      const peerConnection = new RTCPeerConnection({iceServers: ICE_SERVERS})
      const remoteStream = new MediaStream()

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream)
        })
      }

      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track)
        })
        
        // Force update to ensure remote stream is displayed
        setPeerConnections((prev) => ({
          ...prev,
          [socketId]: { peerConnection, remoteStream },
        }))

        // Ensure the video element is updated with the new stream
        if (remoteVideoRefs.current[socketId]) {
          remoteVideoRefs.current[socketId]!.srcObject = remoteStream
        }
      }

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit(
            "ice-candidate",
            event.candidate,
            currentlyWorking?._id,
            socketId
          )
        }
      }

      // Add connection state change handler
      peerConnection.onconnectionstatechange = () => {
        console.log(`Connection state for ${socketId}:`, peerConnection.connectionState)
      }

      setPeerConnections((prev) => ({
        ...prev,
        [socketId]: {peerConnection, remoteStream},
      }))

      return peerConnection
    },
    [localStream, socket, currentlyWorking?._id]
  )

  const handleUserJoined = useCallback(
    async (userData: User) => {
      setUsers((prevUsers) => [...prevUsers, userData])
      
      if (userData?.socketId && localStream) {
        const peerConnection = createPeerConnection(userData.socketId)
        
        try {
          const offer = await peerConnection.createOffer()
          await peerConnection.setLocalDescription(offer)
          socket?.emit("offer", offer, currentlyWorking?._id, userData.socketId)
        } catch (error) {
          console.error("Error creating offer:", error)
        }
      }
    },
    [socket, localStream, createPeerConnection, currentlyWorking?._id]
  )

  const handleOffer = useCallback(
    async (offer: RTCSessionDescriptionInit, fromSocketId: string) => {
      try {
        const peerConnection = createPeerConnection(fromSocketId)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        socket?.emit("answer", answer, currentlyWorking?._id, fromSocketId)
      } catch (error) {
        console.error("Error handling offer:", error)
      }
    },
    [createPeerConnection, socket, currentlyWorking?._id]
  )

  const handleAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit, fromSocketId: string) => {
      const peerConnection = peerConnections[fromSocketId]?.peerConnection
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
          console.log("✔️ Answer set successfully for socketId:", fromSocketId)
        } catch (error) {
          console.error("Error setting remote description:", error)
        }
      }
    },
    [peerConnections]
  )

  const handleIceCandidate = useCallback(
    async (candidate: RTCIceCandidateInit, fromSocketId: string) => {
      const peerConnection = peerConnections[fromSocketId]?.peerConnection
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
          console.log("🧊 ICE Candidate added for socketId:", fromSocketId)
        } catch (error) {
          console.error("Error adding ICE candidate:", error)
        }
      }
    },
    [peerConnections]
  )

  useEffect(() => {
    if (!socket) return

    socket.on("user-joined", handleUserJoined)
    socket.on("user-left", handleUserLeft)
    socket.on("room-users", handleRoomUsers)
    socket.on("offer", handleOffer)
    socket.on("answer", handleAnswer)
    socket.on("ice-candidate", handleIceCandidate)

    return () => {
      socket.off("user-joined")
      socket.off("user-left")
      socket.off("room-users")
      socket.off("offer")
      socket.off("answer")
      socket.off("ice-candidate")
    }
  }, [
    socket,
    handleUserJoined,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
  ])

  const joinRoom = async () => {
    if (socket && currentlyWorking?._id && user?.fullname) {
      try {
        const stream = await getMediaStream()
        if (!stream) {
          console.error("Failed to get media stream")
          return
        }

        const userData: User = {
          name: user.fullname,
          profile: user.profile as string,
          socketId: socket.id,
        }

        socket.emit("join-room", currentlyWorking._id, userData)
        setInRoom(true)
      } catch (error) {
        console.error("Error joining room:", error)
      }
    }
  }

  const handleUserLeft = (userData: User) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.socketId !== userData.socketId)
    )
    if (peerConnections[userData.socketId!]) {
      peerConnections[userData.socketId!].peerConnection.close()
      const newPeerConnections = {...peerConnections}
      delete newPeerConnections[userData.socketId!]
      setPeerConnections(newPeerConnections)
    }
  }

  const handleRoomUsers = (roomUsers: User[]) => {
    setUsers(roomUsers)
  }

  const leaveRoom = () => {
    if (socket && currentlyWorking?._id) {
      socket.emit("leave-room", currentlyWorking._id)
      setInRoom(false)
      setUsers([])
      
      // Cleanup local stream
      localStream?.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
      
      // Cleanup peer connections
      Object.values(peerConnections).forEach(({peerConnection}) => {
        peerConnection.close()
      })
      setPeerConnections({})
      
      // Clear video refs
      localVideoRef.current!.srcObject = null
      Object.values(remoteVideoRefs.current).forEach(ref => {
        if (ref) ref.srcObject = null
      })
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto border p-4 rounded shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Video Call Room</h2>
      </div>
      <div>
        {!inRoom ? (
          <Button onClick={joinRoom} className="w-full">
            Join Room
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Local Video</h3>
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-auto border rounded bg-black"
                />
              </div>
              {Object.entries(peerConnections).map(([socketId, {remoteStream}]) => (
                <div key={socketId}>
                  <h3 className="text-lg font-semibold mb-2">
                    Remote Video {!remoteStream.active && "(Connecting...)"}
                  </h3>
                  <video
                    ref={(el) => {
                      if (el) {
                        el.srcObject = remoteStream
                        remoteVideoRefs.current[socketId] = el
                      }
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-auto border rounded bg-black"
                  />
                </div>
              ))}
            </div>
            <h3 className="text-lg font-semibold">Users in Room:</h3>
            <div className="grid grid-cols-3 gap-4">
              {users.map((user) => (
                <div
                  key={user.socketId}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user.profile}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
            <Button onClick={leaveRoom} className="w-full">
              Leave Room
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}