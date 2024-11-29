"use client";

import MemberCard from "@/components/MemberCard";
import Modal from "@/components/common/Modal";
import Link from "next/link";
import { useState } from "react";
import EarningForm from "./EarningForm";
import EarningHistory from "./EarningHistory";
import BroadcastEarningForm from "@/components/BroadCastEarningForm";
import { useCrewDetail } from "@/hooks/crew/useCrews";

export default function CrewDetail({ crewId }: { crewId: string }) {
  const { data: crew, isLoading, error } = useCrewDetail(crewId);
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
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
        .filter((member) => member.rank.id === rank.id)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.members.length > 0);

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
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setShowBroadcastForm(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          크루 방송 수익 입력
        </button>
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

      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title="멤버 수익 입력"
      >
        {selectedMember && (
          <EarningForm
            memberId={selectedMember.id}
            memberName={selectedMember.name}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </Modal>
      <Modal
        isOpen={!!showBroadcastForm}
        onClose={() => setShowBroadcastForm(false)}
        title="크루 수익 입력"
      >
        {showBroadcastForm && (
          <BroadcastEarningForm
            crewId={parseInt(crewId)}
            onClose={() => setShowBroadcastForm(false)}
          />
        )}
      </Modal>
    </div>
  );
}
