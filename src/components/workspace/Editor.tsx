"use client"
import {useEffect, useState} from "react"
import {BlockNoteEditor} from "@blocknote/core"
import "@blocknote/core/fonts/inter.css"
import {useCreateBlockNote} from "@blocknote/react"
// import {BlockNoteView} from "@blocknote/shadcn"
import {BlockNoteView} from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import {LiveblocksYjsProvider} from "@liveblocks/yjs"
import * as Y from "yjs"
import {useRoom, useSelf} from "@liveblocks/react/suspense"
import stringToColor from "../lib/stringToColor"
import { useEdgeStore } from "@/lib/edgestore"
import Settings from "./settings/settings"

type EditorProps = {
  doc: Y.Doc
  provider: any
}

function Editor() {
  const room = useRoom()
  const [doc, setDoc] = useState<Y.Doc>()
  const [provider, setProvider] = useState<LiveblocksYjsProvider>()

  // Set up Liveblocks Yjs provider
  useEffect(() => {
    const yDoc = new Y.Doc()
    const yProvider = new LiveblocksYjsProvider(room, yDoc)
    setDoc(yDoc)
    setProvider(yProvider)

    return () => {
      yDoc?.destroy()
      yProvider?.destroy()
    }
  }, [room])

  if (!doc || !provider) {
    return null
  }

  return (
    <div className="items-center">
      <BlockNote doc={doc} provider={provider} />
    </div>
  )
}

function BlockNote({doc, provider}: EditorProps) {
  const userInfo = useSelf((me) => me.info)
  const {edgestore} = useEdgeStore()
  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });
 
    return response.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo.name,
        color: stringToColor(userInfo.email),
      },
    },
    uploadFile:handleUpload,
  })

  return (
    <BlockNoteView
      className=""
      theme="dark"
      // formattingToolbar={false}
      // linkToolbar={false}
      // sideMenu={false}
      // slashMenu={false}
      // filePanel={false}
      // tableHandles={false}
      editor={editor}
    />
  )
}

export default Editor
