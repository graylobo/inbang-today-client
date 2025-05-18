"use server";

import { CrewFormData } from "@/app/admin/crews/page";
import { StreamerFormData } from "@/app/admin/members/page";
import { SignatureFormData } from "@/app/admin/signatures/page";
import { apiRequest } from "@/libs/api/api-request";
import { api } from "@/libs/api/axios";
import { API_ROUTES } from "@/libs/api/route";

export async function getCrews() {
  const { data } = await api.get("/crews");
  return data;
}

export async function getCrewRanksByCrewID(crewId: string) {
  const { data } = await api.get(`/crew-ranks/crew/${crewId}`);
  return data;
}

export async function getCrewsRankings(year: number, month: number) {
  const { data } = await api.get(`/crews/rankings?year=${year}&month=${month}`);
  return data;
}

export async function getCrewByID(crewId: string) {
  const { data } = await api.get(`/crews/${crewId}`);
  return data;
}

export async function getCrewEarningsByDate(
  crewId: string,
  startDate: string,
  endDate: string
) {
  const { data } = await api.get(
    `/crew-earnings/crew/${crewId}?startDate=${startDate}&endDate=${endDate}`
  );
  return data;
}

export async function createCrewBroadcastEarning(
  crewId: number,
  totalAmount: number,
  broadcastDate: string,
  description: string,
  broadcastDuration?: number
) {
  const { data } = await api.post("/crew-broadcasts", {
    crewId,
    totalAmount,
    broadcastDate,
    description,
    broadcastDuration,
  });
  return data;
}

export async function createCrewEarning(
  member: { id: number },
  amount: number,
  earningDate: string
) {
  const { data } = await api.post("/crew-earnings", {
    member,
    amount,
    earningDate,
  });
  return data;
}


export async function createCrew(formData: CrewFormData) {
  const { data } = await api.post("/crews", formData);
  return data;
}

export async function updateCrew(id: number, formData: CrewFormData) {
  const { data } = await api.put(`/crews/${id}`, formData);
  return data;
}

export async function deleteCrew(id: number) {
  const { data } = await api.delete(`/crews/${id}`);
  return data;
}

export async function getCrewSignatures(crewId: number) {
  const { data } = await api.get(`/crew-signatures/crew/${crewId}`);
  return data;
}

export async function createCrewSignature(formData: SignatureFormData) {
  const { data } = await api.post("/crew-signatures", formData);
  return data;
}

export async function updateCrewSignature(
  id: number,
  formData: SignatureFormData
) {
  const { data } = await api.put(`/crew-signatures/${id}`, formData);
  return data;
}

export async function deleteCrewSignature(id: number) {
  const { data } = await api.delete(`/crew-signatures/${id}`);
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
  const { data } = await api.post(`/streamers/${id}/remove-from-crew`);
  return data;
}
