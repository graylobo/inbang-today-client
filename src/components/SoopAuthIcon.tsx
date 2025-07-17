"use client";

import { useSoopAuthStatus } from "@/hooks/soop-auth/useSoopAuthStatus";
import { CheckCircle, Circle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface SoopAuthIconProps {
  className?: string;
}

export default function SoopAuthIcon({ className = "" }: SoopAuthIconProps) {
  const { data: authStatus, isLoading } = useSoopAuthStatus();

  console.log("SoopAuthIcon 렌더링:", { authStatus, isLoading });

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Circle className="w-5 h-5 text-gray-400 animate-pulse" />
        <span className="text-sm text-gray-500">인증 확인 중...</span>
      </div>
    );
  }

  if (authStatus?.isVerified) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <CheckCircle className="w-5 h-5 text-green-500" />
        <span className="text-sm text-green-600">숲 인증 완료</span>
        {authStatus.username && (
          <span className="text-xs text-gray-500">({authStatus.username})</span>
        )}
      </div>
    );
  }

  return (
    <Link href="/user/soop-auth">
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center space-x-2 ${className}`}
      >
        <Circle className="w-4 h-4" />
        <span>숲 인증</span>
        <ExternalLink className="w-3 h-3" />
      </Button>
    </Link>
  );
}
