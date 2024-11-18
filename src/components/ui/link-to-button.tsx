"use client";
import {
  useBlockNoteEditor,
  useComponentsContext,
} from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { useEffect, useState, useRef } from "react";
import { createAxiosInstance } from "@/app/utils/axiosInstance";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useDocumentStore } from "@/stores/documentStore";

export function LinkToButton() {
  const editor: any = useBlockNoteEditor();
  const Components = useComponentsContext()!;
  const api = createAxiosInstance();
  const [href, setHref] = useState<string>("/");
  const { currentlyWorking } = useWorkspaceStore();
  const {fetchDocuments} = useDocumentStore()
  const [lastSegment, setLastSegment] = useState<string | null>(null);
  const apiCalled = useRef(false); // Ref to prevent multiple calls

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const segment = path.split("/doc/")[1];
      setLastSegment(segment);
    }
  }, []);

  useEffect(() => {
    if (apiCalled.current || !lastSegment || !editor) return;
    apiCalled.current = true; 

    const fetchHref = async () => {
      try {
        const response = await api.post("/doc/link_doc", {
          workspaceId: currentlyWorking?._id,
          title: editor.getSelectedText(),
          Doc_Id: lastSegment,
        });
        fetchDocuments(currentlyWorking?._id as string)

        const linkId = response.data.document._id;
        setHref(`/workspace/${currentlyWorking?._id}/doc/${linkId}`);
      } catch (error) {
        console.error("Failed to fetch link data:", error);
      }
    };

    fetchHref();
  }, [lastSegment, currentlyWorking, editor]);

  return (
    <Components.FormattingToolbar.Button
      mainTooltip={"Insert Link To"}
      onClick={() => {
        const selection = editor.getSelection();
        if (selection) {
          const text = editor.getSelectedText();
          if (href) {
            editor.insertInlineContent([
              { type: "linkTo", props: { href, text } },
            ]);
          }
        }
      }}
    >
      Link To
    </Components.FormattingToolbar.Button>
  );
}
