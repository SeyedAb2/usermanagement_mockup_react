import { Box, Stack, Skeleton, FormGroup } from "@mui/material";

export default function ProductSearchFilterCardSkeleton() {
  return (
    <Stack spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
      <Box sx={{ minWidth: 180 }}>
        <Skeleton variant="text" animation="wave" height={20} width={80} />
        <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
      <Stack>
        <Skeleton variant="text" animation="wave" height={20} width={120} />
        <FormGroup row sx={{ gap: 1 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" animation="wave" height={32} width={96} sx={{ borderRadius: 2 }} />
          ))}
        </FormGroup>
      </Stack>
      <Box>
        <Skeleton variant="text" animation="wave" height={20} width={100} />
        <Skeleton variant="rectangular" animation="wave" height={36} sx={{ my: 1, borderRadius: 2 }} />
        <Stack direction="row" justifyContent="space-between">
          <Skeleton variant="text" animation="wave" height={16} width={80} />
          <Skeleton variant="text" animation="wave" height={16} width={80} />
        </Stack>
      </Box>
      <Stack direction="row" justifyContent="flex-end">
        <Skeleton variant="rectangular" animation="wave" height={40} width={140} sx={{ borderRadius: 2 }} />
      </Stack>
    </Stack>
  );
}
