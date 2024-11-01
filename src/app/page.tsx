import { Suspense } from 'react';
import CrewList from '@/components/CrewList';
import Loading from '@/components/Loading';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        인터넷방송 크루 랭킹
      </h1>
      <Suspense fallback={<Loading />}>
        <CrewList />
      </Suspense>
    </main>
  );
} 