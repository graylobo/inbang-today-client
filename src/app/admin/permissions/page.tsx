"use client";

import { useGetCrews } from "@/hooks/crew/useCrews";
import { useRequireSuperAdmin } from "@/hooks/useAuth";
import {
  useAssignCrewPermission,
  useGetAllUsers,
  useGetUserPermissions,
  useRemoveCrewPermission,
  useToggleAdminStatus,
  useToggleSuperAdminStatus,
} from "@/hooks/user-permission/useUserPermission";
import { useState } from "react";

// 이 페이지는 SuperAdmin만 접근 가능
export default function PermissionsManagementPage() {
  const { isLoading: isLoadingAuth } = useRequireSuperAdmin();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // 사용자 목록 조회
  const { data: users, isLoading: isLoadingUsers } = useGetAllUsers();

  // 크루 목록 조회
  const { data: crews, isLoading: isLoadingCrews } = useGetCrews();

  // 선택한 사용자의 권한 조회
  const { data: userPermissions, isLoading: isLoadingPermissions } =
    useGetUserPermissions(selectedUserId ?? -1);

  // 권한 부여, 제거, 관리자 토글 뮤테이션
  const assignPermission = useAssignCrewPermission();
  const removePermission = useRemoveCrewPermission();
  const toggleAdmin = useToggleAdminStatus();
  const toggleSuperAdmin = useToggleSuperAdminStatus();

  const handleUserSelect = (userId: number) => {
    const user = users?.find((u: any) => u.id === userId);
    setSelectedUserId(userId);
    setSelectedUser(user);
  };

  const handleAssignPermission = async (crewId: number) => {
    if (!selectedUserId) return;
    assignPermission.mutate({ userId: selectedUserId, crewId });
  };

  const handleRemovePermission = async (crewId: number) => {
    if (!selectedUserId) return;
    removePermission.mutate({ userId: selectedUserId, crewId });
  };

  const handleToggleAdmin = async (
    userId: number,
    isCurrentlyAdmin: boolean
  ) => {
    toggleAdmin.mutate(
      { userId, isAdmin: isCurrentlyAdmin },
      {
        onSuccess: () => {
          // 선택된 사용자 업데이트
          if (selectedUserId === userId) {
            const updatedUser = users?.find((u: any) => u.id === userId);
            if (updatedUser) {
              setSelectedUser({
                ...updatedUser,
                isAdmin: !isCurrentlyAdmin,
              });
            }
          }
        },
      }
    );
  };

  const handleToggleSuperAdmin = async (
    userId: number,
    isCurrentlySuperAdmin: boolean
  ) => {
    toggleSuperAdmin.mutate(
      { userId, isSuperAdmin: isCurrentlySuperAdmin },
      {
        onSuccess: () => {
          // 선택된 사용자 업데이트
          if (selectedUserId === userId) {
            const updatedUser = users?.find((u: any) => u.id === userId);
            if (updatedUser) {
              setSelectedUser({
                ...updatedUser,
                isSuperAdmin: !isCurrentlySuperAdmin,
              });
            }
          }
        },
      }
    );
  };

  // 크루에 대한 권한 확인
  const hasPermissionForCrew = (crewId: number) => {
    if (!userPermissions) return false;
    return userPermissions.some((p: any) => p.crew.id === crewId);
  };

  if (isLoadingAuth || isLoadingUsers || isLoadingCrews) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">권한 관리</h1>
      <p className="text-gray-600">
        슈퍼 관리자, 관리자 권한 설정 및 크루 편집 권한을 관리할 수 있습니다.
      </p>

      {/* 권한 설명 섹션 */}
      <div className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100">
        <h2 className="text-lg font-medium text-indigo-700 mb-2">역할 안내</h2>
        <ul className="space-y-2 text-sm text-indigo-900">
          <li className="flex items-start">
            <span className="inline-block mr-2 mt-0.5 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              슈퍼 관리자
            </span>
            <span>
              모든 시스템 관리 권한과 모든 크루 편집 권한을 가집니다. 관리자
              지정과 시스템 설정을 관리할 수 있습니다.
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block mr-2 mt-0.5 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              관리자
            </span>
            <span>
              관리자 페이지에 접근 가능하며, 부여받은 특정 크루만 편집할 수
              있습니다.
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block mr-2 mt-0.5 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              크루 편집 권한
            </span>
            <span>
              특정 크루만 편집할 수 있는 제한적 권한입니다. 관리자와 일반 사용자
              모두에게 부여할 수 있습니다.
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">사용자 선택</h2>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={selectedUserId || ""}
          onChange={(e) => handleUserSelect(Number(e.target.value))}
        >
          <option value="">사용자 선택...</option>
          {Array.isArray(users) &&
            users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
                {user.isSuperAdmin
                  ? " - 슈퍼 관리자"
                  : user.isAdmin
                  ? " - 관리자"
                  : ""}
              </option>
            ))}
        </select>
      </div>

      {selectedUserId && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium">
              {selectedUser?.name}님의 권한 설정
            </h2>

            <div className="mt-4 space-y-3">
              {/* 슈퍼 관리자 권한 토글 */}
              <div className="flex items-center">
                <span className="mr-3 w-32">슈퍼 관리자 권한:</span>
                <div className="flex items-center">
                  <button
                    className={`px-3 py-1.5 rounded-md ${
                      selectedUser?.isSuperAdmin
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedUser?.isSuperAdmin ? "활성화됨" : "비활성화됨"}
                  </button>
                  <button
                    onClick={() =>
                      handleToggleSuperAdmin(
                        selectedUserId,
                        selectedUser?.isSuperAdmin
                      )
                    }
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    {selectedUser?.isSuperAdmin ? "권한 제거" : "권한 부여"}
                  </button>
                </div>
              </div>

              {/* 관리자 권한 토글 */}
              <div className="flex items-center">
                <span className="mr-3 w-32">관리자 권한:</span>
                <div className="flex items-center">
                  <button
                    className={`px-3 py-1.5 rounded-md ${
                      selectedUser?.isAdmin
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedUser?.isAdmin ? "활성화됨" : "비활성화됨"}
                  </button>
                  <button
                    onClick={() =>
                      handleToggleAdmin(selectedUserId, selectedUser?.isAdmin)
                    }
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    disabled={selectedUser?.isSuperAdmin}
                  >
                    {selectedUser?.isAdmin ? "권한 제거" : "권한 부여"}
                  </button>
                </div>
              </div>
            </div>

            {selectedUser?.isSuperAdmin && (
              <p className="text-purple-600 mt-3">
                * 슈퍼 관리자는 모든 시스템 권한 및 모든 크루 편집 권한을
                가집니다.
              </p>
            )}

            {!selectedUser?.isSuperAdmin && selectedUser?.isAdmin && (
              <p className="text-amber-600 mt-3">
                * 관리자는 관리 메뉴에 접근할 수 있으며, 아래에서 크루 편집
                권한을 부여받을 수 있습니다.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-md font-medium mb-4">크루 편집 권한</h3>
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
                  {Array.isArray(crews) &&
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
                                hasPermission || selectedUser?.isSuperAdmin
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {hasPermission || selectedUser?.isSuperAdmin
                                ? "있음"
                                : "없음"}
                            </span>
                            {selectedUser?.isSuperAdmin && !hasPermission && (
                              <span className="ml-2 text-xs text-gray-500">
                                (기본 권한)
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {!selectedUser?.isSuperAdmin &&
                              (hasPermission ? (
                                <button
                                  onClick={() =>
                                    handleRemovePermission(crew.id)
                                  }
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  disabled={removePermission.isPending}
                                >
                                  {removePermission.isPending &&
                                  removePermission.variables?.crewId === crew.id
                                    ? "처리 중..."
                                    : "권한 제거"}
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleAssignPermission(crew.id)
                                  }
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                  disabled={assignPermission.isPending}
                                >
                                  {assignPermission.isPending &&
                                  assignPermission.variables?.crewId === crew.id
                                    ? "처리 중..."
                                    : "권한 부여"}
                                </button>
                              ))}
                            {selectedUser?.isSuperAdmin && (
                              <span className="text-gray-400">- 기본 권한</span>
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
