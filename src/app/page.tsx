import { Suspense, useState } from "react";
import CrewList from "@/components/CrewList";
import Loading from "@/components/Loading";
import { PrefetchProvider } from "@/providers/pre-fetch-provider";
import { crewsRankingsOptions } from "@/hooks/crew/useCrews.option";

export default function Home() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Crew Ranking</h1>
      <Suspense fallback={<Loading />}>
        <PrefetchProvider prefetchOptions={crewsRankingsOptions(year, month)}>
          <CrewList initialYear={year} initialMonth={month} />
        </PrefetchProvider>
      </Suspense>
    </main>
  );
}
