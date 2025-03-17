/**
 * IP 주소를 마스킹하는 함수
 * IPv4와 IPv6 형식 모두 지원
 * @param ip IP 주소 문자열
 * @returns 마스킹된 IP 주소
 */
export function maskIpAddress(ip: string | null): string {
  if (!ip) return "";

  if (ip.includes(".")) {
    // IPv4 형식 (예: 192.168.1.1)
    return ip.split(".").slice(0, 2).join(".") + ".***.***";
  } else if (ip.includes(":")) {
    // IPv6 형식 (예: 2001:0db8:85a3:0000:0000:8a2e:0370:7334 또는 ::1)
    if (ip === "::1") {
      return "localhost";
    }
    return ip.split(":").slice(0, 2).join(":") + ":****:****";
  }

  return ip; // 기타 형식
}
