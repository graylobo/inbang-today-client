"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api/axios";
import { useState } from "react";
import {
  useCreateCrew,
  useDeleteCrew,
  useGetCrews,
  useUpdateCrew,
} from "@/hooks/crew/useCrews";
import { useCrewPermissionsList } from "@/hooks/useCrewPermission";
import Link from "next/link";

interface RankFormData {
  name: string;
  level: number;
}

export interface CrewFormData {
  name: string;
  description: string;
  iconUrl?: string;
  ranks: RankFormData[];
}

export default function AdminCrewsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<any>(null);
  const [formData, setFormData] = useState<CrewFormData>({
    name: "",
    description: "",
    iconUrl: "",
    ranks: [],
  });

  const queryClient = useQueryClient();

  const { data: allCrews, isLoading: isLoadingAllCrews } = useGetCrews();

  // Get crews the user has permission to edit
  const {
    crews: permittedCrews,
    isLoading: isLoadingPermissions,
    isAdmin,
  } = useCrewPermissionsList();

  const { mutate: createMutate } = useCreateCrew(resetForm);

  const { mutate: updateMutate } = useUpdateCrew(resetForm);

  const { mutate: deleteMutate } = useDeleteCrew();

  function resetForm() {
    setFormData({ name: "", description: "", iconUrl: "", ranks: [] });
    setSelectedCrew(null);
    setIsEditing(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedCrew) {
      updateMutate({ id: selectedCrew.id, formData });
    } else {
      createMutate(formData);
    }
  };

  const handleEdit = (crew: any) => {
    setSelectedCrew(crew);
    setFormData({
      name: crew.name,
      description: crew.description,
      iconUrl: crew.iconUrl || "",
      ranks: crew.ranks || [],
    });
    setIsEditing(true);
  };

  // Filter crews to only show those the user has permission to edit
  const getEditableCrews = () => {
    if (isAdmin) {
      return allCrews || []; // Admin can edit all crews
    }

    if (!permittedCrews || !allCrews) {
      return [];
    }

    const permittedCrewIds = permittedCrews.map((crew: any) => crew.id);
    return allCrews.filter((crew: any) => permittedCrewIds.includes(crew.id));
  };

  const editableCrews = getEditableCrews();

  const handleAddRank = () => {
    setFormData({
      ...formData,
      ranks: [
        ...formData.ranks,
        {
          name: "",
          level: formData.ranks.length + 1,
        },
      ],
    });
  };

  const handleRemoveRank = (index: number) => {
    setFormData({
      ...formData,
      ranks: formData.ranks.filter((_, i) => i !== index),
    });
  };

  const handleRankChange = (
    index: number,
    field: keyof RankFormData,
    value: string | number
  ) => {
    const newRanks = [...formData.ranks];
    newRanks[index] = {
      ...newRanks[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      ranks: newRanks,
    });
  };

  const handleMoveRank = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === formData.ranks.length - 1)
    ) {
      return;
    }

    const newRanks = [...formData.ranks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // 레벨 값 교환
    const tempLevel = newRanks[index].level;
    newRanks[index].level = newRanks[targetIndex].level;
    newRanks[targetIndex].level = tempLevel;

    // 배열에서 위치 교환
    [newRanks[index], newRanks[targetIndex]] = [
      newRanks[targetIndex],
      newRanks[index],
    ];

    setFormData({
      ...formData,
      ranks: newRanks,
    });
  };

  if (isLoadingAllCrews || isLoadingPermissions) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-sm rounded-lg p-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                크루 이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                아이콘 URL
              </label>
              <input
                type="text"
                value={formData.iconUrl}
                onChange={(e) =>
                  setFormData({ ...formData, iconUrl: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* 계급 관리 섹션 */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">계급 관리</h3>
                <button
                  type="button"
                  onClick={handleAddRank}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  계급 추가
                </button>
              </div>
              <div className="space-y-4">
                {formData.ranks.map((rank, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-grow">
                      <label className="block text-sm font-medium text-gray-700">
                        계급 이름
                      </label>
                      <input
                        type="text"
                        value={rank.name}
                        onChange={(e) =>
                          handleRankChange(index, "name", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleMoveRank(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveRank(index, "down")}
                        disabled={index === formData.ranks.length - 1}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveRank(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {isEditing ? "수정하기" : "크루 생성"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">크루 목록</h2>
        {!isAdmin && editableCrews.length === 0 && (
          <p className="text-gray-500">편집 권한이 있는 크루가 없습니다.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {editableCrews.map((crew: any) => (
            <div
              key={crew.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md"
            >
              <div className="flex items-center space-x-3 mb-2">
                {crew.iconUrl && (
                  <img
                    src={crew.iconUrl}
                    alt={crew.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <h3 className="font-medium">{crew.name}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {crew.description}
              </p>
              <div className="flex justify-end space-x-2">
                <Link
                  href={`/admin/crews/edit/${crew.id}`}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  편집
                </Link>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm("정말 삭제하시겠습니까?")) {
                        deleteMutate(crew.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
