"use server";

import { CrewFormData } from "@/app/admin/crews/page";
import { CrewMemberFormData } from "@/app/admin/members/page";
import { api } from "@/libs/api/axios";

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
  description: string
) {
  const { data } = await api.post("/crew-broadcasts", {
    crewId,
    totalAmount,
    broadcastDate,
    description,
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

export async function getCrewMembers() {
  const { data } = await api.get("/crew-members");
  return data;
}

export async function createCrewMember(member: CrewMemberFormData) {
  const { data } = await api.post("/crew-members", member);
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
