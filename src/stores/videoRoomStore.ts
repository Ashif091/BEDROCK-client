import { create } from "zustand";
import { persist ,createJSONStorage} from "zustand/middleware";
import { io, Socket } from "socket.io-client";

interface User {
    name: string
    profile: string
    socketId: string | undefined
  }
  
  interface PeerConnection {
    peerConnection: RTCPeerConnection
    remoteStream: MediaStream
  }
  

interface VideoRoomStore {
  inRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  localStream: MediaStream | null;
  setLocalStream: (stream: MediaStream | null) => void;
  peerConnections: { [key: string]: PeerConnection };
  setPeerConnections: (connections: { [key: string]: PeerConnection }) => void;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRefs: { [key: string]: React.RefObject<HTMLVideoElement> };
  isVideoEnabled: boolean;
  toggleVideo: () => void;
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  isPreviewActive: boolean;
  setIsPreviewActive: (active: boolean) => void;
  socket: Socket;
  setSocket: (socket: Socket) => void;
}

// Create the store with Zustand
export const useVideoRoomStore = create<VideoRoomStore>()(
  persist(
    (set, get) => ({
      inRoom: false,
      setInRoom: (inRoom) => set({ inRoom }),
      users: [],
      setUsers: (users) => set({ users }),
      localStream: null,
      setLocalStream: (stream) => set({ localStream: stream }),
      peerConnections: {},
      setPeerConnections: (connections) => set({ peerConnections: connections }),
      localVideoRef: { current: null },
      remoteVideoRefs: {},
      isVideoEnabled: true,
      toggleVideo: () => {
        const { localStream, isVideoEnabled } = get();
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.enabled = !isVideoEnabled;
            set({ isVideoEnabled: !isVideoEnabled });
          }
        }
      },
      isAudioEnabled: true,
      toggleAudio: () => {
        const { localStream, isAudioEnabled } = get();
        if (localStream) {
          const audioTrack = localStream.getAudioTracks()[0];
          if (audioTrack) {
            audioTrack.enabled = !isAudioEnabled;
            set({ isAudioEnabled: !isAudioEnabled });
          }
        }
      },
      isPreviewActive: false,
      setIsPreviewActive: (active) => set({ isPreviewActive: active }),
      socket: io(process.env.NEXT_PUBLIC_SERVER_URL as string),
      setSocket: (socket) => set({ socket }),
    }),
    {
      name: "video-room-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        inRoom: state.inRoom,
        users: state.users,
        isVideoEnabled: state.isVideoEnabled,
        isAudioEnabled: state.isAudioEnabled,
        isPreviewActive: state.isPreviewActive,
      }),
    }
  )
);
