import React from "react";
import { SignatureFormData } from "@/hooks/crew/useSignatureManager";
import { SignatureInfoForm, SignatureInfoData } from "./SignatureInfoForm";

interface SignatureFormProps {
  formData: SignatureFormData;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (data: SignatureFormData) => void;
  onCancel: () => void;
  onOpenDanceModal: () => void;
  isLoading?: boolean;
}

export const SignatureForm: React.FC<SignatureFormProps> = ({
  formData,
  isEditing,
  onSubmit,
  onFormChange,
  onCancel,
  onOpenDanceModal,
  isLoading = false,
}) => {
  const handleSignatureInfoChange = (signatureInfo: SignatureInfoData) => {
    onFormChange({
      ...formData,
      starballoonCount: signatureInfo.starballoonCount,
      songName: signatureInfo.songName,
      signatureImageUrl: signatureInfo.signatureImageUrl,
      description: signatureInfo.description || "",
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <h3 className="text-lg font-medium">시그니처 관리</h3>

      <SignatureInfoForm
        data={{
          starballoonCount: formData.starballoonCount,
          songName: formData.songName,
          signatureImageUrl: formData.signatureImageUrl,
          description: formData.description,
        }}
        onDataChange={handleSignatureInfoChange}
      />

      {/* 춤 영상 관리 섹션 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">춤 영상 정보</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {formData.dances.length}개의 영상
            </span>
            <button
              type="button"
              onClick={onOpenDanceModal}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              영상 관리
            </button>
          </div>
        </div>
        
        {/* 춤 영상 목록 미리보기 */}
        {formData.dances.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">등록된 영상 목록:</h4>
            <div className="space-y-2">
              {formData.dances.map((dance, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    #{index + 1}
                  </span>
                  <span className="font-medium">{dance.memberName || "이름 없음"}</span>
                  <span className="text-gray-500">({dance.performedAt})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={isLoading}
        >
          {isEditing ? "수정" : "등록"}
        </button>
      </div>
    </form>
  );
};
