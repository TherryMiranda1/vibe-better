import { create } from "zustand";

interface UserCreditsState {
  isLoaded: boolean;
  isLoading: boolean;
  userCredits: number | null;
  updateUserCredits: (userCredits: number | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const useUserStore = create<UserCreditsState>((set) => ({
  isLoaded: false,
  isLoading: false,
  userCredits: null,
  updateUserCredits: (userCredits: number | null) => set({ userCredits }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));

export default useUserStore;
