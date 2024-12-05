import CrewDetail from "@/components/CrewDetail";
import { crewDetailOptions } from "@/hooks/crew/useCrews.option";
import { PrefetchProvider } from "@/providers/pre-fetch-provider";

export default function CrewDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen p-8">
      <PrefetchProvider prefetchOptions={[crewDetailOptions(params.id)]}>
        <CrewDetail crewId={params.id} />
      </PrefetchProvider>
    </main>
  );
} 