"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useBuildAlertStore, ITimerProps } from "@/store/buildAlertStore";
import { speak } from "@/utils/tts.utils";

interface Props {
  id: number;
}

const padNumber = (num: number, length: number): string => {
  return String(num).padStart(length, "0");
};

export default function TimerComponent({ id }: Props) {
  const {
    timers,
    isTimerRunning,
    language,
    updateTimer,
    removeTimer,
    setTimerRunning,
    markTimerCompleted,
    completedTimers,
  } = useBuildAlertStore();

  console.log(
    `🔄 타이머 ${id} 컴포넌트 렌더링 - isTimerRunning: ${isTimerRunning}, completedTimers:`,
    Array.from(completedTimers)
  );

  const currentTimer = timers.find((timer) => timer.id === id);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimeRef = useRef<number>(0);

  // 로컬 완료 상태 (store와 독립적)
  const [localCompleted, setLocalCompleted] = useState(false);

  // 완료 상태 계산 (개별 타이머 완료 즉시 표시)
  const isCompleted = localCompleted || completedTimers.has(id);

  // Display states for countdown
  const [displayHour, setDisplayHour] = useState("00");
  const [displayMin, setDisplayMin] = useState("00");
  const [displaySec, setDisplaySec] = useState("00");

  // Calculate initial time when timer starts
  const calculateInitialTime = useCallback((): number => {
    if (!currentTimer) return 0;

    const hour = Number(currentTimer.hour) || 0;
    const minute = Number(currentTimer.minute) || 0;
    const second = Number(currentTimer.second) || 0;

    return hour * 3600 + minute * 60 + second;
  }, [currentTimer]);

  // Update display time
  const updateDisplayTime = useCallback((timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    setDisplayHour(padNumber(hours, 2));
    setDisplayMin(padNumber(minutes, 2));
    setDisplaySec(padNumber(seconds, 2));
  }, []);

  // 타이머 카운트다운 함수 (재귀적 setTimeout 사용)
  const countdown = useCallback(() => {
    // 최신 상태를 직접 가져오기
    const store = useBuildAlertStore.getState();
    const currentTimerInfo = store.timers.find((t) => t.id === id);
    const isStillRunning = store.isTimerRunning;
    const isAlreadyCompleted = store.completedTimers.has(id);

    console.log(
      `⏱️ 타이머 ${id} countdown 호출: remainingTime=${initialTimeRef.current}, running=${isStillRunning}, completed=${isAlreadyCompleted}`
    );

    // ⭐ 우선순위 1: remainingTime이 0 이하이면 즉시 완료 처리
    if (initialTimeRef.current <= 0) {
      console.log(
        `🎯 *** 타이머 ${id} 완료! *** (remainingTime: ${initialTimeRef.current})`
      );

      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }

      // 로컬 완료 상태 설정
      setLocalCompleted(true);

      console.log("📋 완료된 타이머 정보:", currentTimerInfo);
      console.log("📋 현재 언어 설정:", store.language);

      // 음성 알림 재생
      if (
        currentTimerInfo &&
        currentTimerInfo.content &&
        currentTimerInfo.content.trim()
      ) {
        console.log(
          `🔊 타이머 ${id} 완료! 알림 재생: "${currentTimerInfo.content}"`
        );
        speak(currentTimerInfo.content, store.language);
      } else {
        console.warn(`❌ 타이머 ${id}: 알림 내용이 비어있음`);
        console.warn("currentTimerInfo:", currentTimerInfo);
      }

      // Store에 완료 상태 마킹 (직접 호출)
      console.log(`📝 타이머 ${id}: store에 완료 상태 마킹`);
      store.markTimerCompleted(id);
      return;
    }

    // ⭐ 우선순위 2: 타이머가 중지되었거나 이미 완료된 경우 중단
    if (!isStillRunning || isAlreadyCompleted) {
      console.log(
        `⏹️ 타이머 ${id}: 중지 또는 완료됨 (running: ${isStillRunning}, completed: ${isAlreadyCompleted})`
      );
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // ⭐ 우선순위 3: 카운트다운 계속
    if (initialTimeRef.current > 0) {
      // 카운트다운 계속
      initialTimeRef.current -= 1;
      updateDisplayTime(initialTimeRef.current);

      if (initialTimeRef.current % 10 === 0 || initialTimeRef.current <= 5) {
        console.log(`⏰ 타이머 ${id} 남은 시간: ${initialTimeRef.current}초`);
      }

      // 다음 카운트다운 예약
      intervalRef.current = setTimeout(countdown, 1000);
    }
  }, [id, updateDisplayTime]);

  // 시스템 재시작 감지 및 로컬 상태 리셋 (별도 useEffect)
  useEffect(() => {
    // 타이머가 시작되고 completedTimers가 비어있으면 시스템 재시작으로 판단
    if (isTimerRunning && completedTimers.size === 0 && localCompleted) {
      console.log(`🔄 타이머 ${id}: 시스템 재시작 감지, 로컬 완료 상태 리셋`);
      setLocalCompleted(false);
    }
  }, [isTimerRunning, completedTimers.size, localCompleted, id]);

  // Handle timer start (completedTimers.size 의존성 제거)
  useEffect(() => {
    if (!currentTimer) {
      console.log(`❌ 타이머 ${id}: currentTimer가 없음`);
      return;
    }

    // 완료된 타이머는 시작하지 않음
    const isCurrentlyCompleted = localCompleted || completedTimers.has(id);
    if (isCurrentlyCompleted) {
      console.log(
        `❌ 타이머 ${id}: 시작 조건 미충족 (localCompleted: ${localCompleted}, inCompletedSet: ${completedTimers.has(
          id
        )})`
      );
      return;
    }

    if (isTimerRunning) {
      // 이미 실행 중인 타이머가 있으면 중복 실행 방지
      if (intervalRef.current) {
        console.log(`⚠️ 타이머 ${id}: 이미 실행 중, 중복 실행 방지`);
        return;
      }

      // Initialize countdown
      const initialTime = calculateInitialTime();
      initialTimeRef.current = initialTime;
      console.log(`🚀 타이머 ${id} 시작: ${initialTime}초`);
      updateDisplayTime(initialTime);

      // 첫 카운트다운 시작 (1초 후)
      if (initialTime > 0) {
        intervalRef.current = setTimeout(countdown, 1000);
      } else {
        console.warn(`⚠️ 타이머 ${id}: 초기 시간이 0이므로 시작하지 않음`);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isTimerRunning,
    countdown,
    calculateInitialTime,
    currentTimer,
    id,
    localCompleted,
  ]);

  // Handle timer stop and display reset
  useEffect(() => {
    if (!isTimerRunning) {
      // Stop countdown
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }

      // Reset display to initial values when stopped (not when completed during running)
      if (currentTimer) {
        const hour = Number(currentTimer.hour) || 0;
        const minute = Number(currentTimer.minute) || 0;
        const second = Number(currentTimer.second) || 0;

        setDisplayHour(padNumber(hour, 2));
        setDisplayMin(padNumber(minute, 2));
        setDisplaySec(padNumber(second, 2));
      }
    }
  }, [isTimerRunning, currentTimer]);

  // Handle completed state - 완료 상태일 때만 타이머 정지
  useEffect(() => {
    if (localCompleted && intervalRef.current) {
      console.log(`✅ 타이머 ${id}: 로컬 완료 상태로 변경, 타이머 정지`);
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, [localCompleted, id]);

  // Handle input changes
  const handleInputChange = useCallback(
    (
      field: keyof Pick<ITimerProps, "hour" | "minute" | "second" | "content">,
      value: string
    ) => {
      updateTimer(id, { [field]: value });
    },
    [id, updateTimer]
  );

  // Handle timer removal
  const handleRemove = useCallback(() => {
    removeTimer(id);
  }, [id, removeTimer]);

  if (!currentTimer) return null;

  const inputClassName = `w-[50px] mr-[5px] border-2 border-gray-500 p-[10px] rounded-[3px] outline-blue-600 box-border inline-block text-center text-black ${
    isCompleted
      ? "bg-green-100 cursor-not-allowed border-green-400"
      : isTimerRunning
      ? "bg-gray-300 cursor-not-allowed"
      : "bg-white"
  }`;

  const contentInputClassName = `w-full max-w-[300px] h-[50px] mr-[10px] border-2 border-gray-500 p-[10px] rounded-[3px] outline-blue-600 text-black ${
    isCompleted
      ? "bg-green-100 cursor-not-allowed border-green-400"
      : isTimerRunning
      ? "bg-gray-300 cursor-not-allowed"
      : "bg-white"
  }`;

  return (
    <div className="h-[50px] text-center flex items-center justify-center gap-2 sm:h-[130px] sm:flex-col sm:gap-1">
      {/* Time inputs/display */}
      <div className="flex items-center gap-1">
        {isCompleted ? (
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓ 완료됨</span>
            <span className={inputClassName}>--</span>
            <span className={inputClassName}>--</span>
            <span className={inputClassName}>--</span>
          </div>
        ) : !isTimerRunning ? (
          <>
            <input
              type="number"
              className={inputClassName}
              placeholder="H"
              min="0"
              max="23"
              value={currentTimer.hour || ""}
              onChange={(e) => handleInputChange("hour", e.target.value)}
              disabled={isTimerRunning || isCompleted}
            />
            <input
              type="number"
              className={inputClassName}
              placeholder="M"
              min="0"
              max="59"
              value={currentTimer.minute || ""}
              onChange={(e) => handleInputChange("minute", e.target.value)}
              disabled={isTimerRunning || isCompleted}
            />
            <input
              type="number"
              className={inputClassName}
              placeholder="S"
              min="0"
              max="59"
              value={currentTimer.second || ""}
              onChange={(e) => handleInputChange("second", e.target.value)}
              disabled={isTimerRunning || isCompleted}
            />
          </>
        ) : (
          <>
            <span className={inputClassName}>{displayHour}</span>
            <span className={inputClassName}>{displayMin}</span>
            <span className={inputClassName}>{displaySec}</span>
          </>
        )}
      </div>

      {/* Content input */}
      <input
        type="text"
        className={contentInputClassName}
        placeholder="알림 내용을 입력하세요"
        value={currentTimer.content}
        onChange={(e) => handleInputChange("content", e.target.value)}
        readOnly={isTimerRunning || isCompleted}
        disabled={isTimerRunning || isCompleted}
      />

      {/* Remove button */}
      <button
        disabled={isTimerRunning || isCompleted}
        className={`px-3 py-2 rounded border ${
          isTimerRunning || isCompleted
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600"
        } transition-colors`}
        onClick={handleRemove}
      >
        {isCompleted ? "완료됨" : "삭제"}
      </button>

      <style jsx>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
