import { Box, Container, Grid, Stack, Skeleton, Card } from "@mui/material";
import ProductSearchFilterCardSkeleton from "../../components/skeletons/ProductSearchFilterCardSkeleton";
import ProductCardSkeleton from "../../components/skeletons/ProductCardSkeleton";
import NewUsersListCardSkeleton from "../../components/skeletons/NewUsersListCardSkeleton";
import LatestProductsCardSkeleton from "../../components/skeletons/LatestProductsCardSkeleton";
import PaginationCardSkeleton from "../../components/skeletons/PaginationCardSkeleton";

export default function ProductsPageSkeleton() {
  const COUNT = 12;
  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: { xs: "none", md: "block" }, mb: 2 }}>
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <ProductSearchFilterCardSkeleton />
          </Card>
        </Box>
        <Stack direction="row" spacing={1} sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}>
          <Skeleton variant="rectangular" animation="wave" height={40} sx={{ flex: 1, borderRadius: 2 }} />
          <Skeleton variant="rectangular" animation="wave" height={40} width={96} sx={{ borderRadius: 2 }} />
        </Stack>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            <Grid container spacing={2}>
              {Array.from({ length: COUNT }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                  <ProductCardSkeleton />
                </Grid>
              ))}
            </Grid>
            <PaginationCardSkeleton />
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 3 }} sx={{ display: { xs: "none", md: "block" }, position: "sticky", top: (t) => t.spacing(10), alignSelf: "flex-start" }}>
            <LatestProductsCardSkeleton />
            <NewUsersListCardSkeleton />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
