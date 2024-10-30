"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useNetworkStore } from "@/stores/networkStore"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/authStore"
import { useWorkspaceStore } from "@/stores/workspaceStore"
import { Video, VideoOff, Mic, MicOff } from "lucide-react"

interface User {
  name: string
  profile: string
  socketId: string | undefined
}

interface MediaState {
  videoEnabled: boolean
  audioEnabled: boolean
}

interface PeerConnection {
  peerConnection: RTCPeerConnection
  remoteStream: MediaStream
  mediaState: MediaState
}

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
]

export default function VideoCallRoom() {
  const { socket } = useNetworkStore()
  const { user } = useAuthStore()
  const { currentlyWorking } = useWorkspaceStore()

  const [inRoom, setInRoom] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [peerConnections, setPeerConnections] = useState<{
    [key: string]: PeerConnection
  }>({})
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isPreviewActive, setIsPreviewActive] = useState(false)
  const [peerMediaStates, setPeerMediaStates] = useState<{
    [key: string]: MediaState
  }>({})

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      console.log("Setting local video source", localStream.id)
      localVideoRef.current.srcObject = localStream
      
      localVideoRef.current.play().catch(error => {
        console.error("Error playing local video:", error)
      })
    }
  }, [localStream, inRoom])

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
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 360, ideal: 720, max: 1080 },
            frameRate: { min: 16, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
        })

        stream.getVideoTracks().forEach(track => {
          track.enabled = isVideoEnabled
        })
        stream.getAudioTracks().forEach(track => {
          track.enabled = isAudioEnabled
        })

        setLocalStream(stream)
        return stream
      } catch (error) {
        console.error("Error accessing media devices:", error)
        return null
      }
    },
    [localStream, isVideoEnabled, isAudioEnabled]
  )

  const startPreview = async () => {
    const stream = await getMediaStream()
    if (stream) {
      setIsPreviewActive(true)
    }
  }

  const stopPreview = () => {
    if (localStream && !inRoom) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
      setIsPreviewActive(false)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        const newState = !isVideoEnabled
        videoTrack.enabled = newState
        setIsVideoEnabled(newState)
        
        socket?.emit("media-state-change", {
          type: 'video',
          enabled: newState,
          roomId: currentlyWorking?._id,
        })
      }
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        const newState = !isAudioEnabled
        audioTrack.enabled = newState
        setIsAudioEnabled(newState)
        
        socket?.emit("media-state-change", {
          type: 'audio',
          enabled: newState,
          roomId: currentlyWorking?._id,
        })
      }
    }
  }

  const handleRemoteMediaStateChange = useCallback((userId: string, type: 'video' | 'audio', enabled: boolean) => {
    console.log(userId,"⏳user chage media :", enabled);
    
    setPeerMediaStates(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [type === 'video' ? 'videoEnabled' : 'audioEnabled']: enabled
      }
    }))
  }, [peerMediaStates])

  const createPeerConnection = useCallback(
    (socketId: string) => {
      const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS })
      const remoteStream = new MediaStream()

      setPeerMediaStates(prev => ({
        ...prev,
        [socketId]: {
          videoEnabled: true,
          audioEnabled: true
        }
      }))

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream)
        })
      }

      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track)
          
          if (track.kind === 'video') {
            setPeerMediaStates(prev => ({
              ...prev,
              [socketId]: {
                ...prev[socketId],
                videoEnabled: track.enabled
              }
            }))
          } else if (track.kind === 'audio') {
            setPeerMediaStates(prev => ({
              ...prev,
              [socketId]: {
                ...prev[socketId],
                audioEnabled: track.enabled
              }
            }))
          }
        })

        setPeerConnections(prev => ({
          ...prev,
          [socketId]: {
            peerConnection,
            remoteStream,
            mediaState: {
              videoEnabled: true,
              audioEnabled: true
            }
          }
        }))

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

      peerConnection.onconnectionstatechange = () => {
        console.log(`Connection state for ${socketId}:`, peerConnection.connectionState)
      }

      setPeerConnections((prev) => ({
        ...prev,
        [socketId]: {
          peerConnection,
          remoteStream,
          mediaState: {
            videoEnabled: true,
            audioEnabled: true
          }
        },
      }))

      return peerConnection
    },
    [localStream, socket, currentlyWorking?._id,peerMediaStates]
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

  const handleUserLeft = (userData: User) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.socketId !== userData.socketId)
    )
    if (peerConnections[userData.socketId!]) {
      peerConnections[userData.socketId!].peerConnection.close()
      const newPeerConnections = { ...peerConnections }
      delete newPeerConnections[userData.socketId!]
      setPeerConnections(newPeerConnections)
      
      // Clean up media states
      setPeerMediaStates(prev => {
        const newStates = { ...prev }
        delete newStates[userData.socketId!]
        return newStates
      })
    }
  }

  const handleRoomUsers = (roomUsers: User[]) => {
    setUsers(roomUsers)
  }

  useEffect(() => {
    if (!socket) return

    socket.on("user-joined", handleUserJoined)
    socket.on("user-left", handleUserLeft)
    socket.on("room-users", handleRoomUsers)
    socket.on("offer", handleOffer)
    socket.on("answer", handleAnswer)
    socket.on("ice-candidate", handleIceCandidate)
    socket.on("media-state-changed", ({ userId, type, enabled }) => {
      handleRemoteMediaStateChange(userId, type, enabled)
    })

    return () => {
      socket.off("user-joined")
      socket.off("user-left")
      socket.off("room-users")
      socket.off("offer")
      socket.off("answer")
      socket.off("ice-candidate")
      socket.off("media-state-changed")
    }
  }, [
    socket,
    handleUserJoined,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    handleRemoteMediaStateChange
  ])

  const joinRoom = async () => {
    if (socket && currentlyWorking?._id && user?.fullname) {
      try {
        const stream = isPreviewActive ? localStream : await getMediaStream()
        if (!stream) {
          console.error("Failed to get media stream")
          return
        }

        setLocalStream(stream)

        const userData: User = {
          name: user.fullname,
          profile: user.profile as string,
          socketId: socket.id,
        }

        socket.emit("join-room", currentlyWorking._id, userData)
        setInRoom(true)

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Error joining room:", error)
      }
    }
  }

  const leaveRoom = () => {
    if (socket && currentlyWorking?._id) {
      socket.emit("leave-room", currentlyWorking._id)
      setInRoom(false)
      setUsers([])
      
      localStream?.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
      setIsPreviewActive(false)
      
      setIsVideoEnabled(true)
      setIsAudioEnabled(true)
      
      Object.values(peerConnections).forEach(({ peerConnection }) => {
        peerConnection.close()
      })
      setPeerConnections({})
      setPeerMediaStates({})
      
      if (localVideoRef.current) localVideoRef.current.srcObject = null
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
          <div className="space-y-4">
            {!isPreviewActive ? (
              <Button onClick={startPreview} className="w-full">
                Start Preview
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Preview</h3>
                  <div className="relative">
                    <video
                      key="preview-video"
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-auto border rounded bg-black"
                    />
                    {!isVideoEnabled && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black rounded-lg">
                        <div className="flex flex-col items-center  space-y-4">
                          <img
                            src={user?.profile}
                            alt={user?.fullname}
                            className="w-24 h-24 rounded-full border-2 border-white/20"
                          />
                          <div className="text-white text-lg font-medium">
                            {user?.fullname}
                          </div>
                          <div className="flex items-center space-x-2 text-white/60">
                            <VideoOff className="w-4 h-4" />
                            <span className="text-sm">Video Off</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleVideo}
                    className={!isVideoEnabled ? "bg-red-100" : ""}
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleAudio}
                    className={!isAudioEnabled ? "bg-red-100" : ""}
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex gap-4">
                  <Button onClick={joinRoom} variant="secondary" className="flex-1">
                    Join Room
                  </Button>
                  <Button onClick={stopPreview} className="flex-1">
                    Stop Preview
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Local Video</h3>
                <div className="relative">
                  <video
                    key="room-video"
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-auto border rounded bg-black"
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black rounded-lg">
                      <div className="flex flex-col items-center space-y-4">
                        <img
                          src={user?.profile}
                          alt={user?.fullname}
                          className="w-24 h-24 rounded-full border-2 border-white/20"
                        />
                        <div className="text-white text-lg font-medium">
                          {user?.fullname}
                        </div>
                        <div className="flex items-center space-x-2 text-white/60">
                          <VideoOff className="w-4 h-4" />
                          <span className="text-sm">Video Off</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleVideo}
                      className={`bg-background/80 hover:bg-background/90 ${!isVideoEnabled ? "bg-red-100" : ""}`}
                    >
                      {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleAudio}
                      className={`bg-background/80 hover:bg-background/90 ${!isAudioEnabled ? "bg-red-100" : ""}`}
                    >
                      {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              {Object.entries(peerConnections).map(([socketId, { remoteStream }]) => {
                const remoteUser = users.find(user => user.socketId === socketId)
                const mediaState = peerMediaStates[socketId]
                
                return (
                  <div key={socketId}>
                    <h3 className="text-lg font-semibold mb-2">
                      {remoteUser?.name || "Remote User"}
                    </h3>
                    <div className="relative aspect-video">
                      <video
                        ref={(el) => {
                          if (el) {
                            el.srcObject = remoteStream
                            remoteVideoRefs.current[socketId] = el
                          }
                        }}
                        autoPlay
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover rounded-lg bg-black 
                          ${!mediaState?.videoEnabled ? 'invisible' : 'visible'}`}
                      />
                      
                      {(!mediaState?.videoEnabled && remoteUser) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black rounded-lg">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                              <img
                                src={remoteUser.profile}
                                alt={remoteUser.name}
                                className="w-24 h-24 rounded-full border-2 border-white/20"
                              />
                              {!mediaState?.audioEnabled && (
                                <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                                  <MicOff className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="text-white text-lg font-medium">
                              {remoteUser.name}
                            </div>
                            <div className="flex items-center space-x-2 text-white/60">
                              <VideoOff className="w-4 h-4" />
                              <span className="text-sm">Video Off</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
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