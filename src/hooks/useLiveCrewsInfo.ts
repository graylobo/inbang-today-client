import { useQuery } from "@tanstack/react-query";
import {
  getLiveCrewsInfo,
  LiveCrewsInfoResponse,
} from "@/libs/api/services/crawler.service";

export interface LiveCrewInfo {
  id: number;
  liveStreamersCount: number;
  isOwnerLive: boolean;
}

export const useLiveCrewsInfo = () => {
  return useQuery<LiveCrewsInfoResponse>({
    queryKey: ["liveCrewsInfo"],
    queryFn: async () => {
      return getLiveCrewsInfo();
    },
    refetchInterval: 60000, // Refetch every 60 seconds
  });
};
