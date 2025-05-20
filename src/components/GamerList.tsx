"use client";
import GamerListNavigation from "@/components/streaming/GamerListNavigation";
import StreamerCard from "@/components/streaming/StreamerCard";
import TierSystem from "@/components/TierSystem";
import { useGetMonthlyEloRanking } from "@/hooks/elo-ranking/useEloRanking";
import { useStarCraftMatch } from "@/hooks/match/useStarCraftMatch";
import {
  useGetLiveStreamers,
  useGetStreamers,
} from "@/hooks/streamer/useStreamer";
import { useClickOutside } from "@/hooks/useClickOutSide";
import { format, subMonths } from "date-fns";
import { useMemo, useRef, useState } from "react";

// Gender type for filtering
type GenderFilter = "All" | "Male" | "Female";

function StarTier() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedStreamer, setSelectedStreamer] = useState<number | null>(null);
  const [showOnlyLive, setShowOnlyLive] = useState(false);
  const [showOnlyMatched, setShowOnlyMatched] = useState(false);
  const streamerGridRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(80);
  const [displayMode, setDisplayMode] = useState<"list" | "tier">("list");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("All");

  // Get previous month in YYYY-MM format for ELO rankings
  const currentMonth = format(subMonths(new Date(), 1), "yyyy-MM");

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const { data: streamers } = useGetStreamers(["starcraft"]);
  const { data: liveStreamers } = useGetLiveStreamers();

  // Fetch ELO rankings based on gender filter
  const { data: eloRankings } = useGetMonthlyEloRanking(
    currentMonth,
    genderFilter !== "All" ? genderFilter : undefined
  );

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
      // Gender filter
      if (genderFilter !== "All" && streamer.gender !== genderFilter) {
        return false;
      }

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

    // 선택된 스트리머가 있으면 해당 스트리머를 배열의 맨 앞으로 이동
    if (selectedStreamer) {
      const selectedStreamerIndex = filtered.findIndex(
        (streamer) => streamer.id === selectedStreamer
      );

      if (selectedStreamerIndex > -1) {
        const selectedStreamerObj = filtered[selectedStreamerIndex];
        filtered = [
          selectedStreamerObj,
          ...filtered.slice(0, selectedStreamerIndex),
          ...filtered.slice(selectedStreamerIndex + 1),
        ];
      }
    }

    return filtered;
  }, [
    streamers,
    selectedStreamer,
    showOnlyLive,
    showOnlyMatched,
    opponents,
    genderFilter,
  ]);

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

  // Handle gender filter change
  const handleGenderFilterChange = (gender: GenderFilter) => {
    setGenderFilter(gender);

    // When switching to Male or Female, show tier system
    if (gender !== "All") {
      setDisplayMode("tier");
    } else {
      setDisplayMode("list");
    }
  };

  return (
    <div ref={containerRef}>
      {/* Gender filter tabs */}
      <div className="flex border-b mb-4 fixed top-[164px] left-0 right-0 z-10 bg-white">
        <button
          className={`py-3 px-6 font-medium ${
            genderFilter === "All" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => handleGenderFilterChange("All")}
        >
          전체
        </button>
        <button
          className={`py-3 px-6 font-medium ${
            genderFilter === "Male" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => handleGenderFilterChange("Male")}
        >
          남자
        </button>
        <button
          className={`py-3 px-6 font-medium ${
            genderFilter === "Female" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => handleGenderFilterChange("Female")}
        >
          여자
        </button>
      </div>

      {displayMode === "list" && (
        <>
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
            style={{ marginTop: navHeight + 48 }} /* 48px for gender tabs */
          >
            {/* 기존 스트리머 그리드 */}
            <div
              className="grid gap-[10px] p-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              }}
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
        </>
      )}
      {displayMode === "tier" && eloRankings && (
        <div className="mt-[212px]">
          <TierSystem
            rankings={eloRankings.rankings}
            month={eloRankings.month}
            opponents={opponents}
            selectedStreamer={selectedStreamer}
            setSelectedStreamer={setSelectedStreamer}
            dateRange={dateRange}
            streamerGridRef={streamerGridRef}
            showOnlyLive={showOnlyLive}
          />
        </div>
      )}
    </div>
  );
}

export default StarTier;
