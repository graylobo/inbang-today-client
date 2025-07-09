import { useState, useRef, useEffect } from "react";
import { useSearchStreamers } from "./useStreamer";
import { getStreamerById } from "@/libs/api/services/streamer.service";
import { Streamer } from "./useStreamer.type";

export const useStreamerSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 스트리머 검색 쿼리
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchStreamers(searchQuery, searchQuery.trim().length >= 1);

  // 검색 결과 외부 클릭 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 검색어 변경 핸들러
  const handleSearchQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    // 검색어가 1글자 이상이면 검색 시작
    if (newQuery.trim().length >= 1) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  // 검색 입력 포커스 핸들러
  const handleSearchInputFocus = () => {
    if (searchQuery.trim().length >= 1) {
      setIsSearching(true);
    }
  };

  // 검색 결과 선택 핸들러
  const handleSelectSearchResult = async (
    streamer: Streamer,
    onSelect: (streamerDetails: Streamer) => void
  ) => {
    try {
      // API 호출하여 스트리머 상세 정보 조회
      const streamerDetails = await getStreamerById(streamer.id);

      // 크루 멤버와 호환되는 형태로 변환
      const memberData: Streamer = {
        id: streamerDetails.id,
        name: streamerDetails.name,
        soopId: streamerDetails.soopId,
        crew: streamerDetails.crew,
        rank: streamerDetails.rank,
        race: streamerDetails.race,
        tier: streamerDetails.tier,
      };

      // 콜백 호출
      onSelect(memberData);

      // 검색 상태 초기화
      setSearchQuery("");
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching streamer details:", error);
      alert("스트리머 정보를 불러오는데 실패했습니다.");
    }
  };

  // 검색 상태 초기화
  const resetSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  return {
    // 상태
    searchQuery,
    isSearching,
    searchResults,
    isLoadingSearch,

    // Refs
    searchResultsRef,
    searchInputRef,

    // 핸들러
    handleSearchQueryChange,
    handleSearchInputFocus,
    handleSelectSearchResult,
    resetSearch,

    // 직접 상태 설정 (필요한 경우)
    setSearchQuery,
    setIsSearching,
  };
};
