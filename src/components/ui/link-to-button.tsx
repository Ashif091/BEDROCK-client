"use client"
import {useBlockNoteEditor, useComponentsContext} from "@blocknote/react"
import {Popover, Button, Loader, Box, ScrollArea, Text} from "@mantine/core"
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

  const [opened, setOpened] = useState(false)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<
    {value: string; id?: string; isNew: boolean}[]
  >([])

  const handleButtonClick = () => {
    const sel = editor.getSelectedText()
    if (!sel) return
    setQuery(sel)
    setOpened(true)

    setLoading(true)
    api
      .get("/doc/search", {
        params: {
          workspaceId: currentlyWorking?._id,
          searchQuery: sel,
        },
      })
      .then((resp) => {
        setOptions([
          {value: sel, isNew: true},
          ...resp.data.map((d: any) => ({
            value: d.title,
            id: d._id,
            isNew: false,
          })),
        ])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleSelect = async (item: {
    value: string
    id?: string
    isNew: boolean
  }) => {
    setOpened(false)

    let href: string
    let text = item.value

    if (item.isNew) {
      // create new doc
      const resp = await api.post("/doc/link_doc", {
        workspaceId: currentlyWorking!._id,
        title: item.value,
        Doc_Id: window.location.pathname.split("/doc/")[1],
      })
      href = `/workspace/${currentlyWorking!._id}/doc/${resp.data.document._id}`
      fetchDocuments(currentlyWorking!._id as string)
    } else {
      // use existing
      await api.post("/doc/add_edge", {
        workspaceId: currentlyWorking!._id,
        Doc_Id: window.location.pathname.split("/doc/")[1],
        existing_doc_Id: item.id,
      })
      href = `/workspace/${currentlyWorking!._id}/doc/${item.id}`
    }

    editor.insertInlineContent([{type: "linkTo", props: {href, text}}])
  }

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      withArrow
      trapFocus={false}
    >
      <Popover.Target>
        <Components.FormattingToolbar.Button
          mainTooltip="🔗Insert LinkTo"
          onClick={handleButtonClick}
        >
          Link To
        </Components.FormattingToolbar.Button>
      </Popover.Target>

      <Popover.Dropdown style={{width: 250}}>
        {loading ? (
          <Box style={{textAlign: "center", py: 12}}>
            <Loader size="sm" />
          </Box>
        ) : (
          <ScrollArea
            style={{maxHeight: 200}}
            className="max-h-[200px] rounded-[5px] border border-neutral-700 bg-[#252525] p-1"
          >
            {/* Create new entry */}
            <Button
              fullWidth
              variant="light"
              onClick={() => handleSelect(options[0])}
              style={{mb: 4, backgroundColor: "rgba(110,114,229,0.1)"}}
            >
              <Text size="sm">Create “{query}”</Text>
            </Button>

            {/* Existing-doc suggestions */}
            {options.slice(1).map((opt) => (
              <Button
                key={opt.id}
                fullWidth
                variant="subtle"
                onClick={() => handleSelect(opt)}
                style={{justifyContent: "flex-start"}}
              >
                <Text size="sm">{opt.value}</Text>
              </Button>
            ))}
          </ScrollArea>
        )}
      </Popover.Dropdown>
    </Popover>
  )
}
