import React from "react";

export interface SignatureInfoData {
  starballoonCount: number;
  songName: string;
  signatureImageUrl: string;
  description?: string;
}

interface SignatureInfoFormProps {
  data: SignatureInfoData;
  onDataChange: (data: SignatureInfoData) => void;
}

export const SignatureInfoForm: React.FC<SignatureInfoFormProps> = ({
  data,
  onDataChange,
}) => {
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
