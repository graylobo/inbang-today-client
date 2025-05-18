"use client";

import { useLiveStreamers } from "@/hooks/useLiveStreamers";

interface Streamer {
  nickname: string;
  name: string;
  profileImage: string;
  profileUrl: string;
  thumbnail: string;
  title: string;
  viewCount: number;
}

interface CrewMember {
  id: number;
  name: string;
  soopId?: string;
  rank?: {
    id: number;
    name: string;
    level: number;
  };
}

interface CrewData {
  id: number;
  name: string;
  members: CrewMember[];
}

interface LiveStreamerProps {
  crew: CrewData;
}

export default function LiveStreamer({ crew }: LiveStreamerProps) {
  const { streamers, isLoading, isConnected } = useLiveStreamers(crew?.id);

  if (isLoading) return <div className="dark:text-gray-300">로딩 중...</div>;
  if (!isConnected)
    return <div className="dark:text-gray-300">실시간 업데이트 연결 중...</div>;
  if (!streamers?.length)
    return (
      <div className="dark:text-gray-300">
        현재 방송 중인 스트리머가 없습니다.
      </div>
    );

  const crewStreamers = streamers;

  if (!crewStreamers.length) {
    return (
      <div className="dark:text-gray-300">
        현재 방송 중인 크루원이 없습니다.
      </div>
    );
  }

  // 크루의 대표 스트리머 찾기 (rank.level === 1인 멤버들)
  const representativeMemberIds =
    crew?.members
      ?.filter(
        (member: CrewMember) => member.rank?.level === 1 && member.soopId
      )
      ?.map((member: CrewMember) => member.soopId) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-gray-100">
          실시간 방송
          <span className="text-green-500">({crewStreamers.length}명)</span>
        </h2>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isConnected ? "실시간 연결됨" : "연결 끊김"}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crewStreamers.map((streamer: Streamer) => {
          // 스트리머 ID 추출
          const streamerId = streamer.profileUrl.split("/").pop() || "";
          // 크루 대표인지 확인
          const isRepresentative = representativeMemberIds.includes(streamerId);

          return (
            <a
              key={streamer.profileUrl}
              href={streamer.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:border-gray-600 transition-all relative"
            >
              {isRepresentative && (
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <span className="mr-1 h-2 w-2 bg-white rounded-full animate-pulse"></span>
                  <span>대표</span>
                </div>
              )}
              <div className="relative">
                {streamer.thumbnail ? (
                  <img
                    src={streamer.thumbnail}
                    alt={streamer.title}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800"></div>
                )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  {streamer.viewCount.toLocaleString()}명
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={streamer.profileImage}
                    alt={streamer.nickname}
                    className="w-10 h-10 rounded-full"
                  />

                  <span className="font-medium dark:text-gray-100">
                    {streamer.nickname}
                  </span>
                </div>
                <h3 className="text-gray-800 dark:text-gray-200 font-medium line-clamp-2">
                  {streamer.title}
                </h3>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
