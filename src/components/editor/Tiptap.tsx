"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2 p-2 border-b dark:border-gray-700">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${
          editor.isActive("bold")
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <strong>B</strong>
      </button>
      <button
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
        onClick={() => {
          const url = window.prompt("이미지 URL을 입력하세요:");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        🖼️
      </button>
      <button
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
}: {
  content: string;
  onChange: (html: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Markdown,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
};

export default Tiptap;
