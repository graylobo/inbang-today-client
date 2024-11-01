"use client";

import { useCrewDetail } from "@/hooks/useCrewDetail";
import { useCrewStore } from "@/store/crewStore";
import Link from "next/link";
import EarningForm from "./EarningForm";
import EarningHistory from "./EarningHistory";
import { useState } from "react";

interface CrewDetailProps {
  crewId: string;
}

export default function CrewDetail({ crewId }: CrewDetailProps) {
  const { data: crew, isLoading, error } = useCrewDetail(crewId);
  const [selectedMember, setSelectedMember] = useState<{
    id: number;
    name: string;
  } | null>(null);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!crew) return <div>크루 정보를 찾을 수 없습니다.</div>;

  const membersByRank = crew.members.reduce((acc, member) => {
    const rankId = member.rank?.id;
    if (!acc[rankId]) {
      acc[rankId] = {
        rank: member.rank,
        members: [],
      };
    }
    acc[rankId].members.push(member);
    return acc;
  }, {} as Record<number, { rank: { name: string; level: number }; members: typeof crew.members }>);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
        >
          ← 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold mb-2">{crew.name}</h1>
        <p className="text-gray-600">{crew.description}</p>
      </div>

      <div className="space-y-8">
        {Object.values(membersByRank)
          .sort((a, b) => a.rank.level - b.rank.level)
          .map(({ rank, members }) => (
            <div key={rank?.name} className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">{rank?.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h3 className="font-medium mb-2">{member.name}</h3>
                    <button
                      onClick={() =>
                        setSelectedMember({ id: member.id, name: member.name })
                      }
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      수익 입력
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <EarningHistory crewId={crewId} />

      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">수익 입력</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <EarningForm
              memberId={selectedMember.id}
              memberName={selectedMember.name}
            />
          </div>
        </div>
      )}
    </div>
  );
}
