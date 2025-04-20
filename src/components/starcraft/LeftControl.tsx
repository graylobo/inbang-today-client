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

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const keywordRef = useRef<HTMLInputElement>(null);

  // Mobile detection
  const isMobile = useIsMobile();

  // Input validation
  const validateAlphanumeric = useCallback((value: string): boolean => {
    return /^[a-zA-Z0-9]*$/.test(value);
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
      resetInputAndCombo();
    }
  }, [isSaved, keyword]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (savedWord.length === 0) {
        alert("입력할 키워드를 설정해야 합니다.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      setInputWord(e.target.value);
    },
    [savedWord]
  );

  // Reset input and combo
  const resetInputAndCombo = useCallback(() => {
    if (inputRef.current) inputRef.current.value = "";
    setInputWord("");
    setCombo(0);
  }, []);

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

  // Handle combo counting
  useEffect(() => {
    setComboUp(false);

    // Check if the user completed typing the word correctly
    if (savedWord.length !== 0 && savedWord.length === inputWord.length) {
      if (savedWord === inputWord) {
        setCombo((prevCombo) => prevCombo + 1);
        setComboUp(true);

        // Visual feedback for combo
        const timeout = setTimeout(() => {
          setComboUp(false);
        }, 100);

        return () => clearTimeout(timeout);
      }
    }
  }, [inputWord, savedWord]);

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
          }
          break;
        }
      }
    }
  }, [inputWord, savedWord, checkBox]);

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
      </div>
    </main>
  );
}
