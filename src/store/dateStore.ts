import { create } from "zustand";

interface DateState {
  year: number;
  month: number;
  setDate: (year: number, month: number) => void;
}

const currentDate = new Date();

export const useDateStore = create<DateState>((set) => ({
  year: currentDate.getFullYear(),
  month: currentDate.getMonth() + 1,
  setDate: (year: number, month: number) => set({ year, month }),
})); 