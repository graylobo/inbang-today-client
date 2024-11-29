"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api/axios";

interface BroadcastEarningFormProps {
  crewId: number;
  onClose: () => void;
}

export default function BroadcastEarningForm({
  crewId,
  onClose,
}: BroadcastEarningFormProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/crew-broadcasts", {
        crewId,
        totalAmount: parseFloat(amount),
        broadcastDate: date,
        description,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
      queryClient.invalidateQueries({ queryKey: ["crew"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          방송 수익
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300"
          placeholder="수익 금액"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          방송 날짜
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300"
          placeholder="방송 내용이나 특이사항을 입력하세요"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        {isPending ? "처리 중..." : "수익 등록"}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">
              수익을 등록하시겠습니까?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
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
