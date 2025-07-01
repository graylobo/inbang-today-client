"use client";

import { useCrewsRankings } from "@/hooks/crew/useCrews";
import { useLiveCrewsInfo } from "@/hooks/useLiveCrewsInfo";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CrewList({
  initialYear,
  initialMonth,
}: {
  initialYear: number;
  initialMonth: number;
}) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const { data: crews, isLoading, error } = useCrewsRankings(year, month);
  const { data: liveCrewsData, isLoading: isLiveDataLoading } =
    useLiveCrewsInfo();

  useEffect(() => {
    setYear(initialYear);
    setMonth(initialMonth);
  }, [initialYear, initialMonth]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!crews?.length) return <div>등록된 크루가 없습니다.</div>;

  // Create a map of crew live information for quick access
  const liveCrewsMap = new Map();
  liveCrewsData?.crews?.forEach((crew) => {
    liveCrewsMap.set(crew.id, crew);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">엑셀 방송 랭킹</h2>
        <div className="flex gap-4">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-md border-gray-300 bg-white dark:bg-dark-bg dark:border-gray-600 dark:text-gray-200"
          >
            {Array.from({ length: 5 }, (_, i) => initialYear - i).map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border-gray-300 bg-white dark:bg-dark-bg dark:border-gray-600 dark:text-gray-200"
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
        {crews.map((crew: any, index: number) => {
          const liveInfo = liveCrewsMap.get(crew.id);
          const liveStreamersCount = liveInfo?.liveStreamersCount || 0;
          const isOwnerLive = liveInfo?.isOwnerLive || false;

          return (
            <Link
              href={`/crews/${crew.id}`}
              key={crew.id}
              className="block p-6 bg-white dark:bg-dark-bg rounded-lg shadow-lg hover:shadow-xl transition-all relative 
              border border-transparent dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600
              dark:shadow-none"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>

              {/* Live badges */}
              <div className="absolute top-3 right-3 flex gap-2">
                {isLiveDataLoading ? (
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded-full opacity-40 animate-pulse"></div>
                  </div>
                ) : (
                  <>
                    {isOwnerLive && (
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <span className="mr-1 h-2 w-2 bg-white rounded-full animate-pulse"></span>
                        <span>대표 LIVE</span>
                      </div>
                    )}
                    {liveStreamersCount > 0 && (
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <span className="mr-1 h-2 w-2 bg-white rounded-full animate-pulse"></span>
                        <span>LIVE {liveStreamersCount}명</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                {crew.iconUrl ? (
                  <img
                    src={crew.iconUrl}
                    alt={crew.name}
                    className="w-12 h-12 rounded-full object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-xl">
                      🏢
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold dark:text-gray-100">
                    {crew.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    멤버 {crew.members.length}명
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {crew.description}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {year}년 {month}월 별풍선 수익
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {crew.monthlyEarnings.toLocaleString()}개
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
