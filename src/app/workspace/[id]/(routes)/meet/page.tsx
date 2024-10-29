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
//   const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});

  const [peerConnections, setPeerConnections] = useState<{
    [key: string]: PeerConnection
  }>({})
  const localVideoRef = useRef<HTMLVideoElement>(null)

  const {user} = useAuthStore()
  const {currentlyWorking} = useWorkspaceStore()
  useEffect(() => {
    console.log(" ⤵️~ useEffect ~ localStream:", localStream)
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])
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
  }, [socket,localStream,peerConnections])
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

  const joinRoom = async () => {
    if (socket && currentlyWorking?._id && (user?.fullname as string)) {
      try {
        const stream = await getMediaStream()
        console.log("🚀 ~ joinRoom ~ stream:", stream)
        if (!stream) {
          console.log("no stream available")
          return
        }

        // if (localVideoRef.current) {
        //   localVideoRef.current.srcObject = stream
        // }

        const userData: User = {
          name: user?.fullname as string,
          profile: user?.profile as string,
          socketId: socket.id,
        }

        socket.emit("join-room", currentlyWorking._id, userData)
        setInRoom(true)
      } catch (error) {
        console.error("Error accessing media devices:", error)
      }
    }
  }



  const handleUserJoined = useCallback(
    async (userData: User) => {
      setUsers((prevUsers) => [...prevUsers, userData])
      console.log(
        "🚀 ~ handleUserJoined ~ userData?.socketId:",
        userData?.socketId
      )
  
      if (userData?.socketId && localStream) {
        const peerConnection = createPeerConnection(userData.socketId)
        console.log("🚀 ~ handleUserJoined ~ peerConnection:", peerConnection)
  
        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)
        socket.emit("offer", offer, currentlyWorking?._id, userData.socketId)
      } else {
        console.warn("Local stream is not available yet")
      }
    },
    [socket, localStream, inRoom]
  )
  

  const createPeerConnection = useCallback(
    (socketId: string) => {
      console.log("😥 try to create connection")

      const peerConnection = new RTCPeerConnection({iceServers: ICE_SERVERS})
      const remoteStream = new MediaStream()
      console.log("connection is created , ", peerConnection)

      console.log("🚀 ~ localStream?.getTracks ~ localStream:", localStream)
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream)
        })
      } else {
        console.warn("Local stream is not available yet")
      }

    //   peerConnection.ontrack = (event) => {
        // const remoteStream = new MediaStream();
    //     event.streams[0].getTracks().forEach((track) => {
    //       remoteStream.addTrack(track)
    //     })
    //   }
    peerConnection.ontrack = (event) => {
        const remoteStream = new MediaStream();
        event.streams.forEach((stream) => {
          stream.getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
        });
        // setRemoteStreams((prev) => ({ ...prev, [socketId]: remoteStream }));
      };
      
      console.log("🚀 ~ createPeerConnection ~ peerConnection:", peerConnection)

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(
            "ice-candidate",
            event.candidate,
            currentlyWorking?._id,
            socketId
          )
        }
      }
      console.log("🚀 ~ createPeerConnection ~ peerConnection:", peerConnection)

      setPeerConnections((prev) => ({
        ...prev,
        [socketId]: {peerConnection, remoteStream},
      }))

      return peerConnection
    },
    [localStream, socket, inRoom]
  )

  const handleOffer = useCallback(
    async (offer: RTCSessionDescriptionInit, fromSocketId: string) => {
      console.log("➡️ ~ handleOffer ~ offer:", offer)

      const peerConnection = createPeerConnection(fromSocketId)
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      )
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      socket.emit("answer", answer, currentlyWorking?._id, fromSocketId)
    },
    [inRoom]
  )
  const handleAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit, fromSocketId: string) => {
      const peerConnection = peerConnections[fromSocketId]?.peerConnection;
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("✔️ Answer set successfully for socketId:", fromSocketId);
      } else {
        console.warn("❗ PeerConnection not found for socketId:", fromSocketId);
      }
    },
    [peerConnections]
  );
  
  const handleIceCandidate = useCallback(
    async (candidate: RTCIceCandidateInit, fromSocketId: string) => {
      const peerConnection = peerConnections[fromSocketId]?.peerConnection;
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("🧊 ICE Candidate added for socketId:", fromSocketId);
      } else {
        console.warn("❗ ICE Candidate could not be added. PeerConnection not found for socketId:", fromSocketId);
      }
    },
    [peerConnections]
  );
  

//   const handleAnswer = useCallback(
//     async (answer: RTCSessionDescriptionInit, fromSocketId: string) => {
        
//         const peerConnection = peerConnections[fromSocketId]?.peerConnection
//         console.log("💯 ~ handleAnswer ~ answer:", peerConnections)
//       console.log("");
      
//       if (peerConnection) {
//         await peerConnection.setRemoteDescription(
//           new RTCSessionDescription(answer)
//         )
//       }
//     },
//     [inRoom,peerConnections]
//   )

//   const handleIceCandidate = useCallback(
//     async (candidate: RTCIceCandidateInit, fromSocketId: string) => {
      
//       const peerConnection = peerConnections[fromSocketId]?.peerConnection
//       console.log("🧐 final sdp status id ",fromSocketId ,":", peerConnection)

//       if (peerConnection) {
//         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
//       }
//     },
//     [inRoom,peerConnections]
//   )
  const leaveRoom = () => {
    if (socket && currentlyWorking?._id) {
      socket.emit("leave-room", currentlyWorking._id)
      setInRoom(false)
      setUsers([])
      localStream?.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
      Object.values(peerConnections).forEach((pc) => pc.peerConnection.close())
      setPeerConnections({})
    }
  }
  const handleUserLeft = (userData: User) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.socketId !== userData.socketId)
    )
    if (peerConnections[userData.socketId]) {
      peerConnections[userData.socketId].peerConnection.close()
      const newPeerConnections = {...peerConnections}
      delete newPeerConnections[userData.socketId]
      setPeerConnections(newPeerConnections)
    }
  }

  const handleRoomUsers = (roomUsers: User[]) => {
    console.log("🚀 ~ handleRoomUsers ~ roomUsers:", roomUsers)
    setUsers(roomUsers)
  }
 useEffect(()=>{
     console.log("😁 ~ useEffect ~ remoteStreams:", peerConnections)
    
 },[peerConnections])

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
                  className="w-full h-auto  border"
                />
              </div>
              {/* {Object.entries(remoteStreams).map(([socketId, stream]) => ( */}
              {Object.entries(peerConnections).map(
                ([socketId, {remoteStream}]) => (

                  <div key={socketId}>
                    <h3 className="text-lg font-semibold mb-2">Remote Video{!remoteStream.active&&"false"}</h3>
                    <video
                      autoPlay
                      playsInline
                      className="w-full h-auto"
                      ref={(el) => {
                        if (el) el.srcObject = remoteStream
                      }}
                    />
                  </div>
                )
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
