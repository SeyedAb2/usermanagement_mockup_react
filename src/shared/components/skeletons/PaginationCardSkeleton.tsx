// components/skeletons/PaginationCardSkeleton.tsx
import { Box, Skeleton, Stack } from "@mui/material";

export default function PaginationCardSkeleton() {
  return (
    <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Skeleton variant="circular" animation="wave" width={36} height={36} />
        <Skeleton variant="rectangular" animation="wave" height={36} width={220} sx={{ borderRadius: 2 }} />
        <Skeleton variant="circular" animation="wave" width={36} height={36} />
      </Box>
    </Stack>
  );
}
