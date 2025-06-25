import { create } from "zustand";
import { LanguageOption } from "@/utils/tts.utils";
import { toast } from "sonner";

export interface ITimerProps {
  id: number;
  content: string;
  hour?: string;
  minute?: string;
  second?: string;
}

interface BuildAlertState {
  timers: ITimerProps[];
  isTimerRunning: boolean;
  language: LanguageOption;
  completedTimers: Set<number>; // 완료된 타이머 ID들

  // Actions
  addTimer: () => void;
  removeTimer: (id: number) => void;
  updateTimer: (id: number, updates: Partial<ITimerProps>) => void;
  setTimerRunning: (running: boolean) => void;
  setLanguage: (language: LanguageOption) => void;
  clearAllTimers: () => void;
  markTimerCompleted: (id: number) => void;
  resetCompletedTimers: () => void;

  // Computed values
  getLargestTimer: () => number;
  validateTimers: () => { hasEmptyContent: boolean; hasEmptyTime: boolean };
}

const validateTimeInput = (timer: ITimerProps): ITimerProps => {
  const hour = Math.min(Math.max(0, Number(timer.hour) || 0), 23);
  const minute = Math.min(Math.max(0, Number(timer.minute) || 0), 59);
  const second = Math.min(Math.max(0, Number(timer.second) || 0), 59);

  return {
    ...timer,
    hour: hour > 0 ? hour.toString() : timer.hour,
    minute: minute > 0 ? minute.toString() : timer.minute,
    second: second > 0 ? second.toString() : timer.second,
  };
};

export const useBuildAlertStore = create<BuildAlertState>((set, get) => ({
  timers: [],
  isTimerRunning: false,
  language: { lang: "ko-KR" },
  completedTimers: new Set<number>(),

  addTimer: () =>
    set((state) => {
      const nextId =
        state.timers.length > 0
          ? Math.max(...state.timers.map((t) => t.id)) + 1
          : 0;

      return {
        timers: [...state.timers, { id: nextId, content: "" }],
      };
    }),

  removeTimer: (id) =>
    set((state) => ({
      timers: state.timers.filter((timer) => timer.id !== id),
    })),

  updateTimer: (id, updates) =>
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.id === id ? validateTimeInput({ ...timer, ...updates }) : timer
      ),
    })),

  setTimerRunning: (running) => set({ isTimerRunning: running }),

  setLanguage: (language) => set({ language }),

  clearAllTimers: () =>
    set({ timers: [], isTimerRunning: false, completedTimers: new Set() }),

  markTimerCompleted: (id) =>
    set((state) => {
      const newCompletedTimers = new Set(state.completedTimers);
      newCompletedTimers.add(id);
      console.log(
        `✅ 타이머 ${id} 완료 마크. 완료된 타이머들:`,
        Array.from(newCompletedTimers)
      );
      console.log(
        `📊 전체 타이머 개수: ${state.timers.length}, 완료된 타이머 개수: ${newCompletedTimers.size}`
      );

      // 모든 타이머가 완료되었는지 확인
      const allCompleted = state.timers.every((timer) =>
        newCompletedTimers.has(timer.id)
      );
      console.log(`🏁 모든 타이머 완료 여부: ${allCompleted}`);

      // 모든 타이머가 완료되면 즉시 전체 타이머 중지
      if (allCompleted) {
        console.log("🎯 모든 타이머 완료! 전체 타이머 즉시 중지");
        toast.success(
          "모든 타이머가 완료되었습니다. 전체 타이머를 즉시 중지합니다."
        );
        return {
          completedTimers: newCompletedTimers,
          isTimerRunning: false, // 즉시 중지
        };
      }

      return {
        completedTimers: newCompletedTimers,
        // 아직 완료되지 않은 타이머가 있으므로 isTimerRunning 유지
      };
    }),

  resetCompletedTimers: () => set({ completedTimers: new Set() }),

  getLargestTimer: () => {
    const { timers } = get();
    if (timers.length === 0) return 0;

    return Math.max(
      ...timers.map((timer) => {
        const hour = Number(timer.hour) || 0;
        const minute = Number(timer.minute) || 0;
        const second = Number(timer.second) || 0;
        return hour * 3600 + minute * 60 + second;
      })
    );
  },

  validateTimers: () => {
    const { timers } = get();
    let hasEmptyContent = false;
    let hasEmptyTime = false;

    console.log("=== 타이머 검증 시작 ===");
    timers.forEach((timer, index) => {
      console.log(`타이머 ${index + 1} (ID: ${timer.id}) 검증:`, timer);

      if (!timer.content?.trim()) {
        console.log(`타이머 ${index + 1}: 내용이 비어있음`);
        hasEmptyContent = true;
      } else {
        console.log(`타이머 ${index + 1}: 내용 OK - "${timer.content}"`);
      }

      const hour = Number(timer.hour) || 0;
      const minute = Number(timer.minute) || 0;
      const second = Number(timer.second) || 0;
      const totalTimeInSeconds = hour * 3600 + minute * 60 + second;

      console.log(
        `타이머 ${
          index + 1
        }: 시간 ${hour}h ${minute}m ${second}s = ${totalTimeInSeconds}초`
      );

      if (totalTimeInSeconds <= 0) {
        console.log(`타이머 ${index + 1}: 시간이 0 이하`);
        hasEmptyTime = true;
      } else {
        console.log(`타이머 ${index + 1}: 시간 OK`);
      }
    });

    console.log("검증 결과:", { hasEmptyContent, hasEmptyTime });
    return { hasEmptyContent, hasEmptyTime };
  },
}));
