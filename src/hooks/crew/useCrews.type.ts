import { Streamer } from "@/hooks/streamer/useStreamer.type";

export interface Crew {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  signatureOverviewImageUrl?: string;
  members: {
    id: number;
    name: string;
    rank: {
      id: number;
      name: string;
      level: number;
    };
  }[];
}

export interface CrewDetail {
  id: number;
  name: string;
  description: string;
  signatureOverviewImageUrl?: string;
  members: Streamer[];
  ranks: {
    id: number;
    name: string;
    level: number;
  }[];
}

interface CrewMemberEarning {
  id: number;
  amount: number;
  earningDate: string;
  submittedBy: {
    name: string;
  };
  member: {
    id: number;
    name: string;
    rank: {
      name: string;
      level: number;
    };
  };
}

export interface DailyEarningResponse {
  date: string;
  totalAmount: number;
  earnings: CrewMemberEarning[];
  broadcastEarning?: {
    totalAmount: number;
    description: string;
    broadcastDuration: number;
    submittedBy: {
      id: number;
      name: string;
    };
  };
}
