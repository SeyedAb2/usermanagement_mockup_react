import { Box, Container, Grid, Skeleton, Stack } from "@mui/material";
import SearchUserFilterSkeleton from "../../components/skeletons/SearchUserFilterSkeleton";
import UserCardSkeleton from "../../components/skeletons/UserCardSkeleton";
import PaginationCardSkeleton from "./PaginationCardSkeleton";

export default function UsersPageSkeleton() {
  const COUNT = 12;
  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <SearchUserFilterSkeleton />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Skeleton variant="text" animation="wave" height={20} width={90} />
        </Stack>
        <Grid container spacing={2}>
          {Array.from({ length: COUNT }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <UserCardSkeleton />
            </Grid>
          ))}
        </Grid>
        <PaginationCardSkeleton />
      </Container>
    </Box>
  );
}
