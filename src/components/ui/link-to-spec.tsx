"use client"

import {createReactInlineContentSpec} from "@blocknote/react"
import {useRouter} from "next/navigation"

function LinkToRenderer(props: any) {
  const router = useRouter()
  const {href, text} = props.inlineContent.props

  return (
    <span
      onClick={() => router.push(href)}
      style={{
        color: "#7153e9",
        textDecoration: "underline",
        cursor: "pointer",
      }}
    >
      {text || href}
    </span>
  )
}

export const LinkTo = createReactInlineContentSpec(
  {
    type: "linkTo",
    propSchema: {
      href: {default: ""},
      text: {default: ""},
    },
    content: "none",
  },
  {
    render: LinkToRenderer,
  }
)
