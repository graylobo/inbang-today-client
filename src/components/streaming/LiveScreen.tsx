import Image from "next/image";
import React from "react";

interface Position {
  top?: number;
  bottom?: number;
  left?: number;
}

function LiveScreen({
  liveInfo,
  position,
}: {
  liveInfo: any;
  position: Position;
}) {
  function ViewCount() {
    return (
      <div className="flex items-center text-gray-300">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>{liveInfo.viewCount.toLocaleString()}</span>
      </div>
    );
  }
  return (
    <div
      className="fixed z-50 opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-200 pointer-events-none"
      style={{
        top: position.top !== undefined ? `${position.top}px` : undefined,
        bottom:
          position.bottom !== undefined ? `${position.bottom}px` : undefined,
        left: position.left !== undefined ? `${position.left}px` : undefined,
      }}
    >
      <div
        className="rounded-lg overflow-hidden shadow-2xl"
        style={{ width: "500px", height: "350px" }}
      >
        <div className="relative">
          <div
            className="relative w-full"
            style={{ width: "500px", height: "300px" }}
          >
            <Image
              src={liveInfo.thumbnail}
              alt="Stream thumbnail"
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded px-2 py-1">
              <ViewCount />
            </div>
          </div>
          <div className="p-2 bg-black bg-opacity-90">
            <h3 className="text-white font-bold mb-2">{liveInfo.title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveScreen;
