"use client"
// import dynamic from "next/dynamic"

// const Editor = dynamic(() => import("@/components/workspace/Editor"), {ssr: false})

function DocPage() {
  console.log("page initialized;");
  return (
    <div >DocPage</div>
  )
}

export default DocPage


// import {
//   LiveblocksProvider,
//   RoomProvider,
//   ClientSideSuspense,
// } from "@liveblocks/react/suspense"


// export default function DocumentDetail() {
//   return (
//     <LiveblocksProvider publicApiKey={"pk_dev_tZngn…c7iL6R"}>
//       <RoomProvider id="my-room">
//         <ClientSideSuspense fallback={<div>Loading…</div>}>
//           <h2 className="text-2xl font-semibold mb-4 cursor-pointer">
//             {/* {document.title} */} test
//           </h2>
//           <p>Document content goes here...</p> 
//           <Editor />
//         </ClientSideSuspense>
//       </RoomProvider>
//     </LiveblocksProvider>
//   )
// }


