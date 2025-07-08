import { useState } from "react";
import { toast } from "sonner";
import {
  useUpdateCrewMemberHistory,
  useDeleteCrewMemberHistory,
  CrewMemberHistoryItem,
} from "./useCrewMemberHistory";
import {
  createCrewMemberHistory,
  CrewMemberHistoryData,
} from "@/libs/api/services/crew.service";
import { HistoryFormData } from "@/components/common/MemberHistoryFormModal";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";

export function useMemberHistoryManager() {
  // 사용자 인증 및 권한 정보
  const { user, isAuthenticated, isSuperAdmin } = useAuthStore();

  // Query client for cache invalidation
  const queryClient = useQueryClient();

  // 모달 상태 관리
  const [isHistoryEditModalOpen, setIsHistoryEditModalOpen] = useState(false);
  const [isHistoryAddModalOpen, setIsHistoryAddModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] =
    useState<CrewMemberHistoryItem | null>(null);
  const [currentStreamerId, setCurrentStreamerId] = useState<number | null>(
    null
  );

  // API 훅
  const { mutate: updateHistory } = useUpdateCrewMemberHistory();
  const { mutate: deleteHistory } = useDeleteCrewMemberHistory();

  // 권한 체크 함수들
  const canAddHistory = () => isAuthenticated && user;
  const canEditDeleteHistory = () => isSuperAdmin;

  // 히스토리 수정 모달 열기 - 슈퍼어드민만 가능
  const handleEditHistory = (history: CrewMemberHistoryItem) => {
    if (!canEditDeleteHistory()) {
      toast.error("히스토리 수정은 슈퍼어드민만 가능합니다.");
      return;
    }

    setSelectedHistory(history);
    setIsHistoryEditModalOpen(true);
  };

  // 히스토리 수정 제출 - 슈퍼어드민만 가능
  const handleHistoryEditSubmit = (formData: HistoryFormData) => {
    if (!canEditDeleteHistory()) {
      toast.error("히스토리 수정은 슈퍼어드민만 가능합니다.");
      return;
    }

    if (!selectedHistory) return;

    updateHistory(
      {
        id: selectedHistory.id,
        historyData: {
          crewId: formData.crewId,
          eventType: formData.eventType,
          eventDate: formData.eventDate,
          note: formData.note,
          newRankId:
            formData.eventType === "join" ||
            formData.eventType === "rank_change"
              ? formData.rankId
              : undefined,
          oldRankId:
            formData.eventType === "rank_change"
              ? selectedHistory.oldRank?.id
              : undefined,
        },
      },
      {
        onSuccess: () => {
          setIsHistoryEditModalOpen(false);
          setSelectedHistory(null);
          toast.success("히스토리가 성공적으로 수정되었습니다.");
        },
        onError: (error: any) => {
          toast.error(error.message || "히스토리 수정에 실패했습니다.");
        },
      }
    );
  };

  // 히스토리 삭제 - 슈퍼어드민만 가능
  const handleDeleteHistory = (historyId: number) => {
    if (!canEditDeleteHistory()) {
      toast.error("히스토리 삭제는 슈퍼어드민만 가능합니다.");
      return;
    }

    if (
      window.confirm(
        "정말로 이 히스토리 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      deleteHistory(historyId, {
        onSuccess: () => {
          toast.success("히스토리가 성공적으로 삭제되었습니다.");
        },
        onError: (error: any) => {
          toast.error(error.message || "히스토리 삭제에 실패했습니다.");
        },
      });
    }
  };

  // 히스토리 추가 모달 열기 - 로그인한 사용자만 가능
  const handleAddHistory = (streamerId: number) => {
    if (!canAddHistory()) {
      toast.error("히스토리 추가는 로그인이 필요합니다.");
      return;
    }

    setCurrentStreamerId(streamerId);
    setIsHistoryAddModalOpen(true);
  };

  // 히스토리 추가 제출 - 로그인한 사용자만 가능
  const handleHistoryAddSubmit = async (formData: HistoryFormData) => {
    if (!canAddHistory()) {
      toast.error("히스토리 추가는 로그인이 필요합니다.");
      return;
    }

    if (!currentStreamerId) {
      toast.error("스트리머 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const historyData: CrewMemberHistoryData = {
        streamerId: currentStreamerId,
        crewId: formData.crewId,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        note: formData.note,
        newRankId:
          formData.eventType === "join" || formData.eventType === "rank_change"
            ? formData.rankId
            : undefined,
      };

      await createCrewMemberHistory(historyData);

      // 성공 후 쿼리 캐시 무효화하여 최신 데이터 조회
      queryClient.invalidateQueries({
        queryKey: ["memberHistories", currentStreamerId],
      });

      // 전체 memberHistories도 무효화 (다른 곳에서 사용될 수 있음)
      queryClient.invalidateQueries({
        queryKey: ["memberHistories"],
      });

      setIsHistoryAddModalOpen(false);
      setCurrentStreamerId(null);
      toast.success("히스토리가 성공적으로 추가되었습니다.");
    } catch (error: any) {
      toast.error(error.message || "히스토리 추가에 실패했습니다.");
    }
  };

  // 모달 닫기 핸들러들
  const closeEditModal = () => {
    setIsHistoryEditModalOpen(false);
    setSelectedHistory(null);
  };

  const closeAddModal = () => {
    setIsHistoryAddModalOpen(false);
    setCurrentStreamerId(null);
  };

  return {
    // 상태
    isHistoryEditModalOpen,
    isHistoryAddModalOpen,
    selectedHistory,

    // 권한 정보
    canAddHistory: canAddHistory(),
    canEditDeleteHistory: canEditDeleteHistory(),

    // 핸들러
    handleEditHistory,
    handleHistoryEditSubmit,
    handleDeleteHistory,
    handleAddHistory,
    handleHistoryAddSubmit,
    closeEditModal,
    closeAddModal,

    // 편의 데이터
    editModalInitialData: selectedHistory
      ? {
          crewId: selectedHistory.crew.id,
          eventType: selectedHistory.eventType,
          eventDate: selectedHistory.eventDate,
          note: selectedHistory.note,
          rankId:
            selectedHistory.newRank?.id || selectedHistory.oldRank?.id || 0,
        }
      : undefined,
  };
}
