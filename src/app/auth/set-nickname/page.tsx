"use client";

import {
  useCompleteSocialSignup,
  useTempUserInfo,
  useUpdateNickname,
  useVerifyNickname,
} from "@/hooks/auth/useAuthHooks";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SetNicknamePage() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuthStore();

  // 임시 사용자 정보 가져오기
  const { data: tempUserInfo, isLoading: isLoadingTempUserInfo } =
    useTempUserInfo();

  // Use the React Query hooks
  const {
    data: nicknameValidation,
    isLoading: isValidating,
    refetch: validateNickname,
  } = useVerifyNickname(nickname, false);

  const {
    mutate: updateNickname,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateNickname();

  // 소셜 회원가입 완료 훅
  const {
    mutate: completeSocialSignup,
    isPending: isCompleting,
    isError: isCompleteError,
    error: completeError,
  } = useCompleteSocialSignup();
  // Handle errors from the mutation
  useEffect(() => {
    if (isUpdateError && updateError) {
      console.error("닉네임 업데이트 에러:", updateError);
      setError(updateError.message || "닉네임 설정에 실패했습니다.");
    }
    if (isCompleteError && completeError) {
      console.error("회원가입 완료 에러:", completeError);
      setError(completeError.message || "회원가입을 완료할 수 없습니다.");
    }
  }, [isUpdateError, updateError, isCompleteError, completeError]);

  // 페이지 로드 시 임시 사용자 정보 확인
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== "undefined") {
      console.log("현재 토큰:", document.cookie);
    }

    // 임시 사용자 정보가 없으면 로그인 페이지로 리다이렉트
    if (!isLoadingTempUserInfo && !tempUserInfo) {
      console.error("임시 사용자 정보가 없습니다.");
      // router.replace("/login");
    } else {
      console.log("임시 사용자 정보:", tempUserInfo);
    }
  }, [tempUserInfo, isLoadingTempUserInfo, router]);

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
      console.error("닉네임 확인 중 오류:", error);
      setError("닉네임 확인 중 오류가 발생했습니다.");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await handleValidateNickname();
    if (!isValid) return;
    // 임시 사용자인 경우 (소셜 로그인 후 회원가입 완료)
    if (tempUserInfo) {
      console.log("소셜 회원가입 완료 요청:", { nickname, tempUserInfo });
      completeSocialSignup(
        { nickname, tempUserInfo },
        {
          onSuccess: (data) => {
            console.log("소셜 회원가입 완료 성공:", data);
            setUser(data.user);
            router.replace("/");
          },
          onError: (error) => {
            console.error("소셜 회원가입 완료 실패:", error);
            setError(error.message || "회원가입을 완료할 수 없습니다.");
          },
        }
      );
    } else {
      // 기존 사용자 닉네임 업데이트
      updateNickname(nickname, {
        onSuccess: (updatedUser) => {
          setUser(updatedUser);
          router.replace("/");
        },
        onError: (error) => {
          setError(error.message || "닉네임 설정에 실패했습니다.");
        },
      });
    }
  };

  // 로딩 중일 때 표시
  if (isLoadingTempUserInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            닉네임 설정
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            사용하실 닉네임을 입력해주세요.
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
              disabled={isValidating || isUpdating || isCompleting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {isValidating
                ? "확인중..."
                : isUpdating || isCompleting
                ? "처리중..."
                : tempUserInfo
                ? "회원가입 완료"
                : "닉네임 설정 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
