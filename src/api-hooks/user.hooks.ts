import { useQuery } from "@tanstack/react-query";
import { getUsers, getUserProfile } from "@/libs/api/services/user.service";

export function useUserProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(),
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
}
