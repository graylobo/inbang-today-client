import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface LiveCrewInfo {
  id: number;
  liveStreamersCount: number;
  isOwnerLive: boolean;
}

interface LiveCrewsInfoResponse {
  crews: LiveCrewInfo[];
}

export const useLiveCrewsInfo = () => {
  return useQuery<LiveCrewsInfoResponse>({
    queryKey: ["liveCrewsInfo"],
    queryFn: async () => {
      const { data } = await axios.get<LiveCrewsInfoResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/crawler/live-crews`
      );
      return data;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
  });
};
