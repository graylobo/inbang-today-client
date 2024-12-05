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
  crewId: number;
  starballoonCount: number;
  songName: string;
  signatureImageUrl: string;
  danceVideoUrls: string[];
  description?: string;
}

export default function SignaturesPage() {
  const [selectedCrewID, setSelectedCrewID] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    crewId: 0,
    starballoonCount: 0,
    songName: "",
    signatureImageUrl: "",
    danceVideoUrls: [""],
    description: "",
  });

  const resetForm = () => {
    setFormData({
      crewId: selectedCrewID,
      starballoonCount: 0,
      songName: "",
      signatureImageUrl: "",
      danceVideoUrls: [""],
      description: "",
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

    if (isEditing) {
      updateMutation.mutate({
        id: formData.id as number,
        formData: submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (signature: any) => {
    setFormData({
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
              춤 영상 URL
            </label>
            <input
              type="text"
              value={formData.danceVideoUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  danceVideoUrl: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300"
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
