import { CrewFormData } from "@/app/admin/crews/page";
import { SignatureFormData } from "@/hooks/crew/useSignatureManager";
import { crewEarningsByDateOptions } from "@/hooks/crew/useCrews.option";
import {
  Crew,
  CrewDetail,
  CrewSignature,
  DailyEarningResponse,
} from "@/hooks/crew/useCrews.type";
import {
  createCrew,
  createCrewBroadcastEarning,
  createCrewEarning,
  createCrewSignature,
  deleteCrew,
  deleteCrewSignature,
  getCrewByID,
  getCrewMemberHistory,
  getCrewRanksByCrewID,
  getCrews,
  getCrewSignatures,
  getCrewsRankings,
  removeCrewMember,
  updateCrew,
  updateCrewSignature,
  updateCrewSignatureOverviewImageUrl,
} from "@/libs/api/services/crew.service";
import { getErrorMessage } from "@/libs/utils/error-handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useGetCrews() {
  const router = useRouter();

  const query = useQuery<Crew[]>({
    queryKey: ["crews"],
    queryFn: () => getCrews(),
    retry: false, // 에러 시 재시도 안함
  });

  // useMutation의 onError처럼 에러 처리
  useEffect(() => {
    if (query.error) {
      const error = query.error as any;
      alert(getErrorMessage(error?.response?.data?.errorCode || error));
      router.push("/");
    }
  }, [query.error, router]);

  return query;
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
  return useQuery<CrewSignature[]>({
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
    onError: (error: any) => {
      // 서버에서 오는 중복 에러 처리
      const errorMessage = error?.response?.data?.message || error?.message;
      if (
        errorMessage?.includes("별풍선") &&
        errorMessage?.includes("시그니처가 존재")
      ) {
        alert(errorMessage);
      } else {
        alert(getErrorMessage(error));
      }
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
    onError: (error: any) => {
      // 서버에서 오는 중복 에러 처리
      const errorMessage = error?.response?.data?.message || error?.message;
      if (
        errorMessage?.includes("별풍선") &&
        errorMessage?.includes("시그니처가 존재")
      ) {
        alert(errorMessage);
      } else {
        alert(getErrorMessage(error));
      }
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

export function useUpdateCrewSignatureOverviewImageUrl(resetForm?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, imageUrl }: { id: number; imageUrl: string }) => {
      return await updateCrewSignatureOverviewImageUrl(id, imageUrl);
    },
    onSuccess: (data, variables) => {
      // 전체 크루 목록 무효화
      queryClient.invalidateQueries({ queryKey: ["crews"] });
      // 개별 크루 정보 무효화 (variables.id가 crewId)
      queryClient.invalidateQueries({
        queryKey: ["crew", variables.id.toString()],
      });
      if (resetForm) resetForm();
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });
}
