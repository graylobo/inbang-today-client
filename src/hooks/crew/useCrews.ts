import { CrewFormData } from "@/app/admin/crews/page";
import { CrewMemberFormData } from "@/app/admin/members/page";
import { SignatureFormData } from "@/app/admin/signatures/page";
import {
  crewEarningsByDateOptions
} from "@/hooks/crew/useCrews.option";
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
  createCrewSignature,
  deleteCrew,
  deleteCrewMember,
  deleteCrewSignature,
  getCrewByID,
  getCrewMembers,
  getCrewRanksByCrewID,
  getCrews,
  getCrewSignatures,
  getCrewsRankings,
  updateCrew,
  updateCrewMember,
  updateCrewSignature,
} from "@/libs/api/services/crew.service";
import { getErrorMessage } from "@/libs/utils/error-handler";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

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
    mutationFn: async (member: CrewMemberFormData) => createCrewMember(member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      resetForm();
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });
}

export function useUpdateCrewMember(resetForm: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      member,
    }: {
      id: number;
      member: CrewMemberFormData;
    }) => updateCrewMember(id, member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
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
