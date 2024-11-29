"use server";

import { api } from "@/libs/api/axios";

export async function getCrewsRankings(year: number, month: number) {
  const { data } = await api.get(`/crews/rankings?year=${year}&month=${month}`);
  return data;
}

export async function getCrewDetail(crewId: string) {
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
