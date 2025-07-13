import imageCompression from "browser-image-compression";

// 이미지 압축 옵션 타입 정의
export interface ImageCompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

// 압축 프리셋 정의
export const COMPRESSION_PRESETS = {
  // 프로필 이미지용 - 고품질, 작은 파일 크기
  profile: {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: 0.8,
  },

  // 썸네일용 - 매우 작은 파일 크기
  thumbnail: {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 500,
    useWebWorker: true,
    quality: 0.7,
  },

  // 일반 이미지용 - 균형잡힌 압축
  general: {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    quality: 0.8,
  },
} as const;

export type CompressionPreset = keyof typeof COMPRESSION_PRESETS;

export interface CompressionResult {
  originalFile: File;
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  timeTaken: number;
}

/**
 * 이미지를 압축하는 함수
 * @param file - 압축할 이미지 파일
 * @param preset - 압축 프리셋 또는 사용자 정의 옵션
 * @returns 압축 결과 정보를 포함한 객체
 */
export const compressImage = async (
  file: File,
  preset: CompressionPreset | ImageCompressionOptions = "profile"
): Promise<CompressionResult> => {
  const startTime = performance.now();

  // 프리셋 문자열인 경우 해당 옵션 사용, 아니면 사용자 정의 옵션 사용
  const options =
    typeof preset === "string"
      ? COMPRESSION_PRESETS[preset as CompressionPreset]
      : preset;

  try {
    const compressedFile = await imageCompression(file, options);
    const endTime = performance.now();

    const originalSize = file.size;
    const compressedSize = compressedFile.size;
    const compressionRatio = (1 - compressedSize / originalSize) * 100;
    const timeTaken = endTime - startTime;

    return {
      originalFile: file,
      compressedFile,
      originalSize,
      compressedSize,
      compressionRatio,
      timeTaken,
    };
  } catch (error) {
    console.error("이미지 압축 중 오류가 발생했습니다:", error);
    throw error;
  }
};

/**
 * 파일 크기를 읽기 쉬운 형태로 변환
 * @param bytes - 바이트 단위의 파일 크기
 * @returns 형식화된 파일 크기 문자열
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * 이미지 파일 유효성 검사
 * @param file - 검사할 파일
 * @param maxSize - 최대 파일 크기 (바이트)
 * @param allowedTypes - 허용된 파일 타입들
 * @returns 유효성 검사 결과 및 에러 메시지
 */
export const validateImageFile = (
  file: File,
  maxSize: number = 5 * 1024 * 1024, // 기본 5MB
  allowedTypes: string[] = ["image/jpeg", "image/jpg", "image/png"]
): { isValid: boolean; error?: string } => {
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `파일 크기는 ${formatFileSize(maxSize)}를 초과할 수 없습니다.`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes
      .map((type) => type.split("/")[1].toUpperCase())
      .join(", ");
    return {
      isValid: false,
      error: `${allowedExtensions} 파일만 업로드할 수 있습니다.`,
    };
  }

  return { isValid: true };
};

/**
 * 이미지 미리보기 URL 생성
 * @param file - 미리보기할 파일
 * @returns 미리보기 URL
 */
export const createImagePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * 이미지 미리보기 URL 정리
 * @param url - 정리할 URL
 */
export const revokeImagePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};
