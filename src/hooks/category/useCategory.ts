import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Category,
  StreamerCategory,
  getAllCategories,
  getCategoriesByName,
  getStreamerCategories,
  setStreamerCategories,
} from "@/libs/api/services/category.service";

// 모든 카테고리 조회 훅
export function useGetAllCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });
}

// 이름으로 카테고리 조회 훅
export function useGetCategoriesByName(name: string) {
  return useQuery<Category[]>({
    queryKey: ["categories", "name", name],
    queryFn: () => getCategoriesByName(name),
    enabled: !!name,
  });
}

// 특정 스트리머의 카테고리 조회 훅
export function useGetStreamerCategories(streamerId?: number) {
  return useQuery<StreamerCategory[]>({
    queryKey: ["streamerCategories", streamerId],
    queryFn: () =>
      streamerId ? getStreamerCategories(streamerId) : Promise.resolve([]),
    enabled: !!streamerId,
  });
}

// 스트리머의 카테고리 설정 훅
export function useSetStreamerCategories(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      streamerId,
      categoryIds,
    }: {
      streamerId: number;
      categoryIds: number[];
    }) => setStreamerCategories(streamerId, categoryIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["streamerCategories", variables.streamerId],
      });
      if (onSuccess) onSuccess();
    },
  });
}
