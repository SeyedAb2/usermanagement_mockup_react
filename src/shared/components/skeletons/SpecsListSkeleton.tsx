import { Stack, Skeleton, Chip, Box } from "@mui/material";

export default function SpecsListSkeleton() {
  return (
    <Stack spacing={1.25} sx={{ mt: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Stack key={i} direction="row" alignItems="center" sx={{ gap: 1, flexWrap: "wrap" }}>
          <Chip label="" size="small" sx={{ "& .MuiChip-label": { color: "transparent", px: 2 } }} />
          <Box sx={{ flexGrow: 1, minWidth: 120, maxWidth: 360 }}>
            <Skeleton variant="text" animation="wave" height={18} />
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}