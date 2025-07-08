"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { useGetCrews, useGetCrewRanksByCrewID } from "@/hooks/crew/useCrews";
import { useGetCrewMemberHistory } from "@/hooks/crew/useCrewMemberHistory";

export interface HistoryFormData {
  crewId: number;
  eventType: "join" | "leave" | "rank_change";
  eventDate: string;
  note: string;
  rankId: number;
  isHistoricalEntry?: boolean;
}

interface CurrentMemberInfo {
  id: number;
  name: string;
  currentCrew?: {
    id: number;
    name: string;
  };
  currentRank?: {
    id: number;
    name: string;
  };
}

interface MemberHistoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: HistoryFormData;
  onSubmit: (formData: HistoryFormData) => void;
  isLoading?: boolean;
  currentMember?: CurrentMemberInfo;
}

export default function MemberHistoryFormModal({
  isOpen,
  onClose,
  title,
  initialData,
  onSubmit,
  isLoading = false,
  currentMember,
}: MemberHistoryFormModalProps) {
  const [formData, setFormData] = useState<HistoryFormData>({
    crewId: 0,
    eventType: "join",
    eventDate: "",
    note: "",
    rankId: 0,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // 크루 및 랭크 정보 조회
  const { data: allCrews } = useGetCrews();
  const { data: ranks } = useGetCrewRanksByCrewID(
    formData.crewId?.toString() || ""
  );

  // 현재 멤버의 히스토리 조회 (검증을 위해)
  const { data: memberHistory } = useGetCrewMemberHistory(currentMember?.id);

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
    setValidationErrors([]);
  }, [initialData, isOpen]);

  // 폼 데이터 검증 함수
  const validateFormData = (data: HistoryFormData): string[] => {
    const errors: string[] = [];

    if (!currentMember) {
      errors.push("멤버 정보를 찾을 수 없습니다.");
      return errors;
    }

    // 기본 필수 필드 검증
    if (!data.crewId) {
      errors.push("크루를 선택해주세요.");
    }

    if (!data.eventDate) {
      errors.push("이벤트 날짜를 입력해주세요.");
    }

    // 입사 및 직급 변경 시 계급 필수 검증
    if (
      (data.eventType === "join" || data.eventType === "rank_change") &&
      !data.rankId
    ) {
      errors.push(
        `${
          data.eventType === "join" ? "입사" : "직급 변경"
        } 시 계급 선택은 필수입니다.`
      );
    }

    // 현재 소속 크루와 동일한 크루 검증
    const isCurrentCrew = currentMember.currentCrew?.id === data.crewId;

    // 히스토리에서 해당 크루의 최신 상태 확인
    const crewHistories =
      memberHistory?.filter((h) => h.crew.id === data.crewId) || [];
    const latestCrewHistory = crewHistories.sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    )[0];

    // 현재 해당 크루에 소속되어 있는지 판단
    let isCurrentlyInCrew = false;
    if (isCurrentCrew) {
      // 현재 소속 크루라면 소속되어 있음
      isCurrentlyInCrew = true;
    } else if (latestCrewHistory) {
      // 히스토리 기반으로 판단 (최신 이벤트가 join 또는 rank_change면 소속 중)
      isCurrentlyInCrew =
        latestCrewHistory.eventType === "join" ||
        latestCrewHistory.eventType === "rank_change";
    }

    // 과거 히스토리 여부 감지
    const isHistoricalEntry = checkIfHistoricalEntry(data);

    // 검증 로직
    switch (data.eventType) {
      case "join":
        if (isCurrentlyInCrew && !isHistoricalEntry) {
          errors.push(
            `${
              allCrews?.find((c) => c.id === data.crewId)?.name || "해당 크루"
            }에 이미 소속되어 있어 입사 처리할 수 없습니다.`
          );
        }
        // 과거 히스토리의 경우 동일 크루 내에서 입사->퇴사 순서 검증
        if (isHistoricalEntry && isCurrentlyInCrew) {
          const eventDate = new Date(data.eventDate);
          const crewJoinHistories = crewHistories
            .filter((h) => h.eventType === "join" || h.eventType === "leave")
            .sort(
              (a, b) =>
                new Date(a.eventDate).getTime() -
                new Date(b.eventDate).getTime()
            );

          // 해당 날짜 이후에 퇴사 없이 입사가 있으면 오류
          const futureEvents = crewJoinHistories.filter(
            (h) => new Date(h.eventDate) > eventDate
          );

          if (futureEvents.length > 0 && futureEvents[0].eventType === "join") {
            errors.push(
              `${data.eventDate} 이후에 이미 해당 크루 입사 기록이 있습니다. 순서를 확인해주세요.`
            );
          }
        }
        break;

      case "leave":
        if (!isCurrentlyInCrew && !isHistoricalEntry) {
          errors.push(
            `${
              allCrews?.find((c) => c.id === data.crewId)?.name || "해당 크루"
            }에 소속되어 있지 않아 퇴사 처리할 수 없습니다.`
          );
        }
        // 과거 히스토리의 경우 해당 날짜 이전에 입사 기록이 있는지 확인
        if (isHistoricalEntry) {
          const eventDate = new Date(data.eventDate);
          const priorJoinHistory = crewHistories.find(
            (h) => h.eventType === "join" && new Date(h.eventDate) < eventDate
          );

          if (!priorJoinHistory) {
            errors.push(
              `${data.eventDate} 이전에 해당 크루 입사 기록이 없어 퇴사 처리할 수 없습니다.`
            );
          }
        }
        break;

      case "rank_change":
        if (!isCurrentlyInCrew && !isHistoricalEntry) {
          errors.push(
            `${
              allCrews?.find((c) => c.id === data.crewId)?.name || "해당 크루"
            }에 소속되어 있지 않아 직급 변경할 수 없습니다.`
          );
        }
        break;
    }

    // 미래 날짜 검증
    const eventDate = new Date(data.eventDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // 오늘 끝까지 허용

    if (eventDate > today) {
      errors.push("미래 날짜는 선택할 수 없습니다.");
    }

    return errors;
  };

  // 과거 히스토리인지 확인하는 함수
  const checkIfHistoricalEntry = (data: HistoryFormData): boolean => {
    if (!currentMember?.currentCrew || !memberHistory) return false;

    // 현재 소속 크루의 가장 최근 입사/직급변경 날짜 찾기
    const currentCrewHistories = memberHistory.filter(
      (h) =>
        h.crew.id === currentMember.currentCrew!.id &&
        (h.eventType === "join" || h.eventType === "rank_change")
    );

    if (currentCrewHistories.length === 0) return false;

    const latestCurrentCrewDate = currentCrewHistories.sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    )[0].eventDate;

    // 추가하려는 히스토리 날짜가 현재 소속 크루의 최신 날짜보다 이전이면 과거 히스토리
    const eventDate = new Date(data.eventDate);
    const currentCrewLatestDate = new Date(latestCurrentCrewDate);

    return eventDate < currentCrewLatestDate;
  };

  // 과거 히스토리 상태 확인
  const isHistoricalEntry =
    formData.crewId && formData.eventDate
      ? checkIfHistoricalEntry(formData)
      : false;

  // 폼 데이터 변경 시 실시간 검증
  useEffect(() => {
    if (formData.crewId && formData.eventType && formData.eventDate) {
      const errors = validateFormData(formData);
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
    }
  }, [formData, memberHistory, currentMember, allCrews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 최종 검증
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    onSubmit({ ...formData, isHistoricalEntry });
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
    setValidationErrors([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg">
      <div className="p-6">
        {/* 현재 멤버 정보 표시 */}
        {currentMember && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">현재 멤버 정보</h4>
            <p className="text-sm text-gray-600">
              이름: <span className="font-medium">{currentMember.name}</span>
            </p>
            {currentMember.currentCrew && (
              <p className="text-sm text-gray-600">
                현재 소속:
                <span className="font-medium">
                  {currentMember.currentCrew.name}
                </span>
                {currentMember.currentRank && (
                  <span className="ml-2">
                    ({currentMember.currentRank.name})
                  </span>
                )}
              </p>
            )}
          </div>
        )}

        {/* 과거 히스토리 알림 */}
        {isHistoricalEntry && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">
              📚 과거 히스토리 추가
            </h4>
            <p className="text-sm text-blue-700">
              현재 소속보다 이전 날짜의 기록입니다. 이 히스토리는 현재 크루
              소속에 영향을 주지 않으며, 과거 기록으로만 저장됩니다.
            </p>
          </div>
        )}

        {/* 검증 오류 표시 */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="font-medium text-red-800 mb-2">
              다음 문제를 확인해주세요:
            </h4>
            <ul className="list-disc list-inside text-sm text-red-700">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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
                    {currentMember?.currentCrew?.id === crew.id &&
                      " (현재 소속)"}
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
                      {currentMember?.currentRank?.id === rank.id &&
                        " (현재 계급)"}
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
              <Button
                type="submit"
                disabled={isLoading || validationErrors.length > 0}
              >
                {isLoading ? "처리중..." : initialData ? "저장" : "추가"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
