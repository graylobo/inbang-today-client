import { useState } from "react";
import {
  useCreateCrewSignature,
  useDeleteCrewSignature,
  useUpdateCrewSignature,
  useUpdateCrewSignatureOverviewImageUrl,
} from "./useCrews";
import { DanceVideoData } from "@/components/common/DanceVideoForm";

export interface SignatureFormData {
  signatureId?: number;
  crewId: number;
  starballoonCount: number;
  songName: string;
  signatureImageUrl: string;
  description?: string;
  dances: DanceVideoData[];
}

export interface OverviewImageData {
  crewId: number;
  imageUrl: string;
}

export const useSignatureManager = () => {
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SignatureFormData>({
    crewId: 0,
    starballoonCount: 0,
    songName: "",
    signatureImageUrl: "",
    description: "",
    dances: [],
  });

  const [overviewImageData, setOverviewImageData] = useState<OverviewImageData>(
    {
      crewId: 0,
      imageUrl: "",
    }
  );

  // DanceVideoModal 관련 상태
  const [isDanceModalOpen, setIsDanceModalOpen] = useState(false);

  const resetForm = () => {
    setFormData({
      crewId: 0,
      starballoonCount: 0,
      songName: "",
      signatureImageUrl: "",
      description: "",
      dances: [],
    });
    setIsEditing(false);
    setIsDanceModalOpen(false);
  };

  const resetOverviewForm = () => {
    setOverviewImageData({
      crewId: 0,
      imageUrl: "",
    });
  };

  // Mutations
  const createMutation = useCreateCrewSignature(resetForm);
  const updateMutation = useUpdateCrewSignature(resetForm);
  const deleteMutation = useDeleteCrewSignature();
  const updateOverviewImageMutation =
    useUpdateCrewSignatureOverviewImageUrl(resetOverviewForm);

  // 개별 시그니처 폼 초기화
  const initializeForm = (crewId: number) => {
    setFormData({
      crewId,
      starballoonCount: 0,
      songName: "",
      signatureImageUrl: "",
      description: "",
      dances: [],
    });
    setIsEditing(false);
    setIsDanceModalOpen(false);
  };

  // 오버뷰 이미지 폼 초기화
  const initializeOverviewForm = (
    crewId: number,
    currentImageUrl: string = ""
  ) => {
    setOverviewImageData({
      crewId,
      imageUrl: currentImageUrl,
    });
  };

  // 시그니처 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && formData.signatureId) {
      updateMutation.mutate({
        id: formData.signatureId,
        formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  // 시그니처 편집
  const handleEdit = (signature: any) => {
    // 기존 춤 영상 데이터에 ID 포함해서 매핑
    const dancesWithId =
      signature.dances?.map((dance: any) => ({
        id: dance.id, // 기존 ID 유지
        memberName: dance.memberName,
        danceVideoUrl: dance.danceVideoUrl,
        performedAt: dance.performedAt,
      })) || [];

    setFormData({
      signatureId: signature.id,
      crewId: signature.crewId || signature.crew?.id,
      starballoonCount: signature.starballoonCount,
      songName: signature.songName,
      signatureImageUrl: signature.signatureImageUrl,
      description: signature.description,
      dances: dancesWithId,
    });
    setIsEditing(true);
  };

  // 시그니처 삭제
  const handleDelete = async (id: number) => {
    if (window.confirm("정말로 이 시그니처를 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  // 댄스 정보 추가
  const handleAddDance = () => {
    setFormData({
      ...formData,
      dances: [
        ...formData.dances,
        {
          // id는 undefined (새로운 춤 영상이므로 ID 없음)
          memberName: "",
          danceVideoUrl: "",
          performedAt: getTodayDate(),
        },
      ],
    });
  };

  // 댄스 정보 변경
  const handleDanceChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newDances = [...formData.dances];
    newDances[index] = { ...newDances[index], [field]: value };
    setFormData({ ...formData, dances: newDances });
  };

  // 댄스 정보 제거
  const handleRemoveDance = (index: number) => {
    setFormData({
      ...formData,
      dances: formData.dances.filter((_, i) => i !== index),
    });
  };

  // DanceVideoModal 관련 함수들
  const openDanceModal = () => {
    setIsDanceModalOpen(true);
  };

  const closeDanceModal = () => {
    setIsDanceModalOpen(false);
  };

  const handleDancesSave = (newDances: SignatureFormData["dances"]) => {
    setFormData({
      ...formData,
      dances: newDances,
    });
    setIsDanceModalOpen(false);
  };

  // 오버뷰 이미지 제출
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

  return {
    // 상태
    isEditing,
    formData,
    overviewImageData,
    isDanceModalOpen,

    // 상태 설정자
    setFormData,
    setOverviewImageData,

    // 폼 관리
    initializeForm,
    initializeOverviewForm,
    resetForm,
    resetOverviewForm,

    // 개별 시그니처 관리
    handleSubmit,
    handleEdit,
    handleDelete,
    handleAddDance,
    handleDanceChange,
    handleRemoveDance,

    // DanceVideoModal 관리
    openDanceModal,
    closeDanceModal,
    handleDancesSave,

    // 오버뷰 이미지 관리
    handleOverviewSubmit,

    // Mutation 상태
    createMutation,
    updateMutation,
    deleteMutation,
    updateOverviewImageMutation,
  };
};
