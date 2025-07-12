/**
 * 크루 편집 권한 체크 유틸리티
 */
export const hasCrewEditPermission = (
  isSuperAdmin: boolean,
  permittedCrews: any[] | undefined,
  crewId: number
): boolean => {
  if (isSuperAdmin) return true;
  return permittedCrews?.some((crew: any) => crew.id === crewId) ?? false;
};
