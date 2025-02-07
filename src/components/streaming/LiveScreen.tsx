import Image from "next/image";
import React from "react";

function LiveScreen({ liveInfo }: { liveInfo: any }) {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
      <div
        className="bg-black rounded-lg overflow-hidden shadow-2xl"
        style={{ width: "800px" }}
      >
        {/* Thumbnail */}
        <div className="relative w-full" style={{ height: "450px" }}>
          <Image
            src={liveInfo.thumbnail}
            alt="Stream thumbnail"
            fill
            className="object-cover"
          />
        </div>
        {/* Stream Info */}
        <div className="p-4 bg-black bg-opacity-90">
          <h3 className="text-white font-bold text-xl mb-2">
            {liveInfo.title}
          </h3>
          <div className="flex items-center text-gray-300">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-lg">
              {liveInfo.viewCount.toLocaleString()} 시청
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveScreen;
