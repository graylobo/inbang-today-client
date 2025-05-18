import {
  CrewMemberHistoryData,
  deleteCrewMemberHistory,
  getCrewMemberHistory,
  updateCrewMemberHistory,
} from "@/libs/api/services/crew.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface CrewMemberHistoryItem {
  id: number;
  streamer: {
    id: number;
    name: string;
    soopId: string;
  };
  crew: {
    id: number;
    name: string;
  };
  eventType: "join" | "leave" | "rank_change";
  eventDate: string;
  note: string;
  oldRank?: {
    id: number;
    name: string;
  };
  newRank?: {
    id: number;
    name: string;
  };
}

export function useGetCrewMemberHistory(streamerId?: number) {
  return useQuery<CrewMemberHistoryItem[]>({
    queryKey: ["memberHistories", streamerId],
    queryFn: () => getCrewMemberHistory(streamerId),
    enabled: !!streamerId, // Only run query if streamerId is provided
  });
}

export function useUpdateCrewMemberHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      historyData,
    }: {
      id: number;
      historyData: Partial<CrewMemberHistoryData>;
    }) => {
      return await updateCrewMemberHistory(id, historyData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["memberHistories"] });
    },
  });
}

export function useDeleteCrewMemberHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await deleteCrewMemberHistory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberHistories"] });
    },
  });
}
