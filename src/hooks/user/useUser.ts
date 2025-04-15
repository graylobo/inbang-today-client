import { useAuthStore, User } from "@/store/authStore";
import {
  getUserProfile,
  getUsers,
  updateProfileImage,
} from "@/libs/api/services/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// export function useGetUserProfile() {
//   return useQuery<User[]>({
//     queryKey: ["user", "profile"],
//     queryFn: () => getUserProfile(),
//   });
// }

export function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ["user", "list"],
    queryFn: () => getUsers(),
  });
}

export function useUpdateProfileImage() {
  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: (data) => {
      if (data.success) {
        useAuthStore.setState((state) => ({
          ...state,
          user: state.user
            ? {
                ...state.user,
                image: data.data.profileImage,
              }
            : null,
        }));
        toast.success("프로필 이미지가 업데이트되었습니다.");
      }
    },
    onError: (error) => {
      console.error("Failed to upload image:", error);
      toast.error("이미지 업로드에 실패했습니다.");
    },
  });
}
