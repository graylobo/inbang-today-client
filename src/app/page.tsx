import CrewList from "@/components/CrewList";
import Loading from "@/components/Loading";
import { crewsRankingsOptions } from "@/hooks/crew/useCrews.option";
import { PrefetchProvider } from "@/providers/pre-fetch-provider";
import { Suspense } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "엑셀 방송 랭킹 - 엑셀방송 순위",
  description:
    "엑셀 방송 크루들의 실시간 랭킹을 한눈에 확인하세요.",
  keywords: [
    "엑셀 방송 랭킹",
    "엑셀방송",
    "숲 엑셀",
    "엑셀 순위",
    "엑셀 크루 랭킹",
    "스타크래프트",
  ],
  openGraph: {
    title: "엑셀 방송 랭킹 - 엑셀방송 순위",
    description: "엑셀방송 크루들의 실시간 랭킹을 확인하세요.",
    url: "https://www.inbangtoday.com",
    type: "website",
  },
  alternates: {
    canonical: "https://www.inbangtoday.com",
  },
};

export default function Home() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "인방투데이",
    description: "스타크래프트 스타티어표, 엑셀방송 랭킹 정보 제공",
    url: "https://www.inbangtoday.com",
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    author: {
      "@type": "Organization",
      name: "인방투데이",
    },
    keywords: "스타티어표, 엑셀방송, 스타크래프트, 숲 엑셀",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen">
        <header>
          <h1 className="text-3xl font-bold mb-8">엑셀 방송 랭킹</h1>
          <p className="text-lg text-gray-600 mb-6">
            스타크래프트 엑셀방송 크루들의 최신 랭킹을 확인하세요. 실시간으로
            업데이트되는 크루 순위와 전적을 한눈에 보실 수 있습니다.
          </p>
        </header>
        <Suspense fallback={<Loading />}>
          <PrefetchProvider prefetchOptions={crewsRankingsOptions(year, month)}>
            <CrewList initialYear={year} initialMonth={month} />
          </PrefetchProvider>
        </Suspense>
      </main>
    </>
  );
}
