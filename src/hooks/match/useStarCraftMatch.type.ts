export interface StarCraftMatchQuery {
  streamerId: number;
  startDate?: string;
  endDate?: string;
}

export interface StarCraftMatch {
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
