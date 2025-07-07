"use client";

import {
  useCreateCrewSignature,
  useDeleteCrewSignature,
  useGetCrews,
  useGetCrewSignatures,
  useUpdateCrewSignature,
  useUpdateCrewSignatureOverviewImageUrl,
} from "@/hooks/crew/useCrews";
import { useGetPermittedCrews } from "@/hooks/crew-permission/useCrewPermission";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

export interface SignatureFormData {
  signatureId?: number;
  crewId: number;
  starballoonCount: number;
  songName: string;
  signatureImageUrl: string;
  description?: string;
  dances: {
    memberName: string;
    danceVideoUrl: string;
    performedAt: string;
  }[];
}

export default function SignaturesPage() {
  const [selectedCrewID, setSelectedCrewID] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"individual" | "overview">(
    "individual"
  );

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState<SignatureFormData>({
    crewId: 0,
    starballoonCount: 0,
    songName: "",
    signatureImageUrl: "",
    description: "",
    dances: [
      { memberName: "", danceVideoUrl: "", performedAt: getTodayDate() },
    ],
  });

  // 전체 시그목록표 이미지 URL 관리를 위한 상태
  const [overviewImageData, setOverviewImageData] = useState({
    crewId: 0,
    imageUrl: "",
  });

  const resetForm = () => {
    setFormData({
      crewId: selectedCrewID,
      starballoonCount: 0,
      songName: "",
      signatureImageUrl: "",
      description: "",
      dances: [
        { memberName: "", danceVideoUrl: "", performedAt: getTodayDate() },
      ],
    });
    setIsEditing(false);
  };

  const resetOverviewForm = () => {
    setOverviewImageData({
      crewId: 0,
      imageUrl: "",
    });
  };

  const { isSuperAdmin } = useAuthStore();
  const { data: allCrews } = useGetCrews();
  const { data: permittedCrews } = useGetPermittedCrews();

  // 슈퍼어드민인 경우 모든 크루, 아닌 경우 권한을 가진 크루만 표시
  const crews = isSuperAdmin ? allCrews : permittedCrews;

  const { data: signatures } = useGetCrewSignatures(selectedCrewID);

  const createMutation = useCreateCrewSignature(resetForm);

  const updateMutation = useUpdateCrewSignature(resetForm);

  const deleteMutation = useDeleteCrewSignature();

  const updateOverviewImageMutation =
    useUpdateCrewSignatureOverviewImageUrl(resetOverviewForm);

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
        { memberName: "", danceVideoUrl: "", performedAt: getTodayDate() },
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

  const handleOverviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!overviewImageData.crewId) {
      alert("크루를 선택해주세요.");
      return;
    }

    if (!overviewImageData.imageUrl.trim()) {
      alert("이미지 URL을 입력해주세요.");
      return;
    }

    updateOverviewImageMutation.mutate({
      id: overviewImageData.crewId,
      imageUrl: overviewImageData.imageUrl,
    });
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

      {/* 개별 시그니처 관리 탭 */}
      {activeTab === "individual" && (
        <div className="space-y-6">
          <div>
            <select
              value={selectedCrewID}
              onChange={(e) => {
                setSelectedCrewID(Number(e.target.value));
                resetForm();
              }}
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
                    setFormData({
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
                    setFormData({
                      ...formData,
                      signatureImageUrl: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                  placeholder="선택 사항"
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
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
                        크루원 이름
                      </label>
                      <input
                        type="text"
                        value={dance.memberName}
                        onChange={(e) =>
                          handleDanceChange(index, "memberName", e.target.value)
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
                          handleDanceChange(
                            index,
                            "danceVideoUrl",
                            e.target.value
                          )
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
                          handleDanceChange(
                            index,
                            "performedAt",
                            e.target.value
                          )
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
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    취소
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {isEditing ? "수정" : "등록"}
                </button>
              </div>
            </form>
          )}

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
      )}

      {/* 전체 시그목록표 이미지 관리 탭 */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              크루 선택
            </label>
            <select
              value={overviewImageData.crewId}
              onChange={(e) => {
                const selectedCrewId = Number(e.target.value);
                const selectedCrew = crews?.find(
                  (crew: any) => crew.id === selectedCrewId
                );
                setOverviewImageData({
                  crewId: selectedCrewId,
                  imageUrl: selectedCrew?.signatureOverviewImageUrl || "",
                });
              }}
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

          {overviewImageData.crewId > 0 && (
            <form
              onSubmit={handleOverviewSubmit}
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
                    setOverviewImageData({
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 미리보기
                  </label>
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
                  onClick={resetOverviewForm}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  저장
                </button>
              </div>
            </form>
          )}

          {/* 현재 등록된 전체 시그목록표 이미지 표시 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">
              현재 등록된 전체 시그목록표
            </h3>
            {overviewImageData.crewId > 0 ? (
              (() => {
                const selectedCrew = crews?.find(
                  (crew: any) => crew.id === overviewImageData.crewId
                );
                const currentImageUrl = selectedCrew?.signatureOverviewImageUrl;

                if (currentImageUrl) {
                  return (
                    <div className="space-y-3">
                      <img
                        src={currentImageUrl}
                        alt="현재 등록된 전체 시그목록표"
                        className="w-full h-auto rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const errorDiv =
                            target.nextElementSibling as HTMLElement;
                          if (errorDiv) errorDiv.style.display = "block";
                        }}
                      />
                      <div
                        style={{ display: "none" }}
                        className="text-center text-gray-500 py-4"
                      >
                        이미지를 불러올 수 없습니다.
                      </div>
                      <p className="text-sm text-gray-600 break-all">
                        {currentImageUrl}
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      선택된 크루에 등록된 전체 시그목록표 이미지가 없습니다.
                    </div>
                  );
                }
              })()
            ) : (
              <div className="text-center text-gray-500 py-8">
                크루를 선택하면 등록된 전체 시그목록표를 확인할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
