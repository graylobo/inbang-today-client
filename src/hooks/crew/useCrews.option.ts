import {
  getCrewByID,
  getCrewEarningsByDate,
  getCrewsRankings,
} from "@/libs/api/services/crew.service";

export function crewsRankingsOptions(year: number, month: number) {
  return {
    queryKey: ["crews", "rankings", year, month],
    queryFn: () => getCrewsRankings(year, month),
  };
}

export function crewDetailOptions(crewId: string) {
  return {
    queryKey: ["crew", crewId],
    queryFn: () => getCrewByID(crewId),
  };
}

export function crewEarningsByDateOptions(
  crewId: string,
  year: number,
  month: number
) {
  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];
  return {
    queryKey: ["earnings", crewId, year, month],
    queryFn: () => getCrewEarningsByDate(crewId, startDate, endDate),
  };
}
