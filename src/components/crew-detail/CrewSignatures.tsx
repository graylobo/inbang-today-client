"use client";

import ImageLoader from "@/components/common/image-loader/ImageLoader";
import SignatureModal from "@/components/crew-detail/SignatureModal";
import { useGetCrewSignatures, useGetCrewByID } from "@/hooks/crew/useCrews";
import { useState } from "react";

export default function CrewSignatures({ crewId }: { crewId: string }) {
  const { data: signatures } = useGetCrewSignatures(parseInt(crewId));
  const { data: crew } = useGetCrewByID(crewId);
  const [selectedSignature, setSelectedSignature] = useState<any>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"overview" | "individual">(
    "overview"
  );

  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  };

  const isValidImage = (imageUrl: string) => {
    return (
      imageUrl && imageUrl.startsWith("http") && !failedImages.has(imageUrl)
    );
  };

  return (
    <div className="space-y-6">
      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            시그목록표
          </button>
          <button
            onClick={() => setActiveTab("individual")}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === "individual"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            시그별 댄스
          </button>
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">전체 시그목록표</h3>
          {crew?.signatureOverviewImageUrl ? (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <img
                src={crew.signatureOverviewImageUrl}
                alt="전체 시그목록표"
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const errorDiv = target.nextElementSibling as HTMLElement;
                  if (errorDiv) errorDiv.style.display = "block";
                }}
              />
              <div
                style={{ display: "none" }}
                className="text-center text-gray-500 py-8"
              >
                이미지를 불러올 수 없습니다.
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">등록된 시그목록표가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "individual" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">개별 시그니처</h3>
          {signatures && signatures.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {signatures.map((signature: any) => (
                <div
                  key={signature.id}
                  className="relative bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => setSelectedSignature(signature)}
                >
                  <div className="relative aspect-[16/9]">
                    <ImageLoader
                      src={signature.signatureImageUrl}
                      alt={`${signature.songName} 시그니처 이미지`}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-bold">
                      {signature.songName} ({signature.starballoonCount})
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm12-3c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <p className="text-gray-500">등록된 시그니처가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      <SignatureModal
        signature={selectedSignature}
        onClose={() => setSelectedSignature(null)}
      />
    </div>
  );
}
