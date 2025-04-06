"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRequireCrewPermission } from "@/hooks/useCrewPermission";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/libs/api/axios";
import { useUpdateCrew } from "@/hooks/crew/useCrews";

export default function EditCrewPage() {
  const params = useParams();
  const crewId = Number(params.id);
  const router = useRouter();
  const { hasPermission, isLoading: isLoadingPermission } =
    useRequireCrewPermission(crewId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    iconUrl: "",
  });

  // Fetch crew data
  const { data: crew, isLoading: isLoadingCrew } = useQuery({
    queryKey: ["crew", crewId],
    queryFn: async () => {
      const response = await api.get(`/crew/${crewId}`);
      return response.data;
    },
    enabled: !!crewId,
  });

  // Update mutation
  const { mutate: updateCrew, isPending: isUpdating } = useUpdateCrew(() => {
    router.push("/admin/crews");
  });

  useEffect(() => {
    if (crew) {
      setFormData({
        name: crew.name || "",
        description: crew.description || "",
        iconUrl: crew.iconUrl || "",
      });
    }
  }, [crew]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCrew({ id: crewId, formData });
  };

  if (isLoadingPermission || isLoadingCrew) {
    return <div>로딩 중...</div>;
  }

  if (!hasPermission) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        이 크루를 편집할 권한이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">크루 편집: {crew?.name}</h1>
        <button
          type="button"
          onClick={() => router.push("/admin/crews")}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          목록으로
        </button>
      </div>

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
          <div className="pt-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isUpdating ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
