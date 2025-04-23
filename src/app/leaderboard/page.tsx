import { useState } from "react";
import { useLeaderboard } from "@/api-hooks/rank.hooks";

const PERIODS = ["daily", "weekly", "monthly"] as const;
type Period = (typeof PERIODS)[number];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("weekly");
  const { data: leaderboard, isLoading } = useLeaderboard(period);

  return (
    <div className="container max-w-3xl mx-auto p-4 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">전체 리더보드</h1>
          <div className="flex space-x-2">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded ${
                  period === p
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {p === "daily" ? "일간" : p === "weekly" ? "주간" : "월간"}
              </button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <div>로딩 중...</div>
        ) : leaderboard?.data && leaderboard.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    순위
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    닉네임
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    랭크
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    포인트
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.data.map((entry, idx) => (
                  <tr key={entry.userId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.rank} ({entry.rankCategory})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>리더보드 데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
