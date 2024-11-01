"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useState } from "react";

interface EarningHistoryProps {
  crewId: string;
}

interface Earning {
  id: number;
  amount: number;
  earningDate: string;
  member: {
    id: number;
    name: string;
    rank: {
      name: string;
    };
  };
}

export default function EarningHistory({ crewId }: EarningHistoryProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: earnings, isLoading } = useQuery<Earning[]>({
    queryKey: ["earnings", crewId, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) return [];
      const { data } = await api.get(
        `/crew-earnings/crew/${crewId}?startDate=${startDate}&endDate=${endDate}`
      );
      return data;
    },
    enabled: !!startDate && !!endDate,
  });

  return (
    <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">수익 내역</h2>
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            시작일
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            종료일
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div>로딩 중...</div>
      ) : earnings?.length ? (
        <div className="space-y-4">
          {earnings.map((earning) => (
            <div
              key={earning.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {earning.member.name} ({earning.member.rank?.name})
                </p>
                <p className="text-sm text-gray-600">{earning.earningDate}</p>
              </div>
              <div className="text-lg font-semibold">
                {earning.amount.toLocaleString()}원
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          {startDate && endDate
            ? "해당 기간의 수익 내역이 없습니다."
            : "조회할 기간을 선택해주세요."}
        </div>
      )}
    </div>
  );
}
