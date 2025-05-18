export interface Streamer {
  id: number;
  name: string;
  soopId: string;
  race: string;
  tier: string;
  crew: string;
  rank: string;
}

export interface LiveStreamer {
  thumbnail: string;
  viewCount: number;
  profileUrl: string;
  title: string;
  profileImage: string;
}
