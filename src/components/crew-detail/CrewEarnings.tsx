"use client";

import BroadcastEarningForm from "@/components/BroadCastEarningForm";
import Modal from "@/components/common/Modal";
import EarningHistory from "@/components/EarningHistory";
import { useState } from "react";

export default function CrewEarnings({ crewId }: { crewId: string }) {
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <button
          onClick={() => setShowBroadcastForm(true)}
          className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
        >
          방송 별풍선 수익 입력
        </button>
      </div>

      <EarningHistory crewId={crewId} />

      <Modal
        isOpen={showBroadcastForm}
        onClose={() => setShowBroadcastForm(false)}
        title="방송 별풍선 수익 입력"
      >
        <BroadcastEarningForm
          crewId={parseInt(crewId)}
          onClose={() => setShowBroadcastForm(false)}
        />
      </Modal>
    </div>
  );
}
