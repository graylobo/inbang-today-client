import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { LiveCrewInfo } from "@/hooks/useLiveCrewsInfo";

export interface StreamingDataResponse {
  streamInfos: any[];
  totalCount: number;
}

export interface LiveCrewsInfoResponse {
  crews: LiveCrewInfo[];
}

export async function getLiveCrewsInfo(): Promise<LiveCrewsInfoResponse> {
  const data = await apiRequest(API_ROUTES.crawler.liveCrews);
  return data;
}

export async function getBroadcasts(options?: {
  crewId?: string;
  streamerIds?: string[];
}): Promise<StreamingDataResponse> {
  const streamerIdsParam = options?.streamerIds?.join(",");
  const data = await apiRequest(API_ROUTES.crawler.broadcasts, {
    query: {
      crewId: options?.crewId,
      streamerIds: streamerIdsParam,
    },
  });
  return data;
}

export async function getMatchHistory(startDate: string, endDate: string) {
  const data = await apiRequest(API_ROUTES.crawler.matchHistory, {
    query: {
      startDate,
      endDate,
    },
  });
  return data;
}

export async function saveMatchData(startDate: string, endDate: string) {
  const data = await apiRequest(API_ROUTES.crawler.saveMatchData, {
    query: {
      startDate,
      endDate,
    },
  });
  return data;
}

export async function updateSoopIds() {
  const data = await apiRequest(API_ROUTES.crawler.updateSoopIds);
  return data;
}
