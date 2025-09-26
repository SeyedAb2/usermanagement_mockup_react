import { Card, CardHeader, CardContent, CardActions, Stack, Skeleton, Box, Chip, Avatar, Typography } from "@mui/material";

export default function ProductCardShell() {
  return (
    <Card
      sx={(t) => ({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        borderTop: `4px solid ${(t.palette).wlc?.[500] ?? t.palette.primary.main}`,
      })}
    >
      <Skeleton variant="rectangular" animation="wave" height={180} />
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
            <Skeleton variant="text" animation="wave" height={22} width="60%" />
            <Chip label="" size="small" sx={{ "& .MuiChip-label": { px: 2, color: "transparent" } }} />
          </Stack>
        }
        subheader={
          <Stack direction="row" alignItems="center" sx={{ gap: 1, mt: 0.5 }}>
            <Avatar sx={{ width: 24, height: 24 }} />
            <Skeleton variant="text" animation="wave" height={18} width={120} />
          </Stack>
        }
        sx={{ pb: 0.5 }}
      />
      <CardContent sx={{ pt: 1 }}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <Skeleton variant="circular" animation="wave" width={20} height={20} />
            <Skeleton variant="text" animation="wave" height={18} width="50%" />
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <Skeleton variant="circular" animation="wave" width={20} height={20} />
            <Skeleton variant="text" animation="wave" height={18} width="35%" />
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <Skeleton variant="rectangular" animation="wave" width={80} height={18} sx={{ borderRadius: 1 }} />
            <Skeleton variant="text" animation="wave" height={16} width={60} />
          </Stack>
          <Typography variant="h6" sx={{ color: "success.main" }}>
            <Skeleton variant="text" animation="wave" height={26} width="40%" />
          </Typography>
        </Stack>
      </CardContent>
      <Box flexGrow={1} />
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Skeleton variant="rectangular" animation="wave" height={36} width={120} sx={{ borderRadius: 2 }} />
        <Stack direction="row" sx={{ gap: 0.5 }}>
          <Skeleton variant="circular" animation="wave" width={36} height={36} />
          <Skeleton variant="circular" animation="wave" width={36} height={36} />
        </Stack>
      </CardActions>
    </Card>
  );
}
