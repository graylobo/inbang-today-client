"use client";
import GamerListNavigation from "@/components/streaming/GamerListNavigation";
import StreamerCard from "@/components/streaming/StreamerCard";
import StreamerCardSkeleton from "@/components/streaming/StreamerCardSkeleton";
import TierSystem from "@/components/TierSystem";
import { useGetMonthlyEloRanking } from "@/hooks/elo-ranking/useEloRanking";
import { useStarCraftMatch } from "@/hooks/match/useStarCraftMatch";
import {
  useGetLiveStreamers,
  useGetStreamers,
} from "@/hooks/streamer/useStreamer";
import { useClickOutside } from "@/hooks/useClickOutSide";
import { format, subMonths } from "date-fns";
import { useMemo, useRef, useState, useEffect } from "react";
import styles from "./GamerList.module.scss";

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

  const { data: streamers, isLoading: isLoadingStreamers } = useGetStreamers([
    "starcraft",
  ]);
  const { data: liveStreamers } = useGetLiveStreamers();

  // Fetch ELO rankings based on gender filter
  const { data: eloRankings, isLoading: isLoadingEloRankings } =
    useGetMonthlyEloRanking(
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
      setSelectedStreamer(null);
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

  // Add useEffect to handle scroll when selectedStreamer changes
  useEffect(() => {
    if (selectedStreamer && streamerGridRef.current && displayMode === "list") {
      // Small delay to ensure the DOM has updated with the new order
      setTimeout(() => {
        const streamerGrid = streamerGridRef.current;
        if (streamerGrid) {
          // Get the position of the streamer grid
          const gridRect = streamerGrid.getBoundingClientRect();
          const currentScrollY = window.scrollY;

          // Calculate the absolute position of the grid top
          const gridTop = gridRect.top + currentScrollY;

          // Account for navigation height with some padding
          const scrollToPosition = gridTop - navHeight - 20;

          // Smooth scroll to the position
          window.scrollTo({
            top: Math.max(0, scrollToPosition),
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [selectedStreamer, displayMode, navHeight]);

  // Add useEffect to automatically show only matched opponents when a streamer is selected
  useEffect(() => {
    if (selectedStreamer) {
      setShowOnlyMatched(true);
    } else {
      setShowOnlyMatched(false);
    }
  }, [selectedStreamer]);

  return (
    <div ref={containerRef}>
      {/* Navigation bar should be visible in both modes */}
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

      {/* Unified gamer container with tabs and content */}
      <div className={styles.gamerContainer}>
        {/* Gender filter tabs */}
        <div className={styles.genderTabs}>
          <button
            className={`${styles.genderTabButton} ${
              genderFilter === "All" ? styles.active : ""
            }`}
            onClick={() => handleGenderFilterChange("All")}
          >
            전체
          </button>
          <button
            className={`${styles.genderTabButton} ${
              genderFilter === "Male" ? styles.active : ""
            }`}
            onClick={() => handleGenderFilterChange("Male")}
          >
            남자
          </button>
          <button
            className={`${styles.genderTabButton} ${
              genderFilter === "Female" ? styles.active : ""
            }`}
            onClick={() => handleGenderFilterChange("Female")}
          >
            여자
          </button>
        </div>

        {/* Content area */}
        <div className={styles.contentArea}>
          {displayMode === "list" && (
            <div className={styles.listContainer}>
              {/* 기존 스트리머 그리드 */}
              <div className={styles.streamerGrid} ref={streamerGridRef}>
                {isLoadingStreamers
                  ? // 로딩 중일 때 스켈레톤 UI 표시
                    Array.from({ length: 12 }).map((_, index) => (
                      <StreamerCardSkeleton key={index} />
                    ))
                  : filteredStreamers?.map((streamer) => {
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
          )}

          {displayMode === "tier" && (
            <div className={styles.tierContainer}>
              <div className={styles.tierWrapper}>
                {isLoadingEloRankings ? (
                  // 티어 시스템 로딩 중 스켈레톤 UI
                  <div className="p-4">
                    <div className="h-8 bg-gray-300 rounded w-48 mb-6 animate-pulse"></div>
                    <div className="mb-8 p-4 bg-gray-100 rounded-lg">
                      <div className="h-6 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="space-y-1">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-4 bg-gray-300 rounded animate-pulse"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-8">
                      {Array.from({ length: 3 }).map((_, tierIndex) => (
                        <div key={tierIndex} className="mb-8">
                          <div className="h-12 bg-gray-400 rounded-t-lg animate-pulse"></div>
                          <div className="p-4 bg-gray-100 rounded-b-lg">
                            <div
                              className="grid gap-[10px]"
                              style={{
                                gridTemplateColumns:
                                  "repeat(auto-fill, minmax(150px, 1fr))",
                              }}
                            >
                              {Array.from({ length: 6 }).map((_, cardIndex) => (
                                <div key={cardIndex} className="relative">
                                  <StreamerCardSkeleton />
                                  <div className="mt-1 p-2 bg-gray-300 rounded-md animate-pulse">
                                    <div className="h-4 bg-gray-400 rounded"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : eloRankings ? (
                  <TierSystem
                    rankings={eloRankings.rankings}
                    month={eloRankings.month}
                    opponents={opponents}
                    selectedStreamer={selectedStreamer}
                    setSelectedStreamer={setSelectedStreamer}
                    dateRange={dateRange}
                    streamerGridRef={streamerGridRef}
                    showOnlyLive={showOnlyLive}
                    showOnlyMatched={showOnlyMatched}
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StarTier;
