import React from "react";
import { OverviewImageData } from "@/hooks/crew/useSignatureManager";

interface OverviewImageFormProps {
  overviewImageData: OverviewImageData;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (data: OverviewImageData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  currentImageUrl?: string;
}

export const OverviewImageForm: React.FC<OverviewImageFormProps> = ({
  overviewImageData,
  onSubmit,
  onFormChange,
  onCancel,
  isLoading = false,
  currentImageUrl,
}) => {
  return (
    <div className="space-y-6">
      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            전체 시그목록표 이미지 URL
          </label>
          <input
            type="text"
            value={overviewImageData.imageUrl}
            onChange={(e) =>
              onFormChange({
                ...overviewImageData,
                imageUrl: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
            placeholder="전체 시그목록표 이미지 URL을 입력하세요"
            required
          />
        </div>

        {overviewImageData.imageUrl && (
          <div>
            
            <img
              src={overviewImageData.imageUrl}
              alt="전체 시그목록표 미리보기"
              className="max-w-full h-auto max-h-96 rounded-lg border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            저장
          </button>
        </div>
      </form>

      {/* 현재 등록된 전체 시그목록표 이미지 표시 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">
          현재 등록된 전체 시그목록표
        </h3>
        {currentImageUrl ? (
          <div className="space-y-3">
            <img
              src={currentImageUrl}
              alt="현재 등록된 전체 시그목록표"
              className="w-full h-auto rounded-lg border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const errorDiv = target.nextElementSibling as HTMLElement;
                if (errorDiv) errorDiv.style.display = "block";
              }}
            />
            <div
              style={{ display: "none" }}
              className="text-center text-gray-500 py-4"
            >
              이미지를 불러올 수 없습니다.
            </div>
            <p className="text-sm text-gray-600 break-all">{currentImageUrl}</p>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
            등록된 전체 시그목록표 이미지가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
