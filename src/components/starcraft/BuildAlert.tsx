"use client";

import React, { useCallback } from "react";
import { useBuildAlertStore } from "@/store/buildAlertStore";
import TimerComponent from "@/components/starcraft/TimerComponent";
import { toast } from "sonner";

export default function BuildAlert() {
  const {
    timers,
    isTimerRunning,
    language,
    addTimer,
    setTimerRunning,
    setLanguage,
    validateTimers,
    resetCompletedTimers,
  } = useBuildAlertStore();

  // Handle timer start/stop
  const handleTimerToggle = useCallback(() => {
    console.log("=== 타이머 시작/중지 버튼 클릭 ===");
    console.log("현재 타이머 개수:", timers.length);
    console.log("현재 타이머들:", timers);

    if (timers.length === 0) {
      toast.error("타이머를 추가해주세요.");
      return;
    }

    const { hasEmptyContent, hasEmptyTime } = validateTimers();
    console.log("검증 결과:", { hasEmptyContent, hasEmptyTime });

    if (hasEmptyContent) {
      console.log("검증 실패: 빈 내용");
      toast.error("알림내용이 설정되지 않은 타이머가 존재합니다.");
      return;
    }

    if (hasEmptyTime) {
      console.log("검증 실패: 빈 시간");
      toast.error("시간이 설정되지 않은 타이머가 존재합니다.");
      return;
    }

    console.log("검증 통과! 타이머 상태 변경:", !isTimerRunning);

    // 타이머를 시작할 때 완료된 타이머들 리셋
    if (!isTimerRunning) {
      console.log("타이머 시작 - 완료된 타이머들 리셋");
      resetCompletedTimers();
    }

    setTimerRunning(!isTimerRunning);
  }, [
    timers.length,
    validateTimers,
    isTimerRunning,
    setTimerRunning,
    resetCompletedTimers,
  ]);

  // Handle language change
  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setLanguage({ lang: newLanguage });
    },
    [setLanguage]
  );

  // Handle add timer
  const handleAddTimer = useCallback(() => {
    addTimer();
  }, [addTimer]);

  const buttonClassName =
    "border-2 h-[50px] min-w-[100px] border-blue-700 rounded-[10px] px-4 py-2 bg-white hover:bg-blue-50 text-blue-700 font-medium transition-colors";

  return (
    <main className="mt-[76px] min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            빌드 알리미
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            스타크래프트 빌드 타이밍을 알려주는 타이머입니다.
          </p>
        </div>

        {/* Control Panel */}
        <div className="mb-8 w-full max-w-[580px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <button
              className={buttonClassName}
              onClick={handleAddTimer}
              disabled={isTimerRunning}
            >
              타이머 추가
            </button>

            <button
              className={`border-2 h-[50px] min-w-[100px] rounded-[10px] px-4 py-2 font-medium transition-colors ${
                isTimerRunning
                  ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                  : "bg-green-500 text-white border-green-500 hover:bg-green-600"
              }`}
              onClick={handleTimerToggle}
            >
              {isTimerRunning ? "중지" : "시작"}
            </button>

            <select
              className="px-3 py-2 border-2 border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:border-blue-500"
              value={language.lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={isTimerRunning}
            >
              <option value="ko-KR">한국어</option>
              <option value="en-US">영어</option>
            </select>
          </div>
        </div>

        {/* Timer List */}
        <div className="w-full max-w-4xl mx-auto space-y-4">
          {timers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                타이머를 추가하여 시작하세요!
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                시간과 알림 내용을 설정한 후 시작 버튼을 눌러주세요.
              </div>
            </div>
          ) : (
            timers.map((timer) => (
              <div
                key={timer.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all hover:shadow-md"
              >
                <TimerComponent id={timer.id} />
              </div>
            ))
          )}
        </div>

        {/* Instructions */}
        {timers.length > 0 && (
          <div className="mt-8 w-full max-w-2xl mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                사용법
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• 시간: 시(H), 분(M), 초(S) 순으로 입력하세요</li>
                <li>
                  • 알림 내용: 타이머가 완료될 때 읽어줄 텍스트를 입력하세요
                </li>
                <li>• 언어: 음성 알림의 언어를 선택할 수 있습니다</li>
                <li>
                  • 모든 타이머의 시간과 내용을 설정한 후 시작 버튼을 눌러주세요
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
