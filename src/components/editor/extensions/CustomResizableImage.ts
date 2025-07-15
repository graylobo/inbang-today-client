// components/editor/extensions/CustomResizableImage.ts
import ResizableImageComponent from "@/components/editor/extensions/ResizableImageComponent";
import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";

const CustomResizableImage = Image.extend({
  name: "resizableImage",

  addOptions() {
    return {
      ...this.parent?.(),
      allowBase64: true,
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: "auto",
        renderHTML: (attributes) => ({
          height: attributes.height,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

export default CustomResizableImage;
