import { Suspense } from "react";
import CrewDetail from "@/components/CrewDetail";
import Loading from "@/components/Loading";

export default function CrewDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen p-8">
      <Suspense fallback={<Loading />}>
        <CrewDetail crewId={params.id} />
      </Suspense>
    </main>
  );
}
