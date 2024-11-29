"use server";
import { api } from "@/libs/api/axios";

export async function getCrewsRankings(year: number, month: number) {
  const { data } = await api.get(`/crews/rankings?year=${year}&month=${month}`);
  return data;
}
