"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGeneratePlatformAuthCode,
  useVerifyPlatformAuth,
} from "@/hooks/platform-verification/usePlatformAuth";
import { Copy, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SoopAuthPage() {
  const [username, setUsername] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const { mutate: generateCode, isPending: isGenerating } =
    useGeneratePlatformAuthCode();
  const { mutate: verifyAuth, isPending: isVerifyingAuth } =
    useVerifyPlatformAuth();

  const handleGenerateCode = () => {
    if (!username.trim()) {
      toast.error("숲 아이디를 입력해주세요.");
      return;
    }

    generateCode(
      { platformName: "soop", username },
      {
        onSuccess: (code) => {
          setAuthCode(code);
          toast.success("인증 코드가 생성되었습니다.");
        },
      }
    );
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(authCode);
      toast.success("인증 코드가 복사되었습니다.");
    } catch (error) {
      console.error("복사 실패:", error);
      toast.error("복사에 실패했습니다.");
    }
  };

  const handleVerifyAuth = () => {
    if (!username.trim()) {
      toast.error("숲 아이디를 입력해주세요.");
      return;
    }

    if (!authCode) {
      toast.error("먼저 인증 코드를 생성해주세요.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage(""); // 에러 메시지 초기화
    verifyAuth(
      { platformName: "soop", username },
      {
        onSuccess: (response) => {
          if (response.success) {
            toast.success("숲 인증이 완료되었습니다!");
            // toast 메시지가 표시될 시간을 주기 위해 약간의 지연 후 리다이렉트
            setTimeout(() => {
              router.push("/user/profile");
            }, 1000);
          } else {
            setErrorMessage(response.message || "인증에 실패했습니다.");
          }
        },
        onError: (error: any) => {
          setErrorMessage(error.message || "인증 확인 중 오류가 발생했습니다.");
        },
        onSettled: () => {
          setIsVerifying(false);
        },
      }
    );
  };

  const profileUrl = username
    ? `https://ch.sooplive.co.kr/${username}/setting/basic`
    : "";
  const userProfileUrl = username
    ? `https://ch.sooplive.co.kr/${username}`
    : "";

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">숲 인증</h1>
        <p className="text-gray-600">
          숲 아이디를 입력하여 인증을 완료해주세요.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
        {/* 숲 아이디 입력 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">숲 아이디</label>
          <div className="flex space-x-2">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="숲 아이디를 입력해주세요"
              className="flex-1"
            />
            <Button
              onClick={handleGenerateCode}
              disabled={isGenerating || !username.trim()}
            >
              {isGenerating ? "생성 중..." : "인증 코드 생성"}
            </Button>
          </div>
        </div>

        {/* 인증 코드 표시 */}
        {authCode && (
          <div className="space-y-2">
            <label className="text-sm font-medium">인증 코드</label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
              <code className="flex-1 font-mono text-sm">{authCode}</code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>복사</span>
              </Button>
            </div>
          </div>
        )}

        {/* 프로필 설정 링크 */}
        {authCode && profileUrl && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              인증코드를 복사하셨다면, 아래 링크로 이동하여 프로필 메세지를
              수정해주세요
            </p>
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                {profileUrl}
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(profileUrl, "_blank")}
                className="flex items-center space-x-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>열기</span>
              </Button>
            </div>
          </div>
        )}

        {/* 인증 확인 버튼 */}
        {authCode && (
          <div className="pt-4 space-y-3">
            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                  {errorMessage}
                </p>
              </div>
            )}
            <Button
              onClick={handleVerifyAuth}
              disabled={isVerifyingAuth || isVerifying}
              className="w-full"
            >
              {isVerifyingAuth || isVerifying ? "인증 확인 중..." : "인증 확인"}
            </Button>
          </div>
        )}
      </div>

      {/* 안내 사항 */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          인증 방법
        </h3>
        <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
          <li>숲 아이디를 입력하고 인증 코드를 생성합니다.</li>
          <li>생성된 인증 코드를 복사합니다.</li>
          <li>위의 링크를 클릭하여 숲 프로필 설정 페이지로 이동합니다.</li>
          <li>프로필 메시지에 복사한 인증 코드를 붙여넣고 저장합니다.</li>
          <li>인증 확인 버튼을 클릭하여 인증을 완료합니다.</li>
        </ol>
      </div>
    </div>
  );
}
