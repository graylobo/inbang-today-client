import type { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = "/images/og-image.jpg",
  noindex = false,
}: SEOConfig): Metadata {
  const baseUrl = "https://seujinsa.com";
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullOgImage = `${baseUrl}${ogImage}`;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: "Inbang Today" }],
    creator: "Inbang Today",
    publisher: "Inbang Today",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullCanonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: fullCanonicalUrl,
      siteName: "Inbang Today",
      type: "website",
      locale: "ko_KR",
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullOgImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// 키워드 관련 상수들
export const MAIN_KEYWORDS = [
  "스타티어표",
  "엑셀",
  "엑셀방송",
  "스타크래프트",
  "숲 엑셀",
];

export const STARCRAFT_KEYWORDS = [
  "스타크래프트",
  "스타티어표",
  "프로게이머 랭킹",
  "ASL",
  "KSL",
  "스타크래프트 리마스터",
  "경기 결과",
  "컨트롤 연습",
];

export const EXCEL_KEYWORDS = [
  "엑셀방송",
  "엑셀",
  "숲 엑셀",
  "엑셀 크루",
  "엑셀 랭킹",
  "크루 순위",
  "스타크래프트 엑셀",
];

// 구조화된 데이터 생성 함수들
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Inbang Today",
    alternateName: "인방투데이",
    url: "https://seujinsa.com",
    description: "스타크래프트 스타티어표, 엑셀방송 랭킹 정보",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://seujinsa.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    sameAs: [
      // 소셜 미디어 링크들이 있다면 여기에 추가
    ],
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateGameRankingSchema(gameName: string, rankings: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${gameName} 랭킹`,
    sport: gameName,
    startDate: new Date().toISOString(),
    location: {
      "@type": "VirtualLocation",
      url: "https://seujinsa.com",
    },
    organizer: {
      "@type": "Organization",
      name: "Inbang Today",
    },
  };
}
