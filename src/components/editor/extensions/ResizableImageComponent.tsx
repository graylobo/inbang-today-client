// components/editor/nodes/ResizableImageComponent.tsx
import React, { useRef, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

const ResizableImageComponent = ({ node, updateAttributes, selected }: any) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [resizeDirection, setResizeDirection] = useState("bottom-right");

  const startResize = (event: React.MouseEvent, direction: string) => {
    setResizeDirection(direction);
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
          border: selected ? "2px solid #3B82F6" : "none", // blue-500 색상
          borderRadius: "0.375rem", // rounded-md
        }}
      />
      {selected && (
        <>
          {/* Top-Left */}
          <div
            onMouseDown={(e) => startResize(e, "top-left")}
            className="absolute top-0 left-0 w-3 h-3 bg-blue-500 cursor-nwse-resize z-10"
            style={{ transform: "translate(-50%, -50%)" }}
          />
          {/* Top-Right */}
          <div
            onMouseDown={(e) => startResize(e, "top-right")}
            className="absolute top-0 right-0 w-3 h-3 bg-blue-500 cursor-nesw-resize z-10"
            style={{ transform: "translate(50%, -50%)" }}
          />
          {/* Bottom-Left */}
          <div
            onMouseDown={(e) => startResize(e, "bottom-left")}
            className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 cursor-nesw-resize z-10"
            style={{ transform: "translate(-50%, 50%)" }}
          />
          {/* Bottom-Right */}
          <div
            onMouseDown={(e) => startResize(e, "bottom-right")}
            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-nwse-resize z-10"
            style={{ transform: "translate(50%, 50%)" }}
          />
        </>
      )}
    </NodeViewWrapper>
  );
};

export default ResizableImageComponent;
