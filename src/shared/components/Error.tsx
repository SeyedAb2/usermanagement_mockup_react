// ServerError.tsx
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
import { ReportProblemOutlined } from "@mui/icons-material";

type Props = {
  status?: string | number;       
  title?: string;                 
  description?: string;           
  homeTo?: string;                
  onRetry?: () => void;           
  showRetry?: boolean;            
};

export default function Error({
  status = 500,
  title = "مشکلی پیش آمد",
  description = "در پردازش درخواست شما خطایی رخ داد. لطفاً بعداً دوباره تلاش کنید.",
  homeTo = "/",
  onRetry,
  showRetry = true,
}: Props) {
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 6,
            overflow: "hidden",
            textAlign: "center",
            borderTop: (t) => `6px solid ${t.palette.error.main}`,
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Stack alignItems="center" spacing={2}>
              {/* آیکون */}
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
                <ReportProblemOutlined sx={{ fontSize: 52, opacity: 0.9 }} />
              </Box>

              {/* تیتر و توضیح */}
              <Typography variant="h5" fontWeight={900}>
                {status} — {title}
              </Typography>
              <Typography color="text.secondary">{description}</Typography>

              {/* دکمه‌ها */}
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {showRetry && (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={onRetry}
                    disabled={!onRetry}
                    sx={{ borderRadius: 2,mx:1 }}
                  >
                    تلاش مجدد
                  </Button>
                )}
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to={homeTo}
                  sx={{ borderRadius: 2 , mx:1 }}
                >
                  بازگشت به صفحهٔ اصلی
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
