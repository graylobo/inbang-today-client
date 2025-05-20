"use client";

import { EloRanking } from "@/hooks/elo-ranking/useEloRanking";
import { TierType, calculateTiers } from "@/utils/tierCalculator";
import Image from "next/image";
import { useMemo } from "react";

interface TierSystemProps {
  rankings: EloRanking[];
  month: string;
}

export default function TierSystem({ rankings, month }: TierSystemProps) {
  const tieredRankings = useMemo(() => {
    return calculateTiers(rankings);
  }, [rankings]);

  // Group by tier
  const groupedByTier = useMemo(() => {
    const groups: Record<TierType, typeof tieredRankings> = {
      주: [],
      갑: [],
      을: [],
      병: [],
      정: [],
      무: [],
      기: [],
      경: [],
      신: [],
      임: [],
      계: [],
    };

    tieredRankings.forEach((player) => {
      groups[player.calculatedTier].push(player);
    });

    return groups;
  }, [tieredRankings]);

  // Get race color for background
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">{month} 계급 랭킹</h2>

      {/* Tier system explanation */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold text-lg mb-2">계급 분포 시스템</h3>
        <p className="text-sm">
          • 주 계급: 상위 9명 (고정)
          <br />
          • 갑 계급: 상위 3%
          <br />
          • 을 계급: 상위 5%
          <br />
          • 병 계급: 상위 7%
          <br />
          • 정 계급: 상위 10%
          <br />
          • 무 계급: 상위 15%
          <br />
          • 기 계급: 상위 18%
          <br />
          • 경 계급: 상위 17%
          <br />
          • 신 계급: 상위 13%
          <br />
          • 임 계급: 상위 8%
          <br />• 계 계급: 상위 4%
        </p>
      </div>

      {/* Tiers display */}
      {Object.entries(groupedByTier).map(([tier, players]) => {
        if (players.length === 0) return null;

        return (
          <div key={tier} className="mb-8">
            <div
              className="text-xl font-bold py-2 px-4 rounded-t-lg"
              style={{ backgroundColor: players[0]?.tierColor || "#333" }}
            >
              <span className="text-white">
                {tier} 계급 ({players.length}명)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 bg-gray-100 rounded-b-lg">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`${getRaceColor(
                    player.race
                  )} rounded-lg overflow-hidden shadow-md`}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={`https://profile.img.sooplive.co.kr/LOGO/${player.id
                        .toString()
                        .slice(0, 2)}/${player.id}/${player.id}.jpg`}
                      alt={player.name}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Use a data URI as fallback image
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='%23666666'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>

                  <div className="p-3 text-white">
                    <div className="flex items-center justify-between">
                      <div className="font-bold">{player.name}</div>
                      <div className="text-xs px-2 py-1 bg-black bg-opacity-30 rounded">
                        Rank {player.rank}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm opacity-90">{player.race}</div>
                      <div className="font-medium">
                        {Math.round(player.eloPoint)}p
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
