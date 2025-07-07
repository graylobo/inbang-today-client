"use client";

import {
  useGetAllCategories,
  useGetStreamerCategories,
  useSetStreamerCategories,
} from "@/hooks/category/useCategory";
import { useCrewPermissionsList } from "@/hooks/crew-permission/useCrewPermission";
import { useGetCrewMemberHistory } from "@/hooks/crew/useCrewMemberHistory";
import {
  useGetCrewRanksByCrewID,
  useGetCrews,
  useRemoveCrewMember,
} from "@/hooks/crew/useCrews";
import MemberHistoryTable from "@/components/common/MemberHistoryTable";
import MemberHistoryFormModal from "@/components/common/MemberHistoryFormModal";
import { useMemberHistoryManager } from "@/hooks/crew/useMemberHistoryManager";

import {
  useDeleteStreamer,
  useGetStreamers,
  useSearchStreamers,
  useUpdateStreamer,
} from "@/hooks/streamer/useStreamer";
import { Streamer } from "@/hooks/streamer/useStreamer.type";
import {
  createCrewMemberHistory,
  CrewMemberHistoryData,
} from "@/libs/api/services/crew.service";
import {
  createStreamer,
  getStreamerById,
} from "@/libs/api/services/streamer.service";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export interface StreamerFormData {
  name: string;
  soopId?: string;
  crewId?: number;
  rankId?: number;
  categoryIds?: number[];
  eventType?:
    | "join"
    | "leave"
    | "rank_change"
    | "basic_info_only"
    | "history_add";
  historyEventType?: "join" | "leave" | "rank_change";
  eventDate?: string;
  note?: string;
}

