import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { SearchOffOutlined } from "@mui/icons-material";

export default function NotFound() {
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 6,
            overflow: "hidden",
            textAlign: "center",
            borderTop: (t) => `6px solid ${t.palette.primary.main}`,
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Stack alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: (t) =>
                    t.palette.mode === "light"
                      ? t.palette.grey[100]
                      : t.palette.background.paper,
                  boxShadow: 2,
                }}
              >
                <SearchOffOutlined sx={{ fontSize: 52, opacity: 0.8 }} />
              </Box>

              <Typography variant="h5" fontWeight={900}>
                صفحه‌ای یافت نشد
              </Typography>
              <Typography color="text.secondary">
                آدرس وارد شده نادرست است یا صفحه حذف شده است.
              </Typography>

              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/"
                sx={{ borderRadius: 2, mt: 1, mx:1 }}
              >
                بازگشت به صفحهٔ اصلی
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
