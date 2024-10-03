"use client"

import Editor from "@/components/workspace/Editor"

// import dynamic from "next/dynamic"
// const Editor = dynamic(() => import("@/components/workspace/Editor"), {ssr: false})


function DocPage() {
  return (
    <div className="p-4">
      {/*Title */}
      <h1 className="text-2xl mb-4">Document Page</h1>

      <Editor/>
      
    </div>
  )
}

export default DocPage




