import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";
import { isValidImageUrl } from "@/libs/utils";

interface MemberCardProps {
  member: {
    id: number;
    name: string;
    profileImageUrl?: string;
    broadcastUrl?: string;
    rank: {
      name: string;
      level: number;
    };
  };
  onEarningClick: () => void;
}

export default function MemberCard({
  member,
  onEarningClick,
}: MemberCardProps) {
  const { user } = useAuthStore();
  const [imgError, setImgError] = useState(false);
  const showDefaultAvatar =
    !isValidImageUrl(member.profileImageUrl) || imgError;

  return (
    <div className="p-4 bg-white dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-none transition-all">
      <div className="flex flex-wrap items-center gap-4 min-w-[210px]">
        <div className="relative w-16 h-16 flex-shrink-0">
          {!showDefaultAvatar ? (
            <a
              href={member.broadcastUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <Image
                src={member.profileImageUrl!}
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
            <h3 className="font-medium text-lg dark:text-gray-100 truncate">
              {member.name}
            </h3>
            <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 truncate">
              {member.rank.name}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {member.broadcastUrl && (
              <a
                href={member.broadcastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-block truncate"
              >
                방송국
              </a>
            )}
            {user ? (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
