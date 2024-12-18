"use client";

import CrewEarnings from "@/components/crew-detail/CrewEarnings";
import CrewInfo from "@/components/crew-detail/CrewInfo";
import CrewSignatures from "@/components/crew-detail/CrewSignatures";
import { useGetCrewByID } from "@/hooks/crew/useCrews";
import Link from "next/link";
import { useState } from "react";

const TABS = [
  { id: "info", label: "크루 정보", Component: CrewInfo },
  { id: "earnings", label: "방송 수익", Component: CrewEarnings },
  { id: "signatures", label: "시그니처", Component: CrewSignatures },
] as const;

type TabType = (typeof TABS)[number]["id"];

export default function CrewDetail({ crewId }: { crewId: string }) {
  const { data: crew, error } = useGetCrewByID(crewId);
  const [activeTab, setActiveTab] = useState<TabType>("info");

  if (error) return <div>에러가 발생했습니다.</div>;
  if (!crew) return <div>크루 정보를 찾을 수 없습니다.</div>;

  const ActiveComponent = TABS.find((tab) => tab.id === activeTab)?.Component;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
        >
          ← 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold mb-2">{crew.name}</h1>
        <p className="text-gray-600">{crew.description}</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
