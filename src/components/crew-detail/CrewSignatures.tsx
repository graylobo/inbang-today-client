"use client";

import SignatureModal from "@/components/crew-detail/SignatureModal";
import { useGetCrewSignatures } from "@/hooks/crew/useCrews";
import { useState } from "react";
import Image from "next/image";

export default function CrewSignatures({ crewId }: { crewId: string }) {
  const { data: signatures } = useGetCrewSignatures(parseInt(crewId));
  const [selectedSignature, setSelectedSignature] = useState<any>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  };

  const isValidImage = (imageUrl: string) => {
    return (
      imageUrl && imageUrl.startsWith("http") && !failedImages.has(imageUrl)
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {signatures?.map((signature: any) => (
        <div
          key={signature.id}
          className="relative bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={() => setSelectedSignature(signature)}
        >
          {isValidImage(signature.signatureImageUrl) && (
            <div className="relative aspect-[16/9]">
              <Image
                src={signature.signatureImageUrl}
                alt={`${signature.songName} 시그니처 이미지`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                onError={() => handleImageError(signature.signatureImageUrl)}
                unoptimized
              />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-bold">
              {signature.songName} ({signature.starballoonCount})
            </h3>
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
