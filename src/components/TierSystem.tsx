"use client";

import { EloRanking } from "@/hooks/elo-ranking/useEloRanking";
import { TierType, calculateTiers } from "@/utils/tierCalculator";
import StreamerCard from "@/components/streaming/StreamerCard";
import { Dispatch, RefObject, SetStateAction, useMemo, useRef } from "react";

interface TierSystemProps {
  rankings: EloRanking[];
  month: string;
  opponents: any;
  selectedStreamer: number | null;
  setSelectedStreamer: Dispatch<SetStateAction<number | null>>;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  streamerGridRef: RefObject<HTMLDivElement>;
  showOnlyLive: boolean;
  showOnlyMatched: boolean;
}

export default function TierSystem({
  rankings,
  month,
  opponents,
  selectedStreamer,
  setSelectedStreamer,
  dateRange,
  streamerGridRef,
  showOnlyLive,
  showOnlyMatched,
}: TierSystemProps) {
  const tieredRankings = useMemo(() => {
    return calculateTiers(rankings);
  }, [rankings]);

  // Filter players based on showOnlyMatched
  const filteredRankings = useMemo(() => {
    if (!showOnlyMatched || !selectedStreamer || !opponents) {
      return tieredRankings;
    }

    return tieredRankings.filter((player) => {
      // Always include the selected streamer
      if (player.id === selectedStreamer) {
        return true;
      }

      // Check if this player has a match with the selected streamer
      return opponents.some((match: any) => match.opponent.id === player.id);
    });
  }, [tieredRankings, showOnlyMatched, selectedStreamer, opponents]);

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

    filteredRankings.forEach((player) => {
      groups[player.calculatedTier].push(player);
    });

    return groups;
  }, [filteredRankings]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">{month} 계급 랭킹</h2>

      {/* Tier system explanation */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold text-lg mb-2">계급 분포 시스템</h3>
        <p className="text-sm">
          • 주: 상위 9명 (고정)
          <br />
          • 갑: 상위 3%
          <br />
          • 을: 상위 5%
          <br />
          • 병: 상위 7%
          <br />
          • 정: 상위 10%
          <br />
          • 무: 상위 15%
          <br />
          • 기: 상위 18%
          <br />
          • 경: 상위 17%
          <br />
          • 신: 상위 13%
          <br />
          • 임: 상위 8%
          <br />• 계: 상위 4%
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
                {tier} ({players.length}명)
              </span>
            </div>

            <div
              className="grid gap-[10px] p-4 bg-gray-100 rounded-b-lg"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              }}
            >
              {players.map((player) => (
                <div key={player.id} className="relative">
                  {/* Add tier badge to the corner */}
                  <div
                    className="absolute top-2 right-2 z-10 px-2 py-1 rounded text-sm text-white font-bold"
                    style={{ backgroundColor: player.tierColor }}
                  >
                    {player.calculatedTier}
                  </div>

                  {/* Use the existing StreamerCard component with all props */}
                  <StreamerCard
                    streamer={{
                      id: player.id,
                      name: player.name,
                      soopId: player.soopId,
                      race: player.race,
                      tier: player.tier,
                      gender: player.gender,
                      // Add required structure for StreamerCard
                      crew: { id: 0, name: "" },
                      rank: { id: 0, name: "" },
                    }}
                    opponents={opponents}
                    selectedStreamer={selectedStreamer}
                    setSelectedStreamer={setSelectedStreamer}
                    dateRange={dateRange}
                    streamerGridRef={streamerGridRef}
                    showOnlyLive={showOnlyLive}
                  />

                  {/* ELO point display */}
                  <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md flex justify-between">
                    <span>Rank {player.rank}</span>
                    <span className="font-bold">
                      {Math.round(player.eloPoint)}p
                    </span>
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
