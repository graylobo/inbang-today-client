import React from "react";
import { useStreamerSearch } from "@/hooks/streamer/useStreamerSearch";
import { Streamer } from "@/hooks/streamer/useStreamer.type";

interface StreamerSearchBoxProps {
  onSelectStreamer: (streamer: Streamer) => void;
  placeholder?: string;
  description?: string;
  showCrewInfo?: boolean;
  className?: string;
}

export const StreamerSearchBox: React.FC<StreamerSearchBoxProps> = ({
  onSelectStreamer,
  placeholder = "스트리머 이름 또는 숲 ID로 검색",
  description,
  showCrewInfo = true,
  className = "",
}) => {
  const {
    searchQuery,
    isSearching,
    searchResults,
    isLoadingSearch,
    searchResultsRef,
    searchInputRef,
    handleSearchQueryChange,
    handleSearchInputFocus,
    handleSelectSearchResult,
  } = useStreamerSearch();

  return (
    <div className={className}>
      <div className="relative">
        <input
          type="text"
          ref={searchInputRef}
          value={searchQuery}
          onChange={(e) => handleSearchQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          onFocus={handleSearchInputFocus}
        />
        {isSearching && searchResults && searchResults.length > 0 && (
          <div
            ref={searchResultsRef}
            className="absolute z-10 w-full bg-white dark:bg-gray-700 mt-1 shadow-lg rounded-md border border-gray-200 dark:border-gray-600 max-h-60 overflow-y-auto"
          >
            {isLoadingSearch ? (
              <div className="p-2 text-center text-gray-500 dark:text-gray-400">
                검색 중...
              </div>
            ) : (
              <ul className="py-1">
                {searchResults.map((result) => (
                  <li
                    key={result.id}
                    onClick={() =>
                      handleSelectSearchResult(result, onSelectStreamer)
                    }
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
                  >
                    {result.soopId && (
                      <img
                        src={`https://profile.img.sooplive.co.kr/LOGO/${result.soopId.slice(
                          0,
                          2
                        )}/${result.soopId}/${result.soopId}.jpg`}
                        alt={result.name}
                        className="w-8 h-8 rounded-full mr-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/40";
                        }}
                      />
                    )}
                    <div>
                      <div className="font-medium dark:text-gray-100">
                        {result.name}
                      </div>
                      {result.soopId && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {result.soopId}
                        </div>
                      )}
                      {showCrewInfo && result.crew && (
                        <div className="text-xs text-blue-500 dark:text-blue-400">
                          {result.crew.name}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};
