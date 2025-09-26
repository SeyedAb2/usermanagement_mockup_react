// components/skeletons/UserCardSkeleton.tsx
import { Card, CardContent, Stack, Avatar, Box, Skeleton, CardActions } from "@mui/material";

export default function UserCardSkeleton() {
  return (
    <Card
      sx={(t) => ({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 3,
        borderTop: `4px solid ${(t.palette).wlc?.[500] ?? t.palette.primary.main}`,
      })}
    >
      <CardContent>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ gap: 1 }}>
          <Avatar sx={{ width: 56, height: 56 }} />
          <Box>
            <Skeleton variant="text" animation="wave" height={22} width={140} />
            <Skeleton variant="rectangular" animation="wave" height={24} width={90} sx={{ borderRadius: 2 }} />
          </Box>
        </Stack>
        <Skeleton variant="rectangular" animation="wave" height={1} sx={{ my: 1.5 }} />
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="circular" animation="wave" width={20} height={20} />
            <Skeleton variant="text" animation="wave" height={18} width={120} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="circular" animation="wave" width={20} height={20} />
            <Skeleton variant="text" animation="wave" height={18} width={80} />
          </Stack>
        </Stack>
      </CardContent>
      <Box flexGrow={1} />
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Skeleton variant="rectangular" animation="wave" height={40} width="100%" sx={{ borderRadius: 2 }} />
      </CardActions>
    </Card>
  );
}
