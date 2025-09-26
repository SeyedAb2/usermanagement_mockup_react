// components/skeletons/LatestProductsCardSkeleton.tsx
import { Card, CardHeader, CardContent, Stack, Skeleton } from "@mui/material";

export default function LatestProductsCardSkeleton() {
  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardHeader
        sx={{ "& .MuiCardHeader-avatar": { marginRight: 0 }, pb: 0 }}
        avatar={<Skeleton variant="circular" animation="wave" width={24} height={24} />}
        title={<Skeleton variant="text" animation="wave" height={24} width={120} />}
      />
      <CardContent>
        <Stack spacing={1.2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Stack key={i} spacing={0.5}>
              <Skeleton variant="text" animation="wave" height={18} width="80%" />
              <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                <Skeleton variant="rectangular" animation="wave" height={22} width={72} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" animation="wave" height={16} width={70} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}