import {useState} from "react"

interface DocumentDetailProps {
  document: any
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({document}) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 cursor-pointer">{document.title}</h2>
      <p>Document content goes here...</p>
    </div>
  )
} 

export default DocumentDetail
