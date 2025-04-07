"use client";

import { useCrewPermissionsList } from "@/hooks/crew-permission/useCrewPermission";
import {
  useCreateCrew,
  useDeleteCrew,
  useGetCrews,
  useUpdateCrew,
} from "@/hooks/crew/useCrews";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
  const [formData, setFormData] = useState<CrewFormData>({
    name: "",
    description: "",
    iconUrl: "",
    ranks: [],
  });

  const { data: allCrews, isLoading: isLoadingAllCrews } = useGetCrews();

  // Get crews the user has permission to edit
  const {
    crews: permittedCrews,
    isLoading: isLoadingPermissions,
    isAdmin,
    isSuperAdmin,
  } = useCrewPermissionsList();

  console.log("allCrews:::", allCrews);
  console.log("permittedCrews:::", permittedCrews);

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

    // 슈퍼어드민이 아닌 일반 어드민은 크루 멤버 관리 페이지로 직접 이동
    if (!isSuperAdmin && isAdmin) {
      router.push(`/admin/members?crewId=${crew.id}`);
    }
  };

  // Filter crews to only show those the user has permission to edit
  const getEditableCrews = () => {
    // 슈퍼 관리자는 모든 크루를 볼 수 있음
    if (isSuperAdmin) {
      return allCrews || [];
    }

    // 일반 관리자는 허용된 크루만 볼 수 있음
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
      {/* 슈퍼 관리자만 폼을 볼 수 있음 */}
      {isSuperAdmin && (
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
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  저장
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                크루 생성
              </button>
            )}
          </div>
        </form>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            내가 관리할 수 있는 크루 목록
          </h2>
        </div>

        {editableCrews.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {isSuperAdmin
              ? "등록된 크루가 없습니다."
              : "관리 권한이 있는 크루가 없습니다."}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {editableCrews.map((crew) => (
              <li key={crew.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {crew.iconUrl && (
                      <img
                        src={crew.iconUrl}
                        alt={crew.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {crew.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {crew.description || "설명 없음"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleEdit(crew)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        편집
                      </button>
                    )}
                    <Link
                      href={`/admin/members?crewId=${crew.id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      멤버 관리
                    </Link>
                    {isSuperAdmin && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "정말로 이 크루를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                            )
                          ) {
                            deleteMutate(crew.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
