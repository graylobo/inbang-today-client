export interface LanguageOption {
  rate?: number;
  pitch?: number;
  lang: string;
}

export function speak(text: string, options: LanguageOption): void {
  console.log("🔊 speak 함수 호출:", { text, options });

  if (
    typeof SpeechSynthesisUtterance === "undefined" ||
    typeof window.speechSynthesis === "undefined"
  ) {
    console.warn("❌ 이 브라우저는 음성 합성을 지원하지 않습니다.");
    return;
  }

  if (!text?.trim()) {
    console.warn("❌ 음성 재생할 텍스트가 비어있습니다.");
    return;
  }

  // 현재 읽고 있는 음성이 있다면 취소
  window.speechSynthesis.cancel();

  const speechMsg = new SpeechSynthesisUtterance();
  speechMsg.rate = options.rate || 1; // 속도: 0.1 ~ 10
  speechMsg.pitch = options.pitch || 1; // 음높이: 0 ~ 2
  speechMsg.lang = options.lang || "ko-KR";
  speechMsg.text = text;

  // 음성 시작과 종료 이벤트 추가
  speechMsg.onstart = () => {
    console.log("✅ 음성 재생 시작:", text);
  };

  speechMsg.onend = () => {
    console.log("✅ 음성 재생 완료:", text);
  };

  speechMsg.onerror = (event) => {
    console.error("❌ 음성 재생 오류:", event);
  };

  // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
  console.log("🎵 음성 재생 시도:", text);
  window.speechSynthesis.speak(speechMsg);
}
