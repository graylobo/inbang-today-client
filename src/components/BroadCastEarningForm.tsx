"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api/axios";
import { useCreateCrewBroadcastEarning } from "@/hooks/crew/useCrews";

interface BroadcastEarningFormProps {
  crewId: number;
  onClose: () => void;
}

export default function BroadcastEarningForm({
  crewId,
  onClose,
}: BroadcastEarningFormProps) {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setMonth(today.getMonth() - 1);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const maxDate = today.toISOString().split("T")[0];
  const minimumDate = minDate.toISOString().split("T")[0];
  const { mutate, isPending } = useCreateCrewBroadcastEarning(onClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    mutate({
      crewId,
      totalAmount: parseFloat(amount),
      broadcastDate: date,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          별풍선 개수
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          placeholder="수익 금액"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          방송 날짜
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
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          설명
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          placeholder="방송 내용이나 특이사항을 입력하세요"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
      >
        {isPending ? "처리 중..." : "수익 등록"}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 dark:text-gray-100">
              수익을 등록하시겠습니까?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
