import { create } from 'zustand';

interface SelectionState {
  persons: string[];
  tasks: string[];
  setPersons: (persons: string[]) => void;
  setTasks: (tasks: string[]) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  persons: [],
  tasks: [],
  setPersons: (persons) => set({ persons }),
  setTasks: (tasks) => set({ tasks }),
}));
