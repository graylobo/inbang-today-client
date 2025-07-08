"use client";

import MemberCard from "@/components/MemberCard";
import { useMemberHistoryManager } from "@/hooks/crew/useMemberHistoryManager";
import { useEffect, useState } from "react";
import EarningForm from "../EarningForm";
import MemberHistoryFormModal from "../common/MemberHistoryFormModal";
import MemberHistoryTable from "../common/MemberHistoryTable";
import Modal from "../common/Modal";

export default function CrewInfo({ crew }: { crew: any }) {
  const [selectedMember, setSelectedMember] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [historyMember, setHistoryMember] = useState<{
    id: number;
    name: string;
    crew?: any;
    rank?: any;
  } | null>(null);
  const [rankGroups, setRankGroups] = useState<any[]>([]);

  // 히스토리 관리 커스텀 훅
  const {
    isHistoryEditModalOpen,
    isHistoryAddModalOpen,
    currentMember,
    handleEditHistory,
    handleHistoryEditSubmit,
    handleDeleteHistory,
    handleAddHistory,
    handleHistoryAddSubmit,
    closeEditModal,
    closeAddModal,
    editModalInitialData,
  } = useMemberHistoryManager();

  // Move data processing to useEffect to avoid hydration mismatch
  useEffect(() => {
    // Process data only on client side
    const processedRankGroups = crew.ranks
      .sort((a: any, b: any) => a.level - b.level)
      .map((rank: any) => ({
        ...rank,
        members: crew.members
          .filter((member: any) => member.rank.id === rank.id)
          .sort((a: any, b: any) => a.name.localeCompare(b.name)),
      }))
      .filter((group: any) => group.members.length > 0);

    setRankGroups(processedRankGroups);
  }, [crew]);

  // 히스토리 추가 핸들러 (멤버 정보 포함)
  const handleHistoryAdd = (member: any) => {
    const memberInfo = {
      id: member.id,
      name: member.name,
      currentCrew: {
        id: crew.id,
        name: crew.name,
      },
      currentRank: member.rank
        ? {
            id: member.rank.id,
            name: member.rank.name,
          }
        : undefined,
    };

    handleAddHistory(member.id, memberInfo);
  };

  return (
    <div className="space-y-8">
      {rankGroups.map((rankGroup: any) => (
        <div
          key={rankGroup.id}
          className="bg-white dark:bg-dark-bg rounded-lg p-6 shadow-md dark:shadow-none dark:border dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-gray-100">
            <span className="mr-2">{rankGroup.name}</span>
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
                onNameClick={() =>
                  setHistoryMember({
                    id: member.id,
                    name: member.name,
                    crew: member.crew,
                    rank: member.rank,
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

      <Modal
        isOpen={!!historyMember}
        onClose={() => setHistoryMember(null)}
        title="멤버 히스토리"
        size="xl"
      >
        {historyMember && (
          <MemberHistoryTable
            streamerId={historyMember.id}
            memberName={historyMember.name}
            showActions={true}
            onEdit={handleEditHistory}
            onDelete={handleDeleteHistory}
            onAdd={() =>
              handleHistoryAdd({
                id: historyMember.id,
                name: historyMember.name,
                rank: historyMember.rank,
              })
            }
          />
        )}
      </Modal>

      {/* 히스토리 수정 모달 */}
      <MemberHistoryFormModal
        isOpen={isHistoryEditModalOpen}
        onClose={closeEditModal}
        title="히스토리 수정"
        initialData={editModalInitialData}
        onSubmit={handleHistoryEditSubmit}
        currentMember={currentMember || undefined}
      />

      {/* 히스토리 추가 모달 */}
      <MemberHistoryFormModal
        isOpen={isHistoryAddModalOpen}
        onClose={closeAddModal}
        title="새 히스토리 추가"
        onSubmit={handleHistoryAddSubmit}
        currentMember={currentMember || undefined}
      />
    </div>
  );
}
