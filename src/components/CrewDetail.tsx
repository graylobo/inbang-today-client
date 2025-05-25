"use client";

import CrewEarnings from "@/components/crew-detail/CrewEarnings";
import CrewInfo from "@/components/crew-detail/CrewInfo";
import CrewSignatures from "@/components/crew-detail/CrewSignatures";
import LiveStreamer from "@/components/crew-detail/LiveStreamer";
import { useGetCrewByID } from "@/hooks/crew/useCrews";
import Link from "next/link";
import { useState, Suspense } from "react";

// Helper function to adapt crew data for LiveStreamer component
const adaptCrewForLiveStreamer = (crew: any) => {
  return {
    id: crew.id,
    name: crew.name,
    members: crew.members.map((member: any) => ({
      id: member.id,
      name: member.name,
      soopId: member.soopId,
      rank: {
        ...member.rank,
        level: member.rank.level || 1, // Providing a default level if missing
      },
    })),
  };
};

const TABS = [
  { id: "info", label: "멤버정보", Component: CrewInfo },
  { id: "earnings", label: "별풍수익", Component: CrewEarnings },
  { id: "signatures", label: "시그니처", Component: CrewSignatures },
  { id: "live", label: "방송중", Component: LiveStreamer },
] as const;

type TabType = (typeof TABS)[number]["id"];

// Loading component for consistent UI during loading
const LoadingState = () => (
  <div className="max-w-6xl mx-auto">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
      <div className="flex space-x-8 mb-6">
        {TABS.map((tab) => (
          <div
            key={tab.id}
            className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"
          ></div>
        ))}
      </div>
      <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

// Error component for consistent UI during errors
const ErrorState = () => (
  <div className="max-w-6xl mx-auto">
    <Link
      href="/"
      className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 inline-block"
    >
      ← 목록으로 돌아가기
    </Link>
    <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
      <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
        에러가 발생했습니다
      </h2>
      <p className="text-red-700 dark:text-red-300">
        크루 정보를 불러오는 데 문제가 발생했습니다. 나중에 다시 시도해 주세요.
      </p>
    </div>
  </div>
);

// Not found component for consistent UI when crew is not found
const NotFoundState = () => (
  <div className="max-w-6xl mx-auto">
    <Link
      href="/"
      className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 inline-block"
    >
      ← 목록으로 돌아가기
    </Link>
    <div className="p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-md">
      <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
        크루를 찾을 수 없습니다
      </h2>
      <p className="text-yellow-700 dark:text-yellow-300">
        요청하신 크루 정보가 존재하지 않습니다.
      </p>
    </div>
  </div>
);

// Content component to separate the data fetching logic from the rendering
const CrewDetailContent = ({ crewId }: { crewId: string }) => {
  const { data: crew, error } = useGetCrewByID(crewId);
  const [activeTab, setActiveTab] = useState<TabType>("info");

  if (error) return <ErrorState />;
  if (!crew) return <NotFoundState />;

  const ActiveComponent = TABS.find((tab) => tab.id === activeTab)?.Component;

  return (
    <div className="max-w-6xl mx-auto">
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
        {(() => {
          if (!ActiveComponent) return null;

          switch (activeTab) {
            case "info":
              return <CrewInfo crew={crew} />;
            case "earnings":
              return <CrewEarnings crewId={crewId} />;
            case "signatures":
              return <CrewSignatures crewId={crewId} />;
            case "live":
              return <LiveStreamer crew={adaptCrewForLiveStreamer(crew)} />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default function CrewDetail({ crewId }: { crewId: string }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <CrewDetailContent crewId={crewId} />
    </Suspense>
  );
}
