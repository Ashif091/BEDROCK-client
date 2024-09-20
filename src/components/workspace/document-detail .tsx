"use client"
import dynamic from "next/dynamic"
// import Editor from "./Editor";

const Editor = dynamic(() => import("./Editor"), {ssr: false})

// interface DocumentDetailProps {
//   document: any
// }

// const DocumentDetail: React.FC<DocumentDetailProps> = ({document}) => {
//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-semibold mb-4 cursor-pointer">{document.title}</h2>
//       <p>Document content goes here...</p>
//       {/* <Editor /> */}
//     </div>
//   )
// }

// export default DocumentDetail

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense"
// import { Editor } from "./Editor";

export default function DocumentDetail({document}:any) {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_tZngn…c7iL6R"}>
      <RoomProvider id="my-room">
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <h2 className="text-2xl font-semibold mb-4 cursor-pointer">
            {document.title}
          </h2>
          <p>Document content goes here...</p> 
          <Editor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
