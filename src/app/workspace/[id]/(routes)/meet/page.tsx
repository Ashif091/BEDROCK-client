"use client"

import React, {useState, useEffect, useRef, useCallback} from "react"
import {useNetworkStore} from "@/stores/networkStore"
import {Button} from "@/components/ui/button"
import {useAuthStore} from "@/stores/authStore"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import {Video, VideoOff, Mic, MicOff} from "lucide-react"
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
  const remoteVideoRefs = useRef<{[key: string]: HTMLVideoElement | null}>({})
  // New state for audio/video controls
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isPreviewActive, setIsPreviewActive] = useState(false)

  const {user} = useAuthStore()
  const {currentlyWorking} = useWorkspaceStore()

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      console.log("Setting local video source", localStream.id)
      localVideoRef.current.srcObject = localStream

      // Ensure video plays
      localVideoRef.current.play().catch((error) => {
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
            width: {min: 640, ideal: 1280, max: 1920},
            height: {min: 360, ideal: 720, max: 1080},
            frameRate: {min: 16, ideal: 30, max: 30},
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
        })

        // Set initial track states based on state
        stream.getVideoTracks().forEach((track) => {
          track.enabled = isVideoEnabled
        })
        stream.getAudioTracks().forEach((track) => {
          track.enabled = isAudioEnabled
        })

        setLocalStream(stream)
        return stream
      } catch (error) {
        console.error("Error accessing media devices: " + error)
        return null
      }
    },
    [localStream, isVideoEnabled, isAudioEnabled]
  )
  // New function to handle preview
  const startPreview = async () => {
    const stream = await getMediaStream()
    if (stream) {
      setIsPreviewActive(true)
    }
  }

  // New function to stop preview
  const stopPreview = () => {
    if (localStream && !inRoom) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
      setIsPreviewActive(false)
    }
  }

  // New functions to handle audio/video controls
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
        setIsVideoEnabled(!isVideoEnabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled
        setIsAudioEnabled(!isAudioEnabled)
      }
    }
  }

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
          [socketId]: {peerConnection, remoteStream},
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
        console.log(
          `Connection state for ${socketId}:`,
          peerConnection.connectionState
        )
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
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        )
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
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          )
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
  }, [socket, handleUserJoined, handleOffer, handleAnswer, handleIceCandidate])

  const joinRoom = async () => {
    if (socket && currentlyWorking?._id && user?.fullname) {
      try {
        // Use existing stream if preview is active, otherwise get new stream
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
        // Double-check video element after joining
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
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
      setIsPreviewActive(false)

      // Reset control states
      setIsVideoEnabled(true)
      setIsAudioEnabled(true)

      // Cleanup peer connections
      Object.values(peerConnections).forEach(({peerConnection}) => {
        peerConnection.close()
      })
      setPeerConnections({})

      // Clear video refs
      if (localVideoRef.current) localVideoRef.current.srcObject = null
      Object.values(remoteVideoRefs.current).forEach((ref) => {
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
            {/* Preview section */}
            {!isPreviewActive ? (
              <Button onClick={startPreview} className="w-full">
                Start Preview
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Preview</h3>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-auto border rounded bg-black"
                  />
                </div>
                {/* Media controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleVideo}
                    className={!isVideoEnabled ? "bg-red-100" : ""}
                  >
                    {isVideoEnabled ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <VideoOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleAudio}
                    className={!isAudioEnabled ? "bg-red-100" : ""}
                  >
                    {isAudioEnabled ? (
                      <Mic className="h-4 w-4" />
                    ) : (
                      <MicOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={joinRoom}
                    variant="secondary"
                    className="flex-1"
                  >
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
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-auto border rounded bg-black"
                  />
                  {/* Media controls overlay */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleVideo}
                      className={`bg-background/80 hover:bg-background/90 ${
                        !isVideoEnabled ? "bg-red-100" : ""
                      }`}
                    >
                      {isVideoEnabled ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <VideoOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleAudio}
                      className={`bg-background/80 hover:bg-background/90 ${
                        !isAudioEnabled ? "bg-red-100" : ""
                      }`}
                    >
                      {isAudioEnabled ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <MicOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {Object.entries(peerConnections).map(
                ([socketId, {remoteStream}]) => {
                  // last chan
                  const remoteUser = users.find(
                    (user) => user.socketId === socketId
                  )
                  const isVideoEnabled = remoteStream
                    .getVideoTracks()
                    .some((track) => track.enabled)

                  return (
                    <div key={socketId}>
                      <h3 className="text-lg font-semibold mb-2">
                        {remoteUser?.name || "Remote User"}
                      </h3>
                      <div className="relative">
                        <video
                          ref={(el) => {
                            if (el) {
                              el.srcObject = remoteStream
                              remoteVideoRefs.current[socketId] = el
                            }
                          }}
                          autoPlay
                          playsInline
                          className={`w-full h-auto border rounded bg-black ${
                            !isVideoEnabled ? "hidden" : ""
                          }`}
                        />
                        {/* Fallback profile display when video is disabled */}
                        {!isVideoEnabled && remoteUser && (
                          <div className="w-full aspect-video border rounded bg-black/95 flex flex-col items-center justify-center space-y-4">
                            <img
                              src={remoteUser.profile}
                              alt={remoteUser.name}
                              className="w-24 h-24 rounded-full border-2 border-white/20"
                            />
                            <div className="text-white text-lg font-medium">
                              {remoteUser.name}
                            </div>
                            <div className="flex items-center space-x-2 text-white/60">
                              <VideoOff className="w-4 h-4" />
                              <span className="text-sm">Video Off</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
              )}
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
