import type { Metadata } from "next";
import BuildAlert from "@/components/starcraft/BuildAlert";

export const metadata: Metadata = {
  title: "빌드알리미 - 스타크래프트 빌드 타이밍 알림",
  description:
    "스타크래프트,스타빌드,저그빌드,프로토스빌드,테란빌드,빌드알리미",
  openGraph: {
    title: "빌드알리미",
    description:
      "스타크래프트,스타빌드,저그빌드,프로토스빌드,테란빌드,빌드알리미",
    url: "https://inbangtoday.com/starcraft/build-alert",
    siteName: "인방투데이",
  },
};

export default function BuildAlertPage() {
  return <BuildAlert />;
}
