export interface Streamer {
  id: number;
  name: string;
  nickname: string;
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
  nickname: string;
  title: string;
  profileImage: string;
}
