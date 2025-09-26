// components/skeletons/SearchUserFilterSkeleton.tsx
import { Box, Container, Grid, Skeleton, Stack } from "@mui/material";

export default function SearchUserFilterSkeleton() {
  return (
    <Box sx={{ mb: 2 }}>
      <Container maxWidth={false} disableGutters>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rectangular" animation="wave" height={56} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack direction="row" justifyContent="flex-end">
              <Skeleton variant="rectangular" animation="wave" height={40} width={140} sx={{ borderRadius: 2 }} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}