"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useState } from "react";

interface EarningHistoryProps {
  crewId: string;
}

interface CrewMemberEarning {
  id: number;
  amount: number;
  earningDate: string;
  submittedBy: {
    username: string;
  };
  member: {
    id: number;
    name: string;
    rank: {
      name: string;
      level: number;
    };
  };
}

interface DailyEarning {
  date: string;
  totalAmount: number;
  earnings: CrewMemberEarning[];
}

export default function EarningHistory({ crewId }: EarningHistoryProps) {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: earnings, isLoading } = useQuery<CrewMemberEarning[]>({
    queryKey: ["earnings", crewId, year, month],
    queryFn: async () => {
      const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
      const endDate = new Date(year, month, 0).toISOString().split("T")[0];
      const { data } = await api.get(
        `/crew-earnings/crew/${crewId}?startDate=${startDate}&endDate=${endDate}`
      );
      return data;
    },
  });

  // 날짜별로 수익을 그룹화
  const dailyEarnings: DailyEarning[] = earnings
    ? Object.values(
        earnings.reduce((acc, earning) => {
          const date = earning.earningDate;
          if (!acc[date]) {
            acc[date] = {
              date,
              totalAmount: 0,
              earnings: [],
            };
          }
          acc[date].totalAmount += Number(earning.amount);
          acc[date].earnings.push(earning);
          return acc;
        }, {} as Record<string, DailyEarning>)
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  return (
    <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">방송 수익 내역</h2>
        <div className="flex gap-4">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-md border-gray-300"
          >
            {Array.from(
              { length: 5 },
              (_, i) => currentDate.getFullYear() - i
            ).map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border-gray-300"
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
        <div>로딩 중...</div>
      ) : dailyEarnings.length ? (
        <div className="space-y-4">
          {dailyEarnings.map((daily) => (
            <div key={daily.date}>
              <button
                onClick={() =>
                  setSelectedDate(
                    selectedDate === daily.date ? null : daily.date
                  )
                }
                className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium">{daily.date}</p>
                  <p className="text-sm text-gray-600">
                    참여 멤버: {daily.earnings.length}명
                  </p>
                </div>
                <div className="text-lg font-semibold">
                  {daily.totalAmount.toLocaleString()}원
                </div>
              </button>

              {selectedDate === daily.date && (
                <div className="divide-y border-t">
                  {daily.earnings
                    .sort(
                      (a, b) =>
                        (a.member.rank?.level || 0) -
                        (b.member.rank?.level || 0)
                    )
                    .map((earning) => (
                      <div
                        key={earning.id}
                        className="flex justify-between items-center p-4 hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium">
                            {earning.member.name}
                            <span className="ml-2 text-sm text-gray-600">
                              ({earning.member.rank?.name || "직급 없음"})
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              입력: {earning.submittedBy?.username}
                            </span>
                          </p>
                        </div>
                        <div className="font-medium">
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
        <div className="text-center text-gray-500">
          해당 연도의 수익 내역이 없습니다.
        </div>
      )}
    </div>
  );
}
