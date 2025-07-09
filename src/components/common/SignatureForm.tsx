import React from "react";
import { SignatureFormData } from "@/hooks/crew/useSignatureManager";

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
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          별풍선 개수
        </label>
        <input
          type="number"
          value={formData.starballoonCount || ""}
          onChange={(e) =>
            onFormChange({
              ...formData,
              starballoonCount:
                e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
          className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          노래 이름
        </label>
        <input
          type="text"
          value={formData.songName}
          onChange={(e) =>
            onFormChange({
              ...formData,
              songName: e.target.value,
            })
          }
          className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          시그니처 이미지 URL
        </label>
        <input
          type="text"
          value={formData.signatureImageUrl}
          onChange={(e) =>
            onFormChange({
              ...formData,
              signatureImageUrl: e.target.value,
            })
          }
          className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
          placeholder="선택 사항"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">설명</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            onFormChange({
              ...formData,
              description: e.target.value,
            })
          }
          className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">춤 영상 정보</h3>
          <button
            type="button"
            onClick={onAddDance}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            영상 추가
          </button>
        </div>

        {formData.dances.map((dance, index) => (
          <div key={index} className="p-4 border rounded-md space-y-3">
            <div className="flex justify-between">
              <h4 className="font-medium">영상 #{index + 1}</h4>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => onRemoveDance(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                크루원 이름
              </label>
              <input
                type="text"
                value={dance.memberName}
                onChange={(e) =>
                  onDanceChange(index, "memberName", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                placeholder="크루원 이름을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                영상 URL
              </label>
              <input
                type="text"
                value={dance.danceVideoUrl}
                onChange={(e) =>
                  onDanceChange(index, "danceVideoUrl", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                방송 일자
              </label>
              <input
                type="date"
                value={dance.performedAt}
                onChange={(e) =>
                  onDanceChange(index, "performedAt", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                required
              />
            </div>
          </div>
        ))}
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
