import { useStarCraftMatch } from "@/hooks/match/useStarCraftMatch";
import {
  useGetLiveStreamers,
  useGetStreamers,
} from "@/hooks/streamer/useStreamer";
import Image from "next/image";
import { useState } from "react";

function StarTier() {
  const [selectedStreamer, setSelectedStreamer] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30일 전
    endDate: new Date().toISOString().split('T')[0], // 오늘
  });

  const { data: streamers } = useGetStreamers();
  const { data: liveStreamers } = useGetLiveStreamers();
  const { data: gameMatch } = useStarCraftMatch(
    selectedStreamer
      ? {
          streamerId: selectedStreamer,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }
      : null
  );

  const [showOnlyLive, setShowOnlyLive] = useState(false);

  // 종족별 배경색 설정
  const getRaceColor = (race: string) => {
    switch (race?.toLowerCase()) {
      case "protoss":
        return "bg-[#FF6B00]";
      case "terran":
        return "bg-[#304C89]";
      case "zerg":
        return "bg-[#8B00FF]";
      default:
        return "bg-gray-600";
    }
  };

  // 스트리머가 현재 라이브 중인지 확인하는 함수
  const isStreamerLive = (soopId: string) => {
    return liveStreamers?.some((live) => live.profileUrl.includes(soopId));
  };

  const getLiveStreamInfo = (soopId: string) => {
    return liveStreamers?.find((live) => live.profileUrl.includes(soopId));
  };

  // 표시할 스트리머 필터링
  const filteredStreamers = showOnlyLive
    ? streamers?.filter((streamer) => isStreamerLive(streamer.soopId))
    : streamers;

  return (
    <div>
      {/* 토글 버튼과 날짜 선택 */}
      <div className="flex justify-between items-center mb-4 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedStreamer(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${selectedStreamer ? "bg-gray-500 text-white" : "hidden"}`}
          >
            전적 비교 취소
          </button>
          {selectedStreamer && (
            <>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="rounded-lg border-gray-300"
              />
              <span className="text-gray-500">~</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="rounded-lg border-gray-300"
              />
            </>
          )}
        </div>
        <button
          onClick={() => setShowOnlyLive(!showOnlyLive)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors
            ${
              showOnlyLive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
        >
          {showOnlyLive ? "🔴 라이브 방송만 보기" : "전체 스트리머 보기"}
        </button>
      </div>

      {/* 스트리머 그리드 */}
      <div className="grid grid-cols-6 gap-4 p-4">
        {filteredStreamers?.map((streamer) => {
          const liveInfo = getLiveStreamInfo(streamer.soopId);
          const matchInfo = gameMatch?.find(
            (match) => match.opponent.id === streamer.id
          );
          const isSelected = selectedStreamer === streamer.id;

          return (
            <div
              key={streamer.id}
              onClick={() =>
                setSelectedStreamer(isSelected ? null : streamer.id)
              }
              className={`relative rounded-lg overflow-hidden ${getRaceColor(
                streamer.race
              )} group cursor-pointer
                ${
                  selectedStreamer && !isSelected && !matchInfo
                    ? "opacity-40"
                    : ""
                }
                ${isSelected ? "ring-4 ring-yellow-400" : ""}`}
            >
              {/* Image Container */}
              <div className="relative aspect-square">
                <Image
                  src={`https://profile.img.sooplive.co.kr/LOGO/${streamer.soopId?.slice(
                    0,
                    2
                  )}/${streamer.soopId}/${streamer.soopId}.jpg`}
                  alt={streamer.name}
                  fill
                  className="object-cover"
                />

                {/* Large Preview Modal - Only shows when streamer is live and on hover */}
                {liveInfo && (
                  <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div
                      className="bg-black rounded-lg overflow-hidden shadow-2xl"
                      style={{ width: "800px" }}
                    >
                      {/* Thumbnail */}
                      <div
                        className="relative w-full"
                        style={{ height: "450px" }}
                      >
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
                )}
              </div>

              {/* Footer Info */}
              <div className={`p-2 ${getRaceColor(streamer.race)} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="font-bold">{streamer.name}</div>
                  {liveInfo && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="text-sm opacity-75">{streamer.tier}</div>
                {matchInfo && (
                  <div className="mt-1 text-xs bg-black bg-opacity-30 p-1 rounded">
                    {matchInfo.wins}승 {matchInfo.losses}패 (
                    {Math.round(matchInfo.winRate)}%)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StarTier;
