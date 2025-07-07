import { CrewFormData } from "@/app/admin/crews/page";
import { SignatureFormData } from "@/app/admin/signatures/page";
import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";

export async function getCrews() {
  const data = await apiRequest(API_ROUTES.crews.list);
  return data;
}

export async function getCrewRanksByCrewID(crewId: string) {
  const data = await apiRequest(API_ROUTES.crewRanks.getByCrewId, {
    params: { crewId },
  });
  return data;
}

export async function getCrewsRankings(year: number, month: number) {
  const data = await apiRequest(API_ROUTES.crews.rankings, {
    query: { year, month },
  });
  return data;
}

export async function getCrewByID(crewId: string) {
  const data = await apiRequest(API_ROUTES.crews.getById, {
    params: { crewId },
  });
  return data;
}

export async function getCrewEarningsByDate(
  crewId: string,
  startDate: string,
  endDate: string
) {
  const data = await apiRequest(API_ROUTES.crewEarnings.getByCrewId, {
    params: { crewId },
    query: { startDate, endDate },
  });
  return data;
}

export async function createCrewBroadcastEarning(
  crewId: number,
  totalAmount: number,
  broadcastDate: string,
  description: string,
  broadcastDuration?: number
) {
  const data = await apiRequest(API_ROUTES.crewBroadcasts.create, {
    body: {
      crewId,
      totalAmount,
      broadcastDate,
      description,
      broadcastDuration,
    },
  });
  return data;
}

export async function createCrewEarning(
  member: { id: number },
  amount: number,
  earningDate: string
) {
  const data = await apiRequest(API_ROUTES.crewEarnings.create, {
    body: {
      member,
      amount,
      earningDate,
    },
  });
  return data;
}

export async function createCrew(formData: CrewFormData) {
  const data = await apiRequest(API_ROUTES.crews.create, {
    body: formData,
  });
  return data;
}

export async function updateCrew(id: number, formData: CrewFormData) {
  const data = await apiRequest(API_ROUTES.crews.update, {
    params: { id },
    body: formData,
  });
  return data;
}

export async function deleteCrew(id: number) {
  const data = await apiRequest(API_ROUTES.crews.delete, {
    params: { id },
  });
  return data;
}

export async function getCrewSignatures(crewId: number) {
  const data = await apiRequest(API_ROUTES.crewSignatures.getByCrewId, {
    params: { crewId },
  });
  return data;
}

export async function createCrewSignature(formData: SignatureFormData) {
  const data = await apiRequest(API_ROUTES.crewSignatures.create, {
    body: formData,
  });
  return data;
}

export async function updateCrewSignature(
  id: number,
  formData: SignatureFormData
) {
  const data = await apiRequest(API_ROUTES.crewSignatures.update, {
    params: { id },
    body: formData,
  });
  return data;
}

export async function deleteCrewSignature(id: number) {
  const data = await apiRequest(API_ROUTES.crewSignatures.delete, {
    params: { id },
  });
  return data;
}

// Crew Member History
export interface CrewMemberHistoryData {
  streamerId: number;
  crewId: number;
  eventType: "join" | "leave" | "rank_change";
  eventDate: string;
  note: string;
  oldRankId?: number; // 직급 변경 시 이전 직급
  newRankId?: number; // 직급 변경 시 새 직급
}

export async function createCrewMemberHistory(history: CrewMemberHistoryData) {
  const data = await apiRequest(API_ROUTES.crewMemberHistory.create, {
    body: history,
  });
  return data;
}

export async function updateCrewMemberHistory(
  id: number,
  history: Partial<CrewMemberHistoryData>
) {
  const data = await apiRequest(API_ROUTES.crewMemberHistory.update, {
    params: { id },
    body: history,
  });
  return data;
}

export async function deleteCrewMemberHistory(id: number) {
  const data = await apiRequest(API_ROUTES.crewMemberHistory.delete, {
    params: { id },
  });
  return data;
}

export async function getCrewMemberHistory(streamerId?: number) {
  if (!streamerId) return [];
  const data = await apiRequest(API_ROUTES.crewMemberHistory.get, {
    params: { streamerId },
  });
  return data;
}

export async function removeCrewMember(id: number) {
  const data = await apiRequest(API_ROUTES.streamers.removeFromCrew, {
    params: { id },
  });
  return data;
}

export async function updateCrewSignatureOverviewImageUrl(
  id: number,
  imageUrl: string
) {
  const data = await apiRequest(API_ROUTES.crews.updateSignatureOverviewImageUrl, {
    params: { id },
    body: { imageUrl },
  });
  return data;
}
