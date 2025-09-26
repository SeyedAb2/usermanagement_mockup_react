import { Box, Container, Card, Grid, CardContent, Stack, Skeleton, Chip, Avatar, Typography } from "@mui/material";
import SpecsListSkeleton from "../../components/skeletons/SpecsListSkeleton";
import ProductCardItemSkeleton from "../../components/skeletons/ProductCardItemSkeleton";

export default function ProductDetailPageSkeleton() {
  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Card
          sx={(t) => ({
            mb: 3,
            borderRadius: 3,
            boxShadow: 4,
            overflow: "hidden",
            borderTop: `5px solid ${(t.palette).wlc?.[500] ?? t.palette.primary.main}`,
          })}
        >
          <Grid container>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" animation="wave" sx={{ width: "100%", height: { xs: 260, md: 420 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Skeleton variant="text" animation="wave" height={32} width="60%" />
                  <Chip label="" size="small" sx={{ px: 1, "& .MuiChip-label": { color: "transparent", px: 2 } }} />
                </Stack>
                <Stack direction="row" spacing={1.5} mt={2} flexWrap="wrap" alignItems="center">
                  <Avatar sx={{ width: 28, height: 28 }} />
                  <Skeleton variant="text" animation="wave" height={18} width={120} />
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Skeleton variant="circular" animation="wave" width={20} height={20} />
                    <Skeleton variant="text" animation="wave" height={18} width={100} />
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Skeleton variant="circular" animation="wave" width={20} height={20} />
                    <Skeleton variant="text" animation="wave" height={18} width={140} />
                  </Stack>
                </Stack>
                <Skeleton variant="rectangular" animation="wave" height={1} sx={{ my: 2 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" sx={{ color: "success.main", width: "40%" }}>
                    <Skeleton variant="text" animation="wave" height={28} />
                  </Typography>
                  <Stack direction="row" sx={{ gap: 1 }}>
                    <Skeleton variant="circular" animation="wave" width={36} height={36} />
                    <Skeleton variant="circular" animation="wave" width={36} height={36} />
                  </Stack>
                </Stack>
                <Skeleton variant="text" animation="wave" height={18} width="100%" sx={{ mt: 2 }} />
                <Skeleton variant="text" animation="wave" height={18} width="90%" />
                <Stack direction="row" alignItems="center" spacing={1.5} mt={2}>
                  <Skeleton variant="rectangular" animation="wave" width={80} height={18} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="text" animation="wave" height={16} width={60} />
                </Stack>
                <SpecsListSkeleton />
                <Skeleton variant="rectangular" animation="wave" height={40} width={220} sx={{ mt: 2, borderRadius: 2 }} />
              </CardContent>
            </Grid>
          </Grid>
        </Card>
        <Skeleton variant="text" animation="wave" height={26} width={160} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardItemSkeleton key={i} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
