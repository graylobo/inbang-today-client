"use client";

import CrewEarnings from "@/components/crew-detail/CrewEarnings";
import CrewInfo from "@/components/crew-detail/CrewInfo";
import CrewSignatures from "@/components/crew-detail/CrewSignatures";
import LiveStreamer from "@/components/crew-detail/LiveStreamer";
import { useGetCrewByID } from "@/hooks/crew/useCrews";
import Link from "next/link";
import { useState } from "react";

const TABS = [
  { id: "info", label: "멤버정보", Component: CrewInfo },
  { id: "earnings", label: "별풍수익", Component: CrewEarnings },
  { id: "signatures", label: "시그니처", Component: CrewSignatures },
  { id: "live", label: "방송중", Component: LiveStreamer },
] as const;

type TabType = (typeof TABS)[number]["id"];

export default function CrewDetail({ crewId }: { crewId: string }) {
  const { data: crew, error } = useGetCrewByID(crewId);
  const [activeTab, setActiveTab] = useState<TabType>("info");

  if (error) return <div>에러가 발생했습니다.</div>;
  if (!crew) return <div>크루 정보를 찾을 수 없습니다.</div>;

  const ActiveComponent = TABS.find((tab) => tab.id === activeTab)?.Component;

  return (
    <div className="max-w-6xl mx-auto ">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 inline-block"
        >
          ← 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold mb-2 dark:text-gray-100">
          {crew.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{crew.description}</p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }
              `}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {ActiveComponent && <ActiveComponent crew={crew} crewId={crewId} />}
      </div>
    </div>
  );
}
