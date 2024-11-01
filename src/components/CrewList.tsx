"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import Link from "next/link";
import { useState } from "react";

export default function CrewList() {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const {
    data: crews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["crews", "rankings", year, month],
    queryFn: async () => {
      const { data } = await api.get(
        `/crews/rankings?year=${year}&month=${month}`
      );
      return data;
    },
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!crews?.length) return <div>등록된 크루가 없습니다.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">크루 랭킹</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crews.map((crew: any, index: number) => (
          <Link
            href={`/crews/${crew.id}`}
            key={crew.id}
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow relative"
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {crew.iconUrl ? (
                <img
                  src={crew.iconUrl}
                  alt={crew.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">🏢</span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">{crew.name}</h2>
                <p className="text-sm text-gray-500">
                  멤버 {crew.members.length}명
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{crew.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                {year}년 {month}월 수익
              </span>
              <span className="text-lg font-bold text-blue-600">
                {crew.monthlyEarnings.toLocaleString()}원
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
