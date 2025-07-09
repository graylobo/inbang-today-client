"use client";

import { useGetCrews, useGetCrewSignatures } from "@/hooks/crew/useCrews";
import { useGetPermittedCrews } from "@/hooks/crew-permission/useCrewPermission";
import { useAuthStore } from "@/store/authStore";
import { useSignatureManager } from "@/hooks/crew/useSignatureManager";
import { SignatureForm } from "@/components/common/SignatureForm";
import { OverviewImageForm } from "@/components/common/OverviewImageForm";
import { useState, useEffect } from "react";

export default function SignaturesPage() {
  const [selectedCrewID, setSelectedCrewID] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"individual" | "overview">(
    "individual"
  );

  const signatureManager = useSignatureManager();

  const { isSuperAdmin } = useAuthStore();
  const { data: allCrews } = useGetCrews();
  const { data: permittedCrews } = useGetPermittedCrews();

  // 슈퍼어드민인 경우 모든 크루, 아닌 경우 권한을 가진 크루만 표시
  const crews = isSuperAdmin ? allCrews : permittedCrews;

  const { data: signatures } = useGetCrewSignatures(selectedCrewID);

  // 크루 선택 시 폼 초기화
  useEffect(() => {
    if (selectedCrewID > 0) {
      signatureManager.initializeForm(selectedCrewID);
    }
  }, [selectedCrewID]);

  // 오버뷰 이미지 탭 선택 시 폼 초기화
  useEffect(() => {
    if (activeTab === "overview" && selectedCrewID > 0) {
      const selectedCrew = crews?.find(
        (crew: any) => crew.id === selectedCrewID
      );
      signatureManager.initializeOverviewForm(
        selectedCrewID,
        selectedCrew?.signatureOverviewImageUrl || ""
      );
    }
  }, [activeTab, selectedCrewID, crews]);

  const handleCrewChange = (crewId: number) => {
    setSelectedCrewID(crewId);
    signatureManager.resetForm();
    signatureManager.resetOverviewForm();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">시그니처 관리</h1>

      {/* 탭 선택 UI */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("individual")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "individual"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            개별 시그니처 관리
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            전체 시그목록표 이미지
          </button>
        </nav>
      </div>

      {/* 크루 선택 */}
      <div>
        <select
          value={selectedCrewID}
          onChange={(e) => handleCrewChange(Number(e.target.value))}
          className="rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
        >
          <option value={0}>크루 선택</option>
          {crews?.map((crew: any) => (
            <option key={crew.id} value={crew.id}>
              {crew.name}
            </option>
          ))}
        </select>
      </div>

      {/* 개별 시그니처 관리 탭 */}
      {activeTab === "individual" && selectedCrewID > 0 && (
        <div className="space-y-6">
          <SignatureForm
            formData={signatureManager.formData}
            isEditing={signatureManager.isEditing}
            onSubmit={signatureManager.handleSubmit}
            onFormChange={signatureManager.setFormData}
            onAddDance={signatureManager.handleAddDance}
            onDanceChange={signatureManager.handleDanceChange}
            onRemoveDance={signatureManager.handleRemoveDance}
            onCancel={signatureManager.resetForm}
            isLoading={
              signatureManager.createMutation.isPending ||
              signatureManager.updateMutation.isPending
            }
          />

          {/* 시그니처 목록 */}
          <div className="space-y-4">
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
                      <p className="text-gray-600">{signature.description}</p>
                    )}
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
        </div>
      )}

      {/* 전체 시그목록표 이미지 관리 탭 */}
      {activeTab === "overview" && selectedCrewID > 0 && (
        <div className="space-y-6">
          <OverviewImageForm
            overviewImageData={signatureManager.overviewImageData}
            onSubmit={signatureManager.handleOverviewSubmit}
            onFormChange={signatureManager.setOverviewImageData}
            onCancel={signatureManager.resetOverviewForm}
            isLoading={signatureManager.updateOverviewImageMutation.isPending}
            currentImageUrl={
              crews?.find((crew: any) => crew.id === selectedCrewID)
                ?.signatureOverviewImageUrl
            }
          />
        </div>
      )}
    </div>
  );
}
