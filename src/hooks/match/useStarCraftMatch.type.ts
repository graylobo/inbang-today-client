export interface StarCraftMatchQuery {
  streamerId: number;
  startDate?: string;
  endDate?: string;
}

export interface OpponentStats {
  opponent: {
    id: number;
    name: string;
    race: string;
  };
  wins: number;
  losses: number;
  totalGames: number;
  winRate: number;
}


export interface StarCraftMatch {
  streamer: {
    totalGames: number;
    wins: number;
    losses: number;
    winRate: number;
  };
  opponents: OpponentStats[];
}