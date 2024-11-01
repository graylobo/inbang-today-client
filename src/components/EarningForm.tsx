"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface EarningFormProps {
  memberId: number;
  memberName: string;
}

export default function EarningForm({
  memberId,
  memberName,
}: EarningFormProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/crew-earnings", {
        member: { id: memberId },
        amount: parseFloat(amount),
        earningDate: date,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crew-earnings"] });
      setAmount("");
      setDate("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {memberName}의 수익
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="수익 금액"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">날짜</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isPending ? "처리 중..." : "수익 등록"}
      </button>
      {error && (
        <p className="text-red-500 text-sm">
          수익 등록에 실패했습니다. 다시 시도해주세요.
        </p>
      )}
    </form>
  );
}
