"use client"
import {useBlockNoteEditor, useComponentsContext} from "@blocknote/react"
import "@blocknote/mantine/style.css"
import {useState} from "react"
import {createAxiosInstance} from "@/app/utils/axiosInstance"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import {useDocumentStore} from "@/stores/documentStore"

export function LinkToButton() {
  const editor: any = useBlockNoteEditor()
  const Components = useComponentsContext()!
  const api = createAxiosInstance()
  const {currentlyWorking} = useWorkspaceStore()
  const {fetchDocuments} = useDocumentStore()
  const [linkHref, setLinkHref] = useState<string | null>(null)

  const [lastSegment] = useState(() => {
    if (typeof window === "undefined") return null
    return window.location.pathname.split("/doc/")[1] || null
  })

  const handleClick = async () => {
    const selection = editor.getSelection()
    if (!selection) return
    const text = editor.getSelectedText() || ""


    if (linkHref) {
      editor.insertInlineContent([
        {type: "linkTo", props: {href: linkHref, text}},
      ])
      return
    }


    if (!lastSegment || !currentlyWorking?._id) {
      console.warn("Missing workspace or document context")
      return
    }

    try {
      const response = await api.post("/doc/link_doc", {
        workspaceId: currentlyWorking._id,
        title: text,
        Doc_Id: lastSegment,
      })

      const newId = response.data.document._id
      const href = `/workspace/${currentlyWorking._id}/doc/${newId}`

      setLinkHref(href)
      fetchDocuments(currentlyWorking._id)


      editor.insertInlineContent([{type: "linkTo", props: {href, text}}])
    } catch (err) {
      console.error("Failed to create link-doc:", err)
    }
  }
  return (
    <Components.FormattingToolbar.Button
      mainTooltip={"Insert Link To"}
      onClick={handleClick}
    >
      Link To
    </Components.FormattingToolbar.Button>
  )
}