export default function AdminMembersPage() {
  const searchParams = useSearchParams();
  const crewIdParam = searchParams.get("crewId");
  const { isSuperAdmin, isAdmin } = useAuthStore();

  const [selectedMember, setSelectedMember] = useState<Streamer | null>(null);
  const [selectedCrewId, setSelectedCrewId] = useState<number | "all">(
    crewIdParam ? parseInt(crewIdParam) : "all"
  );
  const [activeTab, setActiveTab] = useState<"registerStreamer" | "manageCrew">(
    "registerStreamer"
  );

  console.log("selectedMember:::", selectedMember);
  // Get today's date in YYYY-MM-DD format for the default date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // 기본 폼 데이터 상태
  const [formData, setFormData] = useState<StreamerFormData>({
    name: "",
    soopId: "",
    crewId: 0,
    rankId: 0,
    categoryIds: [],
    eventType: "basic_info_only",
    eventDate: getTodayDate(),
    note: "",
  });

  // 신규 스트리머 등록을 위한 간소화된 폼 데이터
  const [newStreamerData, setNewStreamerData] = useState({
    name: "",
    soopId: "",
  });

  // 스트리머 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 스트리머 검색 쿼리
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchStreamers(searchQuery, searchQuery.trim().length >= 1);

  const resetForm = () => {
    setFormData({
      name: "",
      soopId: "",
      crewId: 0,
      rankId: 0,
      categoryIds: [],
      eventType: "basic_info_only",
      historyEventType: "join",
      eventDate: getTodayDate(),
      note: "",
    });
    setSelectedMember(null);
    setSearchQuery("");
    setIsSearching(false);
  };

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

  // 슈퍼어드민이 아닌 사용자가 기본정보 수정 모드에 있을 때 자동으로 다른 옵션으로 변경
  useEffect(() => {
    if (!isSuperAdmin && formData.eventType === "basic_info_only") {
      setFormData({
        ...formData,
        eventType: "history_add",
      });
    }
  }, [isSuperAdmin, formData.eventType]);

  const queryClient = useQueryClient();

  // 모든 크루 목록 조회
  const { data: allCrews } = useGetCrews();

  // 권한이 있는 크루 목록 조회
  const { crews: permittedCrews } = useCrewPermissionsList();

  // 선택된 크루의 계급 목록 조회
  const { data: ranks } = useGetCrewRanksByCrewID(
    formData.crewId?.toString() || ""
  );

  // 모든 멤버 조회
  const { data: members, isLoading: isLoadingMembers } = useGetStreamers();

  // 모든 카테고리 조회
  const { data: categories, isLoading: isLoadingCategories } =
    useGetAllCategories();

  // 선택된 멤버의 카테고리 조회
  const { data: memberCategories, isLoading: isLoadingMemberCategories } =
    useGetStreamerCategories(selectedMember?.id);

  // 멤버 업데이트 mutation
  const { mutate: updateStreamer } = useUpdateStreamer(resetForm);

  // 멤버 삭제 mutation
  const { mutate: deleteStreamer } = useDeleteStreamer();

  // 멤버 크루 탈퇴 mutation
  const { mutate: removeFromCrew } = useRemoveCrewMember();

  // 카테고리 설정 mutation
  const { mutate: setCategories } = useSetStreamerCategories(() => {
    queryClient.invalidateQueries({ queryKey: ["crewMembers"] });
  });

  // Excel 카테고리 ID 찾기
  const excelCategoryId = categories?.find(
    (category) => category.name.toLowerCase() === "excel"
  )?.id;

  // 편집 가능한 크루 목록 가져오기
  const getEditableCrews = () => {
    // 슈퍼 어드민은 모든 크루 볼 수 있음
    if (isSuperAdmin) {
      return allCrews || [];
    }

    // 일반 어드민은 권한이 있는 크루만 볼 수 있음
    return permittedCrews || [];
  };

  const editableCrews = getEditableCrews();

  // 멤버의 카테고리 정보가 로드되면 폼에 반영
  useEffect(() => {
    if (memberCategories && selectedMember) {
      // 카테고리 ID 목록을 유지하되, 화면에 표시하지 않음
      const categoryIds = memberCategories.map((item) => item.category.id);
      setFormData((prev) => ({ ...prev, categoryIds }));
    }
  }, [memberCategories, selectedMember]);

  // 편집 권한이 없는 크루를 선택한 경우, 자동으로 'all'로 변경
  useEffect(() => {
    if (selectedCrewId !== "all" && !isSuperAdmin) {
      const hasPermission = permittedCrews?.some(
        (crew: any) => crew.id === selectedCrewId
      );
      if (!hasPermission) {
        setSelectedCrewId("all");
      }
    }
  }, [selectedCrewId, permittedCrews, isSuperAdmin]);

  // 선택된 멤버의 크루 히스토리 조회
  const { data: memberHistory, isLoading: isLoadingHistory } =
    useGetCrewMemberHistory(selectedMember?.id);

  // 히스토리 관리 커스텀 훅
  const historyManager = useMemberHistoryManager();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Early return 패턴으로 null 체크
    if (!selectedMember) {
      alert("스트리머를 먼저 선택해주세요.");
      return;
    }

    // 변수로 추출하여 null이 아님을 명확히 함
    const streamerId = selectedMember.id;
    const memberCrew = selectedMember.crew;
    const memberRank = selectedMember.rank;

    // 필수 필드 검증
    const missingFields = [];
    if (!formData.name.trim()) missingFields.push("멤버 이름");
    if (!formData.soopId?.trim()) missingFields.push("숲 ID (SOOP ID)");

    // 크루 관련 필드는 기본 정보만 수정하는 경우에는 필수가 아님
    if (formData.eventType !== "basic_info_only") {
      if (!formData.crewId) missingFields.push("크루");
      if (!formData.rankId) missingFields.push("계급");
      if (!formData.eventDate) missingFields.push("이벤트 날짜");
    }

    if (missingFields.length > 0) {
      alert(`다음 필드를 입력해주세요: ${missingFields.join(", ")}`);
      return;
    }

    // 슈퍼어드민이 아니면서 해당 크루에 대한 권한이 없는 경우 거부
    if (formData.eventType !== "basic_info_only" && !isSuperAdmin) {
      const hasPermission = permittedCrews?.some(
        (crew: any) => crew.id === formData.crewId
      );
      if (!hasPermission) {
        alert("이 크루에 대한 편집 권한이 없습니다.");
        return;
      }
    }

    // Excel 카테고리 ID 설정
    const formDataWithExcel = {
      ...formData,
      categoryIds: excelCategoryId ? [excelCategoryId] : [],
    };

    // 히스토리 데이터 준비
    const historyData = {
      streamerId,
      crewId:
        formData.eventType === "join" ? formData.crewId : memberCrew?.id || 0,
      eventType: formData.eventType as "join" | "leave" | "rank_change",
      eventDate: formData.eventDate,
      note: formData.note,
      // 직급 변경인 경우 이전 직급과 새 직급 정보 추가
      oldRankId:
        formData.eventType === "rank_change"
          ? memberRank?.id
          : formData.eventType === "leave" && memberRank
          ? memberRank.id
          : undefined,
      newRankId:
        formData.eventType === "rank_change" || formData.eventType === "join"
          ? formData.rankId
          : undefined,
    };

    // 퇴사 이벤트인 경우, 히스토리를 먼저 기록하고 나서 크루에서 제거
    if (formData.eventType === "leave" && memberCrew) {
      // 히스토리 기록 후 API 응답을 기다렸다가 크루에서 제거
      createCrewMemberHistory(historyData as CrewMemberHistoryData)
        .then(() => {
          // 히스토리 기록 성공 후 크루에서 제거
          return removeFromCrew(streamerId);
        })
        .then(() => {
          // 성공적으로 처리되면 쿼리 캐시 무효화
          queryClient.invalidateQueries({ queryKey: ["members"] });
          queryClient.invalidateQueries({ queryKey: ["memberHistories"] });
          // 폼 초기화
          resetForm();
        })
        .catch((error) => {
          console.error("퇴사 처리 중 오류 발생:", error);
          alert("퇴사 처리 중 오류가 발생했습니다.");
        });
    } else {
      // 입사 또는 직급 변경의 경우 기존 로직 유지
      updateStreamer({
        id: streamerId,
        member: formDataWithExcel,
        history: historyData as any,
      });

      // Excel 카테고리 정보 설정
      if (excelCategoryId) {
        setCategories({
          streamerId,
          categoryIds: [excelCategoryId],
        });
      }

      // 폼 초기화
      resetForm();
    }
  };

  // 스트리머 등록 폼 제출 핸들러 (기본 정보만)
  const handleStreamerRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!newStreamerData.name.trim() || !newStreamerData.soopId?.trim()) {
      alert("이름과 숲 ID를 입력해주세요.");
      return;
    }

    // 스트리머 기본 정보만 생성
    createStreamer({
      name: newStreamerData.name,
      soopId: newStreamerData.soopId,
    })
      .then(() => {
        alert("스트리머가 등록되었습니다.");
        setNewStreamerData({ name: "", soopId: "" });
      })
      .catch((error) => {
        console.error("스트리머 등록 실패:", error);
        alert("스트리머 등록에 실패했습니다.");
      });
  };

  // 스트리머 폼에서만 사용하는 리셋
  const resetStreamerForm = () => {
    setNewStreamerData({ name: "", soopId: "" });
  };

  // 크루 멤버십 관리 폼 제출 핸들러
  const handleCrewMembershipUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    // Early return 패턴으로 null 체크
    if (!selectedMember) {
      alert("스트리머를 먼저 선택해주세요.");
      return;
    }

    // 변수로 추출하여 null이 아님을 명확히 함
    const streamerId = selectedMember.id;
    const memberCrew = selectedMember.crew;
    const memberRank = selectedMember.rank;

    // 필수 필드 검증
    const missingFields = [];

    // 이벤트 타입에 따른 필수 필드 검증
    if (formData.eventType === "basic_info_only") {
      if (!formData.name.trim()) missingFields.push("스트리머 이름");
      if (!formData.soopId?.trim()) missingFields.push("숲 ID (SOOP ID)");
    } else if (formData.eventType === "history_add") {
      if (!formData.crewId) missingFields.push("크루");
      if (!formData.historyEventType) missingFields.push("히스토리 타입");
      if (
        (formData.historyEventType === "join" ||
          formData.historyEventType === "rank_change") &&
        !formData.rankId
      ) {
        missingFields.push("계급");
      }
    } else if (formData.eventType === "join") {
      if (!formData.crewId) missingFields.push("크루");
      if (!formData.rankId) missingFields.push("계급");
    } else if (formData.eventType === "rank_change") {
      if (formData.rankId === 0) missingFields.push("새 계급");
      if (formData.rankId === memberRank?.id) {
        alert("현재와 동일한 계급을 선택하셨습니다. 다른 계급을 선택해주세요.");
        return;
      }
    }

    if (formData.eventType !== "basic_info_only" && !formData.eventDate) {
      missingFields.push("이벤트 날짜");
    }

    if (missingFields.length > 0) {
      alert(`다음 필드를 입력해주세요: ${missingFields.join(", ")}`);
      return;
    }

    // 슈퍼어드민이 아니면서 해당 크루에 대한 권한이 없는 경우 거부 (기본 정보 수정 제외)
    if (formData.eventType !== "basic_info_only" && !isSuperAdmin) {
      const hasPermission = permittedCrews?.some(
        (crew: any) => crew.id === formData.crewId
      );
      if (!hasPermission) {
        alert("이 크루에 대한 편집 권한이 없습니다.");
        return;
      }
    }

    // Excel 카테고리 ID 설정
    const formDataWithExcel = {
      ...formData,
      categoryIds: excelCategoryId ? [excelCategoryId] : [],
    };

    // 기본 정보 수정 처리
    if (formData.eventType === "basic_info_only") {
      // 기본 정보만 업데이트
      updateStreamer({
        id: streamerId,
        member: {
          name: formData.name,
          soopId: formData.soopId,
          categoryIds: excelCategoryId ? [excelCategoryId] : [],
          eventType: "basic_info_only",
        },
        history: {
          streamerId,
          crewId: 0,
          eventType: "join", // 기본값 (실제로는 사용되지 않음)
          eventDate: "",
          note: "",
        } as any,
      });

      // Excel 카테고리 정보 설정
      if (excelCategoryId) {
        setCategories({
          streamerId,
          categoryIds: [excelCategoryId],
        });
      }

      resetForm();
      return;
    }

    // 히스토리 추가 처리
    if (formData.eventType === "history_add") {
      const historyData: any = {
        streamerId,
        crewId: formData.crewId,
        eventType: formData.historyEventType,
        eventDate: formData.eventDate,
        note: formData.note,
        newRankId:
          formData.historyEventType === "join" ||
          formData.historyEventType === "rank_change"
            ? formData.rankId
            : undefined,
      };

      // 히스토리만 추가 (실제 멤버 정보는 변경하지 않음)
      createCrewMemberHistory(historyData as CrewMemberHistoryData)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["memberHistories"] });
          resetForm();
        })
        .catch((error) => {
          console.error("히스토리 추가 중 오류 발생:", error);
          alert(error);
        });
      return;
    }

    // 퇴사 이벤트 처리
    if (formData.eventType === "leave" && memberCrew) {
      const crewId = memberCrew.id;

      // Type assertion을 사용하여 타입 오류 해결
      const leaveHistoryData: any = {
        streamerId,
        crewId,
        eventType: "leave",
        eventDate: formData.eventDate,
        note: formData.note,
        oldRankId: memberRank?.id,
      };

      // API 호출
      createCrewMemberHistory(leaveHistoryData as CrewMemberHistoryData)
        .then(() => removeFromCrew(streamerId))
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["members"] });
          queryClient.invalidateQueries({ queryKey: ["memberHistories"] });
          resetForm();
        })
        .catch((error) => {
          console.error("퇴사 처리 중 오류:", error);
          alert("퇴사 처리 중 오류가 발생했습니다.");
        });
    } else {
      // 입사 또는 직급 변경 이벤트 처리
      // Type assertion을 사용하여 타입 오류 해결
      const historyData: any = {
        streamerId,
        crewId:
          formData.eventType === "join" ? formData.crewId : memberCrew?.id || 0,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        note: formData.note,
        oldRankId:
          formData.eventType === "rank_change" ? memberRank?.id : undefined,
        newRankId:
          formData.eventType === "rank_change" || formData.eventType === "join"
            ? formData.rankId
            : undefined,
      };

      // 멤버 업데이트 및 히스토리 생성
      if (streamerId) {
        updateStreamer({
          id: streamerId,
          member: formDataWithExcel,
          history: historyData as any,
        });

        // Excel 카테고리 정보 설정
        if (excelCategoryId) {
          setCategories({
            streamerId,
            categoryIds: [excelCategoryId],
          });
        }
      }

      resetForm();
    }
  };

  const handleEdit = (member: Streamer) => {
    // 슈퍼어드민이 아니면서 해당 크루에 대한 권한이 없는 경우 거부
    if (!isSuperAdmin && member.crew) {
      const hasPermission = permittedCrews?.some(
        (crew: any) => crew.id === member.crew?.id
      );
      if (!hasPermission) {
        alert("이 멤버를 편집할 권한이 없습니다.");
        return;
      }
    }

    setSelectedMember(member);

    // 기본적으로 기본 정보 수정을 선택하도록 설정
    setFormData({
      name: member.name,
      soopId: member.soopId || "",
      crewId: member?.crew?.id || 0,
      rankId: member?.rank?.id || 0,
      categoryIds: [], // 초기값으로 빈 배열 설정, memberCategories 로드 후 업데이트됨
      eventType: "basic_info_only",
      historyEventType: "join",
      eventDate: getTodayDate(),
      note: "",
    });
    setActiveTab("manageCrew"); // 크루 멤버십 탭으로 전환
  };

  // 검색을 시작하는 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 1) {
      setIsSearching(true);
    } else {
      // 검색어가 2글자 미만인 경우 알림
      alert("검색어는 2글자 이상 입력해주세요.");
    }
  };

  // 검색 결과를 선택하는 핸들러
  const handleSelectSearchResult = (streamer: Streamer) => {
    // 스트리머 ID로 전체 데이터 조회
    fetchStreamerDetails(streamer.id);
    setSearchQuery(""); // 검색어 초기화
    setIsSearching(false);
  };

  // 스트리머 상세 정보 조회 및 수정 모드 설정
  const fetchStreamerDetails = async (streamerId: number) => {
    try {
      // API 호출하여 스트리머 상세 정보 조회
      const streamerDetails = await getStreamerById(streamerId);

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

      // 수정 모드 설정
      setSelectedMember(memberData);

      // 폼 데이터 업데이트 (기본 정보 수정을 기본값으로 설정)
      setFormData({
        name: memberData.name,
        soopId: memberData.soopId || "",
        crewId: memberData.crew?.id || 0,
        rankId: memberData.rank?.id || 0,
        categoryIds: [],
        eventType: "basic_info_only",
        historyEventType: "join",
        eventDate: getTodayDate(),
        note: "",
      });

      // 크루 멤버십 탭으로 전환
      setActiveTab("manageCrew");
    } catch (error) {
      console.error("Error fetching streamer details:", error);
      // 에러 시 폼 초기화
      resetForm();
    }
  };

  // 멤버 목록 필터링 및 정렬
  const filteredMembers = members
    ?.filter((member) => {
      // 크루 정보가 없는 멤버는 건너뜀
      if (!member.crew) return false;

      // 슈퍼어드민이면 모든 멤버 또는 선택된 크루의 멤버 표시
      if (isSuperAdmin) {
        return selectedCrewId === "all" || member?.crew?.id === selectedCrewId;
      }

      // 일반 어드민은 권한이 있는 크루의 멤버만 표시
      const hasPermissionForCrew = permittedCrews?.some(
        (crew: any) => crew.id === member.crew?.id
      );
      return (
        hasPermissionForCrew &&
        (selectedCrewId === "all" || member?.crew?.id === selectedCrewId)
      );
    })
    .sort((a, b) => {
      // 멤버에 크루 정보가 없는 경우 처리
      if (!a.crew || !b.crew) return 0;

      // 먼저 크루 이름으로 정렬
      const crewCompare = a.crew?.name?.localeCompare(b.crew?.name || "");
      if (crewCompare !== 0) return crewCompare;

      // 같은 크루 내에서는 계급 레벨로 정렬 (계급 정보가 없는 경우 처리)
      if (!a.rank || !b.rank) return 0;
      return a.rank.id - b.rank.id;
    });

  if (isLoadingMembers || isLoadingCategories) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      {/* 탭 선택 UI */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("registerStreamer")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "registerStreamer"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            스트리머 등록
          </button>
          <button
            onClick={() => setActiveTab("manageCrew")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "manageCrew"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            스트리머 관리
          </button>
        </nav>
      </div>

      {/* 스트리머 등록 폼 - 슈퍼어드민만 접근 가능 */}
      {activeTab === "registerStreamer" && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">스트리머 신규 등록</h2>
          {isSuperAdmin ? (
            <form onSubmit={handleStreamerRegister}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    스트리머 이름
                  </label>
                  <input
                    type="text"
                    value={newStreamerData.name}
                    onChange={(e) =>
                      setNewStreamerData({
                        ...newStreamerData,
                        name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    숲 ID (SOOP ID)
                  </label>
                  <input
                    type="text"
                    value={newStreamerData.soopId}
                    onChange={(e) =>
                      setNewStreamerData({
                        ...newStreamerData,
                        soopId: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="예: woowakgood, dkdlel123"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    프로필 이미지와 방송국 URL은 숲 ID에서 자동 생성됩니다.
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    스트리머 등록
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                슈퍼어드민만 스트리머를 등록할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 크루 멤버십 관리 */}
      {activeTab === "manageCrew" && (
        <>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">스트리머 관리</h2>

            {/* 스트리머 검색 섹션 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                스트리머 검색
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => {
                      const newQuery = e.target.value;
                      setSearchQuery(newQuery);
                      // 검색어가 1글자 이상이면 검색 시작
                      if (newQuery.trim().length >= 1) {
                        setIsSearching(true);
                      } else {
                        setIsSearching(false);
                      }
                    }}
                    placeholder="스트리머 이름 또는 숲 ID로 검색"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onFocus={() => {
                      if (searchQuery.trim().length >= 1) {
                        setIsSearching(true);
                      }
                    }}
                  />
                  {isSearching && searchResults && searchResults.length > 0 && (
                    <div
                      ref={searchResultsRef}
                      className="absolute z-10 w-full bg-white mt-1 shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto"
                    >
                      {isLoadingSearch ? (
                        <div className="p-2 text-center text-gray-500">
                          검색 중...
                        </div>
                      ) : (
                        <ul className="py-1">
                          {searchResults.map((result) => (
                            <li
                              key={result.id}
                              onClick={() => handleSelectSearchResult(result)}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
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
                                <div className="font-medium">{result.name}</div>
                                {result.soopId && (
                                  <div className="text-xs text-gray-500">
                                    {result.soopId}
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
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  검색
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                스트리머를 검색하여 크루 멤버를 관리하세요.
              </p>
            </div>

            {/* 선택된 스트리머 - 크루 멤버십 관리 폼 */}
            {selectedMember && (
              <form onSubmit={handleCrewMembershipUpdate}>
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center mb-4">
                    {selectedMember.soopId ? (
                      <img
                        src={`https://profile.img.sooplive.co.kr/LOGO/${selectedMember.soopId.slice(
                          0,
                          2
                        )}/${selectedMember.soopId}/${
                          selectedMember.soopId
                        }.jpg`}
                        alt={selectedMember.name}
                        className="w-10 h-10 rounded-full mr-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/40";
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-gray-500">👤</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium">
                        {selectedMember.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedMember.soopId || "ID 없음"}
                        {selectedMember.crew &&
                          ` • ${selectedMember.crew.name}`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* 입사/퇴사 선택 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        이벤트 타입
                      </label>
                      <div className="mt-2 space-x-4">
                        {isSuperAdmin && (
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="eventType"
                              value="basic_info_only"
                              checked={formData.eventType === "basic_info_only"}
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  eventType: "basic_info_only",
                                })
                              }
                              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              기본 정보 수정
                            </span>
                          </label>
                        )}
                        <label
                          className={`inline-flex items-center ${
                            !selectedMember.crew ? "" : "opacity-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="eventType"
                            value="join"
                            checked={formData.eventType === "join"}
                            onChange={() =>
                              setFormData({ ...formData, eventType: "join" })
                            }
                            disabled={!!selectedMember.crew}
                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            크루 입사
                          </span>
                        </label>
                        <label
                          className={`inline-flex items-center ${
                            selectedMember.crew ? "" : "opacity-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="eventType"
                            value="leave"
                            checked={formData.eventType === "leave"}
                            onChange={() =>
                              setFormData({ ...formData, eventType: "leave" })
                            }
                            disabled={!selectedMember.crew}
                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            크루 퇴사
                          </span>
                        </label>
                        <label
                          className={`inline-flex items-center ${
                            selectedMember.crew ? "" : "opacity-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="eventType"
                            value="rank_change"
                            checked={formData.eventType === "rank_change"}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                eventType: "rank_change",
                              })
                            }
                            disabled={!selectedMember.crew}
                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            직급 변경
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="eventType"
                            value="history_add"
                            checked={formData.eventType === "history_add"}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                eventType: "history_add",
                              })
                            }
                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            히스토리 추가
                          </span>
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.eventType === "basic_info_only"
                          ? "스트리머의 기본 정보(이름, 숲 ID)를 수정할 수 있습니다."
                          : formData.eventType === "history_add"
                          ? "과거 크루 입사/퇴사/직급변경 기록을 추가할 수 있습니다. 현재 크루 상태와 무관하게 히스토리를 추가할 수 있습니다."
                          : selectedMember.crew
                          ? "멤버가 현재 크루에 속해있어 직급 변경 또는 퇴사를 선택할 수 있습니다."
                          : "멤버가 크루에 속해있지 않아 입사만 선택 가능합니다."}
                      </p>
                    </div>

                    {/* 기본 정보 수정인 경우 이름과 숲 ID 입력 */}
                    {formData.eventType === "basic_info_only" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            스트리머 이름
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            숲 ID (SOOP ID)
                          </label>
                          <input
                            type="text"
                            value={formData.soopId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                soopId: e.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="예: woowakgood, dkdlel123"
                            required
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            프로필 이미지와 방송국 URL은 숲 ID에서 자동
                            생성됩니다.
                          </p>
                        </div>
                      </>
                    )}

                    {/* 히스토리 추가인 경우 */}
                    {formData.eventType === "history_add" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            크루 선택
                          </label>
                          <select
                            value={formData.crewId}
                            onChange={(e) => {
                              const newCrewId = Number(e.target.value);
                              setFormData({
                                ...formData,
                                crewId: newCrewId,
                                rankId: 0,
                              });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          >
                            <option value={0}>크루 선택</option>
                            {allCrews?.map((crew: any) => (
                              <option key={crew.id} value={crew.id}>
                                {crew.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {formData.crewId && formData.crewId > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              히스토리 타입
                            </label>
                            <select
                              value={formData.historyEventType || "join"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  historyEventType: e.target.value as
                                    | "join"
                                    | "leave"
                                    | "rank_change",
                                })
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                            >
                              <option value="join">입사</option>
                              <option value="leave">퇴사</option>
                              <option value="rank_change">직급 변경</option>
                            </select>
                          </div>
                        )}
                        {formData.crewId &&
                          formData.crewId > 0 &&
                          (formData.historyEventType === "join" ||
                            formData.historyEventType === "rank_change") && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                계급
                              </label>
                              <select
                                value={formData.rankId}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    rankId: Number(e.target.value),
                                  })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                              >
                                <option value={0}>계급 선택</option>
                                {ranks?.map((rank: any) => (
                                  <option key={rank.id} value={rank.id}>
                                    {rank.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                      </>
                    )}

                    {/* 입사인 경우 크루 및 계급 선택 */}
                    {formData.eventType === "join" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            크루
                          </label>
                          <select
                            value={formData.crewId}
                            onChange={(e) => {
                              const newCrewId = Number(e.target.value);
                              setFormData({
                                ...formData,
                                crewId: newCrewId,
                                rankId: 0,
                              });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          >
                            <option value={0}>크루 선택</option>
                            {editableCrews?.map((crew: any) => (
                              <option key={crew.id} value={crew.id}>
                                {crew.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {formData.crewId && formData.crewId > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              계급
                            </label>
                            <select
                              value={formData.rankId}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  rankId: Number(e.target.value),
                                })
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                            >
                              <option value={0}>계급 선택</option>
                              {ranks?.map((rank: any) => (
                                <option key={rank.id} value={rank.id}>
                                  {rank.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </>
                    )}

                    {/* 직급 변경인 경우 계급만 선택 */}
                    {formData.eventType === "rank_change" &&
                      selectedMember.crew && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            새 계급
                          </label>
                          <select
                            value={formData.rankId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                rankId: Number(e.target.value),
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          >
                            <option value={0}>계급 선택</option>
                            {ranks?.map((rank: any) => (
                              <option
                                key={rank.id}
                                value={rank.id}
                                disabled={rank.id === selectedMember.rank?.id}
                              >
                                {rank.name}
                                {rank.id === selectedMember.rank?.id
                                  ? " (현재 계급)"
                                  : ""}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-gray-500">
                            현재 계급: {selectedMember.rank?.name || "없음"}
                          </p>
                        </div>
                      )}

                    {/* 이벤트 날짜 (기본 정보 수정 시에는 표시하지 않음) */}
                    {formData.eventType !== "basic_info_only" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          이벤트 날짜
                        </label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              eventDate: e.target.value,
                            })
                          }
                          max={getTodayDate()}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    )}

                    {/* 비고 (메모) - 기본 정보 수정 시에는 표시하지 않음 */}
                    {formData.eventType !== "basic_info_only" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          비고 사항
                        </label>
                        <textarea
                          value={formData.note}
                          onChange={(e) =>
                            setFormData({ ...formData, note: e.target.value })
                          }
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="입사/퇴사 관련 비고 사항을 입력하세요"
                        />
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        {formData.eventType === "basic_info_only"
                          ? "정보 수정"
                          : "저장"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* 멤버 히스토리 */}
          {selectedMember && !isLoadingHistory && (
            <div className="mt-6">
              <MemberHistoryTable
                streamerId={selectedMember.id}
                memberName={selectedMember.name}
                showActions={true}
                onAdd={() => historyManager.handleAddHistory(selectedMember.id)}
                onEdit={historyManager.handleEditHistory}
                onDelete={historyManager.handleDeleteHistory}
              />
            </div>
          )}

          {/* 히스토리 관련 모달들 */}
          <MemberHistoryFormModal
            isOpen={historyManager.isHistoryEditModalOpen}
            onClose={historyManager.closeEditModal}
            onSubmit={historyManager.handleHistoryEditSubmit}
            title="히스토리 수정"
            initialData={historyManager.editModalInitialData}
          />

          <MemberHistoryFormModal
            isOpen={historyManager.isHistoryAddModalOpen}
            onClose={historyManager.closeAddModal}
            onSubmit={historyManager.handleHistoryAddSubmit}
            title="히스토리 추가"
          />

          {/* 멤버 목록 필터 및 리스트 */}
          <div className="mt-6">
            <div className="flex justify-end mb-4">
              <select
                value={selectedCrewId}
                onChange={(e) =>
                  setSelectedCrewId(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className="rounded-md border-gray-300"
              >
                <option value="all">모든 크루</option>
                {editableCrews?.map((crew: any) => (
                  <option key={crew.id} value={crew.id}>
                    {crew.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white shadow-sm rounded-lg">
              {filteredMembers?.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  표시할 멤버가 없습니다.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredMembers?.map((member) => (
                    <li
                      key={member.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleEdit(member)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {member.soopId ? (
                            <img
                              src={`https://profile.img.sooplive.co.kr/LOGO/${member.soopId.slice(
                                0,
                                2
                              )}/${member.soopId}/${member.soopId}.jpg`}
                              alt={member?.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">👤</span>
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-medium">
                              {member?.name}
                              <span className="ml-2 text-sm text-gray-500">
                                ({member?.rank?.name})
                              </span>
                            </h3>
                            <p className="text-sm text-gray-500">
                              {member?.crew?.name}
                              {member.soopId && (
                                <a
                                  href={`https://ch.sooplive.co.kr/${member.soopId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-blue-500"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  방송 보기
                                </a>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // 슈퍼어드민이 아니면서 해당 크루에 대한 권한이 없는 경우 거부
                              if (!isSuperAdmin && member.crew) {
                                const hasPermission = permittedCrews?.some(
                                  (crew: any) => crew.id === member.crew?.id
                                );
                                if (!hasPermission) {
                                  alert("이 멤버를 삭제할 권한이 없습니다.");
                                  return;
                                }
                              }

                              if (
                                window.confirm(
                                  "정말로 이 멤버를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                                )
                              ) {
                                deleteStreamer(member.id);
                              }
                            }}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
