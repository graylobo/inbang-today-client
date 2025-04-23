"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateProfileImage } from "@/hooks/user/useUser";
import { useAuthStore } from "@/store/authStore";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUserRank, useUserBadges } from "@/api-hooks/rank.hooks";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: rank } = useUserRank();
  const { data: badges } = useUserBadges();

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
    // TODO: API call to update nickname
    setIsEditing(false);
  };

  const { mutate: uploadImage, isPending } = useUpdateProfileImage();

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("파일 크기는 5MB를 초과할 수 없습니다.");
      return false;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("JPG, JPEG, PNG 파일만 업로드할 수 있습니다.");
      return false;
    }

    return true;
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    uploadImage(formData);
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage src={user?.image} />
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
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
              />
            </>
          )}
        </div>
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
          <Input value="2,836P" readOnly className="bg-gray-50" />
        </div>

        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button onClick={handleSave}>저장</Button>
            </>
          ) : (
            <Button onClick={handleEdit}>수정</Button>
          )}
        </div>
      </div>

      {/* 랭크 정보 */}
      {rank && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-2">내 랭크</h2>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold">{rank.rank}</span>
            <span className="text-gray-500">({rank.rankCategory})</span>
            <span className="ml-2 text-blue-600 font-semibold">
              {rank.activityPoints}P
            </span>
          </div>
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
