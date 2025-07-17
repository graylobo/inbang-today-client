"use client";

import { useUserBadges, useUserRank } from "@/api-hooks/rank.hooks";
import { RankInfo } from "@/components/rank/RankInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SoopAuthIcon from "@/components/SoopAuthIcon";
import { useUpdateNickname } from "@/hooks/auth/useAuthHooks";
import { useUpdateProfileImage } from "@/hooks/user/useUser";
import { useAuthStore } from "@/store/authStore";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (서버에서 압축 처리)
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: rank } = useUserRank();
  const { data: badges } = useUserBadges();
  const { mutate: updateNickname, isPending: isUpdatingNickname } =
    useUpdateNickname();

  useEffect(() => {
    if (user?.name) {
      setNickname(user.name);
    }
  }, [user?.name]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setNickname(user?.name || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (nickname.trim() === "") {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    if (nickname === user?.name) {
      setIsEditing(false);
      return;
    }

    updateNickname(nickname, {
      onSuccess: (updatedUser) => {
        toast.success("닉네임이 성공적으로 변경되었습니다.");
        setUser({ ...user, ...updatedUser });
        setIsEditing(false);
      },
      onError: (error: any) => {
        console.error("닉네임 업데이트 에러:", error);
        toast.error(error.message || "닉네임 변경에 실패했습니다.");
        setNickname(user?.name || "");
      },
    });
  };

  const { mutate: uploadImage, isPending } = useUpdateProfileImage();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `파일 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다.`
      );
      e.target.value = "";
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("JPG, PNG, GIF 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    try {
      // 서버에서 이미지 압축 처리
      const formData = new FormData();
      formData.append("image", file);

      uploadImage(formData);
    } catch (error) {
      console.error("이미지 업로드 중 오류:", error);
      toast.error("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      // 파일 input 초기화
      e.target.value = "";
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          {isEditing && (
            <>
              <button
                onClick={handleImageClick}
                disabled={isPending}
                className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                className="hidden"
              />
            </>
          )}
        </div>

        {/* 이미지 업로드 가이드 */}
        {isEditing && (
          <div className="text-sm text-gray-600 text-center">
            <p>JPG, PNG, GIF 파일만 업로드 가능 (최대 10MB)</p>
            <p className="text-xs mt-1">
              이미지는 서버에서 자동으로 WebP 형식으로 압축됩니다
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="space-y-2">
          <label className="text-sm font-medium">아이디</label>
          <Input value={user?.email || ""} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">닉네임</label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            readOnly={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">내 포인트</label>
          <Input
            value={rank?.activityPoints || 0}
            readOnly
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">숲 인증</label>
          <SoopAuthIcon />
        </div>

        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdatingNickname}
              >
                취소
              </Button>
              <Button onClick={handleSave} disabled={isUpdatingNickname}>
                {isUpdatingNickname ? "저장 중..." : "저장"}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>수정</Button>
          )}
        </div>
      </div>

      {/* 랭크 정보 */}
      {rank && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
          <RankInfo userRank={rank} />
        </div>
      )}

      {/* 뱃지 정보 */}
      {badges && badges.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-2">획득한 뱃지</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((userBadge, idx) => (
              <div
                key={userBadge.badge.id}
                className="bg-gray-100 rounded-lg p-4 text-center"
              >
                <img
                  src={userBadge.badge.imageUrl}
                  alt={userBadge.badge.name}
                  className="w-12 h-12 mx-auto mb-2"
                />
                <div className="font-medium">{userBadge.badge.name}</div>
                <div className="text-sm text-gray-600">
                  {userBadge.badge.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
