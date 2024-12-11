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

      // YouTube URL 처리
      if (
        videoUrl.hostname.includes("youtube.com") ||
        videoUrl.hostname.includes("youtu.be")
      ) {
        // 일반 YouTube URL을 임베드 URL로 변환
        const videoId = url.includes("youtu.be")
          ? url.split("/").pop()
          : new URLSearchParams(videoUrl.search).get("v");

        return `https://www.youtube.com/embed/${videoId}`;
      }

      // 다른 플랫폼의 경우 추가 처리 가능
      // if (videoUrl.hostname.includes('vimeo.com')) { ... }

      return url;
    } catch {
      // 상대 경로인 경우 절대 경로로 변환
      return url.startsWith("http") ? url : `https://${url}`;
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 200; // 스크롤할 픽셀 양
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-center justify-center">
      <div
        className={
          isFullscreen
            ? "w-full h-full bg-white rounded-lg flex flex-col"
            : "w-[min(90vw,1200px)] h-[min(90vh,800px)] bg-white rounded-lg flex flex-col"
        }
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          <h2 className="text-xl font-bold">
            {signature.songName} ({signature.starballoonCount}별)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {isFullscreen ? "축소" : "확대"}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              닫기
            </button>
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="p-4 bg-gray-50 shrink-0 relative">
          {showArrows && (
            <>
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
              >
                ←
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
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
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {dance.member?.name} (
                {format(new Date(dance.performedAt), "yyyy-MM-dd (eee)", {
                  locale: ko,
                })}
                )
              </button>
            ))}
          </div>
        </div>

        {/* 비디오 영역 */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="h-full flex items-center justify-center">
            <div
              className="w-full bg-black rounded-lg overflow-hidden mx-auto"
              style={{
                aspectRatio: "1.8/1",
                maxHeight: "100%",
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
