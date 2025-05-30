"use client";

import { useCreateCrewEarning } from "@/hooks/crew/useCrews";
import { useRequireAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface EarningFormProps {
  memberId: number;
  memberName: string;
  onClose: () => void;
}

export default function EarningForm({
  memberId,
  memberName,
  onClose,
}: EarningFormProps) {
  const { user } = useRequireAuth(); // 인증 체크 추가
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // 날짜 제한 계산
  const today = new Date();
  const minDate = new Date(today);
  minDate.setMonth(today.getMonth() - 1);

  const maxDate = today.toISOString().split("T")[0];
  const minimumDate = minDate.toISOString().split("T")[0];

  const { mutate, isPending, error } = useCreateCrewEarning(onClose);
  if (!user) {
    return null;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    mutate({
      member: { id: memberId },
      amount: parseFloat(amount),
      earningDate: date,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {memberName} 별풍선 수익
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="별풍선 개수 입력"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            날짜
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minimumDate}
            max={maxDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            * 현재 날짜 기준 한 달 이내의 날짜만 선택 가능합니다.
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isPending ? "처리 중..." : "등록"}
        </button>
        {error && (
          <p className="text-red-500 text-sm">
            수익 등록에 실패했습니다. 다시 시도해주세요.
          </p>
        )}
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">
              수익을 등록하시겠습니까?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
