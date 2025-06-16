import { Providers } from "@/app/providers";
import "./globals.css";
import BaseLayout from "@/layouts/Base";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default:
      "Inbang Today - 스타크래프트 스타티어표, 엑셀방송, 스타크래프트 랭킹",
    template: "%s | Inbang Today",
  },
  description:
    "스타크래프트 스타티어표, 엑셀방송 랭킹, 스타크래프트 프로게이머 정보를 한곳에서! 숲 엑셀부터 최신 스타크래프트 경기 결과까지 실시간으로 확인하세요.",
  keywords: [
    "스타티어표",
    "엑셀",
    "엑셀방송",
    "스타크래프트",
    "숲 엑셀",
    "스타크래프트 랭킹",
    "프로게이머",
    "스타크래프트 경기",
    "인방투데이",
    "게임 랭킹",
    "스타크래프트 리마스터",
    "ASL",
    "KSL",
  ],
  authors: [{ name: "Inbang Today" }],
  creator: "Inbang Today",
  publisher: "Inbang Today",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.inbangtoday.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Inbang Today - 스타크래프트 스타티어표, 엑셀방송 랭킹",
    description:
      "스타크래프트 스타티어표, 엑셀방송 랭킹, 프로게이머 정보를 실시간으로 확인하세요. 숲 엑셀부터 최신 경기 결과까지!",
    url: "https://www.inbangtoday.com",
    siteName: "Inbang Today",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Inbang Today - 스타크래프트 스타티어표",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inbang Today - 스타크래프트 스타티어표, 엑셀방송",
    description: "스타크래프트 스타티어표, 엑셀방송 랭킹 정보",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // 실제 구글 서치 콘솔 인증 코드로 교체 필요
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://www.inbangtoday.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`vsc-initialized ${GeistSans.className}`}>
        <Providers>
          <BaseLayout>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  );
}
