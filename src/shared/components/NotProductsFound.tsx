import { SentimentDissatisfied } from "@mui/icons-material";
import { Card, Typography } from "@mui/material";

export default function NotProductFound(){
    return (
        <Card sx={{ py: 6, borderRadius: 3, boxShadow: 2, textAlign: "center", mb: 2 }}>
            <SentimentDissatisfied sx={{ fontSize: 72, opacity: 0.4 }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
            نتیجه‌ای یافت نشد
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            لطفاً فیلترها را تغییر دهید یا عبارت جستجو را ساده‌تر کنید.
            </Typography>
        </Card>
    )
}