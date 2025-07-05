"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface SignatureModalProps {
  signature: any;
  onClose: () => void;
}

export default function SignatureModal({
  signature,
  onClose,
}: SignatureModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDanceIndex, setSelectedDanceIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!signature) return;

    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const isOverflowing =
          scrollContainerRef.current.scrollWidth >
          scrollContainerRef.current.clientWidth;
        setShowArrows(isOverflowing);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [signature?.dances]);

  if (!signature) return null;

  const currentDance = signature.dances?.[selectedDanceIndex];

  const getValidVideoUrl = (url: string) => {
    if (!url) return "";

    try {
      const videoUrl = new URL(url);

      if (
        videoUrl.hostname.includes("youtube.com") ||
        videoUrl.hostname.includes("youtu.be")
      ) {
        const videoId = url.includes("youtu.be")
          ? url.split("/").pop()
          : new URLSearchParams(videoUrl.search).get("v");

        return `https://www.youtube.com/embed/${videoId}`;
      }

      return url;
    } catch {
      return url.startsWith("http") ? url : `https://${url}`;
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 200;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center my-0">
      <div
        className={
          isFullscreen
            ? "w-full h-full bg-white dark:bg-gray-800 rounded-lg flex flex-col"
            : "w-[900px] h-[650px] bg-white dark:bg-gray-800 rounded-lg flex flex-col"
        }
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center p-3 border-b dark:border-gray-700 shrink-0">
          <h2 className="text-lg font-bold truncate dark:text-gray-100">
            {signature.songName} ({signature.starballoonCount}개)
          </h2>
          <div className="flex gap-2 shrink-0">
            {/* <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 transition-colors"
            >
              {isFullscreen ? "축소" : "확대"}
            </button> */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900 shrink-0 relative">
          {showArrows && (
            <>
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                →
              </button>
            </>
          )}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 overflow-x-auto pb-2 px-8 scrollbar-hide"
          >
            {signature.dances?.map((dance: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedDanceIndex(index)}
                className={`px-4 py-2 rounded whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedDanceIndex === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {dance.memberName} (
                {format(new Date(dance.performedAt), "yyyy-MM-dd", {
                  locale: ko,
                })}
                )
              </button>
            ))}
          </div>
        </div>

        {/* 비디오 영역 */}
        <div className="flex-1 p-3 min-h-0">
          <div className="h-full flex items-center">
            <div
              className="w-full bg-black rounded-lg overflow-hidden"
              style={{
                aspectRatio: "1.8/1",
                maxHeight: "500px",
              }}
            >
              {currentDance?.danceVideoUrl && (
                <iframe
                  src={getValidVideoUrl(currentDance.danceVideoUrl)}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
