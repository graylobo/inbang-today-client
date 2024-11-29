import { create } from "zustand";
import { api } from "@/libs/axios";

interface Crew {
  id: number;
  name: string;
  description: string;
}

interface CrewStore {
  selectedCrew: Crew | null;
  setSelectedCrew: (crew: Crew | null) => void;
}

export const useCrewStore = create<CrewStore>((set) => ({
  selectedCrew: null,
  setSelectedCrew: (crew) => set({ selectedCrew: crew }),
}));
