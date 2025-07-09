import Image from "next/image";
import { Skeleton } from "@mui/material";
import { useState, memo } from "react";

interface ResizeOptions {
  width: number;
  height: number;
}

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  resize?: ResizeOptions;
}

function ImageLoader({ src, alt, className, resize }: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  if (!src?.trim()) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <span className="text-gray-400">이미지 없음</span>
      </div>
    );
  }

  const imageUrl = resize ? `${src}?w=${resize.width}&h=${resize.height}` : src;
  
  // 허용된 도메인 목록
  const allowedDomains = [
    'profile.img.sooplive.co.kr',
    'liveimg.sooplive.co.kr', 
    'file.inbangtoday.com'
  ];
  
  // 현재 이미지 URL의 도메인 확인
  const isAllowedDomain = allowedDomains.some(domain => 
    imageUrl.includes(domain)
  );
  
  // 허용되지 않은 도메인의 경우 unoptimized 사용
  const shouldOptimize = isAllowedDomain;

  return (
    <div className="absolute inset-0">
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          className="absolute inset-0 z-10"
        />
      )}
      {isError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-600">이미지를 불러올 수 없습니다</span>
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          unoptimized={!shouldOptimize}
          className={`transition-opacity duration-300 ease-in-out ${
            isLoading ? "opacity-0" : "opacity-100"
          } ${className || ""}`}
          style={{
            objectFit: "contain",
            zIndex: 0,
          }}
          onLoadingComplete={() => setIsLoading(false)}
          onError={(error) => {
            console.log("Image loading error:", error);
            console.log("src:", imageUrl);
            setIsError(true);
            setIsLoading(false);
          }}
          loading="lazy"
        />
      )}
    </div>
  );
}

export default memo(ImageLoader);
