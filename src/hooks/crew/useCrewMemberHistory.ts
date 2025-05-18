import { useQuery } from "@tanstack/react-query";
import { getCrewMemberHistory } from "@/libs/api/services/crew.service";

export interface CrewMemberHistoryItem {
  id: number;
  eventType: "join" | "leave" | "rank_change";
  eventDate: string;
  note: string;
  createdAt: string;
  streamer: {
    id: number;
    name: string;
  };
  crew: {
    id: number;
    name: string;
  };
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
