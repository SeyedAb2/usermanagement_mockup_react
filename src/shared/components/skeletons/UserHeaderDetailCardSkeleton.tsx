import { Card, CardContent, Stack, Skeleton, Avatar, Box, Chip } from "@mui/material";

export default function UserHeaderDetailCardSkeleton() {
  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 72, height: 72 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" animation="wave" height={26} width="40%" />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip label="" size="small" sx={{ "& .MuiChip-label": { px: 2, color: "transparent" } }} />
              <Chip label="" size="small" sx={{ "& .MuiChip-label": { px: 2, color: "transparent" } }} />
              <Chip label="" size="small" sx={{ "& .MuiChip-label": { px: 2, color: "transparent" } }} />
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" animation="wave" height={36} width={140} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" animation="wave" height={36} width={140} sx={{ borderRadius: 2 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}