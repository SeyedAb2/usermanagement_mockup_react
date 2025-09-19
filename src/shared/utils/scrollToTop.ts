export const scrollToTop = (behavior: "auto" | "smooth" = "smooth") => {
  window.scrollTo({ top: 0, behavior });
};
