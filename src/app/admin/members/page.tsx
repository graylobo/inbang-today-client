"use client";

import {
  useCreateCrewMember,
  useGetCrewMembers,
  useGetCrewRanksByCrewID,
  useGetCrews,
} from "@/hooks/crew/useCrews";
import { CrewMember } from "@/hooks/crew/useCrews.type";
import { api } from "@/libs/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export interface CrewMemberFormData {
  name: string;
  profileImageUrl?: string;
  broadcastUrl?: string;
  crewId: number;
  rankId: number;
}

export default function AdminMembersPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CrewMember | null>(null);
  const [selectedCrewId, setSelectedCrewId] = useState<number | "all">("all");
  const [formData, setFormData] = useState<CrewMemberFormData>({
    name: "",
    profileImageUrl: "",
    broadcastUrl: "",
    crewId: 0,
    rankId: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      profileImageUrl: "",
      broadcastUrl: "",
      crewId: 0,
      rankId: 0,
    });
    setSelectedMember(null);
    setIsEditing(false);
  };

  const queryClient = useQueryClient();

  // 크루 목록 조회
  const { data: crews } = useGetCrews();

  // 선택된 크루의 계급 목록 조회
  const { data: ranks } = useGetCrewRanksByCrewID(formData.crewId.toString());

  // 모든 멤버 조회
  const { data: members, isLoading } = useGetCrewMembers();

  const createMutation = useCreateCrewMember(resetForm);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CrewMemberFormData }) =>
      api.put(`/crew-members/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/crew-members/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedMember) {
      updateMutation.mutate({ id: selectedMember.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (member: CrewMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      profileImageUrl: member.profileImageUrl || "",
      broadcastUrl: member.broadcastUrl || "",
      crewId: member?.crew?.id,
      rankId: member?.rank?.id,
    });
    setIsEditing(true);
  };

  // 멤버 목록 필터링 및 정렬
  const filteredMembers = members
    ?.filter(
      (member) =>
        selectedCrewId === "all" || member?.crew?.id === selectedCrewId
    )
    .sort((a, b) => {
      // 먼저 크루 이름으로 정렬
      const crewCompare = a.crew?.name?.localeCompare(b.crew.name);
      if (crewCompare !== 0) return crewCompare;

      // 같은 크루 내에서는 계급 레벨로 정렬
      return a.rank.id - b.rank.id;
    });

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      {/* 멤버 추가/수정 폼 */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm rounded-lg p-6"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              멤버 이름
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
              프로필 이미지 URL
            </label>
            <input
              type="text"
              value={formData.profileImageUrl}
              onChange={(e) =>
                setFormData({ ...formData, profileImageUrl: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              방송국 URL
            </label>
            <input
              type="text"
              value={formData.broadcastUrl}
              onChange={(e) =>
                setFormData({ ...formData, broadcastUrl: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              크루
            </label>
            <select
              value={formData.crewId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  crewId: Number(e.target.value),
                  rankId: 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value={0}>크루 선택</option>
              {crews?.map((crew: any) => (
                <option key={crew.id} value={crew.id}>
                  {crew.name}
                </option>
              ))}
            </select>
          </div>
          {formData.crewId > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                계급
              </label>
              <select
                value={formData.rankId}
                onChange={(e) =>
                  setFormData({ ...formData, rankId: Number(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

      {/* 멤버 목록 필터 */}
      <div className="flex justify-end">
        <select
          value={selectedCrewId}
          onChange={(e) =>
            setSelectedCrewId(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
          className="rounded-md border-gray-300"
        >
          <option value="all">모든 크루</option>
          {crews?.map((crew: any) => (
            <option key={crew.id} value={crew.id}>
              {crew.name}
            </option>
          ))}
        </select>
      </div>

      {/* 멤버 목록 */}
      <div className="bg-white shadow-sm rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredMembers?.map((member) => (
            <li
              key={member.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleEdit(member)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {member.profileImageUrl ? (
                    <img
                      src={member.profileImageUrl}
                      alt={member?.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">👤</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium">
                      {member?.name}
                      <span className="ml-2 text-sm text-gray-500">
                        ({member?.rank?.name})
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500">
                      {member?.crew?.name}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          "정말로 이 멤버를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                        )
                      ) {
                        deleteMutation.mutate(member.id);
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
