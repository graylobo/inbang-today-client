/**
 * 크루 편집 권한 체크 유틸리티
 *
 * 🔄 권한 모드 전환 방법:
 *
 * 1️⃣ 초기 운영 모드 (현재 활성화):
 *    - 로그인한 모든 사용자가 편집 가능
 *    - 사이트 초기 활성화를 위해 권장
 *
 * 2️⃣ 제한 모드로 전환하려면:
 *    - 아래 'if (isAuthenticated) return true;' 줄을 주석 처리
 *    - 관리자 및 허용된 사용자만 편집 가능
 */
export const hasCrewEditPermission = (
  isSuperAdmin: boolean,
  permittedCrews: any[] | undefined,
  crewId: number,
  isAuthenticated: boolean = false
): boolean => {
  // 🚀 초기 운영 모드: 모든 로그인 사용자에게 편집 권한 부여
  // 제한 모드로 전환하려면 아래 줄을 주석 처리하세요
  if (isAuthenticated) return true;

  // 📝 제한 모드: 관리자 및 허용된 사용자만 편집 가능 (위 줄이 주석 처리되면 활성화)
  if (isSuperAdmin) return true;
  return permittedCrews?.some((crew: any) => crew.id === crewId) ?? false;
};
