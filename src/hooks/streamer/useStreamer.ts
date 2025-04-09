import { LiveStreamer, Streamer } from "@/hooks/streamer/useStreamer.type";
import {
  getLiveStreamers,
  getStreamers,
} from "@/libs/api/services/streamer.service";
import { useQuery } from "@tanstack/react-query";

export function useGetStreamers(categoryNames?: string | string[]) {
  return useQuery<Streamer[]>({
    queryKey: ["streamers", { categoryNames }],
    queryFn: () => getStreamers(categoryNames),
  });
}

export function useGetLiveStreamers() {
  return useQuery<LiveStreamer[]>({
    queryKey: ["liveStreamers"],
    queryFn: () => getLiveStreamers(),
    refetchInterval: 60 * 1000,
  });
}
