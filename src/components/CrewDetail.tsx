"use client";

import { useCrewDetail } from "@/hooks/useCrewDetail";
import Link from "next/link";
import EarningForm from "./EarningForm";
import EarningHistory from "./EarningHistory";
import { useState } from "react";

interface CrewDetailProps {
  crewId: string;
}

interface MemberCardProps {
  member: {
    id: number;
    name: string;
    profileImageUrl?: string;
    broadcastUrl?: string;
    rank: {
      name: string;
      level: number;
    };
  };
  onEarningClick: () => void;
}

function MemberCard({ member, onEarningClick }: MemberCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16">
          {member.profileImageUrl ? (
            <a
              href={member.broadcastUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <img
                src={member.profileImageUrl}
                alt={member.name}
                className="w-full h-full rounded-full object-cover cursor-pointer"
              />
            </a>
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xl">👤</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">{member.name}</h3>
            <span className="text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-600">
              {member.rank.name}
            </span>
          </div>
          {member.broadcastUrl && (
            <a
              href={member.broadcastUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:text-blue-700 mt-1 inline-block"
            >
              방송국 바로가기
            </a>
          )}
        </div>
        <button
          onClick={onEarningClick}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        >
          수익 입력
        </button>
      </div>
    </div>
  );
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

  // 계급별로 멤버 그룹화 및 정렬
  const rankGroups = crew.ranks
    .sort((a, b) => a.level - b.level)
    .map((rank) => ({
      ...rank,
      members: crew.members
        .filter((member) => member.rank?.id === rank.id)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
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
        {rankGroups.map((rankGroup) => (
          <div key={rankGroup.id} className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">{rankGroup.name}</span>
              <span className="text-sm text-gray-500">
                ({rankGroup.members.length}명)
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rankGroup.members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onEarningClick={() =>
                    setSelectedMember({
                      id: member.id,
                      name: member.name,
                    })
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <EarningHistory crewId={crewId} />

      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
              onClose={() => setSelectedMember(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
