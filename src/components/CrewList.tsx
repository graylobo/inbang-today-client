"use client";

import { useCrews } from "@/hooks/useCrews";
import { useCrewStore } from "@/store/crewStore";
import Link from "next/link";

export default function CrewList() {
  const { data: crews, isLoading, error } = useCrews();
  const setSelectedCrew = useCrewStore((state) => state.setSelectedCrew);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!crews?.length) return <div>등록된 크루가 없습니다.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {crews.map((crew) => (
        <Link
          href={`/crews/${crew.id}`}
          key={crew.id}
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setSelectedCrew(crew)}
        >
          <h2 className="text-xl font-bold mb-2">{crew.name}</h2>
          <p className="text-gray-600 mb-4">{crew.description}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>멤버 {crew.members.length}명</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
