import type { Metadata } from "next";

// 스타크래프트 섹션의 기본 메타데이터
export const metadata: Metadata = {
  title: {
    template: `%s`,
    default: "스타크래프트 - Inbang Today",
  },
  description: "스타크래프트 관련 도구 및 정보",
  openGraph: {
    title: "스타크래프트",
    description: "스타크래프트 관련 도구 및 정보",
    url: "https://seujinsa.com/starcraft",
    siteName: "Inbang Today",
  },
};

export default function StarcraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="starcraft-layout">{children}</div>;
}
