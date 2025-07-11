import React, { useMemo } from "react";

export interface SignatureInfoData {
  starballoonCount: number;
  songName: string;
  signatureImageUrl: string;
  description?: string;
}

interface SignatureInfoFormProps {
  data: SignatureInfoData;
  onDataChange: (data: SignatureInfoData) => void;
  existingSignatures?: any[]; // 기존 시그니처 목록
  currentSignatureId?: number; // 현재 편집 중인 시그니처 ID (수정 모드인 경우)
}

export const SignatureInfoForm: React.FC<SignatureInfoFormProps> = ({
  data,
  onDataChange,
  existingSignatures = [],
  currentSignatureId,
}) => {
  // 별풍선 개수 중복 체크
  const isDuplicate = useMemo(() => {
    if (!data.starballoonCount || data.starballoonCount === 0) return false;

    return existingSignatures.some(
      (signature) =>
        signature.starballoonCount === data.starballoonCount &&
        signature.id !== currentSignatureId
    );
  }, [data.starballoonCount, existingSignatures, currentSignatureId]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          별풍선 개수
        </label>
        <input
          type="number"
          value={data.starballoonCount || ""}
          onChange={(e) =>
            onDataChange({
              ...data,
              starballoonCount:
                e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
          className={`mt-1 block w-full rounded-md border-2 focus:ring-1 p-2 ${
            isDuplicate
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          required
        />
        {isDuplicate && (
          <p className="mt-1 text-sm text-red-600">
            ⚠️ 이미 별풍선 {data.starballoonCount}개 시그니처가 존재합니다.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          노래 이름
        </label>
        <input
          type="text"
          value={data.songName}
          onChange={(e) =>
            onDataChange({
              ...data,
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
          value={data.signatureImageUrl}
          onChange={(e) =>
            onDataChange({
              ...data,
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
          value={data.description || ""}
          onChange={(e) =>
            onDataChange({
              ...data,
              description: e.target.value,
            })
          }
          className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
          rows={3}
        />
      </div>
    </div>
  );
};
