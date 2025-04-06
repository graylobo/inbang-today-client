import { User } from "@/store/authStore";
import { getUserProfile, getUsers } from "@/libs/api/services/user.service";
import { useQuery } from "@tanstack/react-query";

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