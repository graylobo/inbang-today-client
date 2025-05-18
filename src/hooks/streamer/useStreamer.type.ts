export interface Streamer {
  id: number;
  name: string;
  soopId: string;
  race: string;
  tier: string;
  crew: {
    id: number;
    name: string;
  };
  rank: {
    id: number;
    name: string;
  };
}

export interface LiveStreamer {
  thumbnail: string;
  viewCount: number;
  profileUrl: string;
  title: string;
  profileImage: string;
}
