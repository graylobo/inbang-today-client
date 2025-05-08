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
  const { streamers, isLoading } = useLiveStreamers(crew?.id);

  if (isLoading) return <div className="dark:text-gray-300">로딩 중...</div>;
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {crewStreamers.map((streamer: Streamer) => (
        <a
          key={streamer.profileUrl}
          href={streamer.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white dark:bg-dark-bg rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:border-gray-600 transition-all"
        >
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
      ))}
    </div>
  );
}
