"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update nickname when user data changes (e.g., after page refresh)
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      // TODO: API call to upload image
      // const response = await fetch('/api/user/profile-image', {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (response.ok) {
      //   const data = await response.json();
      //   // Update user profile image in auth store
      // }
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
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
                className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
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

        <div className="space-y-2">
          <label className="text-sm font-medium">출석체크 완료</label>
          <Input value="✓" readOnly className="bg-gray-50" />
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
    </div>
  );
}
