"use client";

import MemberCard from "@/components/MemberCard";
import { useState } from "react";
import EarningForm from "../EarningForm";
import Modal from "../common/Modal";

export default function CrewInfo({ crew }: { crew: any }) {
  const [selectedMember, setSelectedMember] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // 계급별로 멤버 그룹화 및 정렬
  const rankGroups = crew.ranks
    .sort((a: any, b: any) => a.level - b.level)
    .map((rank: any) => ({
      ...rank,
      members: crew.members
        .filter((member: any) => member.rank.id === rank.id)
        .sort((a: any, b: any) => a.name.localeCompare(b.name)),
    }))
    .filter((group: any) => group.members.length > 0);

  return (
    <div className="space-y-8">
      {rankGroups.map((rankGroup: any) => (
        <div key={rankGroup.id} className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">{rankGroup.name}</span>
            <span className="text-sm text-gray-500">
              ({rankGroup.members.length}명)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rankGroup.members.map((member: any) => (
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
    </div>
  );
} 