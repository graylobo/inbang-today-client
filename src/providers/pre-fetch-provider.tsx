import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  QueryFunction,
  QueryKey,
} from "@tanstack/react-query";
type PrefetchOption = {
  queryKey: QueryKey;
  queryFn: QueryFunction;
};

type PrefetchProviderProps = {
  prefetchOptions: PrefetchOption | PrefetchOption[];
  children?: React.ReactNode;
};

export async function PrefetchProvider({
  prefetchOptions,
  children,
}: PrefetchProviderProps) {
  const queryClient = new QueryClient();

  if (Array.isArray(prefetchOptions)) {
    await Promise.all(
      prefetchOptions.map((prefetchOption) =>
        queryClient.prefetchQuery(prefetchOption)
      )
    );
  } else {
    await queryClient.prefetchQuery(prefetchOptions);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
