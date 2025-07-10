"use client";

import ImageLoader from "@/components/common/image-loader/ImageLoader";
import SignatureModal from "@/components/crew-detail/SignatureModal";
import { SignatureForm } from "@/components/common/SignatureForm";
import { OverviewImageForm } from "@/components/common/OverviewImageForm";
import { useGetCrewSignatures, useGetCrewByID } from "@/hooks/crew/useCrews";
import { useSignatureManager } from "@/hooks/crew/useSignatureManager";
import { useAuthStore } from "@/store/authStore";
import { useCrewPermissionsList } from "@/hooks/crew-permission/useCrewPermission";
import { useState, useEffect } from "react";

export default function CrewSignatures({ crewId }: { crewId: string }) {
  const { data: signatures } = useGetCrewSignatures(parseInt(crewId));
  const { data: crew } = useGetCrewByID(crewId);
  const [selectedSignature, setSelectedSignature] = useState<any>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"overview" | "individual">(
    "overview"
  );
  const [isManageMode, setIsManageMode] = useState(false);
  const [overviewManageMode, setOverviewManageMode] = useState(false);

  // 권한 및 시그니처 관리
  const { isSuperAdmin } = useAuthStore();
  const { crews: permittedCrews } = useCrewPermissionsList();
  const signatureManager = useSignatureManager();

  // 현재 크루에 대한 편집 권한 확인
  const hasEditPermission = () => {
    if (isSuperAdmin) return true;
    return permittedCrews?.some((crew: any) => crew.id === parseInt(crewId));
  };

  // 시그니처 폼 초기화 (크루 ID 설정)
  useEffect(() => {
    if (isManageMode) {
      signatureManager.initializeForm(parseInt(crewId));
    }
  }, [isManageMode, crewId]);

  // 오버뷰 이미지 폼 초기화
  useEffect(() => {
    if (overviewManageMode && crew) {
      signatureManager.initializeOverviewForm(
        parseInt(crewId),
        crew.signatureOverviewImageUrl || ""
      );
    }
  }, [overviewManageMode, crewId, crew?.signatureOverviewImageUrl, crew]);

  // 오버뷰 이미지 저장 완료 시 관리 모드 종료
  useEffect(() => {
    if (
      signatureManager.updateOverviewImageMutation.isSuccess &&
      overviewManageMode
    ) {
      setOverviewManageMode(false);
    }
  }, [
    signatureManager.updateOverviewImageMutation.isSuccess,
    overviewManageMode,
  ]);

  // 개별 시그니처 저장 완료 시 관리 모드 종료
  useEffect(() => {
    if (
      (signatureManager.createMutation.isSuccess ||
        signatureManager.updateMutation.isSuccess) &&
      isManageMode
    ) {
      setIsManageMode(false);
    }
  }, [
    signatureManager.createMutation.isSuccess,
    signatureManager.updateMutation.isSuccess,
    isManageMode,
  ]);

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
      {/* 탭 메뉴 및 관리 버튼 */}
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center">
          <nav className="flex -mb-px">
            <button
              onClick={() => {
                setActiveTab("overview");
                setIsManageMode(false);
                setOverviewManageMode(false);
                // 탭 전환시 mutation 상태 리셋
                signatureManager.updateOverviewImageMutation.reset();
                signatureManager.createMutation.reset();
                signatureManager.updateMutation.reset();
              }}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              시그목록표
            </button>
            <button
              onClick={() => {
                setActiveTab("individual");
                setIsManageMode(false);
                setOverviewManageMode(false);
                // 탭 전환시 mutation 상태 리셋
                signatureManager.updateOverviewImageMutation.reset();
                signatureManager.createMutation.reset();
                signatureManager.updateMutation.reset();
              }}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "individual"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              시그별 댄스
            </button>
          </nav>

          {/* 관리 버튼들 */}
          {hasEditPermission() && (
            <div className="flex space-x-2">
              {activeTab === "overview" && (
                <button
                  onClick={() => {
                    // 관리 모드로 들어갈 때 mutation 상태 리셋
                    if (!overviewManageMode) {
                      signatureManager.updateOverviewImageMutation.reset();
                      // 최신 데이터로 폼 초기화
                      if (crew) {
                        signatureManager.initializeOverviewForm(
                          parseInt(crewId),
                          crew.signatureOverviewImageUrl || ""
                        );
                      }
                    }
                    setOverviewManageMode(!overviewManageMode);
                  }}
                  className={`px-4 py-2 text-sm rounded-md ${
                    overviewManageMode
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {overviewManageMode ? "관리 종료" : "시그목록표 관리"}
                </button>
              )}
              {activeTab === "individual" && (
                <button
                  onClick={() => {
                    // 관리 모드로 들어갈 때 mutation 상태 리셋
                    if (!isManageMode) {
                      signatureManager.createMutation.reset();
                      signatureManager.updateMutation.reset();
                    }
                    setIsManageMode(!isManageMode);
                  }}
                  className={`px-4 py-2 text-sm rounded-md ${
                    isManageMode
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isManageMode ? "관리 종료" : "시그니처 관리"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {overviewManageMode ? (
            <>
              <h3 className="text-lg font-semibold">시그목록표 관리</h3>
              <OverviewImageForm
                overviewImageData={signatureManager.overviewImageData}
                onSubmit={signatureManager.handleOverviewSubmit}
                onFormChange={signatureManager.setOverviewImageData}
                onCancel={() => setOverviewManageMode(false)}
                isLoading={
                  signatureManager.updateOverviewImageMutation.isPending
                }
                currentImageUrl={crew?.signatureOverviewImageUrl}
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}

      {activeTab === "individual" && (
        <div className="space-y-4">
          {isManageMode ? (
            <>
              <h3 className="text-lg font-semibold">시그니처 관리</h3>
              <SignatureForm
                formData={signatureManager.formData}
                isEditing={signatureManager.isEditing}
                onSubmit={signatureManager.handleSubmit}
                onFormChange={signatureManager.setFormData}
                onAddDance={signatureManager.handleAddDance}
                onDanceChange={signatureManager.handleDanceChange}
                onRemoveDance={signatureManager.handleRemoveDance}
                onCancel={() => {
                  signatureManager.resetForm();
                  setIsManageMode(false);
                }}
                isLoading={
                  signatureManager.createMutation.isPending ||
                  signatureManager.updateMutation.isPending
                }
              />

              {/* 시그니처 목록 (관리 모드) */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">등록된 시그니처 목록</h4>
                {signatures?.map((signature: any) => (
                  <div
                    key={signature.id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <p className="font-medium">
                          별풍선 {signature.starballoonCount}개
                        </p>
                        <p className="text-lg">{signature.songName}</p>
                        {signature.description && (
                          <p className="text-gray-600">
                            {signature.description}
                          </p>
                        )}

                        {/* 사용자 정보 */}
                        <div className="text-xs text-gray-500 space-y-1">
                          {signature.createdBy && (
                            <p>등록자: {signature.createdBy.name}</p>
                          )}
                          {signature.updatedBy &&
                            signature.updatedBy.id !==
                              signature.createdBy?.id && (
                              <p>수정자: {signature.updatedBy.name}</p>
                            )}
                          <p>
                            등록일:
                            {new Date(signature.createdAt).toLocaleDateString()}
                          </p>
                          {signature.updatedAt !== signature.createdAt && (
                            <p>
                              수정일:
                              {new Date(
                                signature.updatedAt
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="flex space-x-4">
                          {signature.signatureImageUrl && (
                            <a
                              href={signature.signatureImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              시그니처 이미지 보기
                            </a>
                          )}
                          {signature.danceVideoUrl && (
                            <a
                              href={signature.danceVideoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              춤 영상 보기
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => signatureManager.handleEdit(signature)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() =>
                            signatureManager.handleDelete(signature.id)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
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
            </>
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
