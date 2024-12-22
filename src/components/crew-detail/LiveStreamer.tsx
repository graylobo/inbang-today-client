"use client";

import { useLiveStreamers } from "@/hooks/useLiveStreamers";

interface Streamer {
  nickname: string;
  profileImage: string;
  profileUrl: string;
  thumbnail: string;
  title: string;
  viewCount: number;
}

interface LiveStreamerProps {
  crew: any;
}

export default function LiveStreamer({ crew }: LiveStreamerProps) {
  const { streamers, isLoading } = useLiveStreamers();

  if (isLoading) return <div>로딩 중...</div>;
  if (!streamers?.length) return <div>현재 방송 중인 스트리머가 없습니다.</div>;

  // 현재 크루에 속한 스트리머만 필터링
  //   const crewStreamers = streamers.filter((streamer: Streamer) =>
  //     crew.members.some(
  //       (member: any) => member.broadcastUrl === streamer.profileUrl
  //     )
  //   );

  const crewStreamers = streamers;

  if (!crewStreamers.length) {
    return <div>현재 방송 중인 크루원이 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {crewStreamers.map((streamer: Streamer) => (
        <a
          key={streamer.profileUrl}
          href={streamer.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative">
            <img
              src={streamer.thumbnail}
              alt={streamer.title}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
              시청자 {streamer.viewCount.toLocaleString()}명
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={streamer.profileImage}
                alt={streamer.nickname}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-medium">{streamer.nickname}</span>
            </div>
            <h3 className="text-gray-800 font-medium line-clamp-2">
              {streamer.title}
            </h3>
          </div>
        </a>
      ))}
    </div>
  );
}
