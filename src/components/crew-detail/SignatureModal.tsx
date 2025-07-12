"use client";

import { useCrewPermissionsList } from "@/hooks/crew-permission/useCrewPermission";
import { useSignatureManager } from "@/hooks/crew/useSignatureManager";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { hasCrewEditPermission } from "@/utils/permissions";

interface SignatureModalProps {
  signature: any;
  onClose: () => void;
  onSignatureUpdate?: () => void;
}

export default function SignatureModal({
  signature,
  onClose,
  onSignatureUpdate,
}: SignatureModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDanceIndex, setSelectedDanceIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [isAddingDance, setIsAddingDance] = useState(false);
  const [newDanceData, setNewDanceData] = useState({
    memberName: "",
    danceVideoUrl: "",
    performedAt: new Date().toISOString().split("T")[0],
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 권한 확인
  const { isSuperAdmin } = useAuthStore();
  const { crews: permittedCrews } = useCrewPermissionsList();
  const signatureManager = useSignatureManager();

  // 현재 크루에 대한 편집 권한 확인
  const hasEditPermission = signature
    ? hasCrewEditPermission(isSuperAdmin, permittedCrews, signature.crewId)
    : false;

  useEffect(() => {
    if (!signature) return;

    // 모달이 열릴 때마다 춤영상 추가 섹션을 닫힌 상태로 초기화
    setIsAddingDance(false);

    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const isOverflowing =
          scrollContainerRef.current.scrollWidth >
          scrollContainerRef.current.clientWidth;
        setShowArrows(isOverflowing);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [signature?.dances]);

  if (!signature) return null;

  const currentDance = signature.dances?.[selectedDanceIndex];

  const getValidVideoUrl = (url: string) => {
    if (!url) return "";

    try {
      const videoUrl = new URL(url);

      if (
        videoUrl.hostname.includes("youtube.com") ||
        videoUrl.hostname.includes("youtu.be")
      ) {
        const videoId = url.includes("youtu.be")
          ? url.split("/").pop()
          : new URLSearchParams(videoUrl.search).get("v");

        return `https://www.youtube.com/embed/${videoId}`;
      }

      return url;
    } catch {
      return url.startsWith("http") ? url : `https://${url}`;
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 200;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const handleAddDance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newDanceData.memberName ||
      !newDanceData.danceVideoUrl ||
      !newDanceData.performedAt
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      // 기존 시그니처 데이터에 새 춤 영상 추가
      const updatedFormData = {
        crewId: signature.crewId,
        starballoonCount: signature.starballoonCount,
        songName: signature.songName,
        signatureImageUrl: signature.signatureImageUrl,
        description: signature.description,
        dances: [...signature.dances, newDanceData],
      };

      // 시그니처 업데이트
      await signatureManager.updateMutation.mutateAsync({
        id: signature.id,
        formData: updatedFormData,
      });

      // 성공 시 폼 초기화
      setNewDanceData({
        memberName: "",
        danceVideoUrl: "",
        performedAt: new Date().toISOString().split("T")[0],
      });
      setIsAddingDance(false);

      // 새로 추가된 춤 영상으로 선택 변경
      setSelectedDanceIndex(signature.dances.length);

      // 상위 컴포넌트에 업데이트 알림
      if (onSignatureUpdate) {
        onSignatureUpdate();
      }
    } catch (error) {
      console.error("춤 영상 추가 실패:", error);
      alert("춤 영상 추가에 실패했습니다.");
    }
  };

  const handleDanceDataChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setNewDanceData({
      ...newDanceData,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 pt-20">
      <div
        className={
          isFullscreen
            ? "w-full h-full bg-white dark:bg-gray-800 rounded-lg flex flex-col"
            : "w-[900px] max-h-[calc(100vh-120px)] bg-white dark:bg-gray-800 rounded-lg flex flex-col overflow-y-auto"
        }
      >
        {/* 헤더 */}
        <div className="flex justify-between items-start p-3 border-b dark:border-gray-700 shrink-0">
          <div className="flex-1">
            <h2 className="text-lg font-bold truncate dark:text-gray-100">
              {signature.songName} ({signature.starballoonCount}개)
            </h2>
            {signature.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {signature.description}
              </p>
            )}
            {/* 사용자 정보 */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
              {signature.createdBy && <p>등록자: {signature.createdBy.name}</p>}
              {signature.updatedBy &&
                signature.updatedBy.id !== signature.createdBy?.id && (
                  <p>수정자: {signature.updatedBy.name}</p>
                )}
              <p>
                등록일: {new Date(signature.createdAt).toLocaleDateString()}
              </p>
              {signature.updatedAt !== signature.createdAt && (
                <p>
                  수정일: {new Date(signature.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {hasEditPermission && (
              <button
                onClick={() => setIsAddingDance(!isAddingDance)}
                className={`p-1.5 rounded text-sm transition-colors ${
                  isAddingDance
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isAddingDance ? "취소" : "춤 영상 추가"}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>

        {/* 춤 영상 추가 폼 */}
        {isAddingDance && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 shrink-0">
            <form onSubmit={handleAddDance} className="space-y-3">
              <h3 className="text-sm font-medium dark:text-gray-100">
                새 춤 영상 추가
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    크루원 이름
                  </label>
                  <input
                    type="text"
                    value={newDanceData.memberName}
                    onChange={(e) =>
                      handleDanceDataChange(0, "memberName", e.target.value)
                    }
                    className="w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2 text-sm"
                    placeholder="크루원 이름"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    영상 URL
                  </label>
                  <input
                    type="text"
                    value={newDanceData.danceVideoUrl}
                    onChange={(e) =>
                      handleDanceDataChange(0, "danceVideoUrl", e.target.value)
                    }
                    className="w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2 text-sm"
                    placeholder="유튜브 URL 등"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    방송 일자
                  </label>
                  <input
                    type="date"
                    value={newDanceData.performedAt}
                    onChange={(e) =>
                      handleDanceDataChange(0, "performedAt", e.target.value)
                    }
                    className="w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDance(false)}
                  className="px-3 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={signatureManager.updateMutation.isPending}
                >
                  {signatureManager.updateMutation.isPending
                    ? "추가 중..."
                    : "추가"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 네비게이션 */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 flex-shrink-0 relative z-20">
          {showArrows && (
            <>
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                →
              </button>
            </>
          )}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 overflow-x-auto pb-2 px-8 scrollbar-hide min-h-[48px]"
          >
            {signature.dances?.map((dance: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedDanceIndex(index)}
                className={`px-4 py-2 rounded whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedDanceIndex === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {dance.memberName} (
                {format(new Date(dance.performedAt), "yyyy-MM-dd", {
                  locale: ko,
                })}
                )
              </button>
            ))}
          </div>
        </div>

        {/* 비디오 영역 */}
        <div className="flex-1 p-3 relative z-10 min-h-[300px]">
          <div className="h-full flex items-center">
            <div
              className={`w-full rounded-lg overflow-hidden ${
                currentDance?.danceVideoUrl
                  ? "bg-black"
                  : "bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600"
              }`}
              style={{
                aspectRatio: "1.8/1",
                maxHeight: "400px",
              }}
            >
              {currentDance?.danceVideoUrl ? (
                <iframe
                  src={getValidVideoUrl(currentDance.danceVideoUrl)}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">📹</div>
                    <p className="text-lg">비디오가 존재하지 않습니다</p>
                    <p className="text-sm mt-1">
                      춤 영상이 업로드되지 않았습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
