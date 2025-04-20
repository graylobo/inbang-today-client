"use client";

import {
  useVerifyNickname,
  useUpdateNickname,
} from "@/hooks/auth/useAuthHooks";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SetNicknamePage() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuthStore();

  // Use the React Query hooks
  const {
    data: nicknameValidation,
    isLoading: isValidating,
    refetch: validateNickname,
  } = useVerifyNickname(nickname, false);

  const {
    mutate: updateNickname,
    isPending: isUpdating,
    isError,
    error: updateError,
  } = useUpdateNickname();

  // Handle errors from the mutation
  useEffect(() => {
    if (isError && updateError) {
      setError(updateError.message || "닉네임 설정에 실패했습니다.");
    }
  }, [isError, updateError]);

  const handleValidateNickname = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return false;
    }

    try {
      const result = await validateNickname();
      if (!result.data?.isAvailable) {
        setError("이미 사용중인 닉네임입니다.");
        return false;
      }
      setError("");
      return true;
    } catch (error) {
      setError("닉네임 확인 중 오류가 발생했습니다.");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await handleValidateNickname();
    if (!isValid) return;

    updateNickname(nickname, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);
        router.replace("/");
      },
      onError: (error) => {
        setError(error.message || "닉네임 설정에 실패했습니다.");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            닉네임 설정
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            사용하실 닉네임을 입력해주세요. 한 번 설정한 닉네임은 변경이 어려울
            수 있습니다.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nickname" className="sr-only">
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onBlur={handleValidateNickname}
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={isValidating || isUpdating}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {isValidating
                ? "확인중..."
                : isUpdating
                ? "처리중..."
                : "닉네임 설정 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
