"use client";

import { useCrewEarningsByDate } from "@/hooks/crew/useCrews";
import { useState } from "react";

interface EarningHistoryProps {
  crewId: string;
}

export default function EarningHistory({ crewId }: EarningHistoryProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const { data: dailyEarnings, isLoading } = useCrewEarningsByDate(
    crewId,
    year,
    month
  );

  return (
    <div className="mt-8 bg-white dark:bg-dark-bg rounded-lg p-6 shadow-md dark:shadow-none dark:border dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-gray-100">방송 수익 내역</h2>
        <div className="flex gap-4">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - i
            ).map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="dark:text-gray-300">로딩 중...</div>
      ) : dailyEarnings?.length ? (
        <div className="space-y-4">
          {dailyEarnings.map((daily) => (
            <div key={daily.date}>
              <button
                onClick={() =>
                  setSelectedDate(
                    selectedDate === daily.date ? null : daily.date
                  )
                }
                className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <p className="font-medium dark:text-gray-100">{daily.date}</p>
                  {daily.broadcastEarning ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      크루 방송 수익
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      참여 멤버: {daily.earnings?.length || 0}명
                    </p>
                  )}
                </div>
                <div className="text-lg font-semibold dark:text-gray-100">
                  {daily.totalAmount.toLocaleString()}원
                </div>
              </button>

              {selectedDate === daily.date && (
                <div className="divide-y dark:divide-gray-700 border-t dark:border-gray-700">
                  {daily.broadcastEarning && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-blue-800 dark:text-blue-300">
                            크루 방송 수익
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {daily.broadcastEarning.description || "설명 없음"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            입력: {daily.broadcastEarning.submittedBy.username}
                          </p>
                        </div>
                        <div className="font-bold text-blue-600 dark:text-blue-400">
                          {daily.broadcastEarning.totalAmount.toLocaleString()}
                          원
                        </div>
                      </div>
                    </div>
                  )}
                  {daily.earnings
                    .sort(
                      (a, b) =>
                        (a.member.rank?.level || 0) -
                        (b.member.rank?.level || 0)
                    )
                    .map((earning) => (
                      <div
                        key={earning.id}
                        className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div>
                          <p className="font-medium dark:text-gray-100">
                            {earning.member.name}
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                              ({earning.member.rank?.name || "직급 없음"})
                            </span>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                              입력: {earning.submittedBy.username}
                            </span>
                          </p>
                        </div>
                        <div className="font-medium dark:text-gray-100">
                          {Number(earning.amount).toLocaleString()}원
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          해당 연도의 수익 내역이 없습니다.
        </div>
      )}
    </div>
  );
}
