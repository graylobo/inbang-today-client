import { CrewFormData } from "@/app/admin/crews/page";
import { CrewMemberFormData } from "@/app/admin/members/page";
import { SignatureFormData } from "@/app/admin/signatures/page";
import { crewEarningsByDateOptions } from "@/hooks/crew/useCrews.option";
import {
  Crew,
  CrewDetail,
  CrewMember,
  DailyEarningResponse,
} from "@/hooks/crew/useCrews.type";
import {
  createCrew,
  createCrewBroadcastEarning,
  createCrewEarning,
  createCrewMember,
  createCrewMemberHistory,
  createCrewSignature,
  deleteCrew,
  deleteCrewMember,
  deleteCrewSignature,
  getCrewByID,
  getCrewMemberHistory,
  getCrewMembers,
  getCrewRanksByCrewID,
  getCrews,
  getCrewSignatures,
  getCrewsRankings,
  removeCrewMember,
  updateCrew,
  updateCrewMember,
  updateCrewSignature,
} from "@/libs/api/services/crew.service";
import { getErrorMessage } from "@/libs/utils/error-handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetCrews() {
  return useQuery<Crew[]>({
    queryKey: ["crews"],
    queryFn: () => getCrews(),
  });
}

export function useGetCrewRanksByCrewID(crewId: string) {
  return useQuery({
    queryKey: ["ranks", crewId],
    queryFn: () => getCrewRanksByCrewID(crewId),
  });
}

export function useCrewsRankings(year: number, month: number) {
  return useQuery<Crew[]>({
    queryKey: ["crews", "rankings", year, month],
    queryFn: () => getCrewsRankings(year, month),
  });
}

export function useGetCrewByID(crewId: string) {
  return useQuery<CrewDetail>({
    queryKey: ["crew", crewId],
    queryFn: () => getCrewByID(crewId),
  });
}

export function useCrewEarningsByDate(
  crewId: string,
  year: number,
  month: number
) {
  return useQuery<DailyEarningResponse[]>(
    crewEarningsByDateOptions(crewId, year, month)
  );
}

export function useCreateCrewBroadcastEarning(onClose: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      crewId,
      totalAmount,
      broadcastDate,
      description,
      broadcastDuration,
    }: {
      crewId: number;
      totalAmount: number;
      broadcastDate: string;
      description: string;
      broadcastDuration?: number;
    }) => {
      const data = await createCrewBroadcastEarning(
        crewId,
        totalAmount,
        broadcastDate,
        description,
        broadcastDuration
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
      queryClient.invalidateQueries({ queryKey: ["crew"] });
      queryClient.invalidateQueries({ queryKey: ["points"] });
      onClose();

      if (data.pointsAwarded) {
        alert(
          `방송 수익이 등록되었습니다. ${data.pointsAwarded}포인트가 적립되었습니다.`
        );
      }
    },
    onError: (error) => {
      alert(getErrorMessage(error));
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
      const { data } = await createCrewEarning(member, amount, earningDate);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
      queryClient.invalidateQueries({ queryKey: ["crew"] });
      onClose();
    },
  });
}

export function useGetCrewMembers() {
  return useQuery<CrewMember[]>({
    queryKey: ["members"],
    queryFn: () => getCrewMembers(),
  });
}

export function useCreateCrewMember(resetForm: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      member,
      history,
    }: {
      member: CrewMemberFormData;
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
        const response = await createCrewMember(member);

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
      queryClient.invalidateQueries({ queryKey: ["crewMembers"] });
      queryClient.invalidateQueries({ queryKey: ["memberHistories"] });
      resetForm();
    },
  });
}

export function useUpdateCrewMember(resetForm: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      member,
      history,
    }: {
      id: number;
      member: CrewMemberFormData;
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
      const memberResponse = await updateCrewMember(id, member);

      // Then create the history entry
      if (history) {
        await createCrewMemberHistory(history);
      }

      return memberResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["memberHistories"] });
      resetForm();
    },
  });
}

export function useDeleteCrewMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => deleteCrewMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useCreateCrew(resetForm: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: CrewFormData) => createCrew(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crews"] });
      resetForm();
    },
    onError: (error) => {
      if (error.message === "CONFLICT") {
        alert("크루 이름이 중복되었습니다.");
      }
    },
  });
}

export function useUpdateCrew(resetForm: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number;
      formData: CrewFormData;
    }) => updateCrew(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crews"] });
      resetForm();
    },
  });
}

export function useDeleteCrew() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => deleteCrew(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crews"] });
    },
  });
}

export function useGetCrewSignatures(crewId: number) {
  return useQuery({
    queryKey: ["signatures", crewId],
    queryFn: () => getCrewSignatures(crewId),
  });
}

export function useCreateCrewSignature(resetForm: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: SignatureFormData) =>
      createCrewSignature(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signatures"] });
      resetForm();
    },
  });
}

export function useUpdateCrewSignature(resetForm: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number;
      formData: SignatureFormData;
    }) => updateCrewSignature(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signatures"] });
      resetForm();
    },
  });
}

export function useDeleteCrewSignature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => deleteCrewSignature(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signatures"] });
    },
  });
}

export function useGetCrewMemberHistory(streamerId?: number) {
  return useQuery({
    queryKey: ["memberHistories", streamerId],
    queryFn: () => getCrewMemberHistory(streamerId),
    enabled: !!streamerId,
  });
}

export function useRemoveCrewMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      // Call API to remove the member from their crew
      return await removeCrewMember(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}
