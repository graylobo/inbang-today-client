import type { Metadata } from "next";
import LeftControl from "@/components/starcraft/LeftControl";

export const metadata: Metadata = {
  title: "왼손생산 - 스타크래프트 컨트롤 연습",
  description: "스타크래프트,왼손생산,스타컨트롤",
  openGraph: {
    title: "왼손생산",
    description: "스타크래프트,왼손생산,스타컨트롤",
    url: "https://inbangtoday.com/starcraft/left-control",
    siteName: "인방투데이",
  },
};

export default function LeftControlPage() {
  return <LeftControl />;
}
