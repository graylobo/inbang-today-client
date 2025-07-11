import React from "react";

export interface DanceVideoData {
  id?: number; // 기존 춤 영상의 경우 ID 포함
  memberName: string;
  danceVideoUrl: string;
  performedAt: string;
}

interface DanceVideoFormProps {
  dances: DanceVideoData[];
  onAddDance: () => void;
  onDanceChange: (index: number, field: string, value: string | number) => void;
  onRemoveDance: (index: number) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const DanceVideoForm: React.FC<DanceVideoFormProps> = ({
  dances,
  onAddDance,
  onDanceChange,
  onRemoveDance,
  isVisible,
  onToggleVisibility,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">춤 영상 정보</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleVisibility}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            {isVisible ? "영상 정보 숨기기" : "영상 추가"}
          </button>
          {isVisible && (
            <button
              type="button"
              onClick={onAddDance}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              영상 추가
            </button>
          )}
        </div>
      </div>

      {isVisible && (
        <div className="space-y-4">
          {dances.map((dance, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex justify-between">
                <h4 className="font-medium">영상 #{index + 1}</h4>
                {dances.length > 1 && (
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
                  required={isVisible}
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
                  required={isVisible}
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
                  required={isVisible}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
