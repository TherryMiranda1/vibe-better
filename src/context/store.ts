import { create } from "zustand";

interface UserCreditsState {
  userCredits: number | null;
  updateUserCredits: (userCredits: number | null) => void;
}

const useUserStore = create<UserCreditsState>((set) => ({
  userCredits: null,
  updateUserCredits: (userCredits: number | null) => set({ userCredits }),
}));

export default useUserStore;
