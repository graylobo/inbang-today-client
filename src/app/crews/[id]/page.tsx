import CrewDetail from "@/components/CrewDetail";
import { crewDetailOptions } from "@/hooks/crew/useCrews.option";
import { PrefetchProvider } from "@/providers/pre-fetch-provider";
import { use } from "react";

type CrewDetailPageParams = Promise<{
  id: string;
}>;

export default function CrewDetailPage(props: {
  params: CrewDetailPageParams;
}) {
  const { id } = use(props.params);
  return (
    <main className="min-h-screen">
      <PrefetchProvider prefetchOptions={[crewDetailOptions(id)]}>
        <CrewDetail crewId={id} />
      </PrefetchProvider>
    </main>
  );
}
