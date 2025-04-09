"use client";
import GamerListNavigation from "@/components/streaming/GamerListNavigation";
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
  const [navHeight, setNavHeight] = useState(80); // 기본 높이

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const { data: streamers } = useGetStreamers(["starcraft"]);
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

    // 서버에서 이미 스타크래프트 카테고리 스트리머만 가져왔으므로
    // 라이브 방송과 매치 필터만 적용
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
      <GamerListNavigation
        selectedStreamer={selectedStreamer}
        setSelectedStreamer={setSelectedStreamer}
        dateRange={dateRange}
        setDateRange={setDateRange}
        showOnlyMatched={showOnlyMatched}
        setShowOnlyMatched={setShowOnlyMatched}
        showOnlyLive={showOnlyLive}
        setShowOnlyLive={setShowOnlyLive}
        onHeightChange={setNavHeight}
      />

      {/* 네비게이션 바의 높이만큼 상단 여백 추가 */}
      <div
        className="transition-all duration-300"
        style={{ marginTop: navHeight }}
      >
        {/* 기존 스트리머 그리드 */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 p-4"
          ref={streamerGridRef}
        >
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
