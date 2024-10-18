// "use client"
// import {useEffect, useState} from "react"
// import {BlockNoteEditor} from "@blocknote/core"
// import "@blocknote/core/fonts/inter.css"
// import {useCreateBlockNote} from "@blocknote/react"
// // import {BlockNoteView} from "@blocknote/shadcn"
// import {BlockNoteView} from "@blocknote/mantine"
// import "@blocknote/mantine/style.css"
// import {LiveblocksYjsProvider} from "@liveblocks/yjs"
// import * as Y from "yjs"
// import {useRoom, useSelf} from "@liveblocks/react/suspense"
// import stringToColor from "../lib/stringToColor"
// import {useEdgeStore} from "@/lib/edgestore"
// import Settings from "./settings/settings"

// type EditorProps = {
//   doc: Y.Doc
//   provider: any
// }

// function Editor() {
//   const room = useRoom()
//   const [doc, setDoc] = useState<Y.Doc>()
//   const [provider, setProvider] = useState<LiveblocksYjsProvider>()

//   // Set up Liveblocks Yjs provider
//   useEffect(() => {
//     const yDoc = new Y.Doc()
//     const yProvider = new LiveblocksYjsProvider(room, yDoc)
//     setDoc(yDoc)
//     setProvider(yProvider)

//     return () => {
//       yDoc?.destroy()
//       yProvider?.destroy()
//     }
//   }, [room])

//   if (!doc || !provider) {
//     return null
//   }

//   return (
//     <div className="items-center">
//       <BlockNote doc={doc} provider={provider} />
//     </div>
//   )
// }

// function BlockNote({doc, provider}: EditorProps) {
//   const userInfo = useSelf((me) => me.info)
//   const {edgestore} = useEdgeStore()
//   const handleUpload = async (file: File) => {
//     const response = await edgestore.publicFiles.upload({
//       file,
//     })

//     return response.url
//   }

//   const editor: BlockNoteEditor = useCreateBlockNote({
//     collaboration: {
//       provider,
//       fragment: doc.getXmlFragment("document-store"),
//       user: {
//         name: userInfo.name,
//         color: stringToColor(userInfo.email),
//       },
//     },
//     uploadFile: handleUpload,
//   })

//   return (
//     <>
//       <div>
//       </div>
//       <BlockNoteView className="" theme="dark" editor={editor} />

//     </>
//   )
// }

// export default Editor


'use client'

import { useEffect, useState } from "react"
import { BlockNoteEditor, BlockNoteSchema, defaultInlineContentSpecs } from "@blocknote/core"
import "@blocknote/core/fonts/inter.css"
import { useCreateBlockNote, createReactInlineContentSpec } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { LiveblocksYjsProvider } from "@liveblocks/yjs"
import * as Y from "yjs"
import { useRoom, useSelf } from "@liveblocks/react/suspense"
import stringToColor from "../lib/stringToColor"
import { useEdgeStore } from "@/lib/edgestore"
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
} from "@blocknote/react";
import { LinkToButton } from "./link-to-button"

type EditorProps = {
  doc: Y.Doc
  provider: any
}

// Custom LinkTo inline content
const LinkTo = createReactInlineContentSpec(
  {
    type: "linkTo",
    propSchema: {
      href: {
        default: "",
      },
      text: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: (props) => (
      <a
        href={props.inlineContent.props.href}
        style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
      >
        {props.inlineContent.props.text}
      </a>
    ),
  }
)

// Create a schema with our custom inline content
const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    linkTo: LinkTo,
  },
})

function Editor() {
  const room = useRoom()
  const [doc, setDoc] = useState<Y.Doc>()
  const [provider, setProvider] = useState<LiveblocksYjsProvider>()

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

function BlockNote({ doc, provider }: EditorProps) {
  const userInfo = useSelf((me) => me.info)
  const { edgestore } = useEdgeStore()

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });
    return response.url;
  };

  const editor = useCreateBlockNote({
    schema,
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo.name,
        color: stringToColor(userInfo.email),
      },
    },
    uploadFile: handleUpload,
  })

  return (
    <BlockNoteView editor={editor} formattingToolbar={false}>
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <BlockTypeSelect key={"blockTypeSelect"} />
            <LinkToButton key={"linkToButton"} />
            <FileCaptionButton key={"fileCaptionButton"} />
            <FileReplaceButton key={"replaceFileButton"} />
            <BasicTextStyleButton
              basicTextStyle={"bold"}
              key={"boldStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"italic"}
              key={"italicStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"underline"}
              key={"underlineStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"strike"}
              key={"strikeStyleButton"}
            />
            <TextAlignButton
              textAlignment={"left"}
              key={"textAlignLeftButton"}
            />
            <TextAlignButton
              textAlignment={"center"}
              key={"textAlignCenterButton"}
            />
            <TextAlignButton
              textAlignment={"right"}
              key={"textAlignRightButton"}
            />
            <ColorStyleButton key={"colorStyleButton"} />
            <NestBlockButton key={"nestBlockButton"} />
            <UnnestBlockButton key={"unnestBlockButton"} />
            <CreateLinkButton key={"createLinkButton"} />
          </FormattingToolbar>
        )}
      />
    </BlockNoteView>
  )
}

export default Editor