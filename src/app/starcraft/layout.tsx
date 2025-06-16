import type { Metadata } from "next";

// 스타크래프트 섹션의 기본 메타데이터
export const metadata: Metadata = {
  title: {
    template: `%s | 스타크래프트 - Inbang Today`,
    default: "스타크래프트 정보 - 스타티어표, 프로게이머 랭킹, 경기 결과",
  },
  description:
    "스타크래프트 관련 모든 정보를 한곳에서! 스타티어표, 프로게이머 랭킹, ASL/KSL 경기 결과, 컨트롤 연습 도구까지 제공합니다.",
  keywords: [
    "스타크래프트",
    "스타티어표",
    "프로게이머 랭킹",
    "ASL",
    "KSL",
    "스타크래프트 리마스터",
    "경기 결과",
    "컨트롤 연습",
    "왼손생산",
    "스타크래프트 정보",
  ],
  openGraph: {
    title: "스타크래프트 정보 - 스타티어표, 프로게이머 랭킹",
    description:
      "스타크래프트 관련 모든 정보를 한곳에서! 스타티어표부터 최신 경기 결과까지",
    url: "https://www.inbangtoday.com/starcraft",
    siteName: "Inbang Today",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/images/starcraft-og.jpg",
        width: 1200,
        height: 630,
        alt: "스타크래프트 정보 - Inbang Today",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "스타크래프트 정보 - 스타티어표, 프로게이머 랭킹",
    description: "스타크래프트 관련 모든 정보를 한곳에서!",
    images: ["/images/starcraft-og.jpg"],
  },
  alternates: {
    canonical: "https://www.inbangtoday.com/starcraft",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function StarcraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "스타크래프트 정보",
    description: "스타크래프트 관련 종합 정보 페이지",
    url: "https://www.inbangtoday.com/starcraft",
    isPartOf: {
      "@type": "WebSite",
      name: "Inbang Today",
      url: "https://www.inbangtoday.com",
    },
    about: {
      "@type": "VideoGame",
      name: "스타크래프트",
      genre: "Real-time strategy",
      publisher: "Blizzard Entertainment",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="starcraft-layout">{children}</div>
    </>
  );
}
