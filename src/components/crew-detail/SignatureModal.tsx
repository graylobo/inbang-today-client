"use client";

import { useState } from "react";
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
  const [selectedDanceIndex, setSelectedDanceIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!signature) return null;

  const currentDance = signature.dances?.[selectedDanceIndex];

  // URL이 유효한 절대 경로인지 확인하고 처리하는 함수
  const getValidVideoUrl = (url: string) => {
    if (!url) return "";

    try {
      // URL이 유효한지 확인
      new URL(url);
      return url;
    } catch {
      // 상대 경로인 경우 절대 경로로 변환
      return url.startsWith("http") ? url : `https://${url}`;
    }
  };

  const handlePrevDance = () => {
    setSelectedDanceIndex((prev) =>
      prev === 0 ? signature.dances?.length - 1 : prev - 1
    );
  };

  const handleNextDance = () => {
    setSelectedDanceIndex((prev) =>
      prev === signature.dances?.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        className={`bg-white rounded-lg ${
          isFullscreen ? "w-full h-full" : "w-4/5 h-4/5"
        }`}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
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
        <div className="relative flex items-center justify-center p-4 bg-gray-50">
          {signature.dances?.length > 1 && (
            <>
              <button
                onClick={handlePrevDance}
                className="absolute left-4 p-2 hover:bg-gray-200 rounded"
              >
                {"<"}
              </button>
              <button
                onClick={handleNextDance}
                className="absolute right-4 p-2 hover:bg-gray-200 rounded"
              >
                {">"}
              </button>
            </>
          )}
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            {currentDance?.member?.name} (
            {format(new Date(currentDance?.performedAt), "yyyy-MM-dd (eee)", {
              locale: ko,
            })}
            )
          </button>
        </div>

        {/* 비디오 영역 */}
        <div className="flex-1 p-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
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
  );
}
