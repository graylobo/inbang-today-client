import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";
import { isValidImageUrl } from "@/libs/utils";

interface MemberCardProps {
  member: {
    id: number;
    name: string;
    soopId?: string;
    rank: {
      name: string;
      level: number;
    };
  };
  onEarningClick: () => void;
  onNameClick?: () => void;
}

export default function MemberCard({
  member,
  onEarningClick,
  onNameClick,
}: MemberCardProps) {
  const { user } = useAuthStore();
  const [imgError, setImgError] = useState(false);

  // soopId에서 URL 생성
  const profileImageUrl = member.soopId
    ? `https://profile.img.sooplive.co.kr/LOGO/${member.soopId.slice(0, 2)}/${
        member.soopId
      }/${member.soopId}.jpg`
    : "";
  const broadcastUrl = member.soopId
    ? `https://ch.sooplive.co.kr/${member.soopId}`
    : "";

  const showDefaultAvatar =
    !member.soopId || !isValidImageUrl(profileImageUrl) || imgError;

  return (
    <div className="p-4 bg-white dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-none transition-all">
      <div className="flex flex-wrap items-center gap-4 min-w-[210px]">
        <div className="relative w-16 h-16 flex-shrink-0">
          {!showDefaultAvatar ? (
            <a
              href={broadcastUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <Image
                src={profileImageUrl}
                alt={member.name}
                fill
                sizes="64px"
                className="w-full h-full rounded-full object-cover cursor-pointer"
                onError={() => setImgError(true)}
              />
            </a>
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-xl">
                👤
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-medium text-lg dark:text-gray-100 truncate ${
                onNameClick
                  ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  : ""
              }`}
              onClick={onNameClick}
            >
              {member.name}
            </h3>
            <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 truncate">
              {member.rank.name}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* {user ? (
              <button
                onClick={onEarningClick}
                className="w-[100px] px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 text-sm transition-colors  text-nowrap"
              >
                수익 입력
              </button>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1 bg-gray-500 dark:bg-gray-600 text-white rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 text-sm transition-colors"
              >
                로그인하여 수익 입력
              </Link>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
