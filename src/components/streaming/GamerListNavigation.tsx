import React from "react";
import { useLayoutStore } from "@/store/layout";

function GamerListNavigation({
  selectedStreamer,
  setSelectedStreamer,
  dateRange,
  setDateRange,
  showOnlyMatched,
  setShowOnlyMatched,
  showOnlyLive,
  setShowOnlyLive,
}: {
  selectedStreamer: number | null;
  setSelectedStreamer: (streamer: number | null) => void;
  dateRange: { startDate: string; endDate: string };
  setDateRange: any;
  showOnlyMatched: boolean;
  setShowOnlyMatched: (matched: boolean) => void;
  showOnlyLive: boolean;
  setShowOnlyLive: (live: boolean) => void;
}) {
  const { openSidebar } = useLayoutStore();

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
    <div
      className={`fixed top-[64px] ${
        openSidebar ? "left-[240px]" : "left-0"
      } right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300`}
    >
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
                      setDateRange(
                        (prev: { startDate: string; endDate: string }) => ({
                          ...prev,
                          startDate: e.target.value,
                        })
                      )
                    }
                    className="rounded-lg border-gray-300"
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
  );
}

export default GamerListNavigation;
