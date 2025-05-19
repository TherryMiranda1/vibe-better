// --- MOVE CREDIT FETCH LOGIC TO HEADER-ACTIONS ---

import useUserStore from "@/context/store";
import { getUserCredits } from "@/lib/services/client/userCredits.service";
import { useEffect, useRef } from "react";

function useCreditsOnce() {
  const isLoading = useUserStore((state) => state.isLoading);
  const setIsLoading = useUserStore((state) => state.setIsLoading);
  const userCredits = useUserStore((state) => state.userCredits);
  const updateUserCredits = useUserStore((state) => state.updateUserCredits);
  const isLoaded = useRef(false);

  const fetchCredits = async () => {
    setIsLoading(true);
    isLoaded.current = true;
    try {
      const credits = await getUserCredits();
      updateUserCredits(credits);
    } catch (error) {
      updateUserCredits(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    !isLoaded.current && fetchCredits();
  }, []);
  return { userCredits, isLoading, isLoaded };
}

export default useCreditsOnce;
