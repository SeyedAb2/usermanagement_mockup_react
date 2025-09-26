// components/skeletons/MyProductsSkeleton.tsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function MyProductsSkeleton() {
  const ROWS = 10; 

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%" }}>
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Grid size={{ xs: 12, md: "auto" }}>
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={56}
              sx={{
                borderRadius: 2,
                width: { xs: "100%", md: 360 },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: "auto" }}>
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={56}
              sx={{
                borderRadius: 2,
                width: { xs: "100%", md: 220 },
              }}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflow: "auto",
            maxHeight: { xs: "70dvh", md: "unset" },
            borderRadius: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <TableContainer sx={{ minWidth: 720 }}>
            <Table
              aria-label="my products skeleton"
              sx={{
                "& thead th": {
                  bgcolor: "background.default",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                },
                "& tbody tr:not(:last-of-type) td": {
                  borderBottom: (t) => `1px solid ${t.palette.divider}`,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  {["شماره محصول", "عکس محصول", "نام محصول", "تاریخ عرضه", "عملیات"].map(
                    (h, i) => (
                      <TableCell
                        key={i}
                        align={i === 0 || i === 4 ? "center" : "left"}
                      >
                        <Skeleton
                          variant="text"
                          animation="wave"
                          height={24}
                          sx={{ width: "60%", mx: i === 0 || i === 4 ? "auto" : 0 }}
                        />
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {Array.from({ length: ROWS }).map((_, rowIdx) => (
                  <TableRow key={rowIdx} hover>
                    <TableCell align="center">
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        width={36}
                        height={20}
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        width={48}
                        height={48}
                        sx={{ borderRadius: 1.5 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Skeleton
                        variant="text"
                        animation="wave"
                        height={22}
                        sx={{ width: "40%" }}
                      />
                      <Skeleton
                        variant="text"
                        animation="wave"
                        height={16}
                        sx={{ width: "25%", opacity: 0.9 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Skeleton
                        variant="text"
                        animation="wave"
                        height={18}
                        sx={{ width: "30%" }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        {Array.from({ length: 2 }).map((__, i) => (
                          <Skeleton
                            key={i}
                            variant="circular"
                            animation="wave"
                            width={36}
                            height={36}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 1.5 }}
          >
            <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
              <Skeleton variant="text" animation="wave" height={20} width={80} />
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={96}
                height={36}
                sx={{ borderRadius: 1.5 }}
              />
            </Stack>

            <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
              <Skeleton variant="circular" animation="wave" width={36} height={36} />
              <Skeleton
                variant="text"
                animation="wave"
                height={20}
                sx={{ width: 120 }}
              />
              <Skeleton variant="circular" animation="wave" width={36} height={36} />
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}