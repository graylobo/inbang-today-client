import React, { useState } from "react";
import { SignatureFormData } from "@/hooks/crew/useSignatureManager";
import { SignatureInfoForm, SignatureInfoData } from "./SignatureInfoForm";
import { DanceVideoForm, DanceVideoData } from "./DanceVideoForm";

interface SignatureFormProps {
  formData: SignatureFormData;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (data: SignatureFormData) => void;
  onAddDance: () => void;
  onDanceChange: (index: number, field: string, value: string | number) => void;
  onRemoveDance: (index: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SignatureForm: React.FC<SignatureFormProps> = ({
  formData,
  isEditing,
  onSubmit,
  onFormChange,
  onAddDance,
  onDanceChange,
  onRemoveDance,
  onCancel,
  isLoading = false,
}) => {
  const [isDanceVideoVisible, setIsDanceVideoVisible] = useState(false);

  const handleSignatureInfoChange = (signatureInfo: SignatureInfoData) => {
    onFormChange({
      ...formData,
      starballoonCount: signatureInfo.starballoonCount,
      songName: signatureInfo.songName,
      signatureImageUrl: signatureInfo.signatureImageUrl,
      description: signatureInfo.description || "",
    });
  };

  const handleToggleDanceVideo = () => {
    setIsDanceVideoVisible(!isDanceVideoVisible);
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

      <DanceVideoForm
        dances={formData.dances}
        onAddDance={onAddDance}
        onDanceChange={onDanceChange}
        onRemoveDance={onRemoveDance}
        isVisible={isDanceVideoVisible}
        onToggleVisibility={handleToggleDanceVideo}
      />

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
