import { StreamerFormData } from "@/app/admin/members/page";
import { LiveStreamer, Streamer } from "@/hooks/streamer/useStreamer.type";
import { createCrewMemberHistory } from "@/libs/api/services/crew.service";
import {
  createStreamer,
  deleteStreamer,
  getLiveStreamers,
  getStreamers,
  searchStreamers,
  updateStreamer,
} from "@/libs/api/services/streamer.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetStreamers(categoryNames?: string | string[]) {
  return useQuery<Streamer[]>({
    queryKey: ["streamers", { categoryNames }],
    queryFn: () => getStreamers(categoryNames),
  });
}

export function useSearchStreamers(query: string, enabled = false) {
  return useQuery<Streamer[]>({
    queryKey: ["streamers", "search", query],
    queryFn: () => searchStreamers(query),
    enabled: !!query && enabled,
  });
}

export function useGetLiveStreamers() {
  return useQuery<LiveStreamer[]>({
    queryKey: ["liveStreamers"],
    queryFn: () => getLiveStreamers(),
    refetchInterval: 60 * 1000,
  });
}

export function useCreateStreamer(resetForm: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      member,
      history,
    }: {
      member: StreamerFormData;
      history: {
        streamerId?: number;
        crewId: number;
        eventType: "join" | "leave";
        eventDate: string;
        note: string;
        oldRankId?: number;
        newRankId?: number;
      };
    }) => {
      try {
        const response = await createStreamer(member);

        // After creating the member, create the history entry
        if (response && response.id) {
          // Since this is a new member, we need to add its ID to the history
          const historyWithMemberId = {
            ...history,
            streamerId: response.id,
          };

          // Call the API to add history
          await createCrewMemberHistory(historyWithMemberId);
        }

        return response;
      } catch (error: any) {
        console.log("error.response:::", error);
        alert(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streamers"] });
      queryClient.invalidateQueries({ queryKey: ["memberHistories"] });
      resetForm();
    },
  });
}

export function useUpdateStreamer(resetForm: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      member,
      history,
    }: {
      id: number;
      member: StreamerFormData;
      history: {
        streamerId: number;
        crewId: number;
        eventType: "join" | "leave" | "rank_change";
        eventDate: string;
        note: string;
        oldRankId?: number;
        newRankId?: number;
      };
    }) => {
      // Update the member first
      const memberResponse = await updateStreamer(id, member);

      // Then create the history entry
      if (history) {
        await createCrewMemberHistory(history);
      }

      return memberResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streamers"] });
      queryClient.invalidateQueries({ queryKey: ["memberHistories"] });
      resetForm();
    },
  });
}

export function useDeleteStreamer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => deleteStreamer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streamers"] });
    },
  });
}
