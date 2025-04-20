"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

// Custom hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

// Ad component placeholder
const GoogleAds = () => {
  return (
    <div className="w-full h-[100px] bg-gray-200 flex items-center justify-center">
      <span className="text-gray-500">Advertisement</span>
    </div>
  );
};

export default function LeftControl() {
  // State management
  const [keyword, setKeyword] = useState("");
  const [savedWord, setSavedWord] = useState("");
  const [inputWord, setInputWord] = useState("");
  const [checkBox, setCheckBox] = useState(true);
  const [comboUp, setComboUp] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [maxComboTime, setMaxComboTime] = useState(0); // 최대 콤보 달성 시간

  // 타이머 관련 상태
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState("0.00");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const keywordRef = useRef<HTMLInputElement>(null);
  const elapsedTimeRef = useRef(0); // Add ref to track elapsed time without triggering effects

  // Mobile detection
  const isMobile = useIsMobile();

  // Input validation
  const validateAlphanumeric = useCallback((value: string): boolean => {
    return /^[a-zA-Z0-9]*$/.test(value);
  }, []);

  // Reset input and combo
  const resetInputAndCombo = useCallback(() => {
    if (inputRef.current) inputRef.current.value = "";
    setInputWord("");
    setCombo(0);
  }, []);

  // Start the timer
  const startTimer = useCallback(() => {
    if (!isTimerActive) {
      const startTime = Date.now() - elapsedTime; // 기존 경과 시간을 고려
      setIsTimerActive(true);

      const interval = setInterval(() => {
        const newElapsedTime = Date.now() - startTime;
        setElapsedTime(newElapsedTime);
        elapsedTimeRef.current = newElapsedTime; // Update the ref
        setTimeDisplay((newElapsedTime / 1000).toFixed(2));
      }, 10);

      setIntervalId(interval);
    }
  }, [isTimerActive, elapsedTime]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsTimerActive(false);
    setElapsedTime(0);
    elapsedTimeRef.current = 0; // Reset the ref
    setTimeDisplay("0.00");
    setIntervalId(null);
  }, [intervalId]);

  // 전체 초기화 함수 (입력, 콤보, 타이머 모두 초기화)
  const resetAll = useCallback(() => {
    resetInputAndCombo();
    resetTimer();
    // 최대 콤보는 초기화하지 않음 (세션 기록 유지)
  }, [resetInputAndCombo, resetTimer]);

  // 최대 콤보 초기화 함수
  const resetMaxCombo = useCallback(() => {
    setMaxCombo(0);
    setMaxComboTime(0);
    localStorage.removeItem("leftControl_maxCombo");
    localStorage.removeItem("leftControl_maxComboTime");
  }, []);

  // Handle keyword change
  const handleKeywordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (!validateAlphanumeric(value)) {
        setKeyword("");
        return;
      }

      if (value.length > 30) {
        alert("30자 이내로 설정해야 합니다.");
        setKeyword("");
        if (keywordRef.current) keywordRef.current.value = "";
      } else {
        setKeyword(value);
      }
    },
    [validateAlphanumeric]
  );

  // Handle save/edit button
  const handleSaveToggle = useCallback(() => {
    if (!isSaved) {
      if (keyword.length < 6 || keyword.length > 30) {
        alert("키워드는 6자이상 30자 이하로 설정해야 합니다.");
        setKeyword("");
        if (keywordRef.current) keywordRef.current.value = "";
      } else {
        setSavedWord(keyword);
        setIsSaved(true);
      }
    } else {
      setIsSaved(false);
      resetAll();
    }
  }, [isSaved, keyword, resetAll]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (savedWord.length === 0) {
        alert("입력할 키워드를 설정해야 합니다.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      // 첫 입력 시 타이머 시작
      if (inputWord.length === 0 && e.target.value.length > 0 && checkBox) {
        startTimer();
      }

      const newInputWord = e.target.value;
      setInputWord(newInputWord);

      // 단어가 완성되었을 때 콤보 계산
      if (savedWord.length !== 0 && savedWord.length === newInputWord.length) {
        if (savedWord === newInputWord) {
          // 콤보 증가
          const newCombo = combo + 1;
          setCombo(newCombo);
          setComboUp(true);

          // Visual feedback for combo
          setTimeout(() => {
            setComboUp(false);
          }, 100);

          // 입력창 초기화
          if (inputRef.current) inputRef.current.value = "";
          setInputWord("");
        }
      }
    },
    [savedWord, inputWord, checkBox, startTimer, combo]
  );

  // Handle partial matching and auto-correction
  useEffect(() => {
    // If user is typing more than saved word length and has already typed some characters
    if (savedWord.length < inputWord.length && savedWord.length !== 0) {
      if (inputRef.current) {
        inputRef.current.value = inputWord.charAt(inputWord.length - 1);
        setInputWord(inputRef.current.value);
      }
    }
  }, [inputWord, savedWord]);

  // 최대 콤보 업데이트를 위한 별도의 useEffect
  useEffect(() => {
    if (combo > maxCombo) {
      setMaxCombo(combo);
      // 최대 콤보 달성 시 시간도 함께 기록
      if (elapsedTimeRef.current > 0) {
        setMaxComboTime(elapsedTimeRef.current / 1000);
      }
    }
  }, [combo, maxCombo]);

  // Reset input and combo when saved state changes
  useEffect(() => {
    resetInputAndCombo();
  }, [isSaved, resetInputAndCombo]);

  // 틀린 입력 감지 및 처리를 위한 useEffect
  useEffect(() => {
    // 저장된 단어가 있고 입력값이 있을 때만 실행
    if (savedWord && inputWord) {
      // 입력된 각 문자를 확인
      for (let i = 0; i < inputWord.length; i++) {
        // 잘못된 문자가 입력되었는지 확인
        if (i < savedWord.length && inputWord[i] !== savedWord[i]) {
          // 틀린 문자 발견 시 체크박스 설정에 따라 초기화
          if (checkBox) {
            if (inputRef.current) inputRef.current.value = "";
            setInputWord("");
            setCombo(0);
            // 타이머도 초기화
            resetTimer();
          }
          break;
        }
      }
    }
  }, [inputWord, savedWord, checkBox, resetTimer]);

  // Check for incorrect input and reset if needed
  const renderCharComparison = () => {
    return inputWord.split("").map((char, index) => {
      if (char === savedWord[index]) {
        return (
          <span key={index} className="text-blue-600 text-[24px]">
            {char}
          </span>
        );
      } else {
        return (
          <span key={index} className="text-red-600 text-[24px]">
            {char}
          </span>
        );
      }
    });
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // 로컬 스토리지에서 최대 콤보 불러오기
  useEffect(() => {
    const savedMaxCombo = localStorage.getItem("leftControl_maxCombo");
    const savedMaxComboTime = localStorage.getItem("leftControl_maxComboTime");

    if (savedMaxCombo) {
      setMaxCombo(parseInt(savedMaxCombo, 10));
    }

    if (savedMaxComboTime) {
      setMaxComboTime(parseFloat(savedMaxComboTime));
    }
  }, []);

  // 최대 콤보 업데이트시 로컬 스토리지에 저장
  useEffect(() => {
    if (maxCombo > 0) {
      localStorage.setItem("leftControl_maxCombo", maxCombo.toString());
    }
  }, [maxCombo]);

  // 최대 콤보 시간 업데이트시 로컬 스토리지에 저장
  useEffect(() => {
    if (maxComboTime > 0) {
      localStorage.setItem("leftControl_maxComboTime", maxComboTime.toString());
    }
  }, [maxComboTime]);

  // 콤보 증가시 타이머 시작
  useEffect(() => {
    if (comboUp && checkBox && !isTimerActive) {
      startTimer();
    }
  }, [comboUp, checkBox, isTimerActive, startTimer]);

  return (
    <main className="mt-[96px] h-[350px] flex flex-col relative">
      {/* Ads section */}
      {/* <aside className={`w-[${isMobile ? "320" : "728"}px] mx-auto`}>
        <ins
          className="kakao_ad_area"
          style={{ display: "none" }}
          data-ad-unit="DAN-aKNS1zqwgWC4KTTv"
          data-ad-width="320"
          data-ad-height="100"
        />
      </aside> */}
      {/* 
      <aside className={`w-[${isMobile ? "320" : "728"}px] mx-auto`}>
        <GoogleAds />
      </aside> */}

      {/* Main content */}
      <div className="relative p-[30px] self-center flex flex-col w-full max-w-[550px]">
        {/* Keyword input section */}
        <div className="relative self-center w-full">
          <div className="">키워드 입력 (30/{keyword.length}자)</div>
          <input
            type="text"
            className={`h-[50px] border-2 border-black p-[10px] w-full max-w-[500px] text-black rounded-[3px] outline-blue-600 ${
              isSaved ? "bg-gray-400" : ""
            }`}
            placeholder="키워드 입력 (영문/숫자만 가능)"
            readOnly={isSaved}
            ref={keywordRef}
            value={keyword}
            onChange={handleKeywordChange}
          />
        </div>

        {/* Save/Edit button */}
        <div className="mb-[10px]">
          <button className="float-right" onClick={handleSaveToggle}>
            {isSaved ? "수정" : "저장"}
          </button>
        </div>

        {/* Practice input */}
        <div className="relative self-center w-full">
          <input
            type="text"
            className={`h-[50px] rounded-[3px] border-2 border-black w-full max-w-[500px] p-[10px] outline-blue-600 ${
              !isSaved ? "bg-gray-400" : ""
            }`}
            ref={inputRef}
            readOnly={!isSaved}
            onPaste={(e) => e.preventDefault()}
            onChange={handleInputChange}
          />
        </div>

        {/* Reset on error checkbox */}
        <div>
          <div className="float-right">
            <input
              type="checkbox"
              id="checkbox"
              checked={checkBox}
              onChange={() => setCheckBox((prev) => !prev)}
            />
            <label htmlFor="checkbox" className="ml-1">
              틀리면 초기화
            </label>
          </div>
        </div>

        {/* Word comparison display */}
        <div className="text-[24px] h-[80px] self-center mt-[30px]">
          {savedWord}
          <div>{renderCharComparison()}</div>
        </div>

        {/* Combo counter */}
        <div
          className={`bottom-[15px] self-center ${
            comboUp
              ? "transition-text duration-[0.1s] text-[20px] text-red-600 font-bold"
              : "transition-text duration-[0.1s] text-[17px]"
          }`}
        >
          {combo} Combos
        </div>

        {/* 타이머 표시 - 체크박스가 체크된 경우에만 표시 */}
        {checkBox && (
          <div className="mt-2 self-center text-[16px] flex items-center">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span
                className={isTimerActive ? "text-blue-600 font-semibold" : ""}
              >
                {timeDisplay}초
              </span>
            </div>
          </div>
        )}

        {/* 최대 기록 표시 (타이머 아래로 이동) */}
        {maxCombo > 0 && (
          <div className="mt-3 self-center text-[16px]">
            <div className="text-blue-600">
              <div>최대: {maxCombo} Combos</div>
              <div>달성 시간: {maxComboTime.toFixed(2)}초</div>
              <div>초당 콤보: {(maxCombo / maxComboTime).toFixed(2)}개</div>
              {!isTimerActive && (
                <button
                  onClick={resetMaxCombo}
                  className="mt-1 text-xs text-gray-500 hover:text-red-500"
                  title="최대 기록 초기화"
                >
                  최대기록 초기화
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
