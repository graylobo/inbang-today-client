import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api/axios";
import {
  createCrewBroadcastEarning,
  createCrewEarning,
  getCrewDetail,
  getCrewEarningsByDate,
  getCrewsRankings,
} from "@/libs/api/services/crew.service";
import {
  Crew,
  CrewDetail,
  DailyEarningResponse,
} from "@/hooks/crew/useCrews.type";

export function useCrewsRankings(year: number, month: number) {
  return useQuery<Crew[]>({
    queryKey: ["crews", "rankings", year, month],
    queryFn: () => getCrewsRankings(year, month),
  });
}

export function useCrewDetail(crewId: string) {
  return useQuery<CrewDetail>({
    queryKey: ["crew", crewId],
    queryFn: () => getCrewDetail(crewId),
  });
}

export function useCrewEarningsByDate(
  crewId: string,
  year: number,
  month: number
) {
  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];
  return useQuery<DailyEarningResponse[]>({
    queryKey: ["earnings", crewId, startDate, endDate],
    queryFn: () => getCrewEarningsByDate(crewId, startDate, endDate),
  });
}

export function useCreateCrewBroadcastEarning(onClose: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      crewId,
      totalAmount,
      broadcastDate,
      description,
    }: {
      crewId: number;
      totalAmount: number;
      broadcastDate: string;
      description: string;
    }) => {
      const { data } = await createCrewBroadcastEarning(
        crewId,
        totalAmount,
        broadcastDate,
        description
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
      queryClient.invalidateQueries({ queryKey: ["crew"] });
      onClose();
    },
  });
}

export function useCreateCrewEarning(onClose: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      member,
      amount,
      earningDate,
    }: {
      member: { id: number };
      amount: number;
      earningDate: string;
    }) => {
      const { data } = await createCrewEarning(member.id, amount, earningDate);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
      queryClient.invalidateQueries({ queryKey: ["crew"] });
      onClose();
    },
  });
}
