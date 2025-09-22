import { useEffect, useRef, useState } from "react";
import { Stack, Typography } from "@mui/material";

/** شمارنده‌ی سبک که هنگام دیده‌شدن شروع می‌شود */
function useCountUp(target: number, duration = 1200) {
  const [n, setN] = useState(0);
  const started = useRef(false);
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            setN(Math.round(target * p));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { n, elRef };
}

export default function StatItem({ label, value }: { label: string; value: number }) {
  const { n, elRef } = useCountUp(value);
  return (
    <Stack alignItems="center" spacing={0.5} ref={elRef}>
      <Typography variant="h4" fontWeight={900}>
        {n.toLocaleString("fa-IR")}
      </Typography>
      <Typography color="text.secondary">{label}</Typography>
    </Stack>
  );
}
