"use client";

import StarTier from "@/components/starcraft/gamer-list/GamerList";
import React from "react";
import SEOHead from "@/components/SEO/SEOHead";

function StarTierPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "스타티어표 - 스타크래프트 프로게이머 랭킹",
    description: "스타크래프트 프로게이머들의 실시간 랭킹과 스타티어표",
    url: "https://www.inbangtoday.com/star-tier",
    mainEntity: {
      "@type": "SportsEvent",
      name: "스타크래프트 프로게이머 랭킹",
      sport: "스타크래프트",
      description: "프로게이머들의 실시간 티어 시스템과 랭킹 정보",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.inbangtoday.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "스타티어표",
          item: "https://www.inbangtoday.com/star-tier",
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Inbang Today",
    },
  };

  return (
    <>
      <SEOHead
        title="스타티어표 - 스타크래프트 프로게이머 실시간 랭킹"
        description="스타크래프트 프로게이머들의 최신 스타티어표를 확인하세요. 실시간 랭킹, 전적, 승률 정보를 한눈에! ASL, KSL 프로게이머 순위표"
        canonicalUrl="/star-tier"
        pageType="starcraft"
        ogImage="/images/star-tier-og.jpg"
        structuredData={jsonLd}
      />

      <div>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">스타크래프트 스타티어표</h1>
          <p className="text-lg text-gray-600 mb-4">
            스타크래프트 프로게이머들의 실시간 랭킹과 티어 시스템을 확인하세요.
            ASL, KSL 경기 결과를 바탕으로 한 정확한 순위표와 승률 정보를
            제공합니다.
          </p>
          <div className="text-sm text-gray-500">
            <span>실시간 업데이트</span> • <span>정확한 전적</span> •{" "}
            <span>상세 통계</span>
          </div>
        </header>
        <StarTier />
      </div>
    </>
  );
}

export default StarTierPage;
