import LiveScreen from "@/components/streaming/LiveScreen";
import { useStarCraftMatch } from "@/hooks/match/useStarCraftMatch";
import { useGetLiveStreamers } from "@/hooks/streamer/useStreamer";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";

function StreamerCard({
  streamer,
  opponents,
  selectedStreamer,
  setSelectedStreamer,
  dateRange,
  streamerGridRef,
  showOnlyLive,
}: {
  streamer: any;
  opponents: any;
  selectedStreamer: any;
  setSelectedStreamer: any;
  dateRange: any;
  streamerGridRef: any;
  showOnlyLive: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [liveScreenPosition, setLiveScreenPosition] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
  }>({});
  const { data: liveStreamers } = useGetLiveStreamers();
  const { data } = useStarCraftMatch(
    selectedStreamer
      ? {
          streamerId: selectedStreamer,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }
      : null
  );

  useEffect(() => {
    const calculatePosition = () => {
      if (!cardRef.current || !streamerGridRef.current) return;

      const cardRect = cardRef.current.getBoundingClientRect();
      const streamerGridRect = streamerGridRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const liveScreenWidth = 500; // LiveScreen의 고정 너비

      // LiveScreen의 중심을 카드의 중심과 일치시키기 위한 계산
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const idealLeft = cardCenterX - liveScreenWidth / 2;

      // streamerGridRef의 경계 설정
      const minLeft = streamerGridRect.left;
      const maxLeft = streamerGridRect.right - liveScreenWidth;

      // 경계를 벗어나지 않도록 left 값 조정
      const adjustedLeft = Math.max(minLeft, Math.min(maxLeft, idealLeft));

      // 카드의 상단이 뷰포트의 상단에서 얼마나 떨어져 있는지
      const distanceFromTop = cardRect.top;
      // 카드의 하단이 뷰포트의 하단에서 얼마나 떨어져 있는지
      const distanceFromBottom = viewportHeight - cardRect.bottom;

      // 위쪽과 아래쪽 중 더 많은 공간이 있는 쪽에 LiveScreen 배치
      if (distanceFromTop > distanceFromBottom) {
        setLiveScreenPosition({
          bottom: viewportHeight - cardRect.top,
          left: adjustedLeft,
        });
      } else {
        setLiveScreenPosition({
          top: cardRect.bottom,
          left: adjustedLeft,
        });
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", calculatePosition);
    window.addEventListener("resize", calculatePosition);

    // 초기 위치 계산
    calculatePosition();

    // 클린업 함수
    return () => {
      window.removeEventListener("scroll", calculatePosition);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [showOnlyLive, selectedStreamer, isHovered]);

  useEffect(() => {
    // 위치가 변경될 때마다 위치 재계산
    const calculatePosition = () => {
      if (!cardRef.current || !streamerGridRef.current) return;
      const cardRect = cardRef.current.getBoundingClientRect();
      const streamerGridRect = streamerGridRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const liveScreenWidth = 500;

      const cardCenterX = cardRect.left + cardRect.width / 2;
      const idealLeft = cardCenterX - liveScreenWidth / 2;

      const minLeft = streamerGridRect.left;
      const maxLeft = streamerGridRect.right - liveScreenWidth;

      const adjustedLeft = Math.max(minLeft, Math.min(maxLeft, idealLeft));

      const distanceFromTop = cardRect.top;
      const distanceFromBottom = viewportHeight - cardRect.bottom;

      if (distanceFromTop > distanceFromBottom) {
        setLiveScreenPosition({
          bottom: viewportHeight - cardRect.top,
          left: adjustedLeft,
        });
      } else {
        setLiveScreenPosition({
          top: cardRect.bottom,
          left: adjustedLeft,
        });
      }
    };

    calculatePosition();
  }, [selectedStreamer, streamer.id]);

  const getLiveStreamInfo = (soopId: string) => {
    return liveStreamers?.find((live) => live.profileUrl.includes(soopId));
  };

  const liveInfo = getLiveStreamInfo(streamer.soopId);
  const matchInfo = opponents?.find(
    (match: any) => match.opponent.id === streamer.id
  );
  const isSelected = selectedStreamer === streamer.id;
  return (
    <>
      {/* Large Preview Modal - Only shows when streamer is live and on hover */}
      {liveInfo && isHovered && (
        <LiveScreen liveInfo={liveInfo} position={liveScreenPosition} />
      )}
      <div
        ref={cardRef}
        key={streamer.id}
        onClick={() => setSelectedStreamer(isSelected ? null : streamer.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-full rounded-lg overflow-hidden ${getRaceColor(
          streamer.race
        )} cursor-pointer transition-all duration-200
        ${selectedStreamer && !isSelected && !matchInfo ? "opacity-40" : ""}
        ${isSelected ? "ring-4 ring-yellow-400 transform scale-105" : ""}`}
      >
        {/* Image Container */}
        <div className="relative aspect-square">
          <Image
            src={`https://profile.img.sooplive.co.kr/LOGO/${streamer.soopId?.slice(
              0,
              2
            )}/${streamer.soopId}/${streamer.soopId}.jpg`}
            alt={streamer.name}
            width={150}
            height={150}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Footer Info */}
        <div className={`p-2 ${getRaceColor(streamer.race)} text-white`}>
          <div className="flex items-center justify-between">
            <div className="font-bold text-nowrap">{streamer.name}</div>
            <div className="flex items-center gap-2">
              {liveInfo && (
                <span
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded cursor-pointer hover:bg-red-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 클릭 이벤트 방지
                    window.open(
                      `https://play.sooplive.co.kr/${streamer.soopId}`,
                      "_blank"
                    );
                  }}
                >
                  LIVE
                </span>
              )}
              {isSelected && streamer.soopId && (
                <Image
                  src="/common/soop-logo.png"
                  alt="Soop Channel"
                  width={20}
                  height={20}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 클릭 이벤트 방지
                    window.open(
                      `https://ch.sooplive.co.kr/${streamer.soopId}`,
                      "_blank"
                    );
                  }}
                />
              )}
            </div>
          </div>
          <div className="text-sm opacity-75">{streamer.tier}</div>
          {matchInfo ? (
            <div className="mt-1 space-y-1">
              <div className="text-xs bg-black bg-opacity-30 p-1 rounded">
                {matchInfo.wins}승 {matchInfo.losses}패 (
                {Math.round(matchInfo.winRate)}%)
              </div>
              <div className="h-1.5 bg-gray-200 rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    matchInfo.winRate === 100
                      ? "bg-blue-500"
                      : matchInfo.winRate >= 50
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${matchInfo.winRate}%` }}
                />
              </div>
            </div>
          ) : isSelected && data?.streamer ? (
            <div className="mt-1 space-y-1">
              <div className="text-xs bg-black bg-opacity-30 p-1 rounded">
                {data.streamer.wins}승 {data.streamer.losses}패 (
                {Math.round(data.streamer.winRate)}%)
              </div>
              <div className="h-1.5 bg-gray-200 rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    data.streamer.winRate === 100
                      ? "bg-blue-500"
                      : data.streamer.winRate >= 50
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${data.streamer.winRate}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default StreamerCard;

// 종족별 배경색 설정
const getRaceColor = (race: string) => {
  switch (race?.toLowerCase()) {
    case "protoss":
      return "bg-[#FF6B00]";
    case "terran":
      return "bg-[#304C89]";
    case "zerg":
      return "bg-[#8B00FF]";
    default:
      return "bg-gray-600";
  }
};
