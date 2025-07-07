"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { useGetCrews, useGetCrewRanksByCrewID } from "@/hooks/crew/useCrews";

export interface HistoryFormData {
  crewId: number;
  eventType: "join" | "leave" | "rank_change";
  eventDate: string;
  note: string;
  rankId: number;
}

interface MemberHistoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: HistoryFormData;
  onSubmit: (formData: HistoryFormData) => void;
  isLoading?: boolean;
}

export default function MemberHistoryFormModal({
  isOpen,
  onClose,
  title,
  initialData,
  onSubmit,
  isLoading = false,
}: MemberHistoryFormModalProps) {
  const [formData, setFormData] = useState<HistoryFormData>({
    crewId: 0,
    eventType: "join",
    eventDate: "",
    note: "",
    rankId: 0,
  });

  // 크루 및 랭크 정보 조회
  const { data: allCrews } = useGetCrews();
  const { data: ranks } = useGetCrewRanksByCrewID(
    formData.crewId?.toString() || ""
  );

  // 오늘 날짜 반환
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // 새로 추가하는 경우 기본값 설정
      setFormData({
        crewId: 0,
        eventType: "join",
        eventDate: getTodayDate(),
        note: "",
        rankId: 0,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    onClose();
    // 모달 닫을 때 폼 데이터 초기화
    setFormData({
      crewId: 0,
      eventType: "join",
      eventDate: getTodayDate(),
      note: "",
      rankId: 0,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg">
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                크루
              </label>
              <select
                value={formData.crewId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    crewId: Number(e.target.value),
                    rankId: 0, // 크루가 변경되면 랭크 초기화
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value={0}>크루 선택</option>
                {allCrews?.map((crew: any) => (
                  <option key={crew.id} value={crew.id}>
                    {crew.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                이벤트 타입
              </label>
              <select
                value={formData.eventType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    eventType: e.target.value as
                      | "join"
                      | "leave"
                      | "rank_change",
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="join">입사</option>
                <option value="leave">퇴사</option>
                <option value="rank_change">직급 변경</option>
              </select>
            </div>

            {(formData.eventType === "join" ||
              formData.eventType === "rank_change") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  계급
                </label>
                <select
                  value={formData.rankId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rankId: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value={0}>계급 선택</option>
                  {ranks?.map((rank: any) => (
                    <option key={rank.id} value={rank.id}>
                      {rank.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                이벤트 날짜
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    eventDate: e.target.value,
                  })
                }
                max={getTodayDate()}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                비고 사항
              </label>
              <textarea
                value={formData.note}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    note: e.target.value,
                  })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="비고 사항을 입력하세요"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "처리중..." : initialData ? "저장" : "추가"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
