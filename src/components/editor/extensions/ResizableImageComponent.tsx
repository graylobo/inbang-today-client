// components/editor/nodes/ResizableImageComponent.tsx
import React, { useRef, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

const ResizableImageComponent = ({ node, updateAttributes, selected }: any) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const startResize = (event: React.MouseEvent) => {
    setIsResizing(true);
    setStartX(event.clientX);
    setStartWidth(imgRef.current?.offsetWidth || 0);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = startWidth + (event.clientX - startX);
    updateAttributes({ width: `${newWidth}px` });
  };

  const stopResize = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopResize);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing]);

  return (
    <NodeViewWrapper className="relative inline-block">
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt}
        style={{
          width: node.attrs.width || "auto",
          height: node.attrs.height || "auto",
        }}
        className="rounded-md"
      />
      {selected && (
        <div
          onMouseDown={startResize}
          className="absolute right-0 bottom-0 w-4 h-4 bg-blue-500 cursor-ew-resize z-10"
          style={{ transform: "translate(50%, 50%)" }}
        />
      )}
    </NodeViewWrapper>
  );
};

export default ResizableImageComponent;
