import { User } from "@/store/authStore";
import { getUserProfile } from "@/libs/api/services/user.service";
import { useQuery } from "@tanstack/react-query";

export function useGetUserProfile() {
  return useQuery<User[]>({
    queryKey: ["user", "profile"],
    queryFn: () => getUserProfile(),
  });
}
