"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import Link from "next/link";

export interface Crew {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  members: {
    id: number;
    name: string;
    profileImageUrl?: string;
    broadcastUrl?: string;
    rank: {
      id: number;
      name: string;
      level: number;
    };
  }[];
  ranks: {
    id: number;
    name: string;
    level: number;
  }[];
}
interface CrewWithEarnings extends Crew {
  monthlyEarnings: number;
}

export default function CrewList() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const {
    data: crews,
    isLoading,
    error,
  } = useQuery<CrewWithEarnings[]>({
    queryKey: ["crews", "rankings", currentYear, currentMonth],
    queryFn: async () => {
      const { data } = await api.get(
        `/crews/rankings?year=${currentYear}&month=${currentMonth}`
      );
      return data;
    },
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!crews?.length) return <div>등록된 크루가 없습니다.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-6">
        {currentYear}년 {currentMonth}월 크루 랭킹
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crews.map((crew, index) => (
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
              <span className="text-gray-500">이번 달 수익</span>
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
