import RoomProvider from "@/components/liveblock/RoomProvider"

const DocLayout = ({
  children,
  params: {docId},
}: {
  children: React.ReactNode
  params: {docId: string}
}) => {
  return <RoomProvider roomId={docId}>{children}</RoomProvider>
}

export default DocLayout
