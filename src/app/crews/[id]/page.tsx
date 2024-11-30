import CrewDetail from "@/components/CrewDetail";
import {
  crewDetailOptions,
  crewEarningsByDateOptions,
} from "@/hooks/crew/useCrews";
import { PrefetchProvider } from "@/providers/pre-fetch-provider";

export default function CrewDetailPage({ params }: { params: { id: string } }) {
  const currentDate = new Date();
  const initialYear = currentDate.getFullYear();
  const initialMonth = currentDate.getMonth() + 1;

  return (
    <main className="min-h-screen p-8">
      <PrefetchProvider
        prefetchOptions={[
          crewDetailOptions(params.id),
          crewEarningsByDateOptions(params.id, initialYear, initialMonth),
        ]}
      >
        <CrewDetail crewId={params.id} />
      </PrefetchProvider>
    </main>
  );
}
