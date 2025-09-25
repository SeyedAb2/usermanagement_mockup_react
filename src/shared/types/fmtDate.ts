export const fmtDate = (iso?: string|Date|null|undefined) =>
  iso ? new Date(iso).toLocaleDateString("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" }) : iso