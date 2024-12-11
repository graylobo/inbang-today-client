"use client";

import {
  useCreateCrewSignature,
  useDeleteCrewSignature,
  useGetCrews,
  useGetCrewSignatures,
  useUpdateCrewSignature,
} from "@/hooks/crew/useCrews";
import { useState } from "react";

export interface SignatureFormData {
  signatureId?: number;
  crewId: number;
  starballoonCount: number;
  songName: string;
  signatureImageUrl: string;
  description?: string;
  dances: {
    memberId: number;
    danceVideoUrl: string;
    performedAt: string;
  }[];
}

export default function SignaturesPage() {
  const [selectedCrewID, setSelectedCrewID] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SignatureFormData>({
    crewId: 0,
    starballoonCount: 0,
    songName: "",
    signatureImageUrl: "",
    description: "",
    dances: [{ memberId: 0, danceVideoUrl: "", performedAt: "" }],
  });

  const resetForm = () => {
    setFormData({
      crewId: selectedCrewID,
      starballoonCount: 0,
      songName: "",
      signatureImageUrl: "",
      description: "",
      dances: [{ memberId: 0, danceVideoUrl: "", performedAt: "" }],
    });
    setIsEditing(false);
  };

  const { data: crews } = useGetCrews();

  const { data: signatures } = useGetCrewSignatures(selectedCrewID);

  const createMutation = useCreateCrewSignature(resetForm);

  const updateMutation = useUpdateCrewSignature(resetForm);

  const deleteMutation = useDeleteCrewSignature();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData, crewId: selectedCrewID };

    if (isEditing && formData.signatureId) {
      updateMutation.mutate({
        id: formData.signatureId,
        formData: submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (signature: any) => {
    setFormData({
      id: signature.id,
      ...signature,
      crewId: selectedCrewID,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("정말로 이 시그니처를 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddDance = () => {
    setFormData({
      ...formData,
      dances: [
        ...formData.dances,
        { memberId: 0, danceVideoUrl: "", performedAt: "" },
      ],
    });
  };

  const handleDanceChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newDances = [...formData.dances];
    newDances[index] = { ...newDances[index], [field]: value };
    setFormData({ ...formData, dances: newDances });
  };

  const handleRemoveDance = (index: number) => {
    setFormData({
      ...formData,
      dances: formData.dances.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">시그니처 관리</h1>

      <div>
        <select
          value={selectedCrewID}
          onChange={(e) => {
            setSelectedCrewID(Number(e.target.value));
            resetForm();
          }}
          className="rounded-md border-gray-300"
        >
          <option value={0}>크루 선택</option>
          {crews?.map((crew: any) => (
            <option key={crew.id} value={crew.id}>
              {crew.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCrewID > 0 && (
        <form
          onSubmit={handleSubmit}
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
                setFormData({
                  ...formData,
                  starballoonCount:
                    e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300"
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
                setFormData({
                  ...formData,
                  songName: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300"
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
                setFormData({
                  ...formData,
                  signatureImageUrl: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">춤 영상 정보</h3>
              <button
                type="button"
                onClick={handleAddDance}
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
                      onClick={() => handleRemoveDance(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    크루원
                  </label>
                  <select
                    value={dance.memberId}
                    onChange={(e) =>
                      handleDanceChange(
                        index,
                        "memberId",
                        Number(e.target.value)
                      )
                    }
                    className="mt-1 block w-full rounded-md border-gray-300"
                    required
                  >
                    <option value={0}>크루원 선택</option>
                    {crews
                      ?.find((c) => c.id === selectedCrewID)
                      ?.members.map((member: any) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    영상 URL
                  </label>
                  <input
                    type="text"
                    value={dance.danceVideoUrl}
                    onChange={(e) =>
                      handleDanceChange(index, "danceVideoUrl", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    촬영 일자
                  </label>
                  <input
                    type="date"
                    value={dance.performedAt}
                    onChange={(e) =>
                      handleDanceChange(index, "performedAt", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300"
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
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? "수정" : "등록"}
            </button>
          </div>
        </form>
      )}

      {/* 시그니처 목록 */}
      <div className="space-y-4">
        {signatures?.map((signature: any) => (
          <div key={signature.id} className="bg-white p-4 rounded-lg shadow">
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
                  onClick={() => handleEdit(signature)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(signature.id)}
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
  );
}
