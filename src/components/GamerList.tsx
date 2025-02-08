"use client";
import LiveScreen from "@/components/streaming/LiveScreen";
import StreamerCard from "@/components/streaming/StreamerCard";
import { useStarCraftMatch } from "@/hooks/match/useStarCraftMatch";
import {
  useGetLiveStreamers,
  useGetStreamers,
} from "@/hooks/streamer/useStreamer";
import { useClickOutside } from "@/hooks/useClickOutSide";
import Image from "next/image";
import { useMemo, useState, useRef } from "react";

function StarTier() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedStreamer, setSelectedStreamer] = useState<number | null>(null);
  const [showOnlyLive, setShowOnlyLive] = useState(false);
  const [showOnlyMatched, setShowOnlyMatched] = useState(false);
  const streamerGridRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const { data: streamers } = useGetStreamers();
  const { data: liveStreamers } = useGetLiveStreamers();
  const { data } = useStarCraftMatch(
    selectedStreamer
      ? {
          streamerId: selectedStreamer,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }
      : null
  );

  const { streamer, opponents } = data || {};

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

  // 필터링 및 정렬 로직 수정
  const filteredStreamers = useMemo(() => {
    if (!streamers) return [];

    // 1. 먼저 필터링
    let filtered = streamers.filter((streamer) => {
      // 라이브 방송 필터
      if (showOnlyLive && !isStreamerLive(streamer.soopId)) {
        return false;
      }

      // 전적 존재 필터
      if (showOnlyMatched && selectedStreamer) {
        // 선택된 스트리머는 항상 포함
        if (streamer.id === selectedStreamer) return true;

        const hasMatch = opponents?.some(
          (match) => match.opponent.id === streamer.id
        );
        if (!hasMatch) return false;
      }

      return true;
    });

    // 2. 선택된 스트리머를 첫 번째로 정렬
    if (selectedStreamer) {
      filtered.sort((a, b) => {
        if (a.id === selectedStreamer) return -1;
        if (b.id === selectedStreamer) return 1;
        return 0;
      });
    }

    return filtered;
  }, [streamers, selectedStreamer, showOnlyLive, showOnlyMatched, opponents]);

  useClickOutside(containerRef, () => {
    if (selectedStreamer) {
      setShowOnlyMatched(false);
    }
  });

  // 기간 설정 함수 추가
  const handlePeriodSelect = (months: number) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    setDateRange({
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    });
  };

  return (
    <div ref={containerRef}>
      {/* 정 네비게이션 바 - 레이아웃 고려하여 위치 조정 */}
      <div className="fixed top-[64px] left-[240px] right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
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
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="rounded-lg border-gray-300"
                    />
                    <span className="text-gray-500">~</span>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="rounded-lg border-gray-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePeriodSelect(1)}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200"
                    >
                      1개월
                    </button>
                    <button
                      onClick={() => handlePeriodSelect(3)}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200"
                    >
                      3개월
                    </button>
                    <button
                      onClick={() => handlePeriodSelect(6)}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200"
                    >
                      6개월
                    </button>
                    <button
                      onClick={() => handlePeriodSelect(12)}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200"
                    >
                      1년
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-4">
              {selectedStreamer && (
                <button
                  onClick={() => setShowOnlyMatched(!showOnlyMatched)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors
                    ${
                      showOnlyMatched
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {showOnlyMatched ? "전체 보기" : "전적 있는 상대만 보기"}
                </button>
              )}
              <button
                onClick={() => setShowOnlyLive(!showOnlyLive)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors
                  ${
                    showOnlyLive
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
              >
                {showOnlyLive ? "전체 스트리머 보기" : "🔴 라이브 방송만 보기"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 바의 높이만큼 상단 여백 추가 */}
      <div className="pt-20">
        {/* 기존 스트리머 그리드 */}
        <div className="grid grid-cols-8 gap-4 p-4" ref={streamerGridRef}>
          {filteredStreamers?.map((streamer) => {
            return (
              <StreamerCard
                key={streamer.id}
                streamer={streamer}
                opponents={opponents}
                selectedStreamer={selectedStreamer}
                setSelectedStreamer={setSelectedStreamer}
                dateRange={dateRange}
                streamerGridRef={streamerGridRef}
                showOnlyLive={showOnlyLive}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StarTier;
