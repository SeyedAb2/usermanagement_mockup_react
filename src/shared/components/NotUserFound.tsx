import { Card, Typography } from "@mui/material";
import { PersonSearchOutlined } from "@mui/icons-material";

export default function NotUserFound() {
  return (
    <Card
      sx={{
        py: 6,
        borderRadius: 3,
        boxShadow: 2,
        textAlign: "center",
        mb: 2,
      }}
    >
      <PersonSearchOutlined sx={{ fontSize: 72, opacity: 0.4 }} />
      <Typography variant="h6" sx={{ mt: 1 }}>
        کاربری یافت نشد
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        لطفاً دوباره جستجو کنید یا فیلترها را تغییر دهید.
      </Typography>
    </Card>
  );
}
