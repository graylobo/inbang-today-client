"use client";

import SignatureModal from "@/components/crew-detail/SignatureModal";
import { useGetCrewSignatures } from "@/hooks/crew/useCrews";
import { useState } from "react";

export default function CrewSignatures({ crewId }: { crewId: string }) {
  const { data: signatures } = useGetCrewSignatures(parseInt(crewId));
  const [selectedSignature, setSelectedSignature] = useState<any>(null);

  return (
    <div className="space-y-6">
      {signatures?.map((signature: any) => (
        <div
          key={signature.id}
          className="bg-white dark:bg-dark-bg p-6 rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700 cursor-pointer hover:shadow-lg dark:hover:border-gray-600 transition-all"
          onClick={() => setSelectedSignature(signature)}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold dark:text-gray-100">
                별풍선 {signature.starballoonCount}개
              </h3>
            </div>
            <div>
              <p className="text-lg font-medium dark:text-gray-200">
                {signature.songName}
              </p>
              {signature.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {signature.description}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {signature.dances?.length}개의 영상
              </p>
            </div>
          </div>
        </div>
      ))}

      <SignatureModal
        signature={selectedSignature}
        onClose={() => setSelectedSignature(null)}
      />
    </div>
  );
}
