// components/skeletons/ProductFormSkeleton.tsx
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
} from "@mui/material";

export default function ProductFormSkeleton() {
  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
      <CardContent sx={{ p: 0 }}>
        <Stack direction="row" alignItems="center" sx={{ gap: 1, mb: 2 }}>
          <Skeleton variant="circular" animation="wave" width={28} height={28} />
          <Skeleton variant="text" animation="wave" height={28} width={180} />
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ gap: 2, mb: 2 }}>
          <Box sx={{ position: "relative", width: 120, height: 120 }}>
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={120}
              height={120}
              sx={{
                borderRadius: 2,
                border: (t) => `1px solid ${t.palette.divider}`,
                bgcolor: "background.default",
              }}
            />
            <Skeleton
              variant="circular"
              animation="wave"
              width={36}
              height={36}
              sx={{
                position: "absolute",
                bottom: -8,
                left: -8,
                boxShadow: 2,
              }}
            />
          </Box>

          <Skeleton variant="text" animation="wave" height={20} width={260} />
        </Stack>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Skeleton variant="rectangular" animation="wave" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>

        <Skeleton variant="text" animation="wave" height={24} width={200} sx={{ mt: 3, mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Skeleton variant="rectangular" animation="wave" height={40} width={180} sx={{ borderRadius: 2 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}