import {
  useGetLiveStreamers,
  useGetStreamers,
} from "@/hooks/streamer/useStreamer";
import { getLiveStreamers } from "@/libs/api/services/streamer.service";
import Image from "next/image";
import React from "react";

function StarTier() {
  const { data: streamers } = useGetStreamers();
  const { data: liveStreamers } = useGetLiveStreamers();
  // 종족별 배경색 설정
  const getRaceColor = (race: string) => {
    switch (race?.toLowerCase()) {
      case "protoss":
        return "bg-[#FF6B00]"; // 주황색
      case "terran":
        return "bg-[#304C89]"; // 파란색
      case "zerg":
        return "bg-[#8B00FF]"; // 보라색
      default:
        return "bg-gray-600";
    }
  };

  console.log("liveStreamers", liveStreamers);
  // 스트리머가 현재 라이브 중인지 확인하는 함수
  const isStreamerLive = (soopId: string) => {
    return liveStreamers?.some((live) => live.profileUrl.includes(soopId));
  };

  const getLiveStreamInfo = (soopId: string) => {
    return liveStreamers?.find((live) => live.profileUrl.includes(soopId));
  };

  return (
    <div className="grid grid-cols-6 gap-4 p-4">
      {streamers?.map((streamer) => {
        const liveInfo = getLiveStreamInfo(streamer.soopId);

        return (
          <div
            key={streamer.id}
            className={`relative rounded-lg overflow-hidden ${getRaceColor(
              streamer.race
            )} group`}
          >
            {/* Image Container */}
            <div className="relative aspect-square">
              <Image
                src={`https://profile.img.sooplive.co.kr/LOGO/${streamer.soopId?.slice(
                  0,
                  2
                )}/${streamer.soopId}/${streamer.soopId}.jpg`}
                alt={streamer.name}
                fill
                className="object-cover"
              />

              {/* Large Preview Modal - Only shows when streamer is live and on hover */}
              {liveInfo && (
                <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div
                    className="bg-black rounded-lg overflow-hidden shadow-2xl"
                    style={{ width: "800px" }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative w-full"
                      style={{ height: "450px" }}
                    >
                      <Image
                        src={liveInfo.thumbnail}
                        alt="Stream thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Stream Info */}
                    <div className="p-4 bg-black bg-opacity-90">
                      <h3 className="text-white font-bold text-xl mb-2">
                        {liveInfo.title}
                      </h3>
                      <div className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-lg">
                          {liveInfo.viewCount.toLocaleString()} 시청
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div
              className={`flex items-center p-2 ${getRaceColor(
                streamer.race
              )} text-white`}
            >
              <div className="flex-1">
                <div className="font-bold">{streamer.name}</div>
                <div className="text-sm opacity-75">{streamer.tier}</div>
              </div>
              {liveInfo && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                  LIVE
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StarTier;
