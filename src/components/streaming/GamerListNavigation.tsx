import React, { useEffect, useRef, useLayoutEffect } from "react";
import { useLayoutStore, SidebarState } from "@/store/layout";
import { DRAWER_WIDTH } from "@/layouts/Base";

function GamerListNavigation({
  selectedStreamer,
  setSelectedStreamer,
  dateRange,
  setDateRange,
  showOnlyMatched,
  setShowOnlyMatched,
  showOnlyLive,
  setShowOnlyLive,
  onHeightChange,
}: {
  selectedStreamer: number | null;
  setSelectedStreamer: (streamer: number | null) => void;
  dateRange: { startDate: string; endDate: string };
  setDateRange: any;
  showOnlyMatched: boolean;
  setShowOnlyMatched: (matched: boolean) => void;
  showOnlyLive: boolean;
  setShowOnlyLive: (live: boolean) => void;
  onHeightChange: (height: number) => void;
}) {
  const navRef = useRef<HTMLDivElement>(null);
  const { sidebarState } = useLayoutStore();

  const updateHeight = () => {
    if (navRef.current) {
      const height = navRef.current.offsetHeight;
      onHeightChange(height);
    }
  };

  // 리사이즈 이벤트에 대한 디바운스 처리
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateHeight, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // 컨텐츠가 변경될 때마다 높이 업데이트
  useLayoutEffect(() => {
    updateHeight();
  }, [selectedStreamer, showOnlyMatched, showOnlyLive, sidebarState]);

  const handlePeriodSelect = (months: number) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    setDateRange({
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    });
  };

  // 사이드바 상태에 따른 좌측 마진 계산
  const getLeftMargin = () => {
    switch (sidebarState) {
      case SidebarState.OPEN:
        return `${DRAWER_WIDTH}px`;
      case SidebarState.ICON_ONLY:
        return "64px"; // theme.spacing(8)에 해당
      case SidebarState.CLOSED:
      default:
        return "0px";
    }
  };

  return (
    <div
      ref={navRef}
      className={`fixed top-[64px] left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300`}
      style={{
        marginLeft: getLeftMargin(),
        width: `calc(100% - ${getLeftMargin()})`,
      }}
    >
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedStreamer(null)}
              className={`shrink-0 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
            ${selectedStreamer ? "bg-gray-500 text-white" : "hidden"}`}
            >
              전적 비교 취소
            </button>
            {selectedStreamer && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange(
                        (prev: { startDate: string; endDate: string }) => ({
                          ...prev,
                          startDate: e.target.value,
                        })
                      )
                    }
                    className="shrink-0 rounded-lg border-gray-300 w-[140px]"
                  />
                  <span className="text-gray-500">~</span>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange((prev: any) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="shrink-0 rounded-lg border-gray-300 w-[140px]"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePeriodSelect(1)}
                    className="shrink-0 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap"
                  >
                    1개월
                  </button>
                  <button
                    onClick={() => handlePeriodSelect(3)}
                    className="shrink-0 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap"
                  >
                    3개월
                  </button>
                  <button
                    onClick={() => handlePeriodSelect(6)}
                    className="shrink-0 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap"
                  >
                    6개월
                  </button>
                  <button
                    onClick={() => handlePeriodSelect(12)}
                    className="shrink-0 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap"
                  >
                    1년
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedStreamer && (
              <button
                onClick={() => setShowOnlyMatched(!showOnlyMatched)}
                className={`shrink-0 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
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
              className={`shrink-0 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
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
  );
}

export default GamerListNavigation;
