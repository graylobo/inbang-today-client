"use client";

import {
  useCreateCrewMember,
  useDeleteCrewMember,
  useGetCrewMembers,
  useGetCrewRanksByCrewID,
  useGetCrews,
  useUpdateCrewMember,
} from "@/hooks/crew/useCrews";
import { CrewMember } from "@/hooks/crew/useCrews.type";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCrewPermissionsList } from "@/hooks/crew-permission/useCrewPermission";
import { useAuthStore } from "@/store/authStore";

export interface CrewMemberFormData {
  name: string;
  profileImageUrl?: string;
  broadcastUrl?: string;
  crewId: number;
  rankId: number;
}

export default function AdminMembersPage() {
  const searchParams = useSearchParams();
  const crewIdParam = searchParams.get("crewId");
  const { isSuperAdmin, isAdmin } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CrewMember | null>(null);
  const [selectedCrewId, setSelectedCrewId] = useState<number | "all">(
    crewIdParam ? parseInt(crewIdParam) : "all"
  );
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

  // 모든 크루 목록 조회
  const { data: allCrews } = useGetCrews();

  // 권한이 있는 크루 목록 조회
  const { crews: permittedCrews } = useCrewPermissionsList();

  // 선택된 크루의 계급 목록 조회
  const { data: ranks } = useGetCrewRanksByCrewID(formData.crewId?.toString());

  // 모든 멤버 조회
  const { data: members, isLoading } = useGetCrewMembers();

  const { mutate: createCrewMember } = useCreateCrewMember(resetForm);

  const { mutate: updateCrewMember } = useUpdateCrewMember(resetForm);

  const { mutate: deleteCrewMember } = useDeleteCrewMember();

  // 편집 가능한 크루 목록 가져오기
  const getEditableCrews = () => {
    // 슈퍼 어드민은 모든 크루 볼 수 있음
    if (isSuperAdmin) {
      return allCrews || [];
    }

    // 일반 어드민은 권한이 있는 크루만 볼 수 있음
    return permittedCrews || [];
  };

  const editableCrews = getEditableCrews();

  // 편집 권한이 없는 크루를 선택한 경우, 자동으로 'all'로 변경
  useEffect(() => {
    if (selectedCrewId !== "all" && !isSuperAdmin) {
      const hasPermission = permittedCrews?.some(
        (crew: any) => crew.id === selectedCrewId
      );
      if (!hasPermission) {
        setSelectedCrewId("all");
      }
    }
  }, [selectedCrewId, permittedCrews, isSuperAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 슈퍼어드민이 아니면서 해당 크루에 대한 권한이 없는 경우 거부
    if (!isSuperAdmin) {
      const hasPermission = permittedCrews?.some(
        (crew: any) => crew.id === formData.crewId
      );
      if (!hasPermission) {
        alert("이 크루에 대한 편집 권한이 없습니다.");
        return;
      }
    }

    if (isEditing && selectedMember) {
      updateCrewMember({ id: selectedMember.id, member: formData });
    } else {
      createCrewMember(formData);
    }
  };

  const handleEdit = (member: CrewMember) => {
    // 슈퍼어드민이 아니면서 해당 크루에 대한 권한이 없는 경우 거부
    if (!isSuperAdmin && member.crew) {
      const hasPermission = permittedCrews?.some(
        (crew: any) => crew.id === member.crew?.id
      );
      if (!hasPermission) {
        alert("이 멤버를 편집할 권한이 없습니다.");
        return;
      }
    }

    setSelectedMember(member);
    setFormData({
      name: member.name,
      profileImageUrl: member.profileImageUrl || "",
      broadcastUrl: member.broadcastUrl || "",
      crewId: member?.crew?.id || 0,
      rankId: member?.rank?.id || 0,
    });
    setIsEditing(true);
  };

  // 멤버 목록 필터링 및 정렬
  const filteredMembers = members
    ?.filter((member) => {
      // 크루 정보가 없는 멤버는 건너뜀
      if (!member.crew) return false;

      // 슈퍼어드민이면 모든 멤버 또는 선택된 크루의 멤버 표시
      if (isSuperAdmin) {
        return selectedCrewId === "all" || member?.crew?.id === selectedCrewId;
      }

      // 일반 어드민은 권한이 있는 크루의 멤버만 표시
      const hasPermissionForCrew = permittedCrews?.some(
        (crew: any) => crew.id === member.crew?.id
      );
      return (
        hasPermissionForCrew &&
        (selectedCrewId === "all" || member?.crew?.id === selectedCrewId)
      );
    })
    .sort((a, b) => {
      // 멤버에 크루 정보가 없는 경우 처리
      if (!a.crew || !b.crew) return 0;

      // 먼저 크루 이름으로 정렬
      const crewCompare = a.crew?.name?.localeCompare(b.crew?.name || "");
      if (crewCompare !== 0) return crewCompare;

      // 같은 크루 내에서는 계급 레벨로 정렬 (계급 정보가 없는 경우 처리)
      if (!a.rank || !b.rank) return 0;
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
              {editableCrews?.map((crew: any) => (
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
          {editableCrews?.map((crew: any) => (
            <option key={crew.id} value={crew.id}>
              {crew.name}
            </option>
          ))}
        </select>
      </div>

      {/* 멤버 목록 */}
      <div className="bg-white shadow-sm rounded-lg">
        {filteredMembers?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            표시할 멤버가 없습니다.
          </div>
        ) : (
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
                        // 슈퍼어드민이 아니면서 해당 크루에 대한 권한이 없는 경우 거부
                        if (!isSuperAdmin && member.crew) {
                          const hasPermission = permittedCrews?.some(
                            (crew: any) => crew.id === member.crew?.id
                          );
                          if (!hasPermission) {
                            alert("이 멤버를 삭제할 권한이 없습니다.");
                            return;
                          }
                        }

                        if (
                          window.confirm(
                            "정말로 이 멤버를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                          )
                        ) {
                          deleteCrewMember(member.id);
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
        )}
      </div>
    </div>
  );
}
