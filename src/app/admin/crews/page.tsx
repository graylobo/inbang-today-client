"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useState } from "react";

interface RankFormData {
  name: string;
  level: number;
}

interface CrewFormData {
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

  const { data: crews, isLoading } = useQuery({
    queryKey: ["crews"],
    queryFn: async () => {
      const { data } = await api.get("/crews");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newCrew: CrewFormData) => api.post("/crews", newCrew),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crews"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CrewFormData }) =>
      api.put(`/crews/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crews"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/crews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crews"] });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", iconUrl: "", ranks: [] });
    setSelectedCrew(null);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedCrew) {
      updateMutation.mutate({ id: selectedCrew.id, data: formData });
    } else {
      createMutation.mutate(formData);
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

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
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
                  <div className="flex-1">
                    <input
                      type="text"
                      value={rank.name}
                      onChange={(e) =>
                        handleRankChange(index, "name", e.target.value)
                      }
                      placeholder="계급 이름"
                      className="w-full rounded-md border-gray-300"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveRank(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveRank(index, "down")}
                      disabled={index === formData.ranks.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <span className="text-sm text-gray-500">
                      레벨: {rank.level}
                    </span>
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

          <div className="flex justify-end space-x-3">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isEditing ? "수정" : "생성"}
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white shadow-sm rounded-lg">
        <ul className="divide-y divide-gray-200">
          {crews?.map((crew: any) => (
            <li key={crew.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{crew.name}</h3>
                  <p className="text-gray-500">{crew.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(crew)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "정말로 이 크루를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                        )
                      ) {
                        deleteMutation.mutate(crew.id);
                      }
                    }}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
