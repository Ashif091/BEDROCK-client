import {useDocumentStore} from "@/stores/documentStore"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import Image from "next/image"
import Doc_icon from "../../../../../public/sidebar/file.png"
import { useRouter } from "next/navigation"
// interface DocumentListProps {
//   activeDocument: any
//   onDocumentClick: (doc: any) => void // Prop to handle document clicks
// }

const DocumentList = () => {
  const {documents} = useDocumentStore()
  const {currentlyWorking} = useWorkspaceStore()
  const router = useRouter()
  const onClickNavigation = (id: string) => {
    router.push(`/workspace/${currentlyWorking?._id}/doc/${id}`)
  }
  return (
    <div className="w-full h-60 overflow-hidden overflow-y-auto pb-3 border-y border-gray-200/30 side-scrollbar">
      <h2 className=" font-light opacity-45 text-xs my-4">Documents</h2>
      <ul className="space-y-1">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <li
              key={doc._id}
              className={`w-full p-1  h-7 items-center text-center rounded-md flex gap-2 cursor-pointer hover:bg-[#2b2b2b]`}
              onClick={() => onClickNavigation(doc._id as string)}
            >
              <Image src={Doc_icon} className="w-4 h-4 opacity-70" alt="#" />
              <h3 className="text-sm  font-light ">{doc.title}</h3>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-600">No documents available</li>
        )}
      </ul>
    </div>
  )
}

export default DocumentList

// ${
//   activeDocument && activeDocument._id === doc._id
//     ? "bg-[#2b2b2b]"
//     : "hover:bg-[#2b2b2b]"
// }
