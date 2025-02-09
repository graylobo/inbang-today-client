"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { useCallback, useEffect } from "react";

interface TiptapProps {
  content?: string;
  onChange: (content: string) => void;
  editable?: boolean;
  initialContent?: string;
}
const MenuBar = ({
  editor,
  onImageUpload,
}: {
  editor: any;
  onImageUpload: () => void;
}) => {
  if (!editor) return null;

  return (
    <div className="flex gap-2 p-2 border-b dark:border-gray-700">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        type="button"
        className={`p-2 rounded ${
          editor.isActive("bold")
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${
          editor.isActive("italic")
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={onImageUpload}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        🖼️
      </button>
      <input
        type="file"
        id="image-upload"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
              if (typeof reader.result === "string") {
                const formData = new FormData();
                formData.append("upload", file);

                try {
                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/editor/upload`,
                    {
                      method: "POST",
                      body: formData,
                    }
                  );

                  if (!response.ok) throw new Error("Upload failed");

                  const { url } = await response.json();
                  editor.chain().focus().setImage({ src: url }).run();
                } catch (error) {
                  console.error("Image upload failed:", error);
                  alert("이미지 업로드에 실패했습니다.");
                }
              }
            };
            reader.readAsDataURL(file);
          }
          e.target.value = ""; // 입력 초기화
        }}
      />
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("링크 URL을 입력하세요:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded ${
          editor.isActive("link")
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        🔗
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded ${
          editor.isActive("codeBlock")
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <code>{"</>"}</code>
      </button>
    </div>
  );
};

const Tiptap = ({
  content,
  onChange,
  editable,
  initialContent,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
      Markdown,
    ],
    content: initialContent || content || "",
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);
  const addImage = useCallback(
    async (file: File) => {
      if (!editor) return;

      try {
        const formData = new FormData();
        formData.append("upload", file);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/editor/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Upload failed");

        const { url } = await response.json();
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    },
    [editor]
  );

  // 파일 드롭 핸들러
  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer?.files || []);
      const imageFile = files.find((file) => file.type.startsWith("image/"));
      if (imageFile) {
        addImage(imageFile);
      }
    },
    [addImage]
  );

  // 붙여넣기 핸들러
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items || []);
      const imageItem = items.find((item) => item.type.startsWith("image/"));
      if (imageItem) {
        const file = imageItem.getAsFile();
        if (file) {
          addImage(file);
        }
      }
    },
    [addImage]
  );

  // 이벤트 리스너 등록
  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;
    editorElement.addEventListener("drop", handleDrop);
    editorElement.addEventListener("paste", handlePaste);

    return () => {
      editorElement.removeEventListener("drop", handleDrop);
      editorElement.removeEventListener("paste", handlePaste);
    };
  }, [editor, handleDrop, handlePaste]);

  const handleImageUpload = () => {
    document.getElementById("image-upload")?.click();
  };

  return (
    <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
      <MenuBar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
};

export default Tiptap;
