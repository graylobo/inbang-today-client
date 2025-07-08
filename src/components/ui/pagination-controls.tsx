import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import {
  ITEMS_PER_PAGE_OPTIONS,
  DEFAULT_ITEMS_PER_PAGE,
} from "@/constants/pagination";

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPageOptions?: number[];
  itemsPerPage?: number;
  onItemsPerPageChange?: (perPage: number) => void;
  showItemsPerPage?: boolean;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPageOptions = ITEMS_PER_PAGE_OPTIONS,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  onItemsPerPageChange,
  showItemsPerPage = true,
}: PaginationControlsProps) => {
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const maxPageButtons = 5;
    let pageNumbers = [];

    if (totalPages <= maxPageButtons) {
      // Show all pages if there are fewer than maxPageButtons
      pageNumbers = Array.from(
        { length: Math.max(1, totalPages) },
        (_, i) => i + 1
      );
    } else {
      // Calculate start and end of page buttons
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;

      // Adjust if end exceeds total pages
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      // Add first page and ellipsis if not starting from page 1
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("ellipsis-start");
        }
      }

      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis and last page if not ending at the last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("ellipsis-end");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4 border-t dark:border-gray-700">
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex justify-end w-full px-4">
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 rounded border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm cursor-pointer"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}개씩 보기
              </option>
            ))}
          </select>
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            />
          </PaginationItem>

          {getPageNumbers().map((pageNumber, index) => (
            <PaginationItem key={`${pageNumber}-${index}`}>
              {pageNumber === "ellipsis-start" ||
              pageNumber === "ellipsis-end" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={currentPage === pageNumber}
                  onClick={() => onPageChange(pageNumber as number)}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
