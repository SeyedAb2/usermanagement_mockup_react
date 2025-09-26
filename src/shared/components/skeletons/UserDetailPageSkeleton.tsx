import { Box, Container, Card, Grid, Stack, Skeleton } from "@mui/material";
import UserHeaderDetailCardSkeleton from "../../components/skeletons/UserHeaderDetailCardSkeleton";
import ProductSearchFilterCardSkeleton from "../../components/skeletons/ProductSearchFilterCardSkeleton";
import ProductCardItemSkeleton from "../../components/skeletons/ProductCardItemSkeleton";
import PaginationCardSkeleton from "../../components/skeletons/PaginationCardSkeleton";

export default function UserDetailPageSkeleton() {
  const COUNT = 12;
  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <UserHeaderDetailCardSkeleton />
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
          {Array.from({ length: COUNT }).map((_, i) => (
            <ProductCardItemSkeleton key={i} />
          ))}
        </Grid>
        <PaginationCardSkeleton />
      </Container>
    </Box>
  );
}