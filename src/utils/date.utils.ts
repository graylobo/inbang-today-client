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
}

/**
 * Converts a UTC date string to Korean time (UTC+9)
 * @param dateString UTC date string (e.g., "2025-04-13T11:10:47.443Z")
 * @returns Date object in Korean time
 */
export const toKoreanTime = (dateString: string): Date => {
  const date = new Date(dateString);
  return new Date(date.getTime() + 9 * 60 * 60 * 1000); // Add 9 hours for Korean time
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
  const koreanToday = new Date(today.getTime() + 9 * 60 * 60 * 1000);

  return (
    koreanDate.getUTCFullYear() === koreanToday.getUTCFullYear() &&
    koreanDate.getUTCMonth() === koreanToday.getUTCMonth() &&
    koreanDate.getUTCDate() === koreanToday.getUTCDate()
  );
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
  const { showTimeOnlyForToday = false } = options;
  const koreanDate = toKoreanTime(dateString);

  // If the date is today and showTimeOnlyForToday is true, show only time
  if (showTimeOnlyForToday && isToday(dateString)) {
    const hours = String(koreanDate.getUTCHours()).padStart(2, "0");
    const minutes = String(koreanDate.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const year = koreanDate.getUTCFullYear();
  const month = String(koreanDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(koreanDate.getUTCDate()).padStart(2, "0");
  const hours = String(koreanDate.getUTCHours()).padStart(2, "0");
  const minutes = String(koreanDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(koreanDate.getUTCSeconds()).padStart(2, "0");

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
