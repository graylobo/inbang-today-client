import Head from "next/head";
import {
  MAIN_KEYWORDS,
  STARCRAFT_KEYWORDS,
  EXCEL_KEYWORDS,
} from "@/utils/seo.utils";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image";
  noindex?: boolean;
  structuredData?: object;
  pageType?: "main" | "starcraft" | "excel" | "board" | "private";
}

export default function SEOHead({
  title = "Inbang Today - 스타크래프트 스타티어표, 엑셀방송 랭킹",
  description = "스타크래프트 스타티어표, 엑셀방송 랭킹, 프로게이머 정보를 실시간으로 확인하세요.",
  keywords,
  canonicalUrl,
  ogImage = "/images/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  noindex = false,
  structuredData,
  pageType = "main",
}: SEOHeadProps) {
  // 페이지 타입별 기본 키워드 설정
  const getDefaultKeywords = () => {
    switch (pageType) {
      case "starcraft":
        return STARCRAFT_KEYWORDS;
      case "excel":
        return EXCEL_KEYWORDS;
      case "board":
        return [...MAIN_KEYWORDS, "커뮤니티", "게시판"];
      case "private":
        return []; // 키워드 없음
      default:
        return MAIN_KEYWORDS;
    }
  };

  const finalKeywords = keywords || getDefaultKeywords();
  const baseUrl = "https://seujinsa.com";
  const fullCanonicalUrl = canonicalUrl
    ? `${baseUrl}${canonicalUrl}`
    : undefined;
  const fullOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${baseUrl}${ogImage}`;

  // private 페이지는 noindex 강제
  const shouldNoIndex = noindex || pageType === "private";

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {finalKeywords.length > 0 && (
        <meta name="keywords" content={finalKeywords.join(", ")} />
      )}
      <meta name="author" content="Inbang Today" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Robots */}
      {shouldNoIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Inbang Today" />
      <meta property="og:locale" content="ko_KR" />
      {fullCanonicalUrl && (
        <meta property="og:url" content={fullCanonicalUrl} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  );
}
