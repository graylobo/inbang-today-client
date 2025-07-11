"use client";

import React, { useState, useEffect } from "react";
import { DanceVideoData } from "@/components/common/DanceVideoForm";

interface DanceVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  signatureId?: number;
  initialDances: DanceVideoData[];
  onSave: (dances: DanceVideoData[]) => void;
  isLoading?: boolean;
}

export const DanceVideoModal: React.FC<DanceVideoModalProps> = ({
  isOpen,
  onClose,
  signatureId,
  initialDances,
  onSave,
  isLoading = false,
}) => {
  const [dances, setDances] = useState<DanceVideoData[]>(initialDances);

  useEffect(() => {
    setDances(initialDances);
  }, [initialDances]);

  const handleAddDance = () => {
    const newDance: DanceVideoData = {
      // id는 undefined (새로운 춤 영상이므로 ID 없음)
      memberName: "",
      danceVideoUrl: "",
      performedAt: new Date().toISOString().split("T")[0],
    };
    setDances([...dances, newDance]);
  };

  const handleDanceChange = (index: number, field: string, value: string) => {
    const updatedDances = dances.map((dance, i) =>
      i === index ? { ...dance, [field]: value } : dance
    );
    setDances(updatedDances);
  };

  const handleRemoveDance = (index: number) => {
    setDances(dances.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // 빈 필드가 있는 춤 영상 제거
    const validDances = dances.filter(
      (dance) =>
        dance.memberName.trim() &&
        dance.danceVideoUrl.trim() &&
        dance.performedAt
    );
    onSave(validDances);
  };

  const handleCancel = () => {
    setDances(initialDances);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">춤 영상 관리</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {signatureId ? `시그니처 ID: ${signatureId}` : "새 시그니처"}
            </p>
            <button
              type="button"
              onClick={handleAddDance}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              춤 영상 추가
            </button>
          </div>

          {dances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              등록된 춤 영상이 없습니다. 춤 영상을 추가해보세요.
            </div>
          ) : (
            <div className="space-y-4">
              {dances.map((dance, index) => (
                <div
                  key={dance.id || `new-${index}`}
                  className="p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-lg">
                        춤 영상 #{index + 1}
                        {dance.id ? (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            기존 (ID: {dance.id})
                          </span>
                        ) : (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            새로 추가
                          </span>
                        )}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDance(index)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1 border border-red-500 rounded"
                    >
                      삭제
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        크루원 이름
                      </label>
                      <input
                        type="text"
                        value={dance.memberName}
                        onChange={(e) =>
                          handleDanceChange(index, "memberName", e.target.value)
                        }
                        className="w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                        placeholder="크루원 이름을 입력하세요"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        영상 URL
                      </label>
                      <input
                        type="url"
                        value={dance.danceVideoUrl}
                        onChange={(e) =>
                          handleDanceChange(
                            index,
                            "danceVideoUrl",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        방송 일자
                      </label>
                      <input
                        type="date"
                        value={dance.performedAt}
                        onChange={(e) =>
                          handleDanceChange(
                            index,
                            "performedAt",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                      />
                    </div>
                  </div>

                  {/* 미리보기 */}
                  {dance.danceVideoUrl && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">미리보기:</p>
                      <a
                        href={dance.danceVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        {dance.danceVideoUrl}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
};
