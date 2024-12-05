"use client";

import { useGetCrewSignatures } from "@/hooks/crew/useCrews";

export default function CrewSignatures({ crewId }: { crewId: string }) {
  const { data: signatures } = useGetCrewSignatures(parseInt(crewId));

  return (
    <div className="space-y-6">
      {signatures?.map((signature: any) => (
        <div key={signature.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold">
                별풍선 {signature.starballoonCount}개
              </h3>
            </div>
            <div>
              <p className="text-lg font-medium">{signature.songName}</p>
              {signature.description && (
                <p className="text-gray-600 mt-2">{signature.description}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href={signature.signatureImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:text-blue-700"
              >
                시그니처 이미지 보기
              </a>
              {signature.danceVideoUrls?.map((url: string, index: number) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:text-blue-700"
                >
                  춤 영상 {index + 1} 보기
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 