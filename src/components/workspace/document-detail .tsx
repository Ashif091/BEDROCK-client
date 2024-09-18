"use client"
import dynamic from "next/dynamic";
// import Editor from "./Editor";
 
// const Editor = dynamic(() => import("./Editor"), { ssr: false });


interface DocumentDetailProps {
  document: any
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({document}) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 cursor-pointer">{document.title}</h2>
      <p>Document content goes here...</p>
      {/* <Editor /> */}
    </div>
  )
} 

export default DocumentDetail