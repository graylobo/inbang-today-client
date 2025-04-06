"use client";

import { useRequireAdmin } from "@/hooks/useAuth";
import { useUserPermissionsManagement } from "@/hooks/useCrewPermission";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/libs/api/axios";

export default function PermissionsManagementPage() {
  const { isLoading: isLoadingAuth } = useRequireAdmin();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { assignPermission, removePermission, isAssigning, isRemoving } =
    useUserPermissionsManagement();

  // Fetch all users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/user");
      return response.data;
    },
  });

  // Fetch all crews
  const { data: crews, isLoading: isLoadingCrews } = useQuery({
    queryKey: ["crews"],
    queryFn: async () => {
      const response = await api.get("/crew");
      return response.data;
    },
  });

  // Fetch permissions for the selected user
  const {
    data: userPermissions,
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions,
  } = useQuery({
    queryKey: ["userPermissions", selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return [];
      const response = await api.get(
        `/user-permissions/user/${selectedUserId}`
      );
      return response.data;
    },
    enabled: !!selectedUserId,
  });

  const handleUserSelect = (userId: number) => {
    const user = users.find((u: any) => u.id === userId);
    setSelectedUserId(userId);
    setSelectedUser(user);
  };

  const handleAssignPermission = async (crewId: number) => {
    if (!selectedUserId) return;

    try {
      await assignPermission({ userId: selectedUserId, crewId });
      refetchPermissions();
    } catch (error) {
      console.error("Failed to assign permission:", error);
    }
  };

  const handleRemovePermission = async (crewId: number) => {
    if (!selectedUserId) return;

    try {
      await removePermission({ userId: selectedUserId, crewId });
      refetchPermissions();
    } catch (error) {
      console.error("Failed to remove permission:", error);
    }
  };

  // Check if user has permission for a crew
  const hasPermissionForCrew = (crewId: number) => {
    if (!userPermissions) return false;
    return userPermissions.some((p: any) => p.crew.id === crewId);
  };

  if (isLoadingAuth || isLoadingUsers || isLoadingCrews) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">크루 편집 권한 관리</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">사용자 선택</h2>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={selectedUserId || ""}
          onChange={(e) => handleUserSelect(Number(e.target.value))}
        >
          <option value="">사용자 선택...</option>
          {users &&
            users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email}) {user.isAdmin ? "- 관리자" : ""}
              </option>
            ))}
        </select>
      </div>

      {selectedUserId && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium">
              {selectedUser?.name}님의 크루 편집 권한
            </h2>
            {selectedUser?.isAdmin && (
              <p className="text-amber-600 mt-2">
                * 관리자는 기본적으로 모든 크루에 대한 편집 권한이 있습니다.
              </p>
            )}
          </div>

          <div className="space-y-4">
            {isLoadingPermissions ? (
              <div>권한 로딩 중...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      크루 이름
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      권한
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {crews &&
                    crews.map((crew: any) => {
                      const hasPermission = hasPermissionForCrew(crew.id);
                      return (
                        <tr key={crew.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {crew.iconUrl && (
                                <img
                                  src={crew.iconUrl}
                                  alt={crew.name}
                                  className="w-8 h-8 mr-2 rounded-full"
                                />
                              )}
                              <div className="text-sm font-medium text-gray-900">
                                {crew.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                hasPermission
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {hasPermission ? "있음" : "없음"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {hasPermission ? (
                              <button
                                onClick={() => handleRemovePermission(crew.id)}
                                disabled={isRemoving}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                권한 제거
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAssignPermission(crew.id)}
                                disabled={isAssigning}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                권한 부여
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
