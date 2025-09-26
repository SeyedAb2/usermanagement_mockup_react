// components/skeletons/NewUsersListCardSkeleton.tsx
import { Card, CardHeader, CardContent, Stack, Skeleton, Avatar, Box } from "@mui/material";

export default function NewUsersListCardSkeleton() {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardHeader sx={{ "& .MuiCardHeader-avatar": { marginRight: 0 }, pb: 0 }} avatar={<Skeleton variant="circular" animation="wave" width={24} height={24} />} title={<Skeleton variant="text" animation="wave" height={24} width={140} />} />
      <CardContent>
        <Stack spacing={1.1}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Stack key={i} direction="row" alignItems="center" sx={{ gap: 1.2 }}>
              <Avatar />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Skeleton variant="text" animation="wave" height={18} width={140} />
                <Skeleton variant="text" animation="wave" height={14} width={80} />
              </Box>
              <Skeleton variant="circular" animation="wave" width={28} height={28} />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}