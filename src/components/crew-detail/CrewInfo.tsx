"use client";

import MemberCard from "@/components/MemberCard";
import { useMemberHistoryManager } from "@/hooks/crew/useMemberHistoryManager";
import { useEffect, useState } from "react";
import EarningForm from "../EarningForm";
import MemberHistoryFormModal from "../common/MemberHistoryFormModal";
import MemberHistoryTable from "../common/MemberHistoryTable";
import Modal from "../common/Modal";
import { Streamer } from "@/hooks/streamer/useStreamer.type";
import { StreamerSearchBox } from "../common/StreamerSearchBox";
import { useAuthStore } from "@/store/authStore";
import { useCrewPermissionsList } from "@/hooks/crew-permission/useCrewPermission";
import { hasCrewEditPermission } from "@/utils/permissions";

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
  const [isSearchSectionExpanded, setIsSearchSectionExpanded] = useState(false);
  const { isAuthenticated, isSuperAdmin } = useAuthStore();
  const { crews: permittedCrews } = useCrewPermissionsList();

  // 현재 크루에 대한 편집 권한 확인
  const hasEditPermission = hasCrewEditPermission(
    isSuperAdmin,
    permittedCrews,
    crew.id
  );

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

  // 검색 결과를 선택하는 핸들러
  const handleSelectSearchResult = (streamer: Streamer) => {
    // 멤버 정보 구성
    const memberInfo = {
      id: streamer.id,
      name: streamer.name,
      currentCrew: streamer.crew
        ? {
            id: streamer.crew.id,
            name: streamer.crew.name,
          }
        : undefined,
      currentRank: streamer.rank
        ? {
            id: streamer.rank.id,
            name: streamer.rank.name,
          }
        : undefined,
    };

    // 히스토리 추가 모달 열기
    handleAddHistory(streamer.id, memberInfo);
  };

  return (
    <div className="space-y-8">
      {/* 스트리머 검색 섹션 */}
      <div className="bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700">
        <button
          onClick={() => setIsSearchSectionExpanded(!isSearchSectionExpanded)}
          className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              멤버 관리
            </span>
            {!isAuthenticated && (
              <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                로그인 필요
              </span>
            )}
            {isAuthenticated && !hasEditPermission && (
              <span className="text-xs bg-orange-200 dark:bg-orange-800 text-orange-600 dark:text-orange-400 px-2 py-1 rounded">
                권한 없음
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isSearchSectionExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isSearchSectionExpanded && (
          <div className="px-4 pb-4 border-t dark:border-gray-700">
            {isAuthenticated ? (
              hasEditPermission ? (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    스트리머 검색
                  </label>
                  <StreamerSearchBox
                    onSelectStreamer={handleSelectSearchResult}
                    placeholder="스트리머 이름 또는 숲 ID로 검색하여 멤버 추가"
                    description={`스트리머를 검색하여 ${crew.name} 크루와 관련된 멤버를 추가할 수 있습니다.`}
                    showCrewInfo={true}
                  />
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-orange-400 dark:text-orange-500 mb-3">
                    <svg
                      className="mx-auto h-8 w-8 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <p className="text-sm font-medium">편집 권한이 없습니다</p>
                    <p className="text-xs mt-1">
                      해당 크루에 대한 히스토리 추가 권한이 없습니다.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-6">
                <div className="text-gray-400 dark:text-gray-500 mb-3">
                  <svg
                    className="mx-auto h-8 w-8 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p className="text-sm font-medium">로그인이 필요합니다</p>
                  <p className="text-xs mt-1">
                    스트리머 검색 기능을 사용하려면 로그인해주세요.
                  </p>
                </div>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  로그인하러 가기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 기존 크루 멤버 목록 */}
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
