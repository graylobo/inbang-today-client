"use client";

import {
  useGetCrewMemberHistory,
  CrewMemberHistoryItem,
} from "@/hooks/crew/useCrewMemberHistory";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface MemberHistoryTableProps {
  streamerId: number;
  memberName: string;
  showActions?: boolean;
  onEdit?: (history: CrewMemberHistoryItem) => void;
  onDelete?: (historyId: number) => void;
  onAdd?: () => void;
}

export default function MemberHistoryTable({
  streamerId,
  memberName,
  showActions = false,
  onEdit,
  onDelete,
  onAdd,
}: MemberHistoryTableProps) {
  const { data: memberHistory, isLoading: isLoadingHistory } =
    useGetCrewMemberHistory(streamerId);

  // 사용자 인증 및 권한 정보
  const { user, isAuthenticated, isSuperAdmin } = useAuthStore();

  // 권한별 표시 조건
  const canAddHistory = isAuthenticated && user; // 로그인한 사용자만 추가 가능
  const canEditDelete = isSuperAdmin; // 슈퍼어드민만 수정/삭제 가능

  if (isLoadingHistory) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {/* 히스토리 추가 버튼 - 항상 표시하되 권한에 따라 활성화/비활성화 */}
      {showActions && onAdd && (
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {memberName} 히스토리
          </h3>
          <div className="relative group">
            <Button
              onClick={canAddHistory ? onAdd : undefined}
              className={`${
                canAddHistory
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              size="sm"
              disabled={!canAddHistory}
              title={canAddHistory ? "" : "로그인 후 편집이 가능합니다"}
            >
              <Plus className="w-4 h-4 mr-2" />새 히스토리 추가
            </Button>
            {/* 커스텀 툴팁 */}
            {!canAddHistory && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                로그인 후 편집이 가능합니다
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 기존 제목만 표시하는 부분 제거 - 위에서 항상 표시하도록 변경 */}

      {!memberHistory || memberHistory.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">히스토리 정보가 없습니다.</p>
          {showActions && onAdd && (
            <div className="relative group inline-block">
              <Button
                onClick={canAddHistory ? onAdd : undefined}
                className={`${
                  canAddHistory
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!canAddHistory}
                title={canAddHistory ? "" : "로그인 후 편집이 가능합니다"}
              >
                <Plus className="w-4 h-4 mr-2" />첫 번째 히스토리 추가하기
              </Button>
              {/* 커스텀 툴팁 */}
              {!canAddHistory && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  로그인 후 편집이 가능합니다
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  날짜
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  크루
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  이벤트
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  직급 변경
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  비고
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  입력자
                </th>
                {showActions && canEditDelete && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    작업
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {memberHistory.map((history: CrewMemberHistoryItem) => (
                <tr key={history.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(history.eventDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {history.crew.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {history.eventType === "join" ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        입사
                      </span>
                    ) : history.eventType === "leave" ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        퇴사
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        직급 변경
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {history.eventType === "rank_change" &&
                      history.oldRank &&
                      history.newRank && (
                        <div className="flex items-center">
                          <span className="px-2 py-1 text-xs rounded bg-gray-100">
                            {history.oldRank.name}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mx-2 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                          <span className="px-2 py-1 text-xs rounded font-medium bg-blue-100 text-blue-800">
                            {history.newRank.name}
                          </span>
                        </div>
                      )}
                    {history.eventType === "join" && history.newRank && (
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-xs rounded font-medium bg-blue-100 text-blue-800">
                          {history.newRank.name}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          (초기 직급)
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                    {history.note}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {history.performedBy ? (
                      <span className="text-xs text-gray-600">
                        {history.performedBy.name || "알 수 없음"}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">시스템</span>
                    )}
                    <span className="block text-xs text-gray-400 mt-1">
                      {new Date(history.createdAt).toLocaleString()}
                    </span>
                  </td>
                  {/* 수정/삭제 버튼 - 슈퍼어드민만 표시 */}
                  {showActions && canEditDelete && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit && onEdit(history)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(history.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
