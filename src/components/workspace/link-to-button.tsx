'use client'

import {
  useBlockNoteEditor,
  useComponentsContext,
  useEditorContentOrSelectionChange,
} from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { useState } from "react";
import { Link } from 'lucide-react';

export function LinkToButton() {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;

  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEditorContentOrSelectionChange(() => {
    setIsSelected(editor.getSelectedText().length > 0);
  }, editor);

  const handleLinkTo = async () => {
    const selectedText = editor.getSelectedText();
    if (selectedText) {
      console.log("selected text: " + selectedText);
      try {
        // In a real application, you would make an API call here
        // const response = await fetch('/api/create-document', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ title: selectedText }),
        // });
        // const data = await response.json();
        
        // For demonstration, we're using a placeholder ID
        const placeholderId = '1';

        editor.insertInlineContent([
          {
            type: "link",
            content: selectedText,
            href: `/document/${placeholderId}`,
          },
        ]);
      } catch (error) {
        console.error('Error creating document:', error);
      }
    }
  };

  return (
    <Components.FormattingToolbar.Button
      mainTooltip={"Link To"}
      onClick={handleLinkTo}
      isSelected={isSelected}
    >
      <Link size={18} />
    </Components.FormattingToolbar.Button>
  );
}