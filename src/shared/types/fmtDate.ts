export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" });