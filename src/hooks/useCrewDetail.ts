import { useQuery } from "@tanstack/react-query";
import { api } from "@/libs/axios";

interface CrewMember {
  id: number;
  name: string;
  rank: {
    id: number;
    name: string;
    level: number;
  };
}

interface CrewDetail {
  id: number;
  name: string;
  description: string;
  members: CrewMember[];
  ranks: {
    id: number;
    name: string;
    level: number;
  }[];
}

export function useCrewDetail(crewId: string) {
  return useQuery<CrewDetail>({
    queryKey: ["crew", crewId],
    queryFn: async () => {
      const { data } = await api.get(`/crews/${crewId}`);
      return data;
    },
  });
}
