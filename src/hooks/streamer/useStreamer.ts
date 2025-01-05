import { LiveStreamer, Streamer } from "@/hooks/streamer/useStreamer.type";
import {
  getLiveStreamers,
  getStreamers,
} from "@/libs/api/services/streamer.service";
import { useQuery } from "@tanstack/react-query";

export function useGetStreamers() {
  return useQuery<Streamer[]>({
    queryKey: ["streamers"],
    queryFn: () => getStreamers(),
  });
}

export function useGetLiveStreamers() {
  return useQuery<LiveStreamer[]>({
    queryKey: ["liveStreamers"],
    queryFn: () => getLiveStreamers(),
    refetchInterval: 60 * 1000,
  });
}
