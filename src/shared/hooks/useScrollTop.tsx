import { useEffect, useRef } from "react";
import { scrollToTop } from "../utils/scrollToTop";

interface UseScrollTopOptions {
  behavior?: "auto" | "smooth";
  triggerOnce?: boolean;
}

export const useScrollTop = (
  deps: string[] = [],
  options: UseScrollTopOptions = {}
) => {
  const { behavior = "smooth", triggerOnce = false } = options;
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (triggerOnce && hasScrolled.current) return;
    scrollToTop(behavior);
    hasScrolled.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
