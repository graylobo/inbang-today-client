/**
 * Date formatting utilities for converting UTC dates to Korean time
 * and formatting them according to different display options.
 */

export type DateFormatOption =
  | "mm.dd"
  | "mm.dd hh:mm:ss"
  | "yyyy.mm.dd hh:mm:ss"
  | "hh:mm:ss"
  | "hh:mm";

/**
 * Options for date formatting
 */
export interface DateFormatOptions {
  /**
   * Whether to show only time for today's dates
   * @default false
   */
  showTimeOnlyForToday?: boolean;
  /**
   * 오늘 날짜일 때 경과시간(방금전, n초전, n분전, n시간전 등)으로 표시
   * @default false
   */
  showElapsedForToday?: boolean;
}

/**
 * Converts a UTC date string to Korean time (UTC+9)
 * @param dateString UTC date string (e.g., "2025-04-13T11:10:47.443Z")
 * @returns Date object in Korean time
 */
export const toKoreanTime = (dateString: string): Date => {
  const date = new Date(dateString);
  // Create a new date with the UTC time plus 9 hours
  const koreanDate = new Date(date.getTime());
  koreanDate.setUTCHours(koreanDate.getUTCHours() + 9);
  return koreanDate;
};

/**
 * Checks if a date is today in Korean time
 * @param dateString UTC date string
 * @returns boolean indicating if the date is today
 */
export const isToday = (dateString: string): boolean => {
  const koreanDate = toKoreanTime(dateString);
  const today = new Date();

  // Convert today to Korean time for comparison
  const koreanToday = new Date(today.getTime());
  koreanToday.setUTCHours(koreanToday.getUTCHours() + 9);

  return (
    koreanDate.getFullYear() === koreanToday.getFullYear() &&
    koreanDate.getMonth() === koreanToday.getMonth() &&
    koreanDate.getDate() === koreanToday.getDate()
  );
};

/**
 * 오늘 날짜일 때 경과시간(방금전, n초전, n분전, n시간전 등) 문자열 반환
 * @param date Date 객체 (KST)
 * @returns 경과시간 문자열
 */
const getElapsedTimeString = (date: Date): string => {
  const now = new Date();
  now.setUTCHours(now.getUTCHours()); // 현재 KST
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // 초 단위

  if (diff < 10) return "방금전";
  if (diff < 60) return `${diff}초전`;
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min}분전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간전`;
  const day = Math.floor(hour / 24);
  return `${day}일전`;
};

/**
 * Formats a date according to the specified format option
 * @param dateString UTC date string (e.g., "2025-04-13T11:10:47.443Z")
 * @param format Format option for the date
 * @param options Additional formatting options
 * @returns Formatted date string in Korean time
 */
export const formatDate = (
  dateString: string,
  format: DateFormatOption = "yyyy.mm.dd hh:mm:ss",
  options: DateFormatOptions = {}
): string => {
  const { showTimeOnlyForToday = false, showElapsedForToday = false } = options;
  const koreanDate = toKoreanTime(dateString);

  // 오늘이고 showElapsedForToday 옵션이 true면 경과시간 표시
  if (showElapsedForToday && isToday(dateString)) {
    return getElapsedTimeString(koreanDate);
  }

  // If the date is today and showTimeOnlyForToday is true, show only time
  if (showTimeOnlyForToday && isToday(dateString)) {
    const hours = String(koreanDate.getHours()).padStart(2, "0");
    const minutes = String(koreanDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const year = koreanDate.getFullYear();
  const month = String(koreanDate.getMonth() + 1).padStart(2, "0");
  const day = String(koreanDate.getDate()).padStart(2, "0");
  const hours = String(koreanDate.getHours()).padStart(2, "0");
  const minutes = String(koreanDate.getMinutes()).padStart(2, "0");
  const seconds = String(koreanDate.getSeconds()).padStart(2, "0");

  switch (format) {
    case "mm.dd":
      return `${month}.${day}`;
    case "mm.dd hh:mm:ss":
      return `${month}.${day} ${hours}:${minutes}:${seconds}`;
    case "yyyy.mm.dd hh:mm:ss":
      return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
    case "hh:mm:ss":
      return `${hours}:${minutes}:${seconds}`;
    case "hh:mm":
      return `${hours}:${minutes}`;
    default:
      return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  }
};
